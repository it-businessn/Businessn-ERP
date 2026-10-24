/**
 * PAYROLL-CALC end to end: a whole year of bi-weekly pay runs through the real
 * pay run (POST /api/payroll/process), stub builder and tax calculation, with
 * EmployeePayStub in an in-memory store (same harness as api.payyear.test.js).
 * Each run reads the previous stub's year to date, so the annual CPP, CPP2 and
 * EI maximums are reached exactly once and never exceeded, and the next year
 * starts again from zero.
 */
const fs = require("fs");
const path = require("path");
const request = require("supertest");

jest.mock("../models/Company");
jest.mock("../models/Group");
jest.mock("../models/EmployeePayStub");
jest.mock("../models/FundingTotalsPay");
jest.mock("../models/JournalEntry");
jest.mock("../models/EmployeePayInfo");
jest.mock("../models/EmployeeGovernmentInfo");
jest.mock("../models/EmployeeExtraAllocation");
jest.mock("../models/EmployeeEmploymentInfo");
jest.mock("../models/EmployeeProfileInfo");
jest.mock("../models/EmployeeT4");
jest.mock("../services/userService", () => ({
	...jest.requireActual("../services/userService"),
	getPayrollActiveEmployees: jest.fn(),
}));
jest.mock("../controllers/userController", () => ({
	...jest.requireActual("../controllers/userController"),
	getEmployeeId: jest.fn(),
}));
jest.mock("../services/payrollService", () => ({
	...jest.requireActual("../services/payrollService"),
	calculateTimesheetApprovedHours: jest.fn(),
	findEmployeeBenefitInfo: jest.fn(),
}));
jest.mock("../controllers/t4SlipController", () => ({
	...jest.requireActual("../controllers/t4SlipController"),
	generateT4Slip: jest.fn(),
}));

const Company = require("../models/Company");
const EmployeePayStub = require("../models/EmployeePayStub");
const FundingTotalsPay = require("../models/FundingTotalsPay");
const JournalEntry = require("../models/JournalEntry");
const EmployeePayInfo = require("../models/EmployeePayInfo");
const EmployeeGovernmentInfo = require("../models/EmployeeGovernmentInfo");
const EmployeeExtraAllocation = require("../models/EmployeeExtraAllocation");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");
const EmployeeT4 = require("../models/EmployeeT4");
const { getPayrollActiveEmployees } = require("../services/userService");
const { getEmployeeId } = require("../controllers/userController");
const { calculateTimesheetApprovedHours, findEmployeeBenefitInfo } = require("../services/payrollService");
const { generateT4Slip } = require("../controllers/t4SlipController");
const { clearMembershipCache } = require("../middleware/authorize");
const { auth, query, buildTestApp } = require("./helpers");

const EMP_ID = "64e000000000000000000001";
const utc = (s) => new Date(`${s}T00:00:00.000Z`);
const WINDOW_2025 = { $gte: utc("2025-01-01"), $lt: utc("2026-01-01") };
const WINDOW_2026 = { $gte: utc("2026-01-01"), $lt: utc("2027-01-01") };

const runBody = (over = {}) => ({
	companyName: "Acme",
	currentPayPeriod: {
		payPeriod: 7,
		payPeriodStartDate: "2026-03-01",
		payPeriodEndDate: "2026-03-14",
		payPeriodPayDate: "2026-03-20",
		payPeriodProcessingDate: "2026-03-18",
		frequency: "bi-weekly",
		isExtraRun: false,
		...over,
	},
});

const stub = (payPeriodNum, payDate, extra = {}) => ({
	_id: `${payPeriodNum}-${payDate}-${extra.isExtraRun ? "x" : "r"}`,
	companyName: "Acme",
	empId: EMP_ID,
	payPeriodNum: String(payPeriodNum),
	payPeriodPayDate: utc(payDate),
	payPeriodProcessingDate: utc(payDate),
	isExtraRun: false,
	isProcessed: true,
	scheduleFrequency: "Biweekly",
	reportType: null,
	currentNetPay: 50,
	...extra,
});

// ---- in-memory EmployeePayStub ------------------------------------------
let store = [];
const same = (a, b) => {
	if (a instanceof Date || b instanceof Date) return +new Date(a) === +new Date(b);
	if (b === null) return a === null || a === undefined;
	return String(a) === String(b);
};
const matchValue = (value, cond) => {
	if (cond && typeof cond === "object" && !(cond instanceof Date)) {
		return Object.entries(cond).every(([op, v]) => {
			if (op === "$gte") return value != null && +new Date(value) >= +new Date(v);
			if (op === "$lt") return value != null && +new Date(value) < +new Date(v);
			if (op === "$exists") return (value !== undefined) === v;
			if (op === "$ne") return !same(value, v);
			if (op === "$nin") return !v.some((x) => same(value, x));
			if (op === "$in") return v.some((x) => same(value, x));
			throw new Error(`unsupported operator ${op}`);
		});
	}
	return same(value, cond);
};
const matches = (doc, filter = {}) =>
	Object.entries(filter).every(([k, cond]) => matchValue(doc[k], cond));
const newestFirst = (a, b) =>
	+new Date(b.payPeriodPayDate || 0) - +new Date(a.payPeriodPayDate || 0) ||
	+new Date(b.payPeriodProcessingDate || 0) - +new Date(a.payPeriodProcessingDate || 0);
const withToObject = (d) => ({ ...d, toObject: () => ({ ...d }) });

const installStore = () => {
	EmployeePayStub.find.mockImplementation((f) =>
		query(store.filter((d) => matches(d, f)).map(withToObject)),
	);
	EmployeePayStub.findOne.mockImplementation((f) =>
		query(store.filter((d) => matches(d, f)).sort(newestFirst)[0] || null),
	);
	EmployeePayStub.findOneAndUpdate.mockImplementation((f, update) => {
		let doc = store.filter((d) => matches(d, f)).sort(newestFirst)[0];
		if (doc) Object.assign(doc, update.$set);
		else store.push((doc = { _id: `new-${store.length}`, ...update.$set }));
		return query(doc);
	});
	EmployeePayStub.create.mockImplementation(async (d) => {
		store.push(d);
		return d;
	});
};
const byYear = (year, num = "7", extra = false) =>
	store.filter(
		(d) =>
			new Date(d.payPeriodPayDate).getUTCFullYear() === year &&
			String(d.payPeriodNum) === num &&
			d.isExtraRun === extra,
	);
const flush = () => new Promise((r) => setImmediate(r));

let app;
beforeAll(() => {
	app = buildTestApp();
});
beforeEach(() => {
	jest.clearAllMocks();
	clearMembershipCache();
	store = [];
	installStore();
	// AUD-028: payroll routes are role-gated; the caller is an Authorizing Admin.
	EmployeeEmploymentInfo.findOne.mockImplementation(() =>
		query({ employmentRole: "Authorizing Admin" }),
	);
	EmployeeEmploymentInfo.find.mockImplementation(() => query([]));
	Company.find.mockImplementation(() => query([{ name: "Acme", _id: "65b000000000000000000001" }]));
	Company.findOne.mockImplementation(() => query({ name: "Acme" }));
	getPayrollActiveEmployees.mockResolvedValue([{ empId: { _id: EMP_ID } }]);
	getEmployeeId.mockResolvedValue([{ empId: { _id: EMP_ID } }]);
	calculateTimesheetApprovedHours.mockResolvedValue([]);
	EmployeePayInfo.findOne.mockImplementation(() => query(null));
	EmployeeGovernmentInfo.findOne.mockImplementation(() => query({}));
	EmployeeExtraAllocation.findOne.mockImplementation(() => query(null));
	EmployeeProfileInfo.findOne.mockImplementation(() => query({}));
	EmployeeT4.findOne.mockImplementation(() => query({}));
	FundingTotalsPay.findOne.mockImplementation(() => query(null));
	FundingTotalsPay.findById.mockResolvedValue(null);
	FundingTotalsPay.findOneAndUpdate.mockImplementation(() =>
		query({ value: { _id: "f1" }, lastErrorObject: { updatedExisting: true } }),
	);
	JournalEntry.findOne.mockResolvedValue(null);
	JournalEntry.create.mockResolvedValue({});
	generateT4Slip.mockResolvedValue(undefined);
	jest.spyOn(console, "warn").mockImplementation(() => {});
	jest.spyOn(console, "log").mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());


const round2 = (n) => Math.round(n * 100) / 100;
const payDates = (year, count, first) => {
	const start = utc(first);
	return Array.from({ length: count }, (_, i) => {
		const d = new Date(start.getTime() + i * 14 * 86400000);
		return d.toISOString().slice(0, 10);
	});
};
const run = (payPeriod, payDate, over = {}) =>
	request(app)
		.post("/api/payroll/process")
		.set(auth())
		.send(runBody({ payPeriod, payPeriodPayDate: payDate, payPeriodProcessingDate: payDate, payPeriodStartDate: payDate, payPeriodEndDate: payDate, ...over }));
const current = (num, year) =>
	store.find((d) => String(d.payPeriodNum) === String(num) && new Date(d.payPeriodPayDate).getUTCFullYear() === year && !d.isExtraRun);

describe("a year of pay runs (real calculation)", () => {
	beforeEach(() => {
		// $60/h x 80 h = $4,800 every two weeks (124,800 a year): above the YAMPE
		calculateTimesheetApprovedHours.mockResolvedValue([{ empId: { _id: EMP_ID }, totalRegHoursWorked: 80 }]);
		EmployeePayInfo.findOne.mockImplementation(() => query({ roles: [{ payRate: 60 }] }));
		EmployeeGovernmentInfo.findOne.mockImplementation(() => query({ federalTaxCredit: "0", regionalTaxCredit: "0" }));
	});

	test("T-YEAR-20 2026: CPP, CPP2 and EI stop exactly at the annual maximums; nothing negative; 2027 starts over", async () => {
		const dates = payDates(2026, 26, "2026-01-09");
		for (const [i, date] of dates.entries()) {
			const res = await run(i + 1, date);
			expect(res.status).toBe(200);
		}
		const stubs = dates.map((_, i) => current(i + 1, 2026));
		expect(stubs.every(Boolean)).toBe(true);
		for (const s of stubs) {
			expect(s.currentGrossPay).toBe(4800);
			for (const k of ["currentCPPDeductions", "currentCPP2Deductions", "currentEmployeeEIDeductions", "currentFDTaxDeductions", "currentStateTaxDeductions"]) {
				expect(Number.isFinite(s[k])).toBe(true);
				expect(s[k]).toBeGreaterThanOrEqual(0);
			}
		}
		const last = stubs[25];
		expect(round2(last.YTD_CPPDeductions)).toBe(round2(0.0595 * (74600 - 3500) + 0.04 * (85000 - 74600))); // 4,646.45
		expect(round2(last.YTD_CPP2Deductions)).toBe(416);
		expect(round2(last.YTD_EmployeeEIDeductions)).toBe(1123.07);
		expect(round2(last.YTDGrossPay)).toBe(4800 * 26);
		// sums of the per-stub amounts match the year to date
		const sum = (k) => round2(stubs.reduce((t, s) => t + s[k], 0));
		expect(sum("currentCPPDeductions")).toBe(round2(last.YTD_CPPDeductions));
		expect(sum("currentEmployeeEIDeductions")).toBe(round2(last.YTD_EmployeeEIDeductions));
		// CPP (first tier) stops once 4,230.45 is reached (period 16 at $4,800)
		expect(stubs[0].currentCPPDeductions).toBeGreaterThan(0);
		expect(stubs[25].currentCPPDeductions).toBe(0);
		// with no TD1 amount the basic personal amount is claimed (federal tax well below 14 % of gross)
		expect(stubs[0].currentFDTaxDeductions).toBeLessThan(4800 * 0.2);

		// first pay of 2027: year to date starts again; 2027 rates (CPP 5.75 %, EI 1.64 %)
		expect((await run(1, "2027-01-08")).status).toBe(200);
		const jan = current(1, 2027);
		expect(round2(jan.currentCPPDeductions)).toBe(round2(0.0575 * (4800 - 3500 / 26)));
		expect(round2(jan.currentEmployeeEIDeductions)).toBe(round2(0.0164 * 4800));
		expect(round2(jan.YTD_CPPDeductions)).toBe(round2(jan.currentCPPDeductions));
	});

	test("T-YEAR-21 re-running a pay period gives the same deductions (no double counting of year to date)", async () => {
		const dates = payDates(2026, 3, "2026-01-09");
		for (const [i, date] of dates.entries()) await run(i + 1, date);
		const first = { ...current(3, 2026) };
		await run(3, dates[2]); // run period 3 again
		const again = current(3, 2026);
		for (const k of ["currentCPPDeductions", "currentEmployeeEIDeductions", "currentFDTaxDeductions", "YTD_CPPDeductions", "YTD_EmployeeEIDeductions", "YTDGrossPay"]) {
			expect(round2(again[k])).toBe(round2(first[k]));
		}
	});

	// an extra run pays a $1,000 bonus (allocated for its pay date)
	const bonusOn = (payDate) =>
		EmployeeExtraAllocation.findOne.mockImplementation((f) =>
			query(f?.payPeriodPayDate && new Date(f.payPeriodPayDate).toISOString().startsWith(payDate) ? { bonus: 1000 } : null),
		);
	const extra = (num, year) =>
		store.find((d) => String(d.payPeriodNum) === String(num) && new Date(d.payPeriodPayDate).getUTCFullYear() === year && d.isExtraRun);

	test("T-YEAR-22 (YTD-01) re-running an extra run does not count its own earlier amounts", async () => {
		const dates = payDates(2026, 3, "2026-01-09");
		for (const [i, date] of dates.entries()) await run(i + 1, date);
		bonusOn("2026-02-13");
		await run(3, "2026-02-13", { isExtraRun: true, selectedEmp: [EMP_ID] });
		const first = { ...extra(3, 2026) };
		expect(first.currentGrossPay).toBe(1000);
		await run(3, "2026-02-13", { isExtraRun: true, selectedEmp: [EMP_ID] }); // again, e.g. after a correction
		const again = extra(3, 2026);
		const regular3 = current(3, 2026);
		expect(round2(first.YTDGrossPay)).toBe(round2(regular3.YTDGrossPay + first.currentGrossPay));
		for (const k of ["YTDGrossPay", "YTD_CPPDeductions", "YTD_EmployeeEIDeductions", "currentCPPDeductions", "currentEmployeeEIDeductions"]) {
			expect(round2(again[k])).toBe(round2(first[k]));
		}
	});

	test("T-YEAR-23 (YTD-01) an extra run in period 1 keeps the regular period-1 pay in year to date", async () => {
		await run(1, "2026-01-09");
		bonusOn("2026-01-16");
		await run(1, "2026-01-16", { isExtraRun: true, selectedEmp: [EMP_ID] });
		const reg1 = current(1, 2026);
		const x1 = extra(1, 2026);
		expect(x1.currentGrossPay).toBe(1000);
		expect(round2(x1.YTDGrossPay)).toBe(round2(reg1.currentGrossPay + x1.currentGrossPay));
		expect(round2(x1.YTD_CPPDeductions)).toBe(round2(reg1.currentCPPDeductions + x1.currentCPPDeductions));
		await run(2, "2026-01-23");
		const reg2 = current(2, 2026);
		expect(round2(reg2.YTDGrossPay)).toBe(round2(reg1.currentGrossPay + x1.currentGrossPay + reg2.currentGrossPay));
	});

	test("T-YEAR-24 (YTD-01) a period without a stub (e.g. unpaid leave) does not restart the year", async () => {
		const dates = payDates(2026, 4, "2026-01-09");
		await run(1, dates[0]);
		await run(2, dates[1]);
		await run(4, dates[3]); // no pay run for this employee in period 3
		const p4 = current(4, 2026);
		expect(round2(p4.YTDGrossPay)).toBe(4800 * 3);
		expect(round2(p4.YTD_CPPDeductions)).toBe(round2(current(2, 2026).YTD_CPPDeductions + p4.currentCPPDeductions));
	});

	test("T-YEAR-25 (YTD-01) an extra run paid between two regular runs counts in pay-date order, in any processing order", async () => {
		await run(1, "2026-01-09");
		await run(2, "2026-01-23"); // processed before the extra run below
		bonusOn("2026-01-20");
		await run(2, "2026-01-20", { isExtraRun: true, selectedEmp: [EMP_ID] }); // paid before period 2
		expect(round2(extra(2, 2026).YTDGrossPay)).toBe(4800 + 1000);
		await run(3, "2026-02-06");
		expect(round2(current(3, 2026).YTDGrossPay)).toBe(4800 * 3 + 1000); // the bonus is not lost
		await run(2, "2026-01-23"); // re-run period 2: now after the bonus in pay-date order
		expect(round2(current(2, 2026).YTDGrossPay)).toBe(4800 * 2 + 1000);
		await run(2, "2026-01-23"); // and again: no double counting
		expect(round2(current(2, 2026).YTDGrossPay)).toBe(4800 * 2 + 1000);
	});

	test("T-YEAR-26 an early-January extra run does not lose last year's vacation carried into period 1", async () => {
		store.push(stub(26, "2025-12-19", { YTDVacationBalance: 42 }));
		bonusOn("2026-01-02");
		await run(26, "2026-01-02", { isExtraRun: true, selectedEmp: [EMP_ID] }); // numbered after last year's period
		await run(1, "2026-01-09");
		const p1 = current(1, 2026);
		expect(p1.YTDVacationBalanceFwd).toBe(42);
		expect(round2(p1.YTDGrossPay)).toBe(1000 + 4800);
	});

	test("T-YEAR-27 stored YTD totals are not re-used: re-dating the first stub creates no phantom amount", async () => {
		await run(1, "2026-01-09");
		await run(2, "2026-01-23");
		await run(1, "2026-01-30"); // period 1 re-run with a later pay date (P2 is now the first stub)
		await run(3, "2026-02-06");
		expect(round2(current(3, 2026).YTDGrossPay)).toBe(4800 * 3);
	});

	test("T-YEAR-28 two extra runs on the same pay date count each other in processing order", async () => {
		await run(1, "2026-01-09");
		bonusOn("2026-01-16");
		await run(1, "2026-01-16", { isExtraRun: true, selectedEmp: [EMP_ID], payPeriodProcessingDate: "2026-01-12" });
		await run(2, "2026-01-16", { isExtraRun: true, selectedEmp: [EMP_ID], payPeriodProcessingDate: "2026-01-13" });
		expect(round2(extra(1, 2026).YTDGrossPay)).toBe(4800 + 1000);
		expect(round2(extra(2, 2026).YTDGrossPay)).toBe(4800 + 1000 + 1000);
	});

	test("T-YEAR-29 a pay-schedule change does not restart the year", async () => {
		await run(1, "2026-01-09");
		await run(2, "2026-01-23");
		await run(2, "2026-02-27", { frequency: "Monthly" });
		const monthly = store.find((d) => d.scheduleFrequency === "Monthly");
		expect(round2(monthly.YTDGrossPay)).toBe(round2(4800 * 2 + monthly.currentGrossPay));
		expect(current(2, 2026)).toBeTruthy(); // the bi-weekly period 2 is a different stub
	});


	test("T-YEAR-30 two pay schedules paying on the same day count each other exactly once", async () => {
		await run(1, "2026-01-09");
		await run(1, "2026-01-23", { frequency: "Monthly", payPeriodProcessingDate: "2026-01-20" });
		await run(2, "2026-01-23", { payPeriodProcessingDate: "2026-01-21" });
		const monthly = store.find((d) => d.scheduleFrequency === "Monthly");
		const biweekly2 = store.find((d) => d.scheduleFrequency === "Biweekly" && String(d.payPeriodNum) === "2");
		expect(round2(monthly.YTDGrossPay)).toBe(round2(4800 + monthly.currentGrossPay));
		expect(round2(biweekly2.YTDGrossPay)).toBe(round2(4800 + monthly.currentGrossPay + biweekly2.currentGrossPay));
	});
});

describe("VAC-01 vacation accrual and carry-over through the year (real calculation)", () => {
	// $60/h x 80 h = $4,800 every two weeks; 4 % vacation = $192 accrued a period
	let alloc;
	beforeEach(() => {
		calculateTimesheetApprovedHours.mockResolvedValue([{ empId: { _id: EMP_ID }, totalRegHoursWorked: 80 }]);
		EmployeePayInfo.findOne.mockImplementation(() => query({ roles: [{ payRate: 60 }] }));
		findEmployeeBenefitInfo.mockResolvedValue({ vacationPayPercent: "0.04", typeOfVacationTreatment: "Accrued" });
		// amounts entered on the pay run, by pay date
		alloc = {};
		EmployeeExtraAllocation.findOne.mockImplementation((f) => {
			const day = f?.payPeriodPayDate && new Date(f.payPeriodPayDate).toISOString().slice(0, 10);
			return query(alloc[day] || null);
		});
	});
	const balanceRule = (s) =>
		expect(round2(s.YTDVacationBalance)).toBe(round2(s.YTDVacationBalanceFwd + s.YTDVacationAccrued - s.YTDVacationUsed));

	test("T-VAC-01 accrual adds up every period (it used to stay at period 1's amount); vacation pay taken is used", async () => {
		const dates = payDates(2026, 4, "2026-01-09");
		alloc[dates[2]] = { vacationPayAmt: 500 }; // vacation pay taken in period 3
		for (const [i, date] of dates.entries()) expect((await run(i + 1, date)).status).toBe(200);
		const stubs = dates.map((_, i) => current(i + 1, 2026));
		expect(stubs.map((s) => round2(s.currentVacationAccrued))).toEqual([192, 192, 212, 192]); // 4 % of 5,300 in period 3
		expect(stubs.map((s) => round2(s.YTDVacationAccrued))).toEqual([192, 384, 596, 788]);
		expect(stubs.map((s) => round2(s.YTDVacationUsed))).toEqual([0, 0, 500, 500]);
		expect(stubs.map((s) => round2(s.YTDVacationBalance))).toEqual([192, 384, 96, 288]);
		stubs.forEach(balanceRule);
	});

	test("T-VAC-02 last year's closing balance is carried all year, not only in period 1", async () => {
		store.push(stub(26, "2025-12-19", { YTDVacationAccrued: 5000, YTDVacationBalance: 300 }));
		const dates = payDates(2026, 3, "2026-01-09");
		for (const [i, date] of dates.entries()) await run(i + 1, date);
		const stubs = dates.map((_, i) => current(i + 1, 2026));
		// the closing balance (300), not last year's accrued (5,000)
		expect(stubs.map((s) => s.YTDVacationBalanceFwd)).toEqual([300, 300, 300]);
		expect(stubs.map((s) => round2(s.YTDVacationBalance))).toEqual([492, 684, 876]);
		stubs.forEach(balanceRule);
	});

	test("T-VAC-03 balance adjustments stay in the balance forward; payouts and 'vacation used' reduce the balance", async () => {
		store.push(stub(26, "2025-12-19", { YTDVacationBalance: 300 }));
		const dates = payDates(2026, 4, "2026-01-09");
		alloc[dates[1]] = { vacationBalAdjust: 50 };
		alloc[dates[2]] = { vacationPayout: 100 }; // paid in gross: 4,900, accrues 196
		alloc[dates[3]] = { vacationUsed: 20 };
		for (const [i, date] of dates.entries()) await run(i + 1, date);
		const stubs = dates.map((_, i) => current(i + 1, 2026));
		expect(stubs.map((s) => s.YTDVacationBalanceFwd)).toEqual([300, 350, 350, 350]);
		expect(stubs.map((s) => round2(s.YTDVacationAccrued))).toEqual([192, 384, 580, 772]);
		expect(stubs.map((s) => round2(s.YTDVacationUsed))).toEqual([0, 0, 100, 120]);
		expect(round2(stubs[3].YTDVacationBalance)).toBe(350 + 772 - 120);
		stubs.forEach(balanceRule);
	});

	test("T-VAC-04 the year's closing balance opens next year; accrued and used start again", async () => {
		const dates = payDates(2026, 3, "2026-11-27");
		alloc[dates[1]] = { vacationPayAmt: 100 };
		for (const [i, date] of dates.entries()) await run(24 + i, date);
		const closing = current(26, 2026).YTDVacationBalance;
		expect(round2(closing)).toBe(round2(192 + 196 + 192 - 100));
		await run(1, "2027-01-08");
		await run(2, "2027-01-22");
		const jan = current(1, 2027);
		expect(jan.YTDVacationBalanceFwd).toBe(closing);
		expect(round2(jan.YTDVacationAccrued)).toBe(192);
		expect(jan.YTDVacationUsed).toBe(0);
		expect(current(2, 2027).YTDVacationBalanceFwd).toBe(closing);
		expect(round2(current(2, 2027).YTDVacationBalance)).toBe(round2(closing + 384));
	});

	test("T-VAC-05 Payout treatment: the accrual is used each period, so nothing builds up", async () => {
		findEmployeeBenefitInfo.mockResolvedValue({ vacationPayPercent: "0.04", typeOfVacationTreatment: "Payout" });
		const dates = payDates(2026, 3, "2026-01-09");
		for (const [i, date] of dates.entries()) await run(i + 1, date);
		const last = current(3, 2026);
		expect(round2(last.YTDVacationAccrued)).toBe(576);
		expect(round2(last.YTDVacationUsed)).toBe(576);
		expect(round2(last.YTDVacationBalance)).toBe(0);
	});

	test("T-VAC-06 re-running a period, an extra run and pay runs processed out of order give the same balances", async () => {
		const dates = payDates(2026, 3, "2026-01-09");
		await run(1, dates[0]);
		await run(3, dates[2]); // period 3 processed before period 2
		await run(2, dates[1]);
		alloc["2026-01-30"] = { bonus: 1000 };
		await run(2, "2026-01-30", { isExtraRun: true, selectedEmp: [EMP_ID] });
		await run(3, dates[2]); // period 3 again, now after the extra run
		await run(3, dates[2]); // and again: same result
		const p3 = current(3, 2026);
		expect(round2(p3.YTDVacationAccrued)).toBe(576 + 40); // the bonus (paid before period 3) accrues 4 %
		expect(round2(p3.YTDVacationBalance)).toBe(616);
		const extraRun = store.find((d) => d.isExtraRun && String(d.payPeriodNum) === "2");
		expect(round2(extraRun.YTDVacationAccrued)).toBe(384 + 40);
	});

	test("T-VAC-07 no stub last year: nothing carried; last year's stub on another pay schedule is used", async () => {
		await run(1, "2026-01-09");
		expect(current(1, 2026).YTDVacationBalanceFwd).toBe(0);
		store.length = 0;
		store.push(
			stub(26, "2025-12-05", { YTDVacationBalance: 10 }),
			stub(12, "2025-12-31", { scheduleFrequency: "Monthly", YTDVacationBalance: 75 }),
		);
		await run(1, "2026-01-09");
		expect(current(1, 2026).YTDVacationBalanceFwd).toBe(75); // the last one paid
	});
});
