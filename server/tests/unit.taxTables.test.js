/**
 * TAX-TABLES: federal and BC brackets are chosen by the pay date (CRA rule),
 * including mid-year editions. Values: constants/taxTables.constants.js.
 */
const { getTaxDetails, getTaxTables, calculateTax } = require("../services/taxService");
const { FEDERAL_EDITIONS, BC_EDITIONS } = require("../constants/taxTables.constants");

const round2 = (n) => Math.round(n * 100) / 100;
const thresholds = (brackets) => brackets.map((b) => b.upperLimit);
const rates = (brackets) => brackets.map((b) => b.rate);

describe("tax tables by pay date", () => {
	let warn;
	beforeEach(() => {
		warn = jest.spyOn(console, "warn").mockImplementation(() => {});
	});
	afterEach(() => warn.mockRestore());

	test("T-TT-01 2026 federal: 14 / 20.5 / 26 / 29 / 33 % at 58,523 / 117,045 / 181,440 / 258,482", () => {
		for (const day of ["2026-01-09", "2026-07-03", "2026-12-31"]) {
			const { federal } = getTaxTables(day);
			expect(rates(federal)).toEqual([0.14, 0.205, 0.26, 0.29, 0.33]);
			expect(thresholds(federal)).toEqual([58523, 117045, 181440, 258482, Infinity]);
		}
	});

	test("T-TT-02 2026 BC: 5.06 % withheld until June 30, 6.14 % from July 1 (5.60 % for the year)", () => {
		const bc2026 = [50363, 100728, 115648, 140430, 190405, 265545, Infinity];
		const before = getTaxTables("2026-06-30").provincial;
		const after = getTaxTables("2026-07-01").provincial;
		expect(thresholds(before)).toEqual(bc2026);
		expect(thresholds(after)).toEqual(bc2026);
		expect(before[0].rate).toBe(0.0506);
		expect(after[0].rate).toBe(0.0614);
		expect(rates(after).slice(1)).toEqual([0.077, 0.105, 0.1229, 0.147, 0.168, 0.205]);
		// the catch-up rate makes the full year come out at 5.60 %
		expect(round2(((0.0506 * 6 + 0.0614 * 6) / 12) * 100)).toBe(5.6);
	});

	test("T-TT-03 2027 BC: 2026 brackets frozen, 5.60 % all year; same through 2030", () => {
		for (const day of ["2027-01-01", "2027-07-15", "2030-12-31"]) {
			const { provincial } = getTaxTables(day);
			expect(provincial[0].rate).toBe(0.056);
			expect(thresholds(provincial)).toEqual([50363, 100728, 115648, 140430, 190405, 265545, Infinity]);
		}
	});

	test("T-TT-04 2025: federal 15 % until June, 14 % from July; BC 5.06 % with 2025 brackets", () => {
		expect(getTaxTables("2025-06-27").federal[0].rate).toBe(0.15);
		expect(getTaxTables("2025-07-11").federal[0].rate).toBe(0.14);
		expect(thresholds(getTaxTables("2025-03-01").federal)).toEqual([57375, 114750, 177882, 253414, Infinity]);
		expect(thresholds(getTaxTables("2025-03-01").provincial)).toEqual([
			49279, 98560, 113158, 137407, 186306, 259829, Infinity,
		]);
		expect(warn).not.toHaveBeenCalled();
	});

	test("T-TT-05 a year without a published table reuses the latest one and warns once", () => {
		const t2027 = getTaxTables("2027-01-08");
		expect(t2027.federal).toBe(getTaxTables("2026-12-31").federal); // 2027 federal not published yet
		getTaxTables("2027-02-05");
		const fed2027 = warn.mock.calls.filter(([m]) => m.includes("no federal table for 2027"));
		expect(fed2027.length).toBeLessThanOrEqual(1);
		// before the first table: the oldest one is used
		expect(getTaxTables("2024-05-01").federal).toBe(FEDERAL_EDITIONS[0].brackets);
	});

	test("T-TT-06 the deduction itself follows the pay date (BC tax rises on July 1, 2026)", () => {
		const credits = { federalTaxCredit: "16452", regionalTaxCredit: "13216" };
		const june = getTaxDetails(25, 2000, credits, "Biweekly", { payDate: "2026-06-26" });
		const july = getTaxDetails(25, 2000, credits, "Biweekly", { payDate: "2026-07-10" });
		const y2027 = getTaxDetails(25, 2000, credits, "Biweekly", { payDate: "2027-01-08" });
		// same pay, same claims: only the BC rate (5.06 -> 6.14 -> 5.60 %) and, in 2027, CPP/EI rates differ
		expect(july.totalProvincialTaxDeduction).toBeGreaterThan(june.totalProvincialTaxDeduction);
		expect(y2027.totalProvincialTaxDeduction).toBeLessThan(july.totalProvincialTaxDeduction);
		expect(y2027.totalProvincialTaxDeduction).toBeGreaterThan(june.totalProvincialTaxDeduction);
		// federal is the same 2026 table in June and July
		expect(june.federalTaxDeductionByPayPeriod).toBe(july.federalTaxDeductionByPayPeriod);
		expect(june.details.sources.provincial).toBe("T4127 January 2026");
		expect(july.details.sources.provincial).toMatch(/July 2026/);
		// 2027: CPP base rate 4.75 % (5.75 % in all), EI 1.64 %
		expect(round2(y2027.CPPContribution)).toBe(round2(0.0575 * (2000 - 3500 / 26)));
		expect(round2(y2027.EmployeeEIContribution)).toBe(round2(0.0164 * 2000));
	});

	test("T-TT-07 editions are in date order and every table ends with an open top bracket", () => {
		for (const editions of [FEDERAL_EDITIONS, BC_EDITIONS]) {
			const froms = editions.map((e) => e.from);
			expect([...froms].sort()).toEqual(froms);
			for (const { brackets, source } of editions) {
				expect(source).toBeTruthy();
				expect(brackets[brackets.length - 1].upperLimit).toBe(Infinity);
				const limits = thresholds(brackets);
				expect([...limits].sort((a, b) => a - b)).toEqual(limits);
			}
		}
	});

	test("T-TT-08 calculateTax: income below the claim pays nothing; credit applies at the lowest rate", () => {
		const { federal } = getTaxTables("2026-03-01");
		expect(calculateTax(15000, 16452, federal)).toBe(0);
		expect(round2(calculateTax(100000, 16452, federal))).toBe(
			round2(58523 * 0.14 + (100000 - 58523) * 0.205 - 16452 * 0.14),
		);
	});
});
