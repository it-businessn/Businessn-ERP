/**
 * Stream E: pay-period numbers restart every payroll year, so processed pay
 * stubs must be keyed / read by (pay period, pay-date year), not pay period
 * alone (PAYYEAR-01). EmployeePayStub is backed by a tiny in-memory store that
 * applies the query filters, so "two years of period 7 coexist" is exercised
 * end to end through the real pay-run, submit, journal and T4 code paths.
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
jest.mock("../helpers/payrollHelper", () => ({
	...jest.requireActual("../helpers/payrollHelper"),
	buildNewEmpPayStubInfo: jest.fn(() => ({ currentNetPay: 100, currentGrossPay: 100 })),
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
const { calculateTimesheetApprovedHours } = require("../services/payrollService");
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

describe("PAYYEAR-01 current pay stub is keyed by pay period AND pay-date year", () => {
	test("T-YEAR-01 a 2026 rerun of period 7 updates only the 2026 stub; the 2025 stub survives", async () => {
		store.push(stub(7, "2025-03-21", { currentNetPay: 25 }), stub(7, "2026-03-20"));
		const res = await request(app).post("/api/payroll/process").set(auth()).send(runBody());
		expect(res.status).toBe(200);
		const [filter, update] = EmployeePayStub.findOneAndUpdate.mock.calls[0];
		expect(filter.payPeriodPayDate).toEqual(WINDOW_2026);
		expect(filter).toMatchObject({ payPeriodNum: 7, isExtraRun: false, isProcessed: true });
		expect(update.$set.payPeriodPayDate).toEqual(utc("2026-03-20"));
		expect(store).toHaveLength(2);
		expect(byYear(2025)[0].currentNetPay).toBe(25); // last year's history intact
		expect(byYear(2026)[0].currentNetPay).toBe(100);
	});

	test("T-YEAR-02 first 2026 run of period 7 inserts a new stub next to the 2025 one", async () => {
		store.push(stub(7, "2025-03-21", { currentNetPay: 25 }));
		const res = await request(app).post("/api/payroll/process").set(auth()).send(runBody());
		expect(res.status).toBe(200);
		expect(store).toHaveLength(2);
		expect(byYear(2025)[0].currentNetPay).toBe(25);
		expect(byYear(2026)).toHaveLength(1);
		// the upsert-insert stores the pay date (UTC start of day) from $set
		expect(byYear(2026)[0].payPeriodPayDate).toEqual(utc("2026-03-20"));
	});

	test("T-YEAR-03 pay dates with a time part are normalised to UTC start of day on write", async () => {
		const res = await request(app)
			.post("/api/payroll/process")
			.set(auth())
			.send(runBody({ payPeriodPayDate: "2026-03-20T07:00:00.000Z" }));
		expect(res.status).toBe(200);
		const [filter, update] = EmployeePayStub.findOneAndUpdate.mock.calls[0];
		expect(filter.payPeriodPayDate).toEqual(WINDOW_2026);
		expect(update.$set.payPeriodPayDate).toEqual(utc("2026-03-20"));
	});
});

describe("PAYYEAR-01 previous-period lookup is year-scoped", () => {
	test("T-YEAR-04 period 7 of 2026 uses period 6 of 2026, not period 6 of 2025", async () => {
		store.push(
			stub(6, "2025-03-07", { YTDGrossPay: 9000 }),
			stub(6, "2026-03-06", { YTDGrossPay: 600 }),
		);
		await request(app).post("/api/payroll/process").set(auth()).send(runBody());
		const prevCall = EmployeePayStub.findOne.mock.calls.find(([f]) => f.payPeriodNum === 6);
		expect(prevCall[0].payPeriodPayDate).toEqual(WINDOW_2026);
		const written = EmployeePayStub.findOneAndUpdate.mock.calls[0][1].$set;
		expect(written.YTDGrossPay).toBe(700);
	});

	test("T-YEAR-05 period 1 of 2026 uses the last bi-weekly period (26) of 2025 as previous", async () => {
		store.push(
			stub(26, "2024-12-20", { YTDVacationAccrued: 1 }),
			stub(26, "2025-12-19", { YTDVacationAccrued: 42 }),
		);
		const res = await request(app)
			.post("/api/payroll/process")
			.set(auth())
			.send(
				runBody({
					payPeriod: 1,
					payPeriodStartDate: "2025-12-15",
					payPeriodEndDate: "2025-12-28",
					payPeriodProcessingDate: "2025-12-30",
					payPeriodPayDate: "2026-01-02",
				}),
			);
		expect(res.status).toBe(200);
		const prevCall = EmployeePayStub.findOne.mock.calls.find(([f]) => f.payPeriodNum == 26);
		expect(prevCall[0].payPeriodPayDate).toEqual(WINDOW_2025);
		const written = EmployeePayStub.findOneAndUpdate.mock.calls[0][1].$set;
		expect(written.YTDVacationBalanceFwd).toBe(42); // carried from Dec 2025, not Dec 2024
		expect(written.YTDGrossPay).toBe(100); // YTD restarts at period 1 (unchanged arithmetic)
	});

	test("T-YEAR-06 period 1 of a monthly schedule looks for period 12 of the previous year", async () => {
		store.push(stub(12, "2025-12-05", { scheduleFrequency: "Monthly", YTDVacationAccrued: 7 }));
		await request(app)
			.post("/api/payroll/process")
			.set(auth())
			.send(runBody({ payPeriod: 1, frequency: "Monthly", payPeriodPayDate: "2026-01-05" }));
		const prevCall = EmployeePayStub.findOne.mock.calls.find(([f]) => f.payPeriodNum == 12);
		expect(prevCall).toBeDefined();
		expect(prevCall[0].payPeriodPayDate).toEqual(WINDOW_2025);
		expect(EmployeePayStub.findOneAndUpdate.mock.calls[0][1].$set.YTDVacationBalanceFwd).toBe(7);
	});

	test("T-YEAR-07 extra run: previous = same period of the same year; upsert is year-scoped", async () => {
		store.push(
			stub(7, "2025-03-21", { YTDGrossPay: 9000 }),
			stub(7, "2026-03-20", { YTDGrossPay: 700 }),
			stub(7, "2025-03-21", { isExtraRun: true, currentNetPay: 5 }),
		);
		const res = await request(app)
			.post("/api/payroll/process")
			.set(auth())
			.send(runBody({ isExtraRun: true, selectedEmp: [EMP_ID] }));
		expect(res.status).toBe(200);
		const prevCall = EmployeePayStub.findOne.mock.calls.find(([f]) => f.payPeriodNum === 7);
		expect(prevCall[0].payPeriodPayDate).toEqual(WINDOW_2026);
		const [filter, update] = EmployeePayStub.findOneAndUpdate.mock.calls[0];
		expect(filter).toMatchObject({ isExtraRun: true, payPeriodPayDate: WINDOW_2026 });
		expect(update.$set.YTDGrossPay).toBe(800);
		expect(byYear(2025, "7", true)[0].currentNetPay).toBe(5); // 2025 extra stub untouched
		expect(byYear(2026, "7", true)).toHaveLength(1);
	});
});

describe("PAYYEAR-01 readers by pay period are year-scoped", () => {
	test("T-YEAR-08 submit (VoPay payees) only returns 2026 stubs for the 2026 period 7", async () => {
		store.push(stub(7, "2025-03-21", { _id: "old" }), stub(7, "2026-03-20", { _id: "new" }));
		const res = await request(app)
			.put("/api/payroll/report/submit/65c000000000000000000001")
			.set(auth())
			.send({ yearSchedules: [], ...runBody() });
		expect(res.status).toBe(200);
		const [filter] = EmployeePayStub.find.mock.calls[0];
		expect(filter.payPeriodPayDate).toEqual(WINDOW_2026);
		expect(res.body.employeePayStubs.map((s) => s._id)).toEqual(["new"]);
	});

	test("T-YEAR-09 journal entry for the 2026 run reads only 2026 stubs", async () => {
		store.push(
			stub(7, "2025-03-21", { currentGrossPay: 5000 }),
			stub(7, "2026-03-20", { currentGrossPay: 100 }),
		);
		FundingTotalsPay.findOneAndUpdate.mockImplementation(() =>
			query({ value: { _id: "f1" }, lastErrorObject: { updatedExisting: false } }),
		);
		FundingTotalsPay.findById.mockResolvedValue({
			companyName: "Acme",
			payPeriodNum: "7",
			isExtraRun: false,
			scheduleFrequency: "Biweekly",
			payPeriodPayDate: utc("2026-03-20"),
			payPeriodProcessingDate: utc("2026-03-18"),
		});
		const res = await request(app).post("/api/payroll/process").set(auth()).send(runBody());
		expect(res.status).toBe(200);
		await flush();
		await flush();
		const journalRead = EmployeePayStub.find.mock.calls.find(([f]) => f.payPeriodNum === "7");
		expect(journalRead[0].payPeriodPayDate).toEqual(WINDOW_2026);
		const entry = JournalEntry.create.mock.calls[0][0];
		const gross = entry.departmentBreakDown.reduce((s, d) => s + d.grossWageExpense, 0);
		expect(gross).toBe(100); // only the (re-run) 2026 stub, not 2025's 5000
	});

	test("T-YEAR-10 the pay run hands the pay date to T4 generation", async () => {
		await request(app).post("/api/payroll/process").set(auth()).send(runBody());
		await flush();
		expect(generateT4Slip).toHaveBeenCalledWith("Acme", 7, "2026-03-14", "2026-03-20");
	});

	test("T-YEAR-11 T4 data for 2026 period 7 excludes the 2025 period-7 stubs", async () => {
		const { buildT4PayrollData } = jest.requireActual("../controllers/t4SlipController");
		store.push(
			stub(7, "2025-03-21", { currentGrossPay: 5000, empId: { _id: EMP_ID, fullName: "Old" } }),
			stub(7, "2026-03-20", { currentGrossPay: 100, empId: { _id: EMP_ID, fullName: "New" } }),
		);
		const data = await buildT4PayrollData("Acme", 7, "2026-03-20");
		expect(EmployeePayStub.find.mock.calls[0][0].payPeriodPayDate).toEqual(WINDOW_2026);
		expect(data.map((d) => d.employeeInfo.currentGrossPay)).toEqual([100]);
	});

	test("T-YEAR-12 T4 data without a pay date falls back to the most recent pay year", async () => {
		const { buildT4PayrollData } = jest.requireActual("../controllers/t4SlipController");
		store.push(
			stub(7, "2026-03-20", { currentGrossPay: 100, empId: { _id: EMP_ID, fullName: "New" } }),
			stub(7, "2025-03-21", { currentGrossPay: 5000, empId: { _id: EMP_ID, fullName: "Old" } }),
		);
		const data = await buildT4PayrollData("Acme", 7);
		expect(data.map((d) => d.employeeInfo.currentGrossPay)).toEqual([100]);
	});
});

describe("PAYYEAR-01 exact-date stub readers tolerate the normalised pay date", () => {
	test("T-YEAR-14 findEmployeePayStub / findEmpPayStubDetail match the whole UTC day", async () => {
		const { findEmployeePayStub, findEmpPayStubDetail } = jest.requireActual(
			"../services/payrollService",
		);
		store.push(stub(7, "2026-03-20", { _id: "processed" }));
		const a = await findEmployeePayStub(EMP_ID, "2026-03-20T07:00:00.000Z", "Acme");
		const b = await findEmpPayStubDetail(EMP_ID, "2026-03-20", "Acme");
		expect(a?._id).toBe("processed");
		expect(b?._id).toBe("processed");
		expect(EmployeePayStub.findOne.mock.calls[0][0].payPeriodPayDate).toEqual({
			$gte: utc("2026-03-20"),
			$lt: utc("2026-03-21"),
		});
	});
});

describe("PAYYEAR-01 unique index and duplicate report", () => {
	test("T-YEAR-13 uniq_processed_paystub_v2 includes payPeriodPayDate and stays partial", () => {
		const idx = jest.requireActual("../models/EmployeePayStub").schema.indexes();
		const v2 = idx.find(([, o]) => o.name === "uniq_processed_paystub_v2");
		expect(v2).toBeDefined();
		expect(v2[0]).toEqual({
			companyName: 1,
			empId: 1,
			payPeriodNum: 1,
			isExtraRun: 1,
			scheduleFrequency: 1,
			reportType: 1,
			payPeriodPayDate: 1,
		});
		expect(v2[1]).toMatchObject({ unique: true, partialFilterExpression: { isProcessed: true } });
		expect(idx.some(([, o]) => o.name === "uniq_processed_paystub")).toBe(false);
		const script = fs.readFileSync(
			path.join(__dirname, "..", "scripts", "check-duplicates.js"),
			"utf8",
		);
		expect(script).toContain('db.employeepaystubs.dropIndex("uniq_processed_paystub")');
		expect(script).toContain("uniq_processed_paystub_v2");
	});
});
