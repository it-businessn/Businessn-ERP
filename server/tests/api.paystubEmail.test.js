/**
 * PAYSTUB-EMAIL: pay stubs e-mailed on the pay date.
 * Models are mocked; the delivery log is an in-memory fake that enforces the
 * unique key (like MongoDB), so the "never send twice" claim logic is exercised
 * for real. PDF generation (pdfkit), the EJS template, routing, tenant guard and
 * role checks are real. SMTP (services/emailService) is mocked.
 */
const request = require("supertest");

jest.mock("../models/Company");
jest.mock("../models/Employee");
jest.mock("../models/EmployeeEmploymentInfo");
jest.mock("../models/EmployeeProfileInfo");
jest.mock("../models/EmployeePayStub");
jest.mock("../models/PayStubEmailLog");
jest.mock("../services/emailService", () => ({ sendEmail: jest.fn() }));
jest.mock("node-cron", () => ({ schedule: jest.fn(() => ({ stop: jest.fn() })) }));

const cron = require("node-cron");
const Company = require("../models/Company");
const Employee = require("../models/Employee");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");
const EmployeePayStub = require("../models/EmployeePayStub");
const PayStubEmailLog = require("../models/PayStubEmailLog");
const { sendEmail } = require("../services/emailService");
const service = require("../services/payStubEmailService");
const runPayStubEmailJob = require("../jobs/payStubEmail");
const { clearMembershipCache } = require("../middleware/authorize");
const { USER_ID, auth, query, buildTestApp } = require("./helpers");

const EMP = "65e000000000000000000001";
const EMP2 = "65e000000000000000000002";

const stub = (over = {}) => ({
	_id: "65f00000000000000000000" + (over.n || 1),
	empId: EMP,
	companyName: "Acme",
	payPeriodNum: "7",
	isExtraRun: false,
	reportType: null,
	isProcessed: true,
	payPeriodStartDate: new Date("2026-10-05T00:00:00Z"),
	payPeriodEndDate: new Date("2026-10-18T00:00:00Z"),
	payPeriodPayDate: new Date("2026-10-23T00:00:00Z"),
	regPay: 25,
	totalRegHoursWorked: 80,
	currentRegPayTotal: 2000,
	YTDRegPayTotal: 40000,
	currentIncomeTaxDeductions: 300,
	YTD_IncomeTaxDeductions: 6000,
	currentGrossPay: 2000,
	YTDGrossPay: 40000,
	currentDeductionsTotal: 450,
	YTDDeductionsTotal: 9000,
	currentNetPay: 1550,
	YTDNetPay: 31000,
	...over,
});

// ---- in-memory delivery log with a unique key ------------------------------
let logRows;
const KEY = ["companyName", "empId", "payPeriodNum", "isExtraRun", "reportType", "payPeriodPayDate"];
const same = (a, b) => (a instanceof Date || b instanceof Date ? +new Date(a) === +new Date(b) : a === b);
const matchCond = (v, cond) => {
	if (cond && typeof cond === "object" && !(cond instanceof Date)) {
		if ("$ne" in cond) return !same(v, cond.$ne);
		if ("$lt" in cond) return v !== undefined && v !== null && new Date(v) < cond.$lt;
		if ("$gte" in cond) return new Date(v) >= cond.$gte && new Date(v) < cond.$lt;
	}
	return same(v ?? null, cond ?? null);
};
const matches = (row, filter) =>
	Object.entries(filter).every(([k, cond]) =>
		k === "$or" ? cond.some((f) => matches(row, f)) : matchCond(row[k], cond),
	);
const installLogFake = () => {
	logRows = [];
	let id = 0;
	PayStubEmailLog.findOneAndUpdate.mockImplementation(async (filter, update) => {
		const row = logRows.find((r) => matches(r, filter));
		if (!row) return null;
		Object.assign(row, update.$set);
		row.attempts = (row.attempts || 0) + (update.$inc?.attempts || 0);
		return { ...row };
	});
	PayStubEmailLog.create.mockImplementation(async (doc) => {
		if (logRows.some((r) => KEY.every((k) => same(r[k] ?? null, doc[k] ?? null)))) {
			const e = new Error("E11000 duplicate key");
			e.code = 11000;
			throw e;
		}
		const row = { _id: `log${++id}`, ...doc };
		logRows.push(row);
		return { ...row };
	});
	PayStubEmailLog.updateOne.mockImplementation(async ({ _id }, update) => {
		Object.assign(logRows.find((r) => r._id === _id), update.$set);
		return { acknowledged: true };
	});
	PayStubEmailLog.find.mockImplementation((filter) => query(logRows.filter((r) => matches(r, filter))));
};

let role;
let app;
beforeAll(() => {
	app = buildTestApp();
});
beforeEach(() => {
	jest.clearAllMocks();
	clearMembershipCache();
	delete process.env.PAYSTUB_EMAIL_ENABLED;
	role = "Administrator";
	installLogFake();
	Company.find.mockImplementation(() => query([{ name: "Acme", _id: "65b000000000000000000001" }]));
	Company.findOne.mockImplementation(() =>
		query({ name: "Acme", registration_number: "123456789RP0001", address: { city: "Surrey", state: "BC" } }),
	);
	Employee.findById.mockImplementation((id) =>
		query(
			id === EMP2
				? { _id: EMP2, fullName: "No Mail", email: null }
				: { _id: EMP, fullName: "Jane Employee", firstName: "Jane", email: "jane@acme.test" },
		),
	);
	EmployeeProfileInfo.findOne.mockImplementation(() => query(null));
	// used by RBAC (caller role) and by the statement (employee number)
	EmployeeEmploymentInfo.findOne.mockImplementation(() =>
		query({ employmentRole: role, employeeNo: "E-104" }),
	);
	EmployeePayStub.find.mockImplementation(() => query([stub()]));
	sendEmail.mockResolvedValue();
});

describe("e-mail content", () => {
	test("T-PSE-01 subject, text, escaped HTML and a real PDF attachment", async () => {
		const mail = await service.buildPayStubEmail(
			stub(),
			{ fullName: "<script>x</script> Jane", employeeNo: "E-104" },
			{ company: { name: "Acme" } },
		);
		expect(mail.subject).toBe("Acme - Pay stub for pay period 7 (pay date 23/10/2026)");
		expect(mail.text).toContain("Net pay: $1,550.00");
		expect(mail.text).toContain("Pay date: 23/10/2026");
		expect(mail.text).toContain("The date the funds arrive in your bank account may be different");
		expect(mail.html).toContain("The date the funds arrive in your bank account may be");
		expect(mail.text).not.toContain("was issued on");
		expect(mail.html).toContain("&lt;script&gt;x&lt;/script&gt; Jane");
		expect(mail.html).not.toContain("<script>x</script>");
		expect(mail.html).toContain("Please download the attached PDF");
		expect(mail.html).not.toMatch(/<a\s/); // no links or buttons
		const [pdf] = mail.attachments;
		expect(pdf.contentType).toBe("application/pdf");
		expect(pdf.filename).toBe("Paystub_PP7_23-10-2026_scriptxscriptJane.pdf");
		expect(pdf.content.subarray(0, 5).toString()).toBe("%PDF-");
		expect(pdf.content.length).toBeGreaterThan(1500);
	});

	test("T-PSE-02 extra run is labelled and a missing name falls back", async () => {
		const mail = await service.buildPayStubEmail(stub({ isExtraRun: true }), {}, {});
		expect(mail.subject).toContain("pay period 7 (extra run)");
		expect(mail.text).toContain("Hi there,");
		expect(mail.text).toContain("Please download the attached PDF to view, save or print your pay stub");
	});
});

describe("switch and schedule", () => {
	test("T-PSE-03 off by default; on only with PAYSTUB_EMAIL_ENABLED=true; never in development", () => {
		expect(service.isEnabled()).toBe(false);
		process.env.PAYSTUB_EMAIL_ENABLED = "true";
		expect(service.isEnabled()).toBe(true);
		const env = process.env.NODE_ENV;
		process.env.NODE_ENV = "development";
		expect(service.isEnabled()).toBe(false);
		process.env.NODE_ENV = env;
	});

	test("T-PSE-04 job is not scheduled when off; hourly 08-18 Vancouver when on", () => {
		expect(runPayStubEmailJob()).toBeNull();
		expect(cron.schedule).not.toHaveBeenCalled();
		process.env.PAYSTUB_EMAIL_ENABLED = "true";
		runPayStubEmailJob();
		expect(cron.schedule).toHaveBeenCalledWith("0 8-18 * * *", expect.any(Function), {
			timezone: "America/Vancouver",
		});
	});

	test("T-PSE-05 'today' is the Vancouver calendar day, with a 3-day catch-up window", () => {
		// 23:30 on Oct 22 in Vancouver is already Oct 23 in UTC
		const late = service.dueWindow(new Date("2026-10-23T06:30:00Z"));
		expect(late.$gte.toISOString()).toBe("2026-10-19T00:00:00.000Z");
		expect(late.$lt.toISOString()).toBe("2026-10-23T00:00:00.000Z");
		const morning = service.dueWindow(new Date("2026-10-23T16:00:00Z")); // 09:00 Vancouver
		expect(morning.$gte.toISOString()).toBe("2026-10-20T00:00:00.000Z");
		expect(morning.$lt.toISOString()).toBe("2026-10-24T00:00:00.000Z");
	});

	test("T-PSE-06 scheduled run does nothing (no query, no e-mail) while switched off", async () => {
		const r = await service.sendDuePayStubs();
		expect(r).toMatchObject({ enabled: false, due: 0 });
		expect(EmployeePayStub.find).not.toHaveBeenCalled();
		expect(sendEmail).not.toHaveBeenCalled();
	});
});

describe("sending (exactly once)", () => {
	beforeEach(() => {
		process.env.PAYSTUB_EMAIL_ENABLED = "true";
	});

	test("T-PSE-07 due stub is e-mailed with the PDF and logged SENT", async () => {
		const r = await service.sendDuePayStubs({ now: new Date("2026-10-23T16:00:00Z") });
		expect(r).toEqual({ enabled: true, due: 1, sent: 1, skipped: 0, failed: 0 });
		const filter = EmployeePayStub.find.mock.calls[0][0];
		expect(filter).toMatchObject({ isProcessed: true });
		expect(filter.payPeriodPayDate.$lt.toISOString()).toBe("2026-10-24T00:00:00.000Z");
		const [to, subject, , html, attachments] = sendEmail.mock.calls[0];
		expect(to).toBe("jane@acme.test");
		expect(subject).toContain("pay period 7");
		expect(html).toContain("Jane Employee");
		expect(attachments[0].contentType).toBe("application/pdf");
		expect(logRows).toHaveLength(1);
		expect(logRows[0]).toMatchObject({ status: "SENT", employeeEmail: "jane@acme.test", attempts: 1 });
	});

	test("T-PSE-08 hourly re-runs never send the same stub again", async () => {
		await service.sendDuePayStubs();
		const again = await service.sendDuePayStubs();
		expect(again).toMatchObject({ due: 1, sent: 0, skipped: 1 });
		expect(sendEmail).toHaveBeenCalledTimes(1);
	});

	test("T-PSE-09 two runs at the same time (e.g. two servers) send once", async () => {
		sendEmail.mockImplementation(() => new Promise((r) => setTimeout(r, 30)));
		const [a, b] = await Promise.all([service.sendDuePayStubs(), service.sendDuePayStubs()]);
		expect(a.sent + b.sent).toBe(1);
		expect(a.skipped + b.skipped).toBe(1);
		expect(sendEmail).toHaveBeenCalledTimes(1);
	});

	test("T-PSE-10 SMTP failure is logged FAILED and retried on the next run", async () => {
		sendEmail.mockRejectedValueOnce(new Error("Failed to send email. Please try again later."));
		const first = await service.sendDuePayStubs();
		expect(first).toMatchObject({ failed: 1, sent: 0 });
		expect(logRows[0]).toMatchObject({ status: "FAILED", error: expect.stringMatching(/Failed to send/) });
		const retry = await service.sendDuePayStubs();
		expect(retry).toMatchObject({ sent: 1 });
		expect(logRows[0]).toMatchObject({ status: "SENT", attempts: 2, error: null });
	});

	test("T-PSE-11 employee without e-mail is FAILED with a reason; other stubs still go out", async () => {
		EmployeePayStub.find.mockImplementation(() => query([stub({ empId: EMP2, n: 2 }), stub()]));
		const r = await service.sendDuePayStubs();
		expect(r).toMatchObject({ due: 2, sent: 1, failed: 1 });
		expect(logRows.find((x) => x.empId === EMP2)).toMatchObject({
			status: "FAILED",
			error: "Employee has no e-mail address",
		});
	});

	test("T-PSE-12 falls back to the profile's personal e-mail when the login e-mail is missing", async () => {
		Employee.findById.mockImplementation(() => query({ _id: EMP, fullName: "Jane", email: null }));
		EmployeeProfileInfo.findOne.mockImplementation(() => query({ personalEmail: "jane.home@mail.test" }));
		await service.sendDuePayStubs();
		expect(sendEmail.mock.calls[0][0]).toBe("jane.home@mail.test");
	});

	test("T-PSE-13 period 7 of a new year is a new e-mail (log is keyed by pay date)", async () => {
		await service.emailPayStub(stub({ payPeriodPayDate: new Date("2025-10-24T00:00:00Z") }));
		const r = await service.emailPayStub(stub());
		expect(r).toBe("SENT");
		expect(sendEmail).toHaveBeenCalledTimes(2);
		expect(logRows).toHaveLength(2);
	});

	test("T-PSE-14 a send abandoned mid-way (server crash) is retried after 30 minutes, not before", async () => {
		const key = {
			companyName: "Acme",
			empId: EMP,
			payPeriodNum: "7",
			isExtraRun: false,
			reportType: null,
			payPeriodPayDate: new Date("2026-10-23T00:00:00Z"),
		};
		logRows.push({ _id: "stuck", ...key, status: "SENDING", claimedAt: new Date(), attempts: 1 });
		expect(await service.emailPayStub(stub())).toBe("SKIPPED");
		logRows[0].claimedAt = new Date(Date.now() - 31 * 60 * 1000);
		expect(await service.emailPayStub(stub())).toBe("SENT");
	});
});

/**
 * The attachment is the printed PayStubStatement: same rows, visibility rules
 * and number formats as the client components (EarningsTable, ItemRow,
 * InformationSection, EmployeeInfo, ChequeDetails).
 */
describe("Pay stub e-mail: statement PDF (PayStubStatement)", () => {
	const pdf = require("../services/payStubPdfService");
	const byTitle = (rows) => Object.fromEntries(rows.map((r) => [r.title, r]));
	const full = (over = {}) =>
		stub({
			overTimePay: 37.5,
			totalOvertimeHoursWorked: 4,
			currentOverTimePayTotal: 150,
			YTDOvertimeHoursWorked: 10,
			YTDOverTimePayTotal: 375,
			YTDBonus: 500,
			currentFDTaxDeductions: 200,
			YTD_FDTaxDeductions: 4000,
			currentEmployerContributions: 80,
			YTDEmployerContributions: 1600,
			vacationBalance: 900,
			YTDVacationBalance: 900,
			...over,
		});

	test("T-PSE-23 earnings/deduction rows: shown, hidden and formatted like EarningsTable/ItemRow", () => {
		const { earnings, deductions } = pdf.statementRows(pdf.statementData(full()));
		expect(earnings.map((r) => r.title)).toEqual(["Regular", "Overtime", "Bonus", "Gross Earnings"]);
		const e = byTitle(earnings);
		expect(e.Regular).toMatchObject({ rate: "25.00", hours: "80.00", current: "2000.00", ytd: "40000.00", bold: false });
		expect(e.Bonus).toMatchObject({ rate: null, hours: null, ytdHours: null, current: "0.00", ytd: "500.00" });
		expect(e["Gross Earnings"]).toMatchObject({ bold: true, ytdHours: null, current: "2000.00" });
		// Federal / Provincial tax are never listed (Income Tax already is their sum)
		expect(deductions.map((r) => r.title)).toEqual(["Income Tax", "Total Deductions"]);
		expect(byTitle(deductions)["Total Deductions"].bold).toBe(true);
	});

	test("T-PSE-24 benefit/vacation rows follow InformationSection; Available Balance hides current", () => {
		const { accruals } = pdf.statementRows(pdf.statementData(full()));
		expect(accruals.map((a) => a.type)).toEqual(["Employer Paid Benefits", "Vacation"]);
		const benefits = byTitle(accruals[0].rows);
		// EI has no YTD value -> hidden; CPP and "...Benefits" rows are always shown
		expect(Object.keys(benefits)).toEqual(["CPP", "Total Employer Paid Benefits"]);
		expect(benefits["Total Employer Paid Benefits"]).toMatchObject({ bold: true, current: "80.00", ytd: "1600.00" });
		const vacation = byTitle(accruals[1].rows);
		expect(vacation["Available Balance"]).toMatchObject({ current: null, ytd: "900.00", bold: true });
	});

	test("T-PSE-25 net pay summary: Gross, Total Deductions and Net Pay, all bold", () => {
		const { netSummary } = pdf.statementRows(pdf.statementData(full()));
		expect(netSummary).toEqual([
			expect.objectContaining({ title: "Gross Earnings", current: "2000.00", bold: true }),
			expect.objectContaining({ title: "Total Deductions", current: "450.00", bold: true }),
			expect.objectContaining({ title: "Net Pay", current: "1550.00", ytd: "31000.00", bold: true }),
		]);
	});

	test("T-PSE-26 cheque part: amount in words, payment method and superficial runs (ChequeDetails)", () => {
		expect(pdf.amountInWords(1977.8)).toBe(
			"One Thousand Nine Hundred Seventy Seven Dollars And Eighty Cents Only",
		);
		expect(pdf.amountInWords(undefined)).toBe("Zero Dollars Only");
		expect(pdf.paymentMethod(pdf.statementData(stub({ reportType: "1" })))).toBe("DIRECT DEPOSIT");
		expect(pdf.paymentMethod(pdf.statementData(stub({ reportType: "3" })))).toBe("Manual");
		// a superficial balance run pays nothing, whatever the stub says
		expect(pdf.statementData(stub({ reportType: "4" })).currentNetPay).toBe(0);
		expect(pdf.statementData(stub({ reportType: "1" })).currentNetPay).toBe(1550);
	});

	test("T-PSE-27 employee details come from the loaded employee, else a populated empId", () => {
		const address = { streetNumber: "1 Main St", city: "Surrey", state: "BC", postalCode: "V3T 1A1" };
		const loaded = pdf.statementData(stub(), { fullName: "Jane", employeeNo: "E-1", primaryAddress: address });
		expect(loaded.empId).toEqual({ fullName: "Jane", employeeNo: "E-1", primaryAddress: address });
		const populated = pdf.statementData(stub({ empId: { _id: EMP, fullName: "Pat", employeeNo: "E-2" } }));
		expect(populated.empId).toMatchObject({ fullName: "Pat", employeeNo: "E-2", primaryAddress: null });
	});

	test("T-PSE-28 PDF: one A4 page with logo and watermark, even with every line in use", async () => {
		const raw = async (s, fullName = "Jane") =>
			(await pdf.buildPayStubPdf(s, { fullName }, { name: "Acme" })).toString("latin1");
		const count = (s, re) => (s.match(re) || []).length;
		const one = await raw(full());
		expect(one.startsWith("%PDF-")).toBe(true);
		expect(count(one, /\/Type \/Page\b/g)).toBe(1);
		expect(one).toMatch(/\/MediaBox \[0 0 595\.28 841\.89\]/);
		expect(count(one, /\/Subtype \/Image/g)).toBe(2);
		// every earnings and deduction line in use
		const busy = {};
		for (const r of require("../constants/paystub.constants").EARNINGS_TYPES.concat(
			require("../constants/paystub.constants").DEDUCTION_TYPES,
		)) {
			for (const k of [r.rate, r.totalHours, r.currentTotal, r.YTDHoursTotal, r.YTDTotal]) if (k) busy[k] = 10;
		}
		const long = await raw(full({ ...busy, empId: EMP }));
		expect(count(long, /\/Type \/Page\b/g)).toBe(1);
		// absurdly long values are cut at 3 lines instead of flowing onto extra pages
		const huge = await raw(full(), "Jane Employee ".repeat(120));
		expect(count(huge, /\/Type \/Page\b/g)).toBe(1);
	});
});

/**
 * POST /api/user/send-paystub (Employees > Send pay stub e-mail): the existing
 * manual send now e-mails the pay stub e-mail with the statement PDF attached,
 * through the same delivery log as the pay-date job.
 */
describe("Pay stub e-mail: manual send (POST /api/user/send-paystub)", () => {
	const send = (body) =>
		request(app)
			.post("/api/user/send-paystub")
			.set(auth())
			.send({ employees: ["Jane Employee"], companyName: "Acme", ...body });

	beforeEach(() => {
		Company.find.mockImplementation(() =>
			query([{ name: "Acme", _id: "65b000000000000000000001", employees: [USER_ID, EMP] }]),
		);
		Employee.findOne.mockImplementation((filter) =>
			query(
				filter.fullName === "Jane Employee"
					? { _id: EMP, fullName: "Jane Employee", email: "jane@acme.test" }
					: null,
			),
		);
	});

	test("T-PSE-29 e-mails the latest processed stub: pay stub body + statement PDF to download", async () => {
		const res = await send();
		expect(res.status).toBe(201);
		expect(res.body).toMatchObject({ message: "Email sent successfully", sent: ["Jane Employee"] });
		expect(EmployeePayStub.find.mock.calls[0][0]).toEqual({
			isProcessed: true,
			empId: EMP,
			companyName: { $in: ["Acme"] },
		});
		const [to, subject, text, html, attachments] = sendEmail.mock.calls[0];
		expect(to).toBe("jane@acme.test");
		expect(subject).toBe("Acme - Pay stub for pay period 7 (pay date 23/10/2026)");
		expect(text).toContain("Net pay: $1,550.00");
		expect(html).toContain("Your pay stub is attached");
		expect(html).toContain("Please download the attached PDF");
		expect(html).not.toContain("employee portal");
		expect(html).toContain("cid:footerLogo");
		const [pdfFile, logo] = attachments;
		expect(pdfFile).toMatchObject({
			filename: "Paystub_PP7_23-10-2026_JaneEmployee.pdf",
			contentType: "application/pdf",
			contentDisposition: "attachment",
		});
		expect(pdfFile.content.subarray(0, 5).toString()).toBe("%PDF-");
		expect(logo).toMatchObject({ cid: "footerLogo" });
		expect(logRows).toEqual([expect.objectContaining({ status: "SENT", triggeredBy: "MANUAL" })]);
	});

	test("T-PSE-30 a second click re-sends; the pay-date job then does not send it again", async () => {
		await send();
		await send();
		expect(sendEmail).toHaveBeenCalledTimes(2);
		expect(logRows).toHaveLength(1);
		expect(logRows[0].attempts).toBe(2);
		process.env.PAYSTUB_EMAIL_ENABLED = "true";
		const due = await service.sendDuePayStubs({ now: new Date("2026-10-23T16:00:00Z") });
		expect(due).toMatchObject({ due: 1, sent: 0, skipped: 1 });
		expect(sendEmail).toHaveBeenCalledTimes(2);
	});

	test("T-PSE-31 no processed stub / unknown name / SMTP down are reported per employee", async () => {
		EmployeePayStub.find.mockImplementation(() => query([]));
		const none = await send({ employees: ["Jane Employee", "Nobody"] });
		expect(none.status).toBe(422);
		expect(none.body).toMatchObject({ sent: [], noPayStub: ["Jane Employee"], notFound: ["Nobody"] });
		expect(none.body.message).toBe(
			"Pay stub e-mailed to 0 of 2 employee(s); not found: Nobody; no processed pay stub: Jane Employee",
		);
		expect(sendEmail).not.toHaveBeenCalled();

		EmployeePayStub.find.mockImplementation(() => query([stub()]));
		sendEmail.mockRejectedValueOnce(new Error("SMTP down"));
		const down = await send();
		expect(down.status).toBe(422);
		expect(down.body.failed).toEqual(["Jane Employee"]);
		expect(logRows[0]).toMatchObject({ status: "FAILED", error: "SMTP down" });
	});

});

/** Only stubs with net pay above $0.00 are e-mailed (the payment run's rule). */
describe("Pay stub e-mail: only when net pay is above $0.00", () => {
	const NO_PAY = [
		["net pay $0.00", { currentNetPay: 0 }],
		["negative net pay", { currentNetPay: -42.5 }],
		["missing net pay", { currentNetPay: undefined }],
		["superficial balance run (statement shows $0.00)", { reportType: "4", currentNetPay: 300 }],
	];

	test("T-PSE-33 isPayable: above $0.00 only; superficial runs never", () => {
		expect(service.isPayable(stub({ currentNetPay: 0.01 }))).toBe(true);
		expect(service.isPayable(stub({ reportType: "3", currentNetPay: 10 }))).toBe(true);
		for (const [, over] of NO_PAY) expect(service.isPayable(stub(over))).toBe(false);
	});

	test.each(NO_PAY)("T-PSE-34 pay-date job does not e-mail a stub with %s", async (_, over) => {
		process.env.PAYSTUB_EMAIL_ENABLED = "true";
		EmployeePayStub.find.mockImplementation(() => query([stub(over)]));
		const r = await service.sendDuePayStubs({ now: new Date("2026-10-23T16:00:00Z") });
		expect(r).toMatchObject({ sent: 0, failed: 0 });
		expect(sendEmail).not.toHaveBeenCalled();
		expect(logRows).toHaveLength(0);
		// and the database query itself asks only for payable stubs
		expect(EmployeePayStub.find.mock.calls[0][0]).toMatchObject({
			currentNetPay: { $gt: 0 },
			reportType: { $ne: "4" },
		});
	});

	test.each(NO_PAY)("T-PSE-36 Send pay stub e-mail skips and reports a stub with %s", async (_, over) => {
		Company.find.mockImplementation(() =>
			query([{ name: "Acme", _id: "65b000000000000000000001", employees: [USER_ID, EMP] }]),
		);
		Employee.findOne.mockImplementation(() =>
			query({ _id: EMP, fullName: "Jane Employee", email: "jane@acme.test" }),
		);
		EmployeePayStub.find.mockImplementation(() => query([stub(over)]));
		const res = await request(app)
			.post("/api/user/send-paystub")
			.set(auth())
			.send({ employees: ["Jane Employee"], companyName: "Acme" });
		expect(res.status).toBe(422);
		expect(res.body).toMatchObject({ sent: [], notPayable: ["Jane Employee"] });
		expect(res.body.message).toBe(
			"Pay stub e-mailed to 0 of 1 employee(s); net pay not above $0.00: Jane Employee",
		);
		expect(sendEmail).not.toHaveBeenCalled();
		expect(logRows).toHaveLength(0);
	});
});
