/**
 * LEAD-DETAILS: POST /api/ticket/leads (public website lead / contact forms)
 * saves what the form sent on the CRM Lead it creates, links the ticket to it
 * (leadId, no copy on the ticket) and names the ticket after it.
 */
const request = require("supertest");

jest.mock("../models/Ticket");
jest.mock("../models/Lead");
jest.mock("../models/Employee");
jest.mock("../services/emailTemplates", () => ({
	...jest.requireActual("../services/emailTemplates"),
	sendTemplate: jest.fn(async () => {}),
}));

const SupportTicket = require("../models/Ticket");
const { sendTemplate } = require("../services/emailTemplates");
const Lead = require("../models/Lead");
const Employee = require("../models/Employee");
const { COMPANIES } = require("../constants/constant");
const {
	SUPPORT_CATEGORY,
	LEAD_DEFAULT_ISSUE,
	LEAD_SOURCE_WEBSITE,
	LEAD_STAGE_NEW,
} = require("../constants/ticket.constants");
const { buildTestApp } = require("./helpers");

describe("POST /api/ticket/leads (LEAD-DETAILS)", () => {
	let app;
	beforeAll(() => {
		app = buildTestApp();
	});
	beforeEach(() => {
		jest.resetAllMocks();
		Lead.create.mockImplementation(async (doc) => ({ _id: "l1", ...doc }));
		Employee.findOne.mockResolvedValue({ fullName: "Jesse C", email: "support@example.test" });
		SupportTicket.create.mockImplementation(async (doc) => ({ _id: "t1", ...doc }));
	});
	const created = () => SupportTicket.create.mock.calls[0][0];
	const post = (body) => request(app).post("/api/ticket/leads").send(body);

	const lead = () => Lead.create.mock.calls[0][0];

	test("LD-01 the form's fields are saved on the CRM Lead; the ticket links to it and keeps no copy", async () => {
		const res = await post({
			firstName: " Ana ",
			lastName: "Lee",
			email: "ana@example.test",
			phone: "604-555-0100",
			companyName: "ABC Store",
			title: "Owner",
			country: "CA",
			state: "BC",
			annualRevenue: "1M-5M",
			totalEmployees: "25",
			message: "Need payroll for 25 staff.",
			plan: "Pro",
			webinarTitle: "Payroll 101",
			webinarTopic: "Payroll",
			referrals: "true",
			marketingComms: false,
			ticketType: "Sales enquiry",
			formName: "Contact us",
			source: "website",
			interests: ["Payroll"],
			unknownField: "ignored",
		});
		expect(res.status).toBe(201);
		expect(lead()).toEqual({
			name: "Ana Lee",
			companyName: COMPANIES.BUSINESSN_ORG,
			email: "ana@example.test",
			opportunityName: "ABC Store",
			phone: "604-555-0100",
			productService: [{ name: "Payroll" }],
			region: "BC",
			source: LEAD_SOURCE_WEBSITE,
			stage: LEAD_STAGE_NEW,
			roleTitle: "Owner",
			country: "CA",
			annualRevenue: "1M-5M",
			totalEmployees: "25",
			referrals: true,
			marketingComms: false,
			message: "Need payroll for 25 staff.",
			plan: "Pro",
			webinarTitle: "Payroll 101",
			webinarTopic: "Payroll",
			ticketType: "Sales enquiry",
			formName: "Contact us",
			websiteSource: "website",
		});
		expect(created()).toEqual({
			companyName: COMPANIES.BUSINESSN_ORG,
			category: SUPPORT_CATEGORY,
			priority: 1,
			ticketNumber: expect.stringMatching(/^\d{6}ABC#\d{5}$/),
			assignee: "Jesse C",
			topic: "New Lead: Sales enquiry from ABC Store",
			issue: "Need payroll for 25 staff.",
			leadId: "l1",
		});
	});

	test("LD-02 the ERP's own lead form (province, no ticket type or message) still works", async () => {
		const res = await post({ firstName: "Bo", companyName: "XYZ Ltd", province: "ON", totalEmployees: "" });
		expect(res.status).toBe(201);
		expect(created().topic).toBe("New Lead: Website Contact Form Submission from XYZ Ltd");
		expect(created().issue).toBe(LEAD_DEFAULT_ISSUE);
		expect(lead()).toMatchObject({ name: "Bo", opportunityName: "XYZ Ltd", region: "ON" });
		expect(lead().totalEmployees).toBeUndefined();
	});

	test("LD-03 values that cannot be converted are left out instead of failing the save", async () => {
		await post({ firstName: "Cy", totalEmployees: "50+", referrals: "maybe" });
		expect(lead().totalEmployees).toBeUndefined();
		expect(lead().referrals).toBeUndefined();
		expect(lead().name).toBe("Cy"); // was "Cy undefined" without a last name
	});

	test("LD-04 objects (Mongo operators) are rejected and nothing is saved", async () => {
		const res = await post({ firstName: "Dee", message: { $gt: "" } });
		expect(res.status).toBe(400);
		expect(SupportTicket.create).not.toHaveBeenCalled();
		expect(Lead.create).not.toHaveBeenCalled();
	});

	test("LD-05 the assignee's e-mail lists everything the website sent", async () => {
		await post({
			firstName: "Ana",
			lastName: "Lee",
			email: "ana@example.test",
			phone: "604-555-0100",
			companyName: "ABC Store",
			title: "Owner",
			country: "CA",
			state: "BC",
			annualRevenue: "1M-5M",
			totalEmployees: 25,
			message: "Need payroll for 25 staff.",
			plan: "Pro",
			ticketType: "Sales enquiry",
			formName: "Contact us",
			source: "website",
			marketingComms: false,
		});
		expect(sendTemplate).toHaveBeenCalledTimes(1);
		const mail = await sendTemplate.mock.calls[0][1];
		const body = `${mail.subject} ${mail.text} ${mail.html}`;
		for (const v of ["ABC Store", "Ana Lee", "ana@example.test", "604-555-0100", "Owner", "CA", "BC", "1M-5M", "25",
			"Need payroll for 25 staff.", "Pro", "Sales enquiry", "Contact us", "website"]) {
			expect(body).toContain(v);
		}
		expect(mail.text).toContain("Marketing e-mails: No");
	});
});
