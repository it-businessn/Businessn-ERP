/**
 * Unit tests for the pure payroll calculation layer (no database, no HTTP).
 * Expected values are computed by hand from the formulas/constants in
 * services/taxService.js and helpers/payrollHelper.js, so a change to a rate
 * or a formula shows up here as an explicit, reviewable test change.
 */
const { getTaxDetails } = require("../services/taxService");
const { getPercent, normalizePercent, showPercent, isPercentType } = require("../helpers/percent");
const { convertHrsToFloat, getSumRegHrs, safeNum } = require("../utils/time.util");
const {
	calcPayRates,
	checkExtraRun,
	getSumTotal,
	getPayType,
	calcTotalHours,
	calcHoursWorkedTotals,
	getContributionsDeductions,
} = require("../helpers/payrollHelper");
const { EARNING_TYPE } = require("../constants/earning.constants");

const round2 = (n) => Math.round(n * 100) / 100;

describe("taxService.getTaxDetails (CRA T4127 Option 1)", () => {
	const credits = { federalTaxCredit: "$16,129.00", regionalTaxCredit: "12932" };
	// 2026 tables (pay date March 2026): CPP 5.95 % (base 4.95), YMPE 74,600,
	// EI 1.63 %, federal 14 % / CEA 1,501, BC 5.06 %
	const MARCH_2026 = { payDate: "2026-03-13" };

	test("T-TAX-01 bi-weekly $2,000 gross: CPP, EI, federal and BC tax per period (hand calculation)", () => {
		const r = getTaxDetails(25, 2000, credits, "Biweekly", MARCH_2026);
		const P = 26;
		const cpp = 0.0595 * (2000 - 3500 / P); // 110.99
		const ei = 0.0163 * 2000; // 32.60
		const F5 = cpp * (0.01 / 0.0595); // enhanced CPP, deductible
		const A = P * (2000 - F5); // annual taxable income 51,515
		const credit = P * cpp * (0.0495 / 0.0595) + P * ei; // base CPP + EI (K2)
		const federal = (A * 0.14 - 0.14 * (16129 + credit + 1501)) / P; // K1, K2, K4
		const bcTax = (50363 * 0.0506 + (A - 50363) * 0.077 - 0.0506 * (12932 + credit)) / P;
		expect(round2(r.CPPContribution)).toBe(round2(cpp));
		expect(round2(r.EmployeeEIContribution)).toBe(32.6);
		expect(round2(r.EmployerEIContribution)).toBe(45.64); // 1.4 x employee
		expect(round2(r.federalTaxDeductionByPayPeriod)).toBe(round2(federal));
		expect(round2(r.totalProvincialTaxDeduction)).toBe(round2(bcTax)); // above the BC reduction range
		expect(r.details.annualTaxableIncome).toBe(round2(A));
	});

	test("T-TAX-02 frequency strings are normalised (bi-weekly == Biweekly, missing == Biweekly)", () => {
		const a = getTaxDetails(25, 2000, credits, "Biweekly", MARCH_2026);
		expect(getTaxDetails(25, 2000, credits, "bi-weekly", MARCH_2026)).toEqual(a);
		expect(getTaxDetails(25, 2000, credits, undefined, MARCH_2026)).toEqual(a);
	});

	test("T-TAX-03 (BUG-03) 'semi-monthly' is treated as Semimonthly, not silently as Biweekly", () => {
		const semi = getTaxDetails(25, 2000, credits, "Semimonthly", MARCH_2026);
		expect(getTaxDetails(25, 2000, credits, "semi-monthly", MARCH_2026)).toEqual(semi);
		expect(getTaxDetails(25, 2000, credits, "Semi-monthly", MARCH_2026)).toEqual(semi);
		expect(semi).not.toEqual(getTaxDetails(25, 2000, credits, "Biweekly", MARCH_2026));
	});

	test("T-TAX-04 monthly frequency annualises with 12 periods", () => {
		const r = getTaxDetails(0, 5000, credits, "Monthly", MARCH_2026);
		const cpp = 0.0595 * (5000 - 3500 / 12);
		const A = 12 * (5000 - cpp * (0.01 / 0.0595));
		const credit = 12 * cpp * (0.0495 / 0.0595) + 12 * 0.0163 * 5000;
		const federal = (58523 * 0.14 + (A - 58523) * 0.205 - 0.14 * (16129 + credit + 1501)) / 12;
		expect(round2(r.CPPContribution)).toBe(round2(cpp));
		expect(round2(r.federalTaxDeductionByPayPeriod)).toBe(round2(federal));
	});

	test("T-TAX-05 CPP and EI exemptions zero the contributions", () => {
		const r = getTaxDetails(25, 2000, { ...credits, isCPPExempt: true, isEIExempt: true }, "Biweekly", MARCH_2026);
		expect(r.CPPContribution).toBe(0);
		expect(r.EmployeeEIContribution).toBe(0);
		expect(r.EmployerEIContribution).toBe(0);
	});

	test("T-TAX-06 income below the basic exemption / credits -> no CPP and no income tax", () => {
		const r = getTaxDetails(15, 100, credits, "Biweekly", MARCH_2026); // 2,600 / year
		expect(r.CPPContribution).toBe(0);
		expect(r.federalTaxDeductionByPayPeriod).toBe(0);
		expect(r.totalProvincialTaxDeduction).toBe(0);
	});

	test("T-TAX-07 zero gross and missing credit object do not throw or produce NaN", () => {
		const r = getTaxDetails(undefined, 0, undefined, "Weekly", MARCH_2026);
		const { details, ...amounts } = r;
		Object.values(amounts).forEach((v) => expect(Number.isFinite(v)).toBe(true));
		expect(r.federalTaxDeductionByPayPeriod).toBe(0);
		expect(details.sources.cpp).toBe("CRA 2026");
	});

	test("T-TAX-08 one large payment: EI and CPP stop at the 2026 annual maximums", () => {
		const r = getTaxDetails(0, 100000, {}, "Annually", MARCH_2026);
		expect(round2(r.EmployeeEIContribution)).toBe(1123.07); // 1.63 % x 68,900
		expect(round2(r.EmployerEIContribution)).toBe(1572.3);
		// CPP 5.95 % x (74,600 - 3,500) + CPP2 4 % x (85,000 - 74,600)
		expect(round2(r.CPPContribution)).toBe(round2(4230.45 + 416));
		expect(round2(r.CPP2Contribution)).toBe(416);
	});
});

describe("helpers/percent", () => {
	test("T-PCT-01 getPercent clamps to 0..100 and rounds to 2 dp", () => {
		expect(getPercent(5, 10)).toBe(50);
		expect(getPercent(1, 3)).toBe(33.33);
		expect(getPercent(20, 10)).toBe(100);
		expect(getPercent(-5, 10)).toBe(0);
	});
	test("T-PCT-02 getPercent with zero / invalid estimate -> 0", () => {
		expect(getPercent(5, 0)).toBe(0);
		expect(getPercent("abc", 10)).toBe(0);
		expect(getPercent(5, undefined)).toBe(0);
	});
	test("T-PCT-03 normalizePercent / showPercent round-trip", () => {
		expect(normalizePercent(25)).toBe(0.25);
		expect(normalizePercent(0.25)).toBe(0.25);
		expect(normalizePercent("x")).toBe(0);
		expect(showPercent(0.25)).toBe(25);
		expect(showPercent(25)).toBe(25);
		expect(showPercent("x")).toBe(0);
	});
	test("T-PCT-04 isPercentType only for strings containing %", () => {
		expect(isPercentType("% of Gross")).toBe(true);
		expect(isPercentType("Amount per Hour")).toBe(false);
		expect(isPercentType(5)).toBe(false);
	});
});

describe("utils/time.util", () => {
	test("T-UTIL-01 convertHrsToFloat / safeNum tolerate garbage", () => {
		expect(convertHrsToFloat("7.5")).toBe(7.5);
		expect(convertHrsToFloat(undefined)).toBe(0);
		expect(convertHrsToFloat("abc")).toBe(0);
		expect(safeNum(null)).toBe(0);
		expect(safeNum("3")).toBe(3);
	});
	test("T-UTIL-02 getSumRegHrs subtracts only finite values", () => {
		expect(getSumRegHrs(10, 2)).toBe(8);
		expect(getSumRegHrs(10, "x")).toBe(10);
		expect(getSumRegHrs(undefined, 2)).toBe(-2);
	});
});

describe("helpers/payrollHelper", () => {
	test("T-PAYH-01 calcPayRates derives premium rates from the regular rate", () => {
		const r = calcPayRates({ regPay: 20 });
		expect(r).toMatchObject({
			overTimePay: 30,
			dblOverTimePay: 40,
			statPay: 20,
			statWorkPay: 30,
			sickPay: 20,
			vacationPay: 20,
		});
	});

	test("T-PAYH-02 checkExtraRun accepts boolean and string 'true' only", () => {
		expect(checkExtraRun(true)).toBe(true);
		expect(checkExtraRun("true")).toBe(true);
		expect(checkExtraRun("false")).toBe(false);
		expect(checkExtraRun(undefined)).toBe(false);
	});

	test("T-PAYH-03 getSumTotal / getPayType", () => {
		expect(getSumTotal("2", undefined)).toBe(2);
		expect(getPayType()).toBe("Regular Pay");
		expect(getPayType(true)).toBe("Regular Pay Break");
	});

	test("T-PAYH-04 salaried employees get standard hours; hourly get timesheet + allocated hours", () => {
		const payInfo = (typeOfEarning) => ({
			roles: [{ typeOfEarning, fullTimeStandardHours: "80", partTimeStandardHours: "40" }],
		});
		const ts = { totalRegHoursWorked: "70", totalOvertimeHoursWorked: "2" };
		const alloc = { additionalRegHoursWorked: "1.5", additionalOvertimeHoursWorked: "1" };

		const ft = calcHoursWorkedTotals({}, payInfo(EARNING_TYPE.FT), ts, alloc, false);
		expect(ft.totalRegHoursWorked).toBe(80);
		const pt = calcHoursWorkedTotals({}, payInfo(EARNING_TYPE.PT), ts, alloc, false);
		expect(pt.totalRegHoursWorked).toBe(40);
		const hourly = calcHoursWorkedTotals({}, payInfo(EARNING_TYPE.HOURLY), ts, alloc, false);
		expect(hourly.totalRegHoursWorked).toBe(71.5);
		expect(hourly.totalOvertimeHoursWorked).toBe(3);
		expect(hourly.totalHoursWorked).toBe(74.5);
	});

	test("T-PAYH-05 extra run uses actual hours even for salaried employees", () => {
		const r = calcHoursWorkedTotals(
			{},
			{ roles: [{ typeOfEarning: EARNING_TYPE.FT, fullTimeStandardHours: "80" }] },
			{ totalRegHoursWorked: "5" },
			{},
			true,
		);
		expect(r.totalRegHoursWorked).toBe(5);
	});

	test("T-PAYH-06 no pay info / no timesheet -> all totals 0, never NaN", () => {
		const r = calcHoursWorkedTotals({}, undefined, undefined, undefined, false);
		expect(r.totalHoursWorked).toBe(0);
	});

	describe("getContributionsDeductions", () => {
		const base = {
			regPay: 20,
			overTimePay: 30,
			dblOverTimePay: 40,
			statPay: 20,
			statWorkPay: 30,
			sickPay: 20,
			totalRegHoursWorked: 80,
			totalOvertimeHoursWorked: 2,
			totalDblOvertimeHoursWorked: 0,
			totalStatDayHoursWorked: 0,
			totalStatHours: 0,
			totalSickHoursWorked: 0,
			vacationPayPercent: 0.04,
		};

		test("T-CONTR-01 'No ...' treatments produce 0", () => {
			const r = getContributionsDeductions({
				...base,
				typeOfUnionDuesTreatment: "No Union Dues",
				unionDuesContribution: 50,
				typeOfPensionEETreatment: "No Pension",
				pensionEEContribution: 10,
			});
			expect(r.unionDues).toBe(0);
			expect(r.EE_EPP).toBe(0);
		});

		test("T-CONTR-02 '% ...' treatment applies the rate to earnings incl. vacation accrual", () => {
			const r = getContributionsDeductions({
				...base,
				typeOfUnionDuesTreatment: "% of Gross",
				unionDuesContribution: 0.02,
			});
			// earnings = 80*20 + 2*30 = 1660; vacation 4 % = 66.4; base = 1726.4
			expect(round2(r.unionDues)).toBe(round2(1726.4 * 0.02));
		});

		test("T-CONTR-03 'per Hour' treatment multiplies by allocated hours", () => {
			const r = getContributionsDeductions({
				...base,
				typeOfUnionDuesTreatment: "Amount per Hour",
				unionDuesContribution: 0.5,
			});
			expect(r.unionDues).toBe(0.5 * 82);
		});

		test("T-CONTR-04 flat amount is returned as-is", () => {
			const r = getContributionsDeductions({
				...base,
				typeOfPensionERTreatment: "Flat Amount",
				pensionERContribution: 25,
			});
			expect(r.ER_EPP).toBe(25);
		});
	});

	describe("calcTotalHours (time-card display)", () => {
		const at = (hhmm) => new Date(`2026-03-02T${hhmm}:00`);

		test("T-HRS-01 no clock-out -> undefined", () => {
			expect(calcTotalHours({ clockIn: at("09:00") })).toBeUndefined();
		});

		test("T-HRS-02 shift without breaks", () => {
			expect(calcTotalHours({ clockIn: at("09:00"), clockOut: at("17:30") })).toEqual({
				totalBreakHours: 0,
				totalWorkedHours: "08:30",
			});
		});

		test("T-HRS-03 one break is subtracted", () => {
			const r = calcTotalHours({
				clockIn: at("09:00"),
				clockOut: at("17:00"),
				startBreaks: [at("12:00")],
				endBreaks: [at("13:00")],
			});
			expect(r).toEqual({ totalBreakHours: 1, totalWorkedHours: "07:00" });
		});

		test("T-HRS-04 (BUG-01) second and third breaks are subtracted too", () => {
			const r = calcTotalHours({
				clockIn: at("08:00"),
				clockOut: at("18:00"),
				startBreaks: [at("10:00"), at("12:00"), at("15:00")],
				endBreaks: [at("10:30"), at("13:00"), at("15:30")],
			});
			// 10 h on the clock - (0.5 + 1 + 0.5) h of breaks = 8 h
			expect(r).toEqual({ totalBreakHours: 2, totalWorkedHours: "08:00" });
		});

		test("T-HRS-05 break started but not ended is ignored (no negative / NaN)", () => {
			const r = calcTotalHours({
				clockIn: at("09:00"),
				clockOut: at("17:00"),
				startBreaks: [at("12:00")],
				endBreaks: [],
			});
			expect(r.totalWorkedHours).toBe("08:00");
		});
	});
});
