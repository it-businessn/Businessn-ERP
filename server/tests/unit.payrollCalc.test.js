/**
 * PAYROLL-CALC: TD1 personal amounts, annual CPP / CPP2 / EI maximums against
 * year to date, and the BC tax reduction (CRA T4127 Option 1).
 */
const { getTaxDetails, federalBasicAmount, bcTaxReduction, getTaxTables } = require("../services/taxService");

const round2 = (n) => Math.round(n * 100) / 100;
const MARCH_2026 = "2026-03-13";
const bi = (gross, credits = {}, opts = {}) =>
	getTaxDetails(0, gross, credits, "Biweekly", { payDate: MARCH_2026, ...opts });

describe("TD1 personal amounts", () => {
	test("T-PC-01 no TD1 amount (blank or the screen's old 0 default) claims the basic personal amounts", () => {
		for (const credits of [{}, { federalTaxCredit: "0", regionalTaxCredit: "0" }, { federalTaxCredit: "", regionalTaxCredit: null }]) {
			const r = bi(2000, credits);
			expect(r.details.federalClaim).toBe(16452);
			expect(r.details.provincialClaim).toBe(13216);
		}
		// before: a 0 claim gave no basic personal amount, so far more tax
		const zeroClaimTax = bi(2000, { isTD1ClaimCodeZero: true });
		expect(zeroClaimTax.federalTaxDeductionByPayPeriod - bi(2000).federalTaxDeductionByPayPeriod).toBeCloseTo((16452 * 0.14) / 26, 1);
	});

	test("T-PC-02 an entered TD1 amount is used as entered; claim code 0 claims nothing", () => {
		const r = bi(2000, { federalTaxCredit: "$20,000.00", regionalTaxCredit: "15000" });
		expect(r.details.federalClaim).toBe(20000);
		expect(r.details.provincialClaim).toBe(15000);
		const none = bi(2000, { federalTaxCredit: "16452", isTD1ClaimCodeZero: true });
		expect(none.details.federalClaim).toBe(0);
		expect(none.details.provincialClaim).toBe(0);
	});

	test("T-PC-03 federal basic personal amount is reduced for high incomes (2026: 16,452 -> 14,829)", () => {
		const { bpa } = getTaxTables(MARCH_2026).federalEdition;
		expect(federalBasicAmount(bpa, 100000)).toBe(16452);
		expect(federalBasicAmount(bpa, 181440)).toBe(16452);
		expect(round2(federalBasicAmount(bpa, (181440 + 258482) / 2))).toBe(round2((16452 + 14829) / 2));
		expect(federalBasicAmount(bpa, 300000)).toBe(14829);
		expect(bi(12000).details.federalClaim).toBe(14829); // 312,000 a year
	});
});

describe("annual maximums against year to date", () => {
	test("T-PC-04 CPP stops at the annual maximum: partial in the period that reaches it, then nothing", () => {
		const maxCPP = 0.0595 * (74600 - 3500); // 4,230.45
		const normal = 0.0595 * (5000 - 3500 / 26);
		expect(round2(bi(5000, {}, { ytd: { cpp: 0 } }).CPPContribution)).toBe(round2(normal));
		expect(round2(bi(5000, {}, { ytd: { cpp: maxCPP - 100 } }).CPPContribution - bi(5000, {}, { ytd: { cpp: maxCPP - 100 } }).CPP2Contribution)).toBe(100);
		expect(bi(5000, {}, { ytd: { cpp: maxCPP } }).CPPContribution).toBe(0);
	});

	test("T-PC-05 EI stops at the annual maximum (2026: 1.63 % x 68,900 = 1,123.07); employer is 1.4 x", () => {
		expect(round2(bi(5000, {}, { ytd: { ei: 1123.07 - 30 } }).EmployeeEIContribution)).toBe(30);
		expect(round2(bi(5000, {}, { ytd: { ei: 1123.07 - 30 } }).EmployerEIContribution)).toBe(42);
		expect(bi(5000, {}, { ytd: { ei: 1123.07 } }).EmployeeEIContribution).toBe(0);
	});

	test("T-PC-06 CPP2: 4 % only on year-to-date earnings above the YMPE, up to the YAMPE ($416 max)", () => {
		// below the YMPE so far and after this pay: no CPP2
		expect(bi(5000, {}, { ytd: { pensionableEarnings: 60000 } }).CPP2Contribution).toBe(0);
		// this pay crosses the YMPE (74,600): CPP2 on the 2,400 above it
		expect(round2(bi(5000, {}, { ytd: { pensionableEarnings: 72000 } }).CPP2Contribution)).toBe(96);
		// fully above the YMPE: 4 % of the whole pay
		expect(round2(bi(5000, {}, { ytd: { pensionableEarnings: 76000, cpp2: 56 } }).CPP2Contribution)).toBe(200);
		// CPP2 maximum reached
		expect(bi(5000, {}, { ytd: { pensionableEarnings: 90000, cpp2: 416 } }).CPP2Contribution).toBe(0);
	});

	test("T-PC-07 enhanced CPP (first additional + CPP2) lowers taxable income; once CPP stops, tax goes up", () => {
		const paying = bi(5000, {}, { ytd: { cpp: 0 } });
		const capped = bi(5000, {}, { ytd: { cpp: 99999, cpp2: 999, ei: 9999, pensionableEarnings: 90000 } });
		expect(paying.details.annualTaxableIncome).toBeLessThan(26 * 5000);
		expect(capped.details.annualTaxableIncome).toBe(26 * 5000);
		expect(capped.federalTaxDeductionByPayPeriod).toBeGreaterThan(paying.federalTaxDeductionByPayPeriod);
	});
});

describe("BC tax reduction (factor S)", () => {
	test("T-PC-08 2026 January: $575, less 3.56 % above $25,570; nil from $41,722", () => {
		const { reduction } = getTaxTables("2026-03-01").provincialEdition;
		expect(bcTaxReduction(reduction, 20000)).toBe(575);
		expect(round2(bcTaxReduction(reduction, 30000))).toBe(round2(575 - 0.0356 * (30000 - 25570)));
		expect(bcTaxReduction(reduction, 45000)).toBe(0);
	});

	test("T-PC-09 July-December 2026: prorated $805, nil from $44,952; 2027: $690; 2025: $562 above $25,020", () => {
		const july = getTaxTables("2026-07-10").provincialEdition.reduction;
		expect(bcTaxReduction(july, 25000)).toBe(805);
		expect(round2(bcTaxReduction(july, 25570 + 575 / 0.0356))).toBe(230);
		expect(round2(bcTaxReduction(july, 44952))).toBe(0);
		expect(bcTaxReduction(july, 44953)).toBe(0);
		const y2027 = getTaxTables("2027-02-05").provincialEdition.reduction;
		expect(bcTaxReduction(y2027, 25000)).toBe(690);
		expect(round2(bcTaxReduction(y2027, 35261))).toBe(round2(690 - 0.0356 * (35261 - 25570)));
		const y2025 = getTaxTables("2025-03-01").provincialEdition.reduction;
		expect(bcTaxReduction(y2025, 25020)).toBe(562);
		expect(round2(bcTaxReduction(y2025, 30000))).toBe(round2(562 - 0.0356 * (30000 - 25020)));
	});

	test("T-PC-10 a low earner's BC tax is reduced (never below zero)", () => {
		// $1,000 bi-weekly = about 26,000 a year: BC tax is more than wiped out by the reduction
		const low = bi(1000);
		expect(low.totalProvincialTaxDeduction).toBe(0);
		// $1,400 bi-weekly: partly reduced
		const mid = bi(1400);
		expect(mid.details.bcTaxReduction).toBeGreaterThan(0);
		expect(mid.totalProvincialTaxDeduction).toBeGreaterThan(0);
	});
});
