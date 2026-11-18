/**
 * SUPPORT-QUEUE: tickets from the public support / contact forms (BusinessN
 * Corporate, category SUPPORT_CATEGORY, no originator) are listed for every admin-level
 * user of BusinessN Corporate, assigned or not. Before, only the one assignee
 * (SUPPORT_ADMIN_CONTACT) saw them.
 */
const request = require("supertest");

jest.mock("../models/Company");
jest.mock("../models/Ticket");
jest.mock("../models/Employee");
jest.mock("../models/EmployeeEmploymentInfo");
jest.mock("../services/emailTemplates", () => ({
	...jest.requireActual("../services/emailTemplates"),
	sendTemplate: jest.fn(async () => {}),
}));

const Company = require("../models/Company");
const SupportTicket = require("../models/Ticket");
const Employee = require("../models/Employee");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const { sendTemplate } = require("../services/emailTemplates");
const { COMPANIES } = require("../constants/constant");
const { SUPPORT_CATEGORY, TICKET_STATUS, LEAD_POPULATE_FIELDS } = require("../constants/ticket.constants");
const { clearMembershipCache } = require("../middleware/authorize");
const { auth, query, buildTestApp } = require("./helpers");

const BN = COMPANIES.BUSINESSN_ORG;
const ME = "Juli Khosla";
const enc = encodeURIComponent;

describe("support tickets list (SUPPORT-QUEUE)", () => {
	let app;
	let role;
	beforeAll(() => {
		app = buildTestApp();
	});
	beforeEach(() => {
		jest.resetAllMocks();
		clearMembershipCache();
		role = "Administrator";
		Company.find.mockImplementation(() =>
			query([
				{ name: BN, _id: "65b000000000000000000001" },
				{ name: "Other Co", _id: "65b000000000000000000002" },
			]),
		);
		EmployeeEmploymentInfo.findOne.mockImplementation(async () => ({ employmentRole: role }));
		SupportTicket.find.mockImplementation(() => query([]));
		SupportTicket.aggregate.mockResolvedValue([]);
	});
	const filterOf = () => SupportTicket.find.mock.calls[0][0];
	const seesQueue = (filter) => filter.$or.some((c) => c.category === SUPPORT_CATEGORY);

	test("SQ-01 an admin of BusinessN Corporate sees every Support ticket (assigned or not) + their own", async () => {
		const res = await request(app).get(`/api/ticket/open/${enc(ME)}/${enc(BN)}`).set(auth());
		expect(res.status).toBe(200);
		expect(filterOf()).toMatchObject({ companyName: BN, status: { $ne: TICKET_STATUS.CLOSED } });
		expect(filterOf().$or).toEqual([{ originator: ME }, { assignee: ME }, { category: SUPPORT_CATEGORY }]);
	});

	test("SQ-02 the same for closed tickets, the category filter and the category counts", async () => {
		await request(app).get(`/api/ticket/closed/${enc(ME)}/${enc(BN)}`).set(auth());
		await request(app).get(`/api/ticket/filter/${enc(ME)}/${enc(BN)}/Support`).set(auth());
		await request(app).get(`/api/ticket/count/${enc(ME)}/${enc(BN)}`).set(auth());
		expect(seesQueue(SupportTicket.find.mock.calls[0][0])).toBe(true);
		expect(seesQueue(SupportTicket.find.mock.calls[1][0])).toBe(true);
		expect(seesQueue(SupportTicket.aggregate.mock.calls[0][0][0].$match)).toBe(true);
		// "My tickets" stays personal
		expect(SupportTicket.aggregate.mock.calls[1][0][0].$match.originator).toBe(ME);
	});

	test("SQ-03 employees and managers still see only their own tickets", async () => {
		for (const r of ["Employee", "Manager"]) {
			role = r;
			clearMembershipCache();
			SupportTicket.find.mockClear();
			await request(app).get(`/api/ticket/open/${enc(ME)}/${enc(BN)}`).set(auth());
			expect(filterOf().$or).toEqual([{ originator: ME }, { assignee: ME }]);
		}
	});

	test("SQ-04 other companies are unchanged, even for their admins", async () => {
		await request(app).get(`/api/ticket/open/${enc(ME)}/${enc("Other Co")}`).set(auth());
		expect(filterOf()).toMatchObject({ companyName: "Other Co" });
		expect(filterOf().$or).toEqual([{ originator: ME }, { assignee: ME }]);
	});

	test("SQ-05 reassigning a ticket e-mails the new assignee (only when the assignee changes)", async () => {
		const id = "65c000000000000000000009";
		const ticket = { _id: id, companyName: BN, assignee: "Jesse C", category: SUPPORT_CATEGORY, ticketNumber: "T1" };
		SupportTicket.findById.mockImplementation(() => query(ticket));
		SupportTicket.findByIdAndUpdate.mockImplementation(async (i, u) => ({ ...ticket, ...u.$set }));
		Employee.findOne.mockImplementation(() => query({ email: "new.assignee@example.test" }));

		const res = await request(app).put(`/api/ticket/${id}`).set(auth()).send({ assignee: ME });
		expect(res.status).toBe(200);
		expect(res.body.assignee).toBe(ME);
		expect(sendTemplate).toHaveBeenCalledTimes(1);
		expect(sendTemplate.mock.calls[0][0]).toBe("new.assignee@example.test");

		await request(app).put(`/api/ticket/${id}`).set(auth()).send({ status: TICKET_STATUS.PROGRESS });
		expect(sendTemplate).toHaveBeenCalledTimes(1); // no assignee change, no e-mail
	});

	test("SQ-06 ticket lists include the linked CRM Lead (leadId) for the Lead details section", async () => {
		const populate = jest.fn();
		SupportTicket.find.mockImplementation(() => {
			const q = query([]);
			q.populate = (...args) => {
				populate(...args);
				return q;
			};
			return q;
		});
		await request(app).get(`/api/ticket/open/${enc(ME)}/${enc(BN)}`).set(auth());
		await request(app).get(`/api/ticket/closed/${enc(ME)}/${enc(BN)}`).set(auth());
		await request(app).get(`/api/ticket/filter/${enc(ME)}/${enc(BN)}/${SUPPORT_CATEGORY}`).set(auth());
		expect(populate).toHaveBeenCalledTimes(3);
		populate.mock.calls.forEach(([path, fields]) => {
			expect(path).toBe("leadId");
			expect(fields).toBe(LEAD_POPULATE_FIELDS);
		});
	});
});
