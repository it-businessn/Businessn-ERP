/**
 * Stream E2: leftover handler defects.
 *  - LEFT-01 POST /api/payroll/employmentInfo always 500 (updateEmployee used an undefined `res`)
 *  - LEFT-02 POST /api/timecard/manual: no response for [] / several responses for several entries
 *  - LEFT-03 findEmployeeTADByBadgeId matched badges across every tenant
 *  - LEFT-04 affiliate getEmployeeProfileInfo: unchecked Employee.findById fallback (as NEW-14)
 *  - LEFT-05 HTML injection in e-mails built from request data (AUD-016)
 * Models, e-mail and the permission seeding are mocked; routing, middleware and
 * the controllers under test are real.
 */
const request = require("supertest");

jest.mock("../models/Company");
jest.mock("../models/Employee");
jest.mock("../models/EmployeeEmploymentInfo");
jest.mock("../models/EmployeePayInfo");
jest.mock("../models/EmployeeProfileInfo");
jest.mock("../models/Timecard");
jest.mock("../models/TimecardRaw");
jest.mock("../models/Timesheet");
jest.mock("../models/Ticket");
jest.mock("../models/Lead");
jest.mock("../services/emailService", () => ({ sendEmail: jest.fn() }));
jest.mock("../controllers/permissionController", () => ({
	...jest.requireActual("../controllers/permissionController"),
	setInitialPermissions: jest.fn(),
}));
jest.mock("../controllers/statHolidayController", () => ({
	...jest.requireActual("../controllers/statHolidayController"),
	getHolidays: jest.fn(async () => []),
}));

const Company = require("../models/Company");
const Employee = require("../models/Employee");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");
const Timecard = require("../models/Timecard");
const TimecardRaw = require("../models/TimecardRaw");
const Timesheet = require("../models/Timesheet");
const SupportTicket = require("../models/Ticket");
const Lead = require("../models/Lead");
const { sendEmail } = require("../services/emailService");
const timecardController = require("../controllers/timecardController");
const { clearMembershipCache } = require("../middleware/authorize");
const { USER_ID, auth, query, buildTestApp } = require("./helpers");

const EMP_ID = "64e000000000000000000001";
const EMP_2 = "64e000000000000000000002";
const ACME_ID = "65b000000000000000000001";
const XSS = "<script>alert(1)</script>";
const flush = () => new Promise((r) => setImmediate(r));

let app;
// employment records by "<empId>|<companyName>"; the caller (USER_ID) is a Super Admin of Acme
let employment;
beforeAll(() => {
	app = buildTestApp();
});
beforeEach(() => {
	jest.clearAllMocks();
	jest.restoreAllMocks();
	clearMembershipCache();
	employment = { [`${USER_ID}|Acme`]: { employmentRole: "Super Admin", empId: USER_ID } };
	Company.find.mockImplementation(() => query([{ name: "Acme", _id: ACME_ID }]));
	EmployeeEmploymentInfo.findOne.mockImplementation((filter = {}) =>
		query(employment[`${filter.empId}|${filter.companyName}`] ?? null),
	);
});

describe("LEFT-01 POST /api/payroll/employmentInfo", () => {
	const body = { empId: EMP_ID, companyName: "Acme", payrollStatus: "Payroll Active", employeeNo: "E1", employmentRole: "Employee" };

	test("T-LEFT-01 success path -> 200 with the record, employee fields updated", async () => {
		EmployeeEmploymentInfo.create.mockResolvedValue([{ _id: "ei1", empId: EMP_ID }]);
		const employee = { _id: EMP_ID, payrollStatus: "Payroll Inactive", save: jest.fn() };
		Employee.findById.mockResolvedValue(employee);
		const res = await request(app).post("/api/payroll/employmentInfo").set(auth()).send(body);
		expect(res.status).toBe(200);
		expect(res.body).toEqual([{ _id: "ei1", empId: EMP_ID }]);
		expect(employee.save).toHaveBeenCalledTimes(1);
		expect(employee).toMatchObject({ payrollStatus: "Payroll Active", employeeNo: "E1", role: "Employee" });
	});

	test("T-LEFT-02 missing / invalid empId or companyName -> 400, nothing written", async () => {
		for (const bad of [{ ...body, empId: undefined }, { ...body, empId: "nope" }, { ...body, employmentRole: undefined, companyName: undefined }]) {
			const res = await request(app).post("/api/payroll/employmentInfo").set(auth()).send(bad);
			expect(res.status).toBe(400);
		}
		expect(EmployeeEmploymentInfo.create).not.toHaveBeenCalled();
	});

	test("T-LEFT-03 a failing employee update is reported as 500 (error path still answers)", async () => {
		EmployeeEmploymentInfo.create.mockResolvedValue([{ _id: "ei1" }]);
		Employee.findById.mockResolvedValue({ _id: EMP_ID, save: jest.fn().mockRejectedValue(new Error("db down")) });
		jest.spyOn(console, "error").mockImplementation(() => {});
		const res = await request(app).post("/api/payroll/employmentInfo").set(auth()).send(body);
		expect(res.status).toBe(500);
		expect(res.body).toEqual({ message: "Internal server error" });
	});
});

describe("LEFT-02 POST /api/timecard/manual", () => {
	beforeEach(() => {
		employment[`${EMP_ID}|Acme`] = { employeeNo: "E1" };
		employment[`${EMP_2}|Acme`] = { employeeNo: "E2" };
		Timecard.findOne.mockImplementation(() => query(null));
	});
	const entry = (empId = EMP_ID) => ({ isNotDevice: true, empId, companyName: "Acme", punch: "0" });

	test("T-LEFT-04 empty array, non-array and non-matching bodies -> 400 (used to hang / 500)", async () => {
		for (const body of [[], {}, [{ punch: "0" }], [entry(), "x"], [{ isNotDevice: true, empId: EMP_ID, punch: "0" }]]) {
			const res = await request(app).post("/api/timecard/manual").set(auth()).send(body);
			expect(res.status).toBe(400);
		}
	});

	test("T-LEFT-05 several entries -> exactly one 201 response with the old body", async () => {
		const errors = jest.spyOn(console, "error").mockImplementation(() => {});
		const res = await request(app).post("/api/timecard/manual").set(auth()).send([entry(), entry(EMP_2)]);
		await flush();
		expect(res.status).toBe(201);
		expect(res.body).toBe("Timecard entries added manually");
		expect(Timecard.findOne).toHaveBeenCalledTimes(2);
		expect(errors).not.toHaveBeenCalled();
	});

	test("T-LEFT-06 a failing entry -> one 500 with per-entry results", async () => {
		jest.spyOn(console, "error").mockImplementation(() => {});
		Timecard.findOne.mockImplementation((f) =>
			f.badge_id === "E2" ? { sort: () => Promise.reject(new Error("boom")) } : query(null),
		);
		const res = await request(app).post("/api/timecard/manual").set(auth()).send([entry(), entry(EMP_2)]);
		expect(res.status).toBe(500);
		expect(res.body.results).toEqual([
			{ index: 0, status: "ok" },
			{ index: 1, status: "failed" },
		]);
	});
});

describe("LEFT-03 badge lookup is scoped by company", () => {
	const match = (companyName) => ({ empId: { _id: EMP_ID, fullName: "A" }, companyName });

	test("T-LEFT-07 with a company the lookup is limited to it", async () => {
		EmployeeEmploymentInfo.findOne.mockImplementation(() => query(match("Acme")));
		const rec = await timecardController.findEmployeeTADByBadgeId("5", "Acme");
		expect(rec.companyName).toBe("Acme");
		expect(EmployeeEmploymentInfo.findOne.mock.calls[0][0]).toMatchObject({ companyName: "Acme" });
	});

	test("T-LEFT-08 device punch (no company): a badge used in two tenants is not attributed", async () => {
		const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
		EmployeeEmploymentInfo.find.mockImplementation(() => query([match("Acme"), match("Globex")]));
		expect(await timecardController.findEmployeeTADByBadgeId("5")).toBeNull();
		expect(warn).toHaveBeenCalled();
		EmployeeEmploymentInfo.find.mockImplementation(() => query([match("Acme"), match("Acme")]));
		expect((await timecardController.findEmployeeTADByBadgeId("5")).companyName).toBe("Acme");
	});

	test("T-LEFT-09 device clock-in with an ambiguous badge creates no time card; clock-out uses the time card's company", async () => {
		jest.spyOn(console, "warn").mockImplementation(() => {});
		const now = new Date().toISOString();
		TimecardRaw.findOne.mockResolvedValue(null);
		TimecardRaw.create.mockResolvedValue({});
		EmployeeEmploymentInfo.find.mockImplementation(() => query([match("Acme"), match("Globex")]));
		TimecardRaw.find.mockImplementation(() => query([{ user_id: "5", timestamp: now, punch: "0" }]));
		Timecard.findOne.mockImplementation(() => query(null));
		let res = await request(app).post("/api/timecard").send([{ user_id: "5", timestamp: now, punch: "0" }]);
		expect(res.status).toBe(201);
		await flush();
		await flush();
		expect(Timecard.create).not.toHaveBeenCalled();

		TimecardRaw.find.mockImplementation(() => query([{ user_id: "5", timestamp: now, punch: "1" }]));
		Timecard.findOne.mockImplementation(() =>
			query({ _id: "tc1", badge_id: "5", companyName: "Globex", clockIn: now, startBreaks: [], endBreaks: [] }),
		);
		Timecard.findByIdAndUpdate.mockResolvedValue({});
		EmployeeEmploymentInfo.findOne.mockImplementation(() => query(match("Globex")));
		Timesheet.findOne.mockResolvedValue(null);
		res = await request(app).post("/api/timecard").send([{ user_id: "5", timestamp: now, punch: "1" }]);
		expect(res.status).toBe(201);
		await flush();
		await flush();
		expect(EmployeeEmploymentInfo.findOne).toHaveBeenCalledWith(expect.objectContaining({ companyName: "Globex" }));
	});
});

describe("LEFT-04 GET /api/affiliate/:companyName/:empId", () => {
	beforeEach(() => {
		EmployeeProfileInfo.findOne.mockImplementation(() => query(null));
		Employee.findById.mockImplementation(() => query({ _id: EMP_ID, firstName: "A", email: "a@x" }));
	});

	test("T-LEFT-10 employee of another company -> 404, Employee not read", async () => {
		Company.findOne.mockImplementation(() => query(null));
		const res = await request(app).get(`/api/affiliate/Acme/${EMP_ID}`).set(auth());
		expect(res.status).toBe(404);
		expect(Employee.findById).not.toHaveBeenCalled();
	});

	test("T-LEFT-11 member of the company -> 200 with the basic record", async () => {
		Company.findOne.mockImplementation(() => query({ _id: ACME_ID }));
		const res = await request(app).get(`/api/affiliate/Acme/${EMP_ID}`).set(auth());
		expect(res.status).toBe(200);
		expect(res.body.firstName).toBe("A");
		expect(Company.findOne).toHaveBeenCalledWith({ name: "Acme", employees: EMP_ID });
	});
});

describe("LEFT-05 user input is HTML-escaped in e-mails", () => {
	const html = () => sendEmail.mock.calls[0][3];
	const expectEscaped = (s) => {
		expect(s).not.toContain("<script>");
		expect(s).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
	};
	beforeEach(() => {
		Employee.findOne.mockImplementation(() => query({ email: "support@x", fullName: "Support" }));
		SupportTicket.create.mockImplementation(async (d) => ({ ...d, _id: "t1" }));
		Lead.create.mockImplementation(async (d) => ({ ...d, _id: "l1" }));
	});

	test("T-LEFT-12 public lead form (POST /api/ticket/leads)", async () => {
		const res = await request(app)
			.post("/api/ticket/leads")
			.send({ firstName: XSS, lastName: '"><img src=x>', email: "a@b.c", phone: XSS, companyName: `${XSS} Inc` });
		expect(res.status).toBeLessThan(300);
		expectEscaped(html());
		expect(html()).not.toContain("<img src=x>");
		expect(html()).toMatch(/(&quot;|&#34;)&gt;&lt;img src=x&gt;/); // EJS writes " as &#34;
	});

	test("T-LEFT-13 public support form (POST /api/ticket/support)", async () => {
		const res = await request(app)
			.post("/api/ticket/support")
			.send({
				companyInfo: { companyName: `${XSS} Inc` },
				contactInfo: { clientFirstName: "A", clientLastName: "B", clientEmail: "a@b.c" },
				queryInfo: { issue: XSS },
			});
		expect(res.status).toBe(201);
		expectEscaped(html());
	});

	test("T-LEFT-14 internal ticket (POST /api/ticket)", async () => {
		const res = await request(app)
			.post("/api/ticket")
			.set(auth())
			.send({ companyName: "Acme", originator: XSS, assignee: "Support", topic: XSS, issue: XSS, category: "Support" });
		expect(res.status).toBeLessThan(300);
		expectEscaped(html());
	});

	test("T-LEFT-15 password reset e-mail (POST /api/forgot-password)", async () => {
		Employee.findOne.mockImplementation(() =>
			query({ _id: EMP_ID, email: "a@b.c", firstName: XSS, password: "hash" }),
		);
		const res = await request(app).post("/api/forgot-password").send({ email: "a@b.c" });
		expect(res.status).toBe(200);
		expectEscaped(html());
	});
});
