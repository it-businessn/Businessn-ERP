/**
 * Regression tests for defects found in the second review pass (NEW-xx, see
 * docs/CHANGES.md). Models are mocked; routing, middleware and controllers
 * are real.
 */
const request = require("supertest");

jest.mock("../models/Company");
jest.mock("../models/Employee");
jest.mock("../models/EmployeeEmploymentInfo");
jest.mock("../models/Lead");
jest.mock("../models/permissions");
jest.mock("../models/TimecardRaw");
jest.mock("../models/Timecard");
jest.mock("../models/EmployeeShifts");
jest.mock("../models/WorkShift");
jest.mock("../models/Contact");
jest.mock("../models/Task");
jest.mock("../models/Order");
jest.mock("../models/Announcement");

const Company = require("../models/Company");
const Employee = require("../models/Employee");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const Lead = require("../models/Lead");
const UserPermissions = require("../models/permissions");
const TimecardRaw = require("../models/TimecardRaw");
const { clearMembershipCache } = require("../middleware/authorize");
const { USER_ID, OTHER_ID, auth, query, buildTestApp } = require("./helpers");

const ACME_ID = "65b000000000000000000001";
const GLOBEX_ID = "65b000000000000000000002";

let app;
beforeAll(() => {
	app = buildTestApp();
});
beforeEach(() => {
	jest.clearAllMocks();
	clearMembershipCache();
	// USER_ID belongs to Acme only
	Company.find.mockImplementation(() => query([{ name: "Acme", _id: ACME_ID }]));
});

describe("NEW-02 non-string company identifiers", () => {
	test("T-TEN-20 operator object as body companyName -> 400, handler not reached", async () => {
		const res = await request(app)
			.post("/api/payroll/employmentInfo/details")
			.set(auth())
			.send({ companyName: { $ne: "x" } });
		expect(res.status).toBe(400);
		expect(res.body.code).toBe("INVALID_COMPANY");
		expect(EmployeeEmploymentInfo.find).not.toHaveBeenCalled();
	});

	test("T-TEN-21 operator in query string (?companyName[$ne]=x) -> 400", async () => {
		const res = await request(app).get("/api/leads/disburse/Acme?companyName[$ne]=x").set(auth());
		expect(res.status).toBe(400);
	});

	test("T-TEN-22 array as body company -> 400", async () => {
		const res = await request(app)
			.post("/api/permissions")
			.set(auth())
			.send({ company: ["Acme", "Globex"] });
		expect(res.status).toBe(400);
	});

	test("T-TEN-23 null / absent companyName still passes (no regression)", async () => {
		UserPermissions.findOne.mockImplementation(() => query(null));
		UserPermissions.mockImplementation(() => ({
			permissionType: [],
			save: jest.fn().mockResolvedValue({ ok: 1 }),
		}));
		// AUD-028: POST /permissions now needs an admin-level role in a named
		// company, so the null value is carried by `company` instead of `companyName`.
		EmployeeEmploymentInfo.findOne.mockImplementation(() => query({ employmentRole: "Administrator" }));
		const res = await request(app)
			.post("/api/permissions")
			.set(auth())
			.send({ empId: USER_ID, company: null, companyName: "Acme", name: "Payroll", accessName: "canViewModule" });
		expect(res.status).toBe(201);
	});
});

describe("NEW-01 company (un)assignment through PUT /api/user/:id", () => {
	test("T-USR-04 assigning a company the caller does not belong to -> 403, nothing written", async () => {
		const res = await request(app)
			.put("/api/user/" + USER_ID)
			.set(auth())
			.send({ assignedCompanies: ["Globex"], role: "Administrator" });
		expect(res.status).toBe(403);
		expect(Company.findOne).not.toHaveBeenCalled();
		expect(Employee.findByIdAndUpdate).not.toHaveBeenCalled();
	});

	test("T-USR-05 companyId.name of a foreign company -> 403", async () => {
		const res = await request(app)
			.put("/api/user/" + OTHER_ID)
			.set(auth())
			.send({ companyId: { name: "Globex" }, role: "Employee" });
		expect(res.status).toBe(403);
	});

	test("T-USR-06 unassigning from a foreign company id -> 403, company not loaded", async () => {
		const res = await request(app)
			.put("/api/user/" + OTHER_ID)
			.set(auth())
			.send({ unassignedCompanies: [GLOBEX_ID] });
		expect(res.status).toBe(403);
		expect(Company.findById).not.toHaveBeenCalled();
	});

	test("T-USR-07 own company is still allowed (no regression)", async () => {
		// AUD-028: assigning a role needs a caller role whose ROLE_ACCESS includes it
		EmployeeEmploymentInfo.findOne.mockImplementation(() => query({ employmentRole: "Administrator" }));
		Company.findOne.mockResolvedValue(null);
		Company.findById.mockResolvedValue(null);
		Employee.findByIdAndUpdate.mockResolvedValue({ _id: OTHER_ID });
		const a = await request(app)
			.put("/api/user/" + OTHER_ID)
			.set(auth())
			.send({ assignedCompanies: ["Acme"], role: "Employee" });
		const b = await request(app)
			.put("/api/user/" + OTHER_ID)
			.set(auth())
			.send({ unassignedCompanies: [ACME_ID] });
		expect([a.status, b.status]).toEqual([201, 201]);
	});

	test("T-USR-08 plain profile edit without company fields is unaffected", async () => {
		Employee.findByIdAndUpdate.mockResolvedValue({ _id: OTHER_ID, firstName: "B" });
		const res = await request(app)
			.put("/api/user/" + OTHER_ID)
			.set(auth())
			.send({ firstName: "B" });
		expect(res.status).toBe(201);
	});
});

describe("NEW-03 time-card device POST", () => {
	test("T-TC-01 malformed payloads -> 400 instead of an unhandled rejection", async () => {
		for (const body of [[null], { user_id: "1" }, ["x"]]) {
			const res = await request(app).post("/api/timecard").send(body);
			expect(res.status).toBe(400);
		}
		expect(TimecardRaw.create).not.toHaveBeenCalled();
	});

	test("T-TC-02 punches are stored before the raw->timecard mapping runs", async () => {
		TimecardRaw.findOne.mockResolvedValue(null);
		TimecardRaw.create.mockImplementation(
			() => new Promise((resolve) => setTimeout(() => resolve({}), 30)),
		);
		TimecardRaw.find.mockImplementation(() => query([]));
		const res = await request(app)
			.post("/api/timecard")
			.send([{ user_id: "7746", timestamp: new Date().toISOString(), punch: "0" }]);
		expect(res.status).toBe(201);
		expect(TimecardRaw.create).toHaveBeenCalledTimes(1);
		expect(TimecardRaw.create.mock.invocationCallOrder[0]).toBeLessThan(
			TimecardRaw.find.mock.invocationCallOrder[0],
		);
	});
});

describe("NEW-08 / NEW-09 broken handlers", () => {
	test("T-LEAD-01 (NEW-09) GET /api/leads/disburse/:co returns the leads instead of 500", async () => {
		Lead.find.mockImplementation(() => query([{ _id: "l1" }]));
		const res = await request(app).get("/api/leads/disburse/Acme").set(auth());
		expect(res.status).toBe(200);
		expect(res.body).toEqual([{ _id: "l1" }]);
	});

	test("T-PERM-01 (NEW-08) adding a permission that already exists -> 409, not a hang", async () => {
		UserPermissions.findOne.mockImplementation(() => query({ empId: USER_ID }));
		// AUD-028: permission writes now need an admin-level role
		EmployeeEmploymentInfo.findOne.mockImplementation(() => query({ employmentRole: "Administrator" }));
		const res = await request(app)
			.post("/api/permissions")
			.set(auth())
			.send({ empId: USER_ID, companyName: "Acme", name: "Payroll", accessName: "canViewModule" });
		expect(res.status).toBe(409);
	});

	test("T-USR-09 (NEW-08) PUT /api/user/master/:id for an unknown user -> 404, not a hang", async () => {
		Employee.findById.mockResolvedValue(null);
		const res = await request(app)
			.put("/api/user/master/" + OTHER_ID)
			.set(auth())
			.send({});
		expect(res.status).toBe(404);
	});
});

describe("SEC-01 schedule routes where :name is the company", () => {
	const foreign = [
		"/api/schedule/2026-10-01/Globex",
		"/api/schedule/work/2026-10-01/Site%20A/Jane/Globex",
		"/api/schedule/work-week/2026-10-01/Site%20A/Jane/Globex",
		"/api/schedule/work/emp/2026-10-01/Site%20A/Jane/Globex",
	];
	test.each(foreign)("T-TEN-24 %s for a foreign company -> 403", async (url) => {
		const res = await request(app).get(url).set(auth());
		expect(res.status).toBe(403);
		expect(res.body.code).toBe("COMPANY_ACCESS_DENIED");
	});

	test("T-TEN-25 own company on the same route is not blocked", async () => {
		const EmployeeShift = require("../models/EmployeeShifts");
		EmployeeShift.find.mockResolvedValue([]);
		const res = await request(app).get("/api/schedule/2026-10-01/Acme").set(auth());
		expect(res.status).toBe(200);
	});
});

describe("API-02 empty T4 handlers", () => {
	test("T-T4-01 GET /api/generate-t4/:companyName -> 501 instead of hanging", async () => {
		const res = await request(app).get("/api/generate-t4/Acme").set(auth());
		expect(res.status).toBe(501);
	});
	test("T-T4-02 GET /api/generate-t4/emp/:companyName/:empId -> 501", async () => {
		const res = await request(app).get("/api/generate-t4/emp/Acme/" + OTHER_ID).set(auth());
		expect(res.status).toBe(501);
	});
});

describe("API-04/13 handlers that hung or updated nothing", () => {
	const ID = "65c000000000000000000001";

	test("T-CON-01 (API-13) PUT /api/contacts/:id updates the contact named in the URL", async () => {
		const Contact = require("../models/Contact");
		Contact.findByIdAndUpdate.mockResolvedValue({ _id: ID, name: "New" });
		const res = await request(app).put("/api/contacts/" + ID).set(auth()).send({ name: "New" });
		expect(res.status).toBe(201);
		expect(Contact.findByIdAndUpdate.mock.calls[0][0]).toBe(ID);
	});

	test("T-TASK-01 (API-13) PUT /api/tasks/:id and /status/:taskId both target the task", async () => {
		const Task = require("../models/Task");
		Task.findByIdAndUpdate.mockResolvedValue({ _id: ID });
		await request(app).put("/api/tasks/" + ID).set(auth()).send({ isOpen: false });
		await request(app).put("/api/tasks/status/" + ID).set(auth()).send({ isOpen: false });
		expect(Task.findByIdAndUpdate.mock.calls.map((c) => c[0])).toEqual([ID, ID]);
	});

	test("T-ORD-01 (API-04) PUT /api/orders/:id for an unknown order -> 404, not a hang", async () => {
		const Order = require("../models/Order");
		Order.findByIdAndUpdate.mockResolvedValue(null);
		const res = await request(app).put("/api/orders/" + ID).set(auth()).send({});
		expect(res.status).toBe(404);
	});

	test("T-NOTE-01 (API-04) PUT /api/notes/:id with an unsupported type -> 400, not a hang", async () => {
		const res = await request(app).put("/api/notes/" + ID).set(auth()).send({ type: "bogus" });
		expect(res.status).toBe(400);
	});
});

describe("NEW-06 announcements", () => {
	test("T-ANN-01 GET /api/announcements/:co returns that company's announcements only", async () => {
		const Announcement = require("../models/Announcement");
		Announcement.find.mockImplementation(() => query([{ title: "Hi" }]));
		const res = await request(app).get("/api/announcements/Acme").set(auth());
		expect(res.status).toBe(200);
		expect(Announcement.find).toHaveBeenCalledWith({ companyName: "Acme" });
	});
});
