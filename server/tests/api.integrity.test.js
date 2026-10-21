/**
 * Stream D: pay-run integrity (AUD-015) and time-card device authentication
 * (AUD-013). Models and the payroll calculation services are mocked; routing,
 * middleware and the pay-run / funding-totals / T4 controllers are real.
 */
const request = require("supertest");
const mongoose = require("mongoose");

jest.mock("../models/Company");
jest.mock("../models/EmployeePayStub");
jest.mock("../models/FundingTotalsPay");
jest.mock("../models/EmployeePayInfo");
jest.mock("../models/EmployeeGovernmentInfo");
jest.mock("../models/EmployeeExtraAllocation");
jest.mock("../models/Timecard");
jest.mock("../models/TimecardRaw");
jest.mock("../models/EmployeeTADProfile");
jest.mock("../models/EmployeeEmploymentInfo");
jest.mock("../services/userService", () => ({
	...jest.requireActual("../services/userService"),
	getPayrollActiveEmployees: jest.fn(),
}));
jest.mock("../services/payrollService", () => ({
	...jest.requireActual("../services/payrollService"),
	calculateTimesheetApprovedHours: jest.fn(),
	findEmployeeBenefitInfo: jest.fn(),
}));
jest.mock("../helpers/payrollHelper", () => ({
	...jest.requireActual("../helpers/payrollHelper"),
	buildNewEmpPayStubInfo: jest.fn(() => ({ currentNetPay: 100, currentIncomeTaxDeductions: 10 })),
}));
jest.mock("../controllers/t4SlipController", () => ({
	...jest.requireActual("../controllers/t4SlipController"),
	generateT4Slip: jest.fn(),
}));

const Company = require("../models/Company");
const EmployeePayStub = require("../models/EmployeePayStub");
const FundingTotalsPay = require("../models/FundingTotalsPay");
const EmployeePayInfo = require("../models/EmployeePayInfo");
const EmployeeGovernmentInfo = require("../models/EmployeeGovernmentInfo");
const EmployeeExtraAllocation = require("../models/EmployeeExtraAllocation");
const Timecard = require("../models/Timecard");
const TimecardRaw = require("../models/TimecardRaw");
const EmployeeTADProfileInfo = require("../models/EmployeeTADProfile");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const { getPayrollActiveEmployees } = require("../services/userService");
const { calculateTimesheetApprovedHours } = require("../services/payrollService");
const { generateT4Slip } = require("../controllers/t4SlipController");
const { clearMembershipCache } = require("../middleware/authorize");
const { auth, query, buildTestApp } = require("./helpers");

const EMP_ID = "64e000000000000000000001";
const PAY_BODY = {
	companyName: "Acme",
	currentPayPeriod: {
		payPeriod: 7,
		payPeriodStartDate: "2026-03-01",
		payPeriodEndDate: "2026-03-14",
		payPeriodPayDate: "2026-03-20",
		payPeriodProcessingDate: "2026-03-18",
		frequency: "bi-weekly",
		isExtraRun: false,
	},
};

const flush = () => new Promise((r) => setImmediate(r));

let app;
beforeAll(() => {
	app = buildTestApp();
});
afterEach(() => {
	delete mongoose.connection.readyState; // removes the instance shadow, if any
});
beforeEach(() => {
	jest.clearAllMocks();
	jest.restoreAllMocks();
	clearMembershipCache();
	delete process.env.PAYRUN_TRANSACTIONS;
	delete process.env.TIMECARD_DEVICE_KEYS;
	// AUD-028 (stream C): payroll/VoPay routes are role-gated; the caller is an
	// Authorizing Admin here so these tests keep exercising the handlers.
	EmployeeEmploymentInfo.findOne.mockImplementation(() => query({ employmentRole: "Authorizing Admin" }));
	Company.find.mockImplementation(() => query([{ name: "Acme", _id: "65b000000000000000000001" }]));
	getPayrollActiveEmployees.mockResolvedValue([{ empId: { _id: EMP_ID } }]);
	calculateTimesheetApprovedHours.mockResolvedValue([]);
	EmployeePayInfo.findOne.mockImplementation(() => query(null));
	EmployeeGovernmentInfo.findOne.mockImplementation(() => query(null));
	EmployeeExtraAllocation.findOne.mockImplementation(() => query(null));
	EmployeePayStub.findOne.mockImplementation(() => query(null));
	EmployeePayStub.find.mockImplementation(() => query([]));
	EmployeePayStub.create.mockImplementation(async (d) => ({ _id: "s1", ...d }));
	EmployeePayStub.findOneAndUpdate.mockImplementation(() => query({ _id: "s1" }));
	FundingTotalsPay.findOne.mockImplementation(() => query(null));
	FundingTotalsPay.findById.mockResolvedValue(null);
	FundingTotalsPay.create.mockImplementation(async (d) => ({ _id: "f1", ...d }));
	FundingTotalsPay.findOneAndUpdate.mockImplementation(() =>
		query({ value: { _id: "f1" }, lastErrorObject: { updatedExisting: false } }),
	);
	generateT4Slip.mockResolvedValue(undefined);
});

/** Pretend mongoose is connected and hands out the given session. */
const fakeConnection = (sessionOrError) => {
	// readyState is a non-configurable prototype accessor: shadow it on the instance
	Object.defineProperty(mongoose.connection, "readyState", { get: () => 1, configurable: true });
	return jest.spyOn(mongoose.connection, "startSession").mockImplementation(async () => {
		if (sessionOrError instanceof Error) throw sessionOrError;
		return sessionOrError;
	});
};
const replicaSetError = () =>
	Object.assign(
		new Error("Transaction numbers are only allowed on a replica set member or mongos"),
		{ code: 20, codeName: "IllegalOperation" },
	);

describe("AUD-015 pay-run integrity", () => {
	test("T-INT-01 pay stub is written with one atomic upsert on its natural key", async () => {
		const res = await request(app).post("/api/payroll/process").set(auth()).send(PAY_BODY);
		expect(res.status).toBe(200);
		expect(EmployeePayStub.create).not.toHaveBeenCalled();
		expect(EmployeePayStub.findOneAndUpdate).toHaveBeenCalledTimes(1);
		const [filter, update, opts] = EmployeePayStub.findOneAndUpdate.mock.calls[0];
		expect(filter).toEqual({
			companyName: "Acme",
			empId: EMP_ID,
			payPeriodNum: 7,
			isExtraRun: false,
			scheduleFrequency: "Biweekly",
			reportType: null,
			isProcessed: true,
			// PAYYEAR-01 (stream E): + the pay-date year of the run
			payPeriodPayDate: {
				$gte: new Date("2026-01-01T00:00:00.000Z"),
				$lt: new Date("2027-01-01T00:00:00.000Z"),
			},
		});
		expect(update.$set).toMatchObject({ empId: EMP_ID, isProcessed: true, currentNetPay: 100 });
		expect(opts).toMatchObject({ upsert: true, new: true });
	});

	test("T-INT-02 funding totals are upserted on (company, period, extra-run, pay date, frequency)", async () => {
		const res = await request(app).post("/api/payroll/process").set(auth()).send(PAY_BODY);
		expect(res.status).toBe(200);
		expect(FundingTotalsPay.create).not.toHaveBeenCalled();
		expect(FundingTotalsPay.findOneAndUpdate).toHaveBeenCalledTimes(1);
		const [filter, update, opts] = FundingTotalsPay.findOneAndUpdate.mock.calls[0];
		expect(filter).toEqual({
			companyName: "Acme",
			payPeriodNum: 7,
			isExtraRun: false,
			payPeriodPayDate: new Date("2026-03-20T00:00:00.000Z"),
			scheduleFrequency: "Biweekly",
		});
		expect(update.$set.totalNetPay).toBe(100);
		expect(opts).toMatchObject({ upsert: true });
		// journal entry only for a newly created funding record, after the writes
		await flush();
		expect(FundingTotalsPay.findById).toHaveBeenCalledWith("f1");
	});

	test("T-INT-03 updating existing funding totals does not create a second journal entry", async () => {
		FundingTotalsPay.findOneAndUpdate.mockImplementation(() =>
			query({ value: { _id: "f1" }, lastErrorObject: { updatedExisting: true } }),
		);
		const res = await request(app).post("/api/payroll/process").set(auth()).send(PAY_BODY);
		expect(res.status).toBe(200);
		await flush();
		expect(FundingTotalsPay.findById).not.toHaveBeenCalled();
	});

	test("T-INT-04 writes run inside a transaction and commit when sessions are supported", async () => {
		const session = {
			withTransaction: jest.fn(async (fn) => fn(session)),
			endSession: jest.fn(async () => {}),
		};
		fakeConnection(session);
		const res = await request(app).post("/api/payroll/process").set(auth()).send(PAY_BODY);
		expect(res.status).toBe(200);
		expect(session.withTransaction).toHaveBeenCalledTimes(1);
		expect(session.endSession).toHaveBeenCalled();
		expect(EmployeePayStub.findOneAndUpdate.mock.calls[0][2].session).toBe(session);
		expect(FundingTotalsPay.findOneAndUpdate.mock.calls[0][2].session).toBe(session);
	});

	test("T-INT-05 standalone mongod (replica-set error from the transaction) -> non-transactional fallback", async () => {
		const session = {
			withTransaction: jest.fn(async () => {
				throw replicaSetError();
			}),
			endSession: jest.fn(async () => {}),
		};
		fakeConnection(session);
		const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
		const res = await request(app).post("/api/payroll/process").set(auth()).send(PAY_BODY);
		expect(res.status).toBe(200);
		expect(EmployeePayStub.findOneAndUpdate).toHaveBeenCalledTimes(1);
		expect(EmployeePayStub.findOneAndUpdate.mock.calls[0][2].session).toBeUndefined();
		expect(FundingTotalsPay.findOneAndUpdate).toHaveBeenCalledTimes(1);
		warn.mockRestore();
	});

	test("T-INT-06 startSession itself failing with IllegalOperation -> fallback", async () => {
		fakeConnection(replicaSetError());
		jest.spyOn(console, "warn").mockImplementation(() => {});
		const res = await request(app).post("/api/payroll/process").set(auth()).send(PAY_BODY);
		expect(res.status).toBe(200);
		expect(EmployeePayStub.findOneAndUpdate).toHaveBeenCalledTimes(1);
	});

	test("T-INT-07 PAYRUN_TRANSACTIONS=off never opens a session", async () => {
		process.env.PAYRUN_TRANSACTIONS = "off";
		const start = fakeConnection({ withTransaction: jest.fn(), endSession: jest.fn() });
		const res = await request(app).post("/api/payroll/process").set(auth()).send(PAY_BODY);
		expect(res.status).toBe(200);
		expect(start).not.toHaveBeenCalled();
		expect(EmployeePayStub.findOneAndUpdate).toHaveBeenCalledTimes(1);
	});

	test("T-INT-08 a non-transaction error inside the transaction -> 500, no silent retry", async () => {
		const session = {
			withTransaction: jest.fn(async (fn) => fn(session)),
			endSession: jest.fn(async () => {}),
		};
		fakeConnection(session);
		EmployeePayStub.findOneAndUpdate.mockImplementation(() => {
			throw Object.assign(new Error("E11000 duplicate key"), { code: 11000 });
		});
		jest.spyOn(console, "error").mockImplementation(() => {});
		const res = await request(app).post("/api/payroll/process").set(auth()).send(PAY_BODY);
		expect(res.status).toBe(500);
		expect(EmployeePayStub.findOneAndUpdate).toHaveBeenCalledTimes(1);
		expect(FundingTotalsPay.findOneAndUpdate).not.toHaveBeenCalled();
	});

	test("T-INT-09 failing T4 generation is logged and never an unhandled rejection", async () => {
		const unhandled = jest.fn();
		process.on("unhandledRejection", unhandled);
		const err = jest.spyOn(console, "error").mockImplementation(() => {});
		generateT4Slip.mockImplementation(() => Promise.reject(new Error("T4 boom")));
		try {
			const res = await request(app).post("/api/payroll/process").set(auth()).send(PAY_BODY);
			expect(res.status).toBe(200);
			await flush();
			await flush();
			expect(unhandled).not.toHaveBeenCalled();
			expect(err.mock.calls.some((c) => String(c[0]).includes("T4"))).toBe(true);
		} finally {
			process.removeListener("unhandledRejection", unhandled);
		}
	});

	test("T-INT-10 generateT4Slip with no pay stubs resolves without crashing", async () => {
		const actual = jest.requireActual("../controllers/t4SlipController");
		EmployeePayStub.find.mockImplementation(() => query([]));
		jest.spyOn(console, "warn").mockImplementation(() => {});
		await expect(actual.generateT4Slip("Acme", 7, "2026-03-14")).resolves.toBeUndefined();
	});

	test("T-INT-11 unique natural-key indexes are declared and their build errors are logged", () => {
		const stubIdx = jest.requireActual("../models/EmployeePayStub").schema.indexes();
		expect(stubIdx).toContainEqual([
			// PAYYEAR-01 (stream E): key includes payPeriodPayDate (uniq_processed_paystub_v2)
			{
				companyName: 1,
				empId: 1,
				payPeriodNum: 1,
				isExtraRun: 1,
				scheduleFrequency: 1,
				reportType: 1,
				payPeriodPayDate: 1,
			},
			expect.objectContaining({ unique: true, partialFilterExpression: { isProcessed: true } }),
		]);
		const fundIdx = jest.requireActual("../models/FundingTotalsPay").schema.indexes();
		expect(fundIdx).toContainEqual([
			{ companyName: 1, payPeriodNum: 1, isExtraRun: 1, payPeriodPayDate: 1, scheduleFrequency: 1 },
			expect.objectContaining({ unique: true }),
		]);
		const RealStub = jest.requireActual("../models/EmployeePayStub");
		expect(RealStub.listenerCount("index")).toBeGreaterThan(0);
	});
});

describe("AUD-013 time-card authentication", () => {
	const GET_URL = `/api/timecard/Acme/filter=${encodeURIComponent(JSON.stringify({ startDate: "2026-03-01" }))}`;
	beforeEach(() => {
		Timecard.find.mockImplementation(() => query([]));
		TimecardRaw.find.mockImplementation(() => query([]));
		TimecardRaw.findOne.mockResolvedValue(null);
		TimecardRaw.create.mockResolvedValue({});
		EmployeeTADProfileInfo.find.mockImplementation(() => query([]));
	});

	test("T-DEV-01 time-card reads require a bearer token", async () => {
		expect((await request(app).get(GET_URL)).status).toBe(401);
		expect((await request(app).get("/api/timecard/tad-users")).status).toBe(401);
		expect((await request(app).get("/api/timecard/tad-filtered-users")).status).toBe(401);
		expect((await request(app).post("/api/timecard/manual").send([])).status).toBe(401);
		expect(Timecard.find).not.toHaveBeenCalled();
	});

	test("T-DEV-02 foreign company -> 403", async () => {
		const res = await request(app)
			.get(GET_URL.replace("/Acme/", "/Globex/"))
			.set(auth());
		expect(res.status).toBe(403);
		const manual = await request(app)
			.post("/api/timecard/manual")
			.set(auth())
			.send([{ isNotDevice: true, empId: "x", companyName: "Globex", punch: "0" }]);
		expect(manual.status).toBe(403);
		const tad = await request(app).get("/api/timecard/tad-users").set(auth());
		expect(tad.status).toBe(403); // TAD lists are hard-wired to one company
		expect(Timecard.find).not.toHaveBeenCalled();
		expect(EmployeeTADProfileInfo.find).not.toHaveBeenCalled();
	});

	test("T-DEV-03 own company -> 200", async () => {
		const res = await request(app).get(GET_URL).set(auth());
		expect(res.status).toBe(200);
		EmployeeEmploymentInfo.findOne.mockImplementation(() => query({ employeeNo: "1" }));
		Timecard.findOne.mockImplementation(() => query(null));
		const manual = await request(app)
			.post("/api/timecard/manual")
			.set(auth())
			.send([{ isNotDevice: true, empId: EMP_ID, companyName: "Acme", punch: "9" }]);
		expect(manual.status).toBe(201);
	});

	test("T-DEV-04 device keys configured: missing or wrong key -> 401, right key -> 201", async () => {
		process.env.TIMECARD_DEVICE_KEYS = "key-one, key-two";
		const punch = [{ user_id: "7746", timestamp: new Date().toISOString(), punch: "0" }];
		expect((await request(app).post("/api/timecard").send(punch)).status).toBe(401);
		expect(
			(await request(app).post("/api/timecard").set("x-device-key", "nope").send(punch)).status,
		).toBe(401);
		expect(TimecardRaw.create).not.toHaveBeenCalled();
		const ok = await request(app).post("/api/timecard").set("x-device-key", "key-two").send(punch);
		expect(ok.status).toBe(201);
		expect(TimecardRaw.create).toHaveBeenCalledTimes(1);
	});

	test("T-DEV-05 device keys configured: the web UI's refresh call with a bearer token still works", async () => {
		process.env.TIMECARD_DEVICE_KEYS = "key-one";
		const res = await request(app).post("/api/timecard").set(auth()).send([]);
		expect(res.status).toBe(201);
	});

	test("T-DEV-06 TIMECARD_DEVICE_KEYS unset -> device posts accepted without a key (backward compatible)", async () => {
		const res = await request(app)
			.post("/api/timecard")
			.send([{ user_id: "7746", timestamp: new Date().toISOString(), punch: "0" }]);
		expect(res.status).toBe(201);
	});
});
