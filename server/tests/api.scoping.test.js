/**
 * Stream A1 — cross-company data leaks on list / lookup endpoints
 * (CHANGES.md API #1, #7, #11; NEW-06 remainder, NEW-16).
 * Models are mocked; routing, middleware and controllers are real. Each test
 * asserts the Mongo filter handed to the mocked model.
 */
const request = require("supertest");

jest.mock("../models/Company");
jest.mock("../models/Employee");
jest.mock("../models/EmployeeEmploymentInfo");
jest.mock("../models/UserActivity");
jest.mock("../models/CompanyResource");
jest.mock("../models/Contact");
jest.mock("../models/Event");
jest.mock("../models/LogTask");
jest.mock("../models/Meeting");
jest.mock("../models/Note");
jest.mock("../models/Project");
jest.mock("../models/ProjectFile");
jest.mock("../models/Questionnaire");
jest.mock("../models/EmployeeShifts");
jest.mock("../models/Task");
jest.mock("../models/Conversation");
jest.mock("../models/Lead");
jest.mock("../models/LeadCompany");
jest.mock("../models/Ticket");
jest.mock("../services/emailService", () => ({ sendEmail: jest.fn().mockResolvedValue() }));

const Company = require("../models/Company");
const Employee = require("../models/Employee");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const UserActivity = require("../models/UserActivity");
const Resource = require("../models/CompanyResource");
const Contact = require("../models/Contact");
const Event = require("../models/Event");
const LogTask = require("../models/LogTask");
const Meeting = require("../models/Meeting");
const Note = require("../models/Note");
const Project = require("../models/Project");
const Questionnaire = require("../models/Questionnaire");
const EmployeeShift = require("../models/EmployeeShifts");
const Task = require("../models/Task");
const Conversation = require("../models/Conversation");
const Lead = require("../models/Lead");
const LeadCompany = require("../models/LeadCompany");
const SupportTicket = require("../models/Ticket");
const { clearMembershipCache } = require("../middleware/authorize");
const { USER_ID, OTHER_ID, auth, query, buildTestApp } = require("./helpers");

const ACME_ID = "65b000000000000000000001";
const DOC_ID = "66c000000000000000000001";
const EMP_ID = "64a000000000000000000003";
const FOREIGN_EMP_ID = "64a000000000000000000004";

let app;
beforeAll(() => {
	app = buildTestApp();
});
beforeEach(() => {
	jest.clearAllMocks();
	clearMembershipCache();
	// USER_ID belongs to Acme only; Acme's employees are USER_ID, OTHER_ID, EMP_ID.
	Company.find.mockImplementation((filter = {}) => {
		if (filter.employees === USER_ID || filter.employees === EMP_ID) {
			return query([{ name: "Acme", _id: ACME_ID, employees: [USER_ID, OTHER_ID, EMP_ID] }]);
		}
		if (filter.employees) return query([]);
		return query([{ name: "Acme", _id: ACME_ID, employees: [USER_ID, OTHER_ID, EMP_ID] }]);
	});
});

const lastFilter = (fn) => fn.mock.calls[fn.mock.calls.length - 1][0];

// [test id, path, model, sample row]
const LIST_ENDPOINTS = [
	["T-SCOPE-01", "/api/resource", Resource],
	["T-SCOPE-02", "/api/contacts", Contact],
	["T-SCOPE-03", "/api/events", Event],
	["T-SCOPE-04", "/api/log-tasks", LogTask],
	["T-SCOPE-05", "/api/meetings", Meeting],
	["T-SCOPE-06", "/api/notes", Note],
	["T-SCOPE-07", "/api/projects", Project],
	["T-SCOPE-08", "/api/questionnaire", Questionnaire],
	["T-SCOPE-09", "/api/schedule", EmployeeShift],
	["T-SCOPE-10", "/api/tasks", Task],
];

describe("NEW-06 list endpoints are restricted to the caller's companies", () => {
	test.each(LIST_ENDPOINTS)("%s GET %s filters by the caller's companies", async (_id, path, Model) => {
		// Projects are post-processed through ProjectFile; an empty list keeps that out of scope.
		const rows = Model === Project ? [] : [{ _id: DOC_ID, companyName: "Acme" }];
		Model.find.mockImplementation(() => query(rows));
		const res = await request(app).get(path).set(auth());
		expect(res.status).toBe(200);
		expect(res.body).toEqual(rows);
		expect(lastFilter(Model.find)).toMatchObject({ companyName: { $in: ["Acme"] } });
	});

	test.each(LIST_ENDPOINTS)("%s GET %s?companyName=Globex -> 403, model not queried", async (_id, path, Model) => {
		const res = await request(app).get(`${path}?companyName=Globex`).set(auth());
		expect(res.status).toBe(403);
		expect(Model.find).not.toHaveBeenCalled();
	});

	test.each(LIST_ENDPOINTS)("%s GET %s?companyName=Acme narrows to that company", async (_id, path, Model) => {
		Model.find.mockImplementation(() => query([]));
		const res = await request(app).get(`${path}?companyName=Acme`).set(auth());
		expect(res.status).toBe(200);
		expect(lastFilter(Model.find)).toMatchObject({ companyName: { $in: ["Acme"] } });
	});

	test("T-SCOPE-11 GET /api/user lists only employees of the caller's companies (was a 500)", async () => {
		const rows = [{ empId: { fullName: "Ann" }, companyName: "Acme" }];
		EmployeeEmploymentInfo.find.mockImplementation(() => query(rows));
		const res = await request(app).get("/api/user").set(auth());
		expect(res.status).toBe(200);
		expect(res.body).toEqual(rows);
		expect(lastFilter(EmployeeEmploymentInfo.find)).toMatchObject({
			empId: { $exists: true },
			companyName: { $in: ["Acme"] },
		});
	});

	test("T-SCOPE-12 GET /api/user/activity only returns logins of the caller's co-workers", async () => {
		UserActivity.find.mockImplementation(() => query([{ userID: OTHER_ID }]));
		const res = await request(app).get("/api/user/activity").set(auth());
		expect(res.status).toBe(200);
		expect(res.body).toEqual([{ userID: OTHER_ID }]);
		const filter = lastFilter(UserActivity.find);
		expect(filter.loginTime).toBeDefined();
		expect(filter.userID.$in.map(String).sort()).toEqual([USER_ID, OTHER_ID, EMP_ID].sort());
	});

	test("T-SCOPE-13 GET /api/company lists only companies the caller belongs to", async () => {
		const res = await request(app).get("/api/company").set(auth());
		expect(res.status).toBe(200);
		expect(res.body.map((c) => c.name)).toEqual(["Acme"]);
		expect(Company.find).toHaveBeenCalled();
		for (const [filter] of Company.find.mock.calls) {
			expect(filter).toMatchObject({ employees: USER_ID });
		}
	});

	test("T-SCOPE-14 GET /api/user/activity?companyName=Globex -> 403", async () => {
		const res = await request(app).get("/api/user/activity?companyName=Globex").set(auth());
		expect(res.status).toBe(403);
		expect(UserActivity.find).not.toHaveBeenCalled();
	});
});

describe("NEW-06 group conversations", () => {
	test("T-SCOPE-15 GET /api/conversations/group returns only own-company or participating groups", async () => {
		Conversation.find.mockImplementation(() => query([{ groupName: "g" }]));
		const res = await request(app).get("/api/conversations/group").set(auth());
		expect(res.status).toBe(200);
		expect(lastFilter(Conversation.find)).toEqual({
			conversationType: "group",
			$or: [{ companyName: { $in: ["Acme"] } }, { participants: USER_ID }],
		});
	});
});

describe("NEW-06 / NEW-16 lead endpoints", () => {
	test("T-SCOPE-16 POST /api/leads/multiple-opportunities returns only that company's leads", async () => {
		Lead.findOne.mockImplementation(() => query(null));
		Lead.find.mockImplementation(() => query([{ companyName: "Acme" }]));
		const res = await request(app)
			.post("/api/leads/multiple-opportunities")
			.set(auth())
			.send({ newRecord: [], companyName: "Acme" });
		expect(res.status).toBe(200);
		expect(lastFilter(Lead.find)).toEqual({ isDisbursed: false, companyName: "Acme" });
	});

	test("T-SCOPE-17 multiple-opportunities: foreign company -> 403, missing company -> 400", async () => {
		const a = await request(app)
			.post("/api/leads/multiple-opportunities")
			.set(auth())
			.send({ newRecord: [], companyName: "Globex" });
		expect(a.status).toBe(403);
		const b = await request(app).post("/api/leads/multiple-opportunities").set(auth()).send({ newRecord: [] });
		expect(b.status).toBe(400);
		expect(Lead.find).not.toHaveBeenCalled();
	});

	const employeeDoc = (id) => ({ _id: id, fullName: "Sam", leads: [], save: jest.fn().mockResolvedValue() });

	test("T-SCOPE-18 confirm-disburse only assigns the caller's companies' leads", async () => {
		const emp = employeeDoc(EMP_ID);
		Employee.findById.mockResolvedValue(emp);
		Lead.find.mockImplementation(() => query([{ _id: DOC_ID }]));
		const lead = { save: jest.fn().mockResolvedValue() };
		Lead.findById.mockResolvedValue(lead);
		const res = await request(app)
			.post("/api/leads/confirm-disburse")
			.set(auth())
			.send([{ _id: EMP_ID, assignedLeads: 1 }]);
		expect(res.status).toBe(200);
		expect(lastFilter(Lead.find)).toEqual({
			isDisbursedConfirmed: false,
			isDisbursed: true,
			companyName: { $in: ["Acme"] },
		});
		expect(emp.save).toHaveBeenCalled();
		expect(lead.primaryAssignee).toBe("Sam");
	});

	test("T-SCOPE-19 confirm-disburse to another company's employee -> 403, nothing written", async () => {
		const emp = employeeDoc(FOREIGN_EMP_ID);
		Employee.findById.mockResolvedValue(emp);
		const res = await request(app)
			.post("/api/leads/confirm-disburse")
			.set(auth())
			.send([{ _id: FOREIGN_EMP_ID, assignedLeads: 1 }]);
		expect(res.status).toBe(403);
		expect(emp.save).not.toHaveBeenCalled();
		expect(Lead.findById).not.toHaveBeenCalled();
	});

	test("T-SCOPE-20 confirm-disburse: unknown employee -> 404 (was TypeError 500); foreign entry company -> 403", async () => {
		Employee.findById.mockResolvedValue(null);
		const a = await request(app)
			.post("/api/leads/confirm-disburse")
			.set(auth())
			.send([{ _id: EMP_ID, assignedLeads: 1 }]);
		expect(a.status).toBe(404);
		Employee.findById.mockResolvedValue(employeeDoc(EMP_ID));
		const b = await request(app)
			.post("/api/leads/confirm-disburse")
			.set(auth())
			.send([{ _id: EMP_ID, assignedLeads: 1, companyName: "Globex" }]);
		expect(b.status).toBe(403);
		expect(Lead.findById).not.toHaveBeenCalled();
	});

	test("T-SCOPE-21 POST /api/leads/companies looks the name up within the caller's company only", async () => {
		LeadCompany.findOne.mockImplementation((f) =>
			query(f.companyName ? null : { name: "Initech", companyName: "Globex" }),
		);
		LeadCompany.create.mockResolvedValue({ name: "Initech", companyName: "Acme" });
		const res = await request(app)
			.post("/api/leads/companies")
			.set(auth())
			.send({ name: "Initech", companyName: "Acme" });
		expect(res.status).toBe(201);
		expect(res.body).toEqual({ name: "Initech", companyName: "Acme" });
		expect(lastFilter(LeadCompany.findOne)).toEqual({ name: "Initech", companyName: "Acme" });
	});
});

describe("NEW-06 ticket and resource routers (CHANGES.md API #11)", () => {
	test("T-SCOPE-22 GET /api/ticket/:id lists only tickets of the caller's companies", async () => {
		SupportTicket.find.mockImplementation(() => query([]));
		const res = await request(app).get(`/api/ticket/${USER_ID}`).set(auth());
		expect(res.status).toBe(200);
		expect(lastFilter(SupportTicket.find)).toMatchObject({ companyName: { $in: ["Acme"] } });
	});

	test("T-SCOPE-23 body / query company names on ticket and resource routes are checked", async () => {
		const a = await request(app).get(`/api/ticket/${USER_ID}?companyName=Globex`).set(auth());
		const b = await request(app)
			.put(`/api/ticket/${DOC_ID}`)
			.set(auth())
			.send({ companyName: "Globex", status: "Open" });
		const c = await request(app).get("/api/resource?companyName=Globex").set(auth());
		expect([a.status, b.status, c.status]).toEqual([403, 403, 403]);
		expect(SupportTicket.findByIdAndUpdate).not.toHaveBeenCalled();
	});

	test.each([
		["T-SCOPE-24", "put", `/api/ticket/${DOC_ID}`, SupportTicket, "findByIdAndUpdate", { status: "Close" }],
		["T-SCOPE-25", "put", `/api/resource/${DOC_ID}`, Resource, "findByIdAndUpdate", { fileName: "x" }],
		["T-SCOPE-26", "delete", `/api/resource/${DOC_ID}`, Resource, "findByIdAndDelete", undefined],
	])("%s %s %s: foreign 403, missing 404, own reaches handler", async (_id, method, path, Model, writer, body) => {
		Model.findById.mockImplementation(() => query({ _id: DOC_ID, companyName: "Globex" }));
		const foreign = await request(app)[method](path).set(auth()).send(body);
		expect(foreign.status).toBe(403);
		expect(Model[writer]).not.toHaveBeenCalled();

		Model.findById.mockImplementation(() => query(null));
		const missing = await request(app)[method](path).set(auth()).send(body);
		expect(missing.status).toBe(404);
		expect(Model[writer]).not.toHaveBeenCalled();

		Model.findById.mockImplementation(() => query({ _id: DOC_ID, companyName: "Acme" }));
		Model[writer].mockResolvedValue({ _id: DOC_ID, companyName: "Acme" });
		const own = await request(app)[method](path).set(auth()).send(body);
		expect(own.status).toBeLessThan(300);
		expect(Model[writer]).toHaveBeenCalled();
	});

	test("T-SCOPE-27 public ticket creation still needs no token and is not company-checked", async () => {
		const res = await request(app)
			.post("/api/ticket/support")
			.send({ companyInfo: { companyName: "Globex" } });
		expect(res.status).toBe(400); // validation error, not 401 / 403
	});

	test("T-SCOPE-28 attachment / resource downloads are looked up within the caller's companies", async () => {
		Resource.findOne.mockImplementation(() => query(null));
		SupportTicket.findOne.mockImplementation(() => query(null));
		await request(app).get("/api/resource/download/a.pdf").set(auth());
		await request(app).get("/api/ticket/download/a.pdf").set(auth());
		expect(lastFilter(Resource.findOne)).toEqual({ originalname: "a.pdf", companyName: { $in: ["Acme"] } });
		expect(lastFilter(SupportTicket.findOne)).toEqual({
			originalname: "a.pdf",
			companyName: { $in: ["Acme"] },
		});
	});
});

describe("CHANGES.md API #1: GET /api/resource/:companyName was shadowed by /:fileType", () => {
	test("T-SCOPE-29 GET /api/resource/Acme (as the client calls it) returns Acme's resources", async () => {
		Resource.find.mockImplementation(() => query([{ companyName: "Acme" }]));
		const res = await request(app).get("/api/resource/Acme").set(auth());
		expect(res.status).toBe(200);
		expect(lastFilter(Resource.find)).toEqual({ companyName: "Acme" });
	});

	test("T-SCOPE-30 GET /api/resource/Globex -> 403", async () => {
		const res = await request(app).get("/api/resource/Globex").set(auth());
		expect(res.status).toBe(403);
		expect(Resource.find).not.toHaveBeenCalled();
	});
});
