/**
 * Stream A2 regression tests (T-FIX-xx): NEW-05, NEW-10..14, NEW-16 and
 * CHANGES.md API #13 (conversations/history), #18 (rate-limit tier)
 * and #19 (logout of another user). Models are mocked; routing, middleware and
 * controllers are real (same pattern as api.defects.test.js).
 */
const fs = require("fs");
const path = require("path");
const request = require("supertest");

jest.mock("../models/Company");
jest.mock("../models/Employee");
jest.mock("../models/EmployeeEmploymentInfo");
jest.mock("../models/Lead");
jest.mock("../models/Group");
jest.mock("../models/Contact");
jest.mock("../models/GeneralJournal");
jest.mock("../models/Ticket");
jest.mock("../models/EmployeeLeave");
jest.mock("../models/Timesheet");
jest.mock("../models/EmployeeProfileInfo");
jest.mock("../models/Holiday");
jest.mock("../models/EmployeePayInfo");
jest.mock("../models/EmployeeScheduleEmailLog");
jest.mock("../models/Conversation");
jest.mock("../models/UserActivity");
jest.mock("../services/emailService");
// send-paystub: only recipient scoping is tested here; the pay stub e-mail
// itself (PDF, log) is covered by api.paystubEmail.test.js (T-PSE-29..32)
jest.mock("../services/payStubEmailService", () => ({
	...jest.requireActual("../services/payStubEmailService"),
	findLatestPayStub: jest.fn(),
	emailPayStub: jest.fn(),
}));
jest.mock("../services/timecardService");

const Company = require("../models/Company");
const Employee = require("../models/Employee");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const Lead = require("../models/Lead");
const Group = require("../models/Group");
const Contact = require("../models/Contact");
const GeneralJournal = require("../models/GeneralJournal");
const SupportTicket = require("../models/Ticket");
const EmployeeLeave = require("../models/EmployeeLeave");
const Timesheet = require("../models/Timesheet");
const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");
const Holiday = require("../models/Holiday");
const EmployeePayInfo = require("../models/EmployeePayInfo");
const EmployeeScheduleEmailLog = require("../models/EmployeeScheduleEmailLog");
const Conversation = require("../models/Conversation");
const UserActivity = require("../models/UserActivity");
const { sendEmail } = require("../services/emailService");
const { addTimesheetEntry } = require("../services/timecardService");
const { clearMembershipCache } = require("../middleware/authorize");
const { USER_ID, OTHER_ID, auth, query, buildTestApp } = require("./helpers");

const ACME_ID = "65b000000000000000000001";
const ALICE_ID = "64a0000000000000000000a1"; // member of Acme
const MALLORY_ID = "64a0000000000000000000b2"; // member of Globex only
const GROUP_ID = "65d000000000000000000001";
const CONV_ID = "65e000000000000000000001";
const UPLOADS = path.join(__dirname, "../uploads");

const MEMBERS = { Acme: [USER_ID, ALICE_ID], Globex: [MALLORY_ID] };

// fs.unlink is asynchronous: give it a moment after the response.
const removedSoon = async (file, ms = 500) => {
	const until = Date.now() + ms;
	while (fs.existsSync(file) && Date.now() < until) await new Promise((r) => setTimeout(r, 10));
	return !fs.existsSync(file);
};

let app;
beforeAll(() => {
	app = buildTestApp();
});
beforeEach(() => {
	jest.clearAllMocks();
	jest.resetAllMocks();
	clearMembershipCache();
	// USER_ID belongs to Acme only. Company.find is also used to load the member
	// ids of named companies ({ name: { $in: [...] } }).
	Company.find.mockImplementation((filter = {}) => {
		if (filter.employees) return query([{ name: "Acme", _id: ACME_ID }]);
		const names = filter.name?.$in || [];
		return query(names.map((name) => ({ name, employees: MEMBERS[name] || [] })));
	});
	sendEmail.mockResolvedValue(true);
});

/* ------------------------------------------------------------------------ */
describe("NEW-05 employee look-ups by full name are scoped to the company", () => {
	const people = {
		Alice: { _id: ALICE_ID, fullName: "Alice", email: "alice@acme.test", password: "h" },
		Mallory: { _id: MALLORY_ID, fullName: "Mallory", email: "m@globex.test", password: "h" },
	};
	// Emulates Mongo: the person matches only if the _id filter (when present) allows it.
	const findOneByName = (filter) => {
		const p = people[filter.fullName];
		if (!p) return query(null);
		if (filter._id?.$in && !filter._id.$in.map(String).includes(String(p._id))) return query(null);
		return query(p);
	};

	test("T-FIX-01 getEmployeeId only returns members of the given company and skips unknown names", async () => {
		Employee.findOne.mockImplementation(findOneByName);
		const { getEmployeeId } = require("../controllers/userController");
		const list = await getEmployeeId(["Alice", "Mallory", "Nobody"], "Acme");
		expect(list).toEqual([{ empId: people.Alice }]);
		for (const [filter] of Employee.findOne.mock.calls) {
			expect(filter._id).toEqual({ $in: MEMBERS.Acme });
		}
		expect(list.some((e) => !e.empId)).toBe(false); // no stub without an employee
	});

	test("T-FIX-02 getEmployeeId without a company name is refused; empty company -> []", async () => {
		const { getEmployeeId } = require("../controllers/userController");
		await expect(getEmployeeId(["Alice"])).rejects.toThrow(/companyName/);
		const none = await getEmployeeId(["Alice"], "Initech");
		expect(none).toEqual([]);
		expect(Employee.findOne).not.toHaveBeenCalled();
	});

	test("T-FIX-03 extra-run pay info does not pick up another tenant's employee with the same name", async () => {
		Group.findById.mockImplementation(() =>
			query({
				scheduleFrequency: "Biweekly",
				yearSchedules: [
					{},
					{ payPeriods: [{ payPeriodPayDate: "2026-10-24", selectedEmp: ["Mallory"] }] },
				],
			}),
		);
		Employee.findOne.mockImplementation(findOneByName);
		const res = await request(app)
			.get(`/api/payroll/payInfo/Acme/2026-10-24/true/${GROUP_ID}`)
			.set(auth());
		expect(res.status).toBe(200);
		expect(res.body).toEqual([]);
		expect(Employee.findOne).toHaveBeenCalledWith({ fullName: "Mallory", _id: { $in: MEMBERS.Acme } });
	});

	test("T-FIX-04 send-paystub e-mails only members of companyName and reports names not found", async () => {
		const { findLatestPayStub, emailPayStub } = require("../services/payStubEmailService");
		findLatestPayStub.mockImplementation(async ({ empId }) => ({ _id: "stub1", empId, currentNetPay: 100 }));
		emailPayStub.mockResolvedValue("SENT");
		Employee.findOne.mockImplementation(findOneByName);
		const res = await request(app)
			.post("/api/user/send-paystub")
			.set(auth())
			.send({ employees: ["Alice", "Mallory"], companyName: "Acme" });
		expect(res.status).toBe(201);
		expect(res.body.message).toBe("Pay stub e-mailed to 1 of 2 employee(s); not found: Mallory");
		expect(res.body.notFound).toEqual(["Mallory"]);
		expect(emailPayStub).toHaveBeenCalledTimes(1);
		expect(findLatestPayStub.mock.calls[0][0]).toMatchObject({ companyNames: ["Acme"] });
		expect(String(findLatestPayStub.mock.calls[0][0].empId)).toBe(String(ALICE_ID));
	});

	test("T-FIX-05 send-email (credentials) without companyName is scoped to the caller's companies", async () => {
		Employee.findOne.mockImplementation(findOneByName);
		const res = await request(app)
			.post("/api/user/send-email")
			.set(auth())
			.send({ employees: ["Mallory"] });
		expect(res.status).toBe(201);
		expect(res.body.notFound).toEqual(["Mallory"]);
		expect(sendEmail).not.toHaveBeenCalled();
		expect(Employee.findOne.mock.calls[0][0]._id).toEqual({ $in: MEMBERS.Acme });
	});

	test("T-FIX-06 negative: foreign companyName -> 403; employees not a list of names -> 400", async () => {
		const foreign = await request(app)
			.post("/api/user/send-paystub")
			.set(auth())
			.send({ employees: ["Mallory"], companyName: "Globex" });
		expect(foreign.status).toBe(403);
		const bad = await request(app)
			.post("/api/user/send-paystub")
			.set(auth())
			.send({ employees: [{ $ne: null }] });
		expect(bad.status).toBe(400);
		const notArray = await request(app).post("/api/user/send-email").set(auth()).send({});
		expect(notArray.status).toBe(400);
		expect(Employee.findOne).not.toHaveBeenCalled();
		expect(sendEmail).not.toHaveBeenCalled();
	});
});

/* ------------------------------------------------------------------------ */
describe("NEW-10 lead redistribution reads Employee (isActive / assignedWeight)", () => {
	test("T-FIX-07 weights come from Employee and the Employee ids are updated", async () => {
		Employee.find.mockImplementation(() =>
			query([
				{ _id: USER_ID, assignedWeight: 3 },
				{ _id: ALICE_ID, assignedWeight: 1 },
			]),
		);
		Lead.find.mockImplementation(() => query([{}, {}, {}, {}]));
		Employee.findByIdAndUpdate.mockResolvedValue({});
		const res = await request(app).put("/api/user/assignLeads").set(auth()).send({});
		expect(res.status).toBe(200);
		expect(EmployeeEmploymentInfo.find).not.toHaveBeenCalled();
		const filter = Employee.find.mock.calls[0][0];
		expect(filter.isActive).toBe(true);
		expect(filter._id).toEqual({ $in: MEMBERS.Acme });
		expect(Employee.findByIdAndUpdate.mock.calls.map((c) => [c[0], c[1]])).toEqual([
			[USER_ID, { $set: { assignedLeads: 3 } }],
			[ALICE_ID, { $set: { assignedLeads: 1 } }],
		]);
	});

	test("T-FIX-08 negative: zero total weight gives 0 leads (not NaN); leads scoped to caller's companies", async () => {
		Employee.find.mockImplementation(() => query([{ _id: USER_ID, assignedWeight: 0 }, { _id: ALICE_ID }]));
		Lead.find.mockImplementation(() => query([{}, {}]));
		Employee.findByIdAndUpdate.mockResolvedValue({});
		const res = await request(app).put("/api/user/assignLeads").set(auth()).send({});
		expect(res.status).toBe(200);
		for (const call of Employee.findByIdAndUpdate.mock.calls) {
			expect(call[1]).toEqual({ $set: { assignedLeads: 0 } });
		}
		expect(Lead.find.mock.calls[0][0].companyName).toEqual({ $in: ["Acme"] });
	});
});

/* ------------------------------------------------------------------------ */
describe("NEW-11 pay-schedule generation errors surface", () => {
	// AUD-028: group writes are admin-only and the company comes from the group.
	beforeEach(() => {
		EmployeeEmploymentInfo.findOne.mockImplementation(() => query({ employmentRole: "Administrator" }));
	});

	const url = `/api/setup/groups/paycycle/${GROUP_ID}`;

	test("T-FIX-09 unknown group -> 404", async () => {
		Group.findById.mockImplementation(() => query(null));
		const res = await request(app).put(url).set(auth()).send({ scheduleFrequency: "Weekly" });
		expect(res.status).toBe(404);
		expect(Group.findByIdAndUpdate).not.toHaveBeenCalled();
	});

	test("T-FIX-10 unsupported frequency -> 400", async () => {
		Group.findById.mockImplementation(() => query({ companyName: "Acme", yearSchedules: [] }));
		const res = await request(app).put(url).set(auth()).send({ scheduleFrequency: "Fortnightly" });
		expect(res.status).toBe(400);
		expect(Group.findByIdAndUpdate).not.toHaveBeenCalled();
	});

	test("T-FIX-11 database failure while saving -> 500", async () => {
		Group.findById.mockImplementation(() => query({ companyName: "Acme", yearSchedules: [] }));
		Group.findByIdAndUpdate.mockRejectedValue(new Error("db down"));
		const res = await request(app).put(url).set(auth()).send({ scheduleFrequency: "Weekly" });
		expect(res.status).toBe(500);
	});

	test("T-FIX-12 success is unchanged: 201 'Added schedules' (bi-weekly alias)", async () => {
		Group.findById.mockImplementation(() => query({ companyName: "Acme", yearSchedules: [] }));
		Group.findByIdAndUpdate.mockResolvedValue({});
		const res = await request(app).put(url).set(auth()).send({ scheduleFrequency: "bi-weekly" });
		expect(res.status).toBe(201);
		expect(res.body).toBe("Added schedules");
		expect(Group.findByIdAndUpdate.mock.calls[0][1].$set.scheduleSettings).toHaveLength(26);
	});

	test("T-FIX-13 creating a group still answers 201 when its schedule cannot be generated", async () => {
		Group.findOne.mockResolvedValue(null);
		Group.create.mockResolvedValue({ _id: GROUP_ID, name: "G" });
		Group.findById.mockImplementation(() => query({ companyName: "Acme", yearSchedules: [] }));
		const res = await request(app)
			.post("/api/setup/groups")
			.set(auth())
			.send({ name: "G", company: "Acme", payrollActivated: true, payFrequency: "Fortnightly" });
		expect(res.status).toBe(201);
	});
});

/* ------------------------------------------------------------------------ */
describe("NEW-12 raw req.body no longer used as a Mongo filter or document", () => {
	test("T-FIX-14 POST /api/contacts with an operator object -> 400, nothing queried", async () => {
		const res = await request(app)
			.post("/api/contacts")
			.set(auth())
			.send({ firstName: { $ne: null } });
		expect(res.status).toBe(400);
		expect(Contact.findOne).not.toHaveBeenCalled();
		expect(Contact.create).not.toHaveBeenCalled();
	});

	test("T-FIX-15 POST /api/contacts duplicate check uses only the form fields", async () => {
		Contact.findOne.mockResolvedValue(null);
		Contact.create.mockResolvedValue({ _id: "c1" });
		const res = await request(app)
			.post("/api/contacts")
			.set(auth())
			.send({ firstName: "Ann", email: "a@x.test", employees: 3, $where: "1", leadId: { $gt: "" } });
		expect(res.status).toBe(201);
		expect(Contact.findOne).toHaveBeenCalledWith({ firstName: "Ann", email: "a@x.test", employees: 3 });
	});

	test("T-FIX-16 POST /api/accounting/general-journal rejects operators in fields and entry keys", async () => {
		const a = await request(app)
			.post("/api/accounting/general-journal")
			.set(auth())
			.send({ description: { $gt: "" }, companyName: "Acme" });
		const b = await request(app)
			.post("/api/accounting/general-journal")
			.set(auth())
			.send({ description: "x", companyName: "Acme", entries: [{ $where: "1" }] });
		const c = await request(app)
			.post("/api/accounting/general-journal")
			.set(auth())
			.send({ description: "x", companyName: "Acme", entries: [{ accountName: { $ne: 1 } }] });
		expect([a.status, b.status, c.status]).toEqual([400, 400, 400]);
		expect(GeneralJournal.findOne).not.toHaveBeenCalled();
		expect(GeneralJournal.create).not.toHaveBeenCalled();
	});

	test("T-FIX-17 journal entry: only allow-listed fields reach findOne/create", async () => {
		GeneralJournal.findOne.mockResolvedValue(null);
		GeneralJournal.create.mockImplementation(async (d) => d);
		const body = {
			transactionDate: "2026-10-01",
			description: "Rent",
			companyName: "Acme",
			entries: [
				{ accountName: "Cash", debit: "", credit: "100" },
				{ accountName: "Rent", debit: "100", credit: "" },
			],
			_id: "65f000000000000000000001",
			createdOn: "1999-01-01",
		};
		const res = await request(app).post("/api/accounting/general-journal").set(auth()).send(body);
		expect(res.status).toBe(201);
		const expected = {
			transactionDate: body.transactionDate,
			description: body.description,
			companyName: "Acme",
			entries: body.entries,
		};
		expect(GeneralJournal.findOne).toHaveBeenCalledWith(expected);
		expect(GeneralJournal.create).toHaveBeenCalledWith(expected);
	});

	test("T-FIX-18 budgetingController.addAccountsJournalEntry (same code, unrouted) is allow-listed too", async () => {
		const { addAccountsJournalEntry } = require("../controllers/budgetingController");
		const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
		await addAccountsJournalEntry({ body: { companyName: { $ne: "x" } } }, res);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(GeneralJournal.findOne).not.toHaveBeenCalled();
	});

	test("T-FIX-19 public POST /api/ticket/leads with an operator object -> 400", async () => {
		const res = await request(app)
			.post("/api/ticket/leads")
			.send({ firstName: "A", email: { $gt: "" }, interests: ["Payroll"] });
		expect(res.status).toBe(400);
		const res2 = await request(app)
			.post("/api/ticket/leads")
			.send({ firstName: "A", interests: [{ $gt: "" }] });
		expect(res2.status).toBe(400);
		expect(Lead.create).not.toHaveBeenCalled();
		expect(SupportTicket.create).not.toHaveBeenCalled();
	});

	test("T-FIX-20 public lead ticket: client cannot set status, file, originator or priority", async () => {
		Lead.create.mockImplementation(async (d) => d);
		Employee.findOne.mockResolvedValue(null);
		SupportTicket.create.mockImplementation(async (d) => d);
		const res = await request(app)
			.post("/api/ticket/leads")
			.send({
				firstName: "Ann",
				lastName: "Lee",
				title: "CFO",
				email: "ann@x.test",
				phone: "1",
				country: "CA",
				province: "BC",
				annualRevenue: "1M",
				totalEmployees: "10",
				interests: ["Payroll"],
				companyName: "Lee Ltd",
				status: "Closed",
				originator: "attacker",
				file: { path: "/etc/passwd" },
				ticketDaysOpened: 999,
			});
		expect(res.status).toBe(201);
		const doc = SupportTicket.create.mock.calls[0][0];
		for (const k of ["status", "originator", "file", "ticketDaysOpened"]) expect(doc).not.toHaveProperty(k);
		expect(doc).toMatchObject({ category: "Support", priority: 1, companyName: "BusinessN Corporate" });
		expect(doc.ticketNumber).toBeTruthy();
		expect(Lead.create.mock.calls[0][0]).toMatchObject({ name: "Ann Lee", opportunityName: "Lee Ltd" });
	});
});

/* ------------------------------------------------------------------------ */
describe("NEW-13 leave request: allow-listed hours field and bounded range", () => {
	const base = {
		company: "Acme",
		type: "Sick Pay",
		leaveType: "Sick",
		employeeId: ALICE_ID,
		source: "Manager",
		startDate: "2026-11-02",
		endDate: "2026-11-04",
	};
	beforeEach(() => {
		EmployeeLeave.findOne.mockResolvedValue(null);
		EmployeeLeave.create.mockImplementation(async (d) => d);
		Timesheet.insertMany.mockResolvedValue([]);
	});

	test.each(["regHoursWorked", "$where", "__proto__", "employeeId", ""])(
		"T-FIX-21 param_hours=%p -> 400, nothing written",
		async (param_hours) => {
			const res = await request(app).post("/api/leaves").set(auth()).send({ ...base, param_hours });
			expect(res.status).toBe(400);
			expect(EmployeeLeave.create).not.toHaveBeenCalled();
			expect(Timesheet.insertMany).not.toHaveBeenCalled();
		},
	);

	test("T-FIX-22 a range longer than 366 days -> 400", async () => {
		const res = await request(app)
			.post("/api/leaves")
			.set(auth())
			.send({ ...base, param_hours: "sickPayHours", startDate: "2020-01-01", endDate: "2099-12-31" });
		expect(res.status).toBe(400);
		expect(EmployeeLeave.create).not.toHaveBeenCalled();
		expect(Timesheet.insertMany).not.toHaveBeenCalled();
	});

	test("T-FIX-23 valid requests behave as before (sick, Unpaid, Other)", async () => {
		const sick = await request(app)
			.post("/api/leaves")
			.set(auth())
			.send({ ...base, param_hours: "sickPayHours" });
		expect(sick.status).toBe(201);
		const entries = Timesheet.insertMany.mock.calls[0][0];
		expect(entries).toHaveLength(3);
		expect(entries.every((e) => e.sickPayHours === 8)).toBe(true);

		Timesheet.insertMany.mockClear();
		const unpaid = await request(app).post("/api/leaves").set(auth()).send({ ...base, param_hours: "Unpaid" });
		expect(unpaid.status).toBe(201);
		expect(Timesheet.insertMany).not.toHaveBeenCalled();

		const other = await request(app).post("/api/leaves").set(auth()).send({ ...base, param_hours: "Other" });
		expect(other.status).toBe(201);
		const otherEntries = Timesheet.insertMany.mock.calls[0][0];
		expect(otherEntries).toHaveLength(3);
		expect(otherEntries[0]).not.toHaveProperty("Other");
	});

	test("T-FIX-24 operator objects in employeeId / dates -> 400", async () => {
		for (const patch of [{ employeeId: { $ne: null } }, { startDate: { $gt: "" } }]) {
			const res = await request(app)
				.post("/api/leaves")
				.set(auth())
				.send({ ...base, param_hours: "sickPayHours", ...patch });
			expect(res.status).toBe(400);
		}
		expect(EmployeeLeave.findOne).not.toHaveBeenCalled();
	});
});

/* ------------------------------------------------------------------------ */
describe("NEW-14 profile fallback requires company membership", () => {
	test("T-FIX-25 employee not in the company -> 404, Employee not read", async () => {
		EmployeeProfileInfo.findOne.mockResolvedValue(null);
		Company.findOne.mockImplementation(() => query(null));
		const res = await request(app).get(`/api/payroll/profileInfo/Acme/${MALLORY_ID}`).set(auth());
		expect(res.status).toBe(404);
		expect(Employee.findById).not.toHaveBeenCalled();
		expect(Company.findOne.mock.calls[0][0]).toEqual({ name: "Acme", employees: MALLORY_ID });
	});

	test("T-FIX-26 member without a profile still gets the basic employee record (200)", async () => {
		EmployeeProfileInfo.findOne.mockResolvedValue(null);
		Company.findOne.mockImplementation(() => query({ _id: ACME_ID }));
		Employee.findById.mockImplementation(() => query({ firstName: "Alice" }));
		const res = await request(app).get(`/api/payroll/profileInfo/Acme/${ALICE_ID}`).set(auth());
		expect(res.status).toBe(200);
		expect(res.body).toEqual({ firstName: "Alice" });
	});

	test("T-FIX-27 malformed employee id -> 404 (was a CastError 500)", async () => {
		EmployeeProfileInfo.findOne.mockResolvedValue(null);
		const res = await request(app).get("/api/payroll/profileInfo/Acme/not-an-id").set(auth());
		expect(res.status).toBe(404);
		expect(Employee.findById).not.toHaveBeenCalled();
	});
});

/* ------------------------------------------------------------------------ */
describe("NEW-16 stat holidays and multer temp files", () => {
	test("T-FIX-28 duplicate check uses the year of the holiday date, not the current year", async () => {
		Holiday.findOne.mockResolvedValue(null);
		Holiday.create.mockImplementation(async (d) => d);
		const res = await request(app)
			.post("/api/holiday")
			.set(auth())
			.send({ name: "New Year", date: "2030-01-01", company: "Acme" });
		expect(res.status).toBe(201);
		expect(Holiday.findOne).toHaveBeenCalledWith({ name: "New Year", companyName: "Acme", year: "2030" });
	});

	test("T-FIX-29 missing / invalid holiday date -> 400", async () => {
		for (const date of [undefined, "not a date", { $gt: "" }]) {
			const res = await request(app).post("/api/holiday").set(auth()).send({ name: "X", date, company: "Acme" });
			expect(res.status).toBe(400);
		}
		expect(Holiday.create).not.toHaveBeenCalled();
	});

	test("T-FIX-30 stat hours are 0 (not NaN) when the pay rate is 0; normal rate unchanged", async () => {
		const { addStatHolidayTimesheet } = require("../controllers/statHolidayController");
		EmployeeEmploymentInfo.find.mockImplementation(() =>
			query([{ empId: { _id: ALICE_ID, fullName: "Alice" } }]),
		);
		Timesheet.findOne.mockResolvedValue(null);
		// Schema defaults: every hours field is 0 unless set.
		const day = {
			regHoursWorked: 8,
			overtimeHoursWorked: 0,
			dblOvertimeHoursWorked: 0,
			statDayHoursWorked: 0,
			statDayHours: 0,
			sickPayHours: 0,
			vacationPayHours: 0,
			bereavementPayHours: 0,
			personalPayHours: 0,
		};
		Timesheet.find.mockResolvedValue([day, day]);
		EmployeePayInfo.findOne.mockResolvedValue({ roles: [{ payRate: "0" }] });
		addTimesheetEntry.mockResolvedValue({});
		await addStatHolidayTimesheet("Acme");
		const zero = addTimesheetEntry.mock.calls[0][0];
		expect(zero.statDayHours).toBe("0.00");
		expect(zero.clockOut.isValid()).toBe(true);

		addTimesheetEntry.mockClear();
		EmployeePayInfo.findOne.mockResolvedValue({ roles: [{ payRate: "20" }] });
		await addStatHolidayTimesheet("Acme");
		expect(addTimesheetEntry.mock.calls[0][0].statDayHours).toBe("8.00");
	});

	test("T-FIX-31 POST /api/ticket removes the multer temp file after storing it", async () => {
		SupportTicket.create.mockImplementation(async (d) => ({ _id: "t1", originalname: d.originalname }));
		const name = `fix31-${Date.now()}.txt`;
		const res = await request(app)
			.post("/api/ticket")
			.set(auth())
			.field("companyName", "Acme")
			.field("topic", "Help")
			.attach("file", Buffer.from("hello"), name);
		expect(res.status).toBe(201);
		expect(SupportTicket.create.mock.calls[0][0].file.data.toString()).toBe("hello");
		expect(await removedSoon(path.join(UPLOADS, name))).toBe(true);
	});

	test("T-FIX-32 POST /api/schedule/send removes the temp file on success and on failure", async () => {
		EmployeeScheduleEmailLog.findOne.mockResolvedValue(null);
		EmployeeScheduleEmailLog.create.mockResolvedValue({});
		const ok = `fix32-ok-${Date.now()}.pdf`;
		const res = await request(app)
			.post("/api/schedule/send")
			.set(auth())
			.field("email", "alice@acme.test")
			.field("fullName", "Alice")
			.field("week", "W44")
			.attach("file", Buffer.from("pdf"), ok);
		expect(res.status).toBe(201);
		expect(await removedSoon(path.join(UPLOADS, ok))).toBe(true);

		sendEmail.mockRejectedValue(new Error("smtp down"));
		const bad = `fix32-bad-${Date.now()}.pdf`;
		const res2 = await request(app)
			.post("/api/schedule/send")
			.set(auth())
			.field("email", "alice@acme.test")
			.attach("file", Buffer.from("pdf"), bad);
		expect(res2.status).toBe(500);
		expect(await removedSoon(path.join(UPLOADS, bad))).toBe(true);
	});
});

/* ------------------------------------------------------------------------ */
describe("CHANGES.md API #13 POST /api/conversations/history reads id/type from the body", () => {
	test("T-FIX-33 returns the conversation's messages sorted by time", async () => {
		Conversation.findById.mockImplementation(() =>
			query({
				groupMessages: [
					{ text: "b", timestamp: "2026-10-02" },
					{ text: "a", timestamp: "2026-10-01" },
				],
			}),
		);
		const res = await request(app)
			.post("/api/conversations/history")
			.set(auth())
			.send({ id: CONV_ID, type: "group" });
		expect(res.status).toBe(200);
		expect(Conversation.findById).toHaveBeenCalledWith(CONV_ID);
		expect(res.body.map((m) => m.text)).toEqual(["a", "b"]);
	});

	test("T-FIX-34 negative: missing/invalid id -> 400, unknown id -> 404", async () => {
		for (const body of [{}, { id: "nope" }, { id: { $ne: null } }]) {
			const res = await request(app).post("/api/conversations/history").set(auth()).send(body);
			expect(res.status).toBe(400);
		}
		expect(Conversation.findById).not.toHaveBeenCalled();
		Conversation.findById.mockImplementation(() => query(null));
		const res = await request(app).post("/api/conversations/history").set(auth()).send({ id: CONV_ID });
		expect(res.status).toBe(404);
	});
});

/* ------------------------------------------------------------------------ */
describe("CHANGES.md API #18 global limiter: authenticated tier", () => {
	let logSpy;
	let errSpy;
	beforeEach(() => {
		logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
		errSpy = jest.spyOn(console, "error").mockImplementation(() => {});
	});
	afterEach(() => {
		logSpy.mockRestore();
		errSpy.mockRestore();
	});

	const hammer = async (a, n, headers = {}) => {
		const statuses = [];
		for (let i = 0; i < n; i++) {
			const r = await request(a).get("/api/fix-no-such-route").set(headers);
			statuses.push(r.status);
		}
		return statuses;
	};

	test("T-FIX-35 a valid bearer token gets 500/min (201st..500th not limited, 501st is)", async () => {
		const a = buildTestApp();
		const statuses = await hammer(a, 501, auth());
		expect(statuses.slice(0, 500).every((s) => s === 404)).toBe(true);
		expect(statuses[500]).toBe(429);
	}, 60000);

	test("T-FIX-36 negative: no token and an invalid token stay on the 200/min tier", async () => {
		const anon = await hammer(buildTestApp(), 201);
		expect(anon[199]).toBe(401);
		expect(anon[200]).toBe(429);
		const forged = await hammer(buildTestApp(), 201, { Authorization: "Bearer not.a.jwt" });
		expect(forged[199]).toBe(403);
		expect(forged[200]).toBe(429);
	}, 60000);
});

/* ------------------------------------------------------------------------ */
describe("CHANGES.md API #19 GET /api/logout/:id is self-only", () => {
	test("T-FIX-37 logging out another user -> 403, activity untouched", async () => {
		const res = await request(app).get(`/api/logout/${OTHER_ID}`).set(auth());
		expect(res.status).toBe(403);
		expect(res.body.code).toBe("FORBIDDEN");
		expect(UserActivity.findOne).not.toHaveBeenCalled();
	});

	test("T-FIX-38 logging out yourself still works", async () => {
		UserActivity.findOne.mockResolvedValue(null);
		const res = await request(app).get(`/api/logout/${USER_ID}`).set(auth());
		expect(res.status).toBe(200);
		expect(res.body.message).toBe("Logged out successfully");
	});
});
