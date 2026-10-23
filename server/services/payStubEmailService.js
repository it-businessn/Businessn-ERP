const path = require("path");
const ejs = require("ejs");
const moment = require("moment-timezone");
const Company = require("../models/Company");
const Employee = require("../models/Employee");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const EmployeePayStub = require("../models/EmployeePayStub");
const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");
const PayStubEmailLog = require("../models/PayStubEmailLog");
const { sendEmail } = require("./emailService");
const { buildPayStubPdf, payStubFileName } = require("./payStubPdfService");
const { PAYRUN_TYPE_CODE } = require("../constants/paystub.constants");
const { normalisePayDate } = require("../utils/payYear.util");

/**
 * PAYSTUB-EMAIL: e-mails each employee their earnings statement (PDF) on the
 * pay date. Driven by jobs/payStubEmail.js (hourly, 08:00-18:00 Vancouver) and
 * by Send pay stub e-mail in the app (userController.sendMailPaystub).
 */

const EMAIL_TEMPLATE = path.join(__dirname, "../views/emails/paystub.ejs");
// assets/logos/BusinessN_dark1.png trimmed to the wordmark and resized for e-mail (12 KB)
const FOOTER_LOGO = path.join(__dirname, "../assets/paystub/email-logo.png");
const TIMEZONE = "America/Vancouver";
/** Pay dates up to this many days back are re-checked, so a restart or outage on payday skips nobody. */
const CATCH_UP_DAYS = 3;
/** A SENDING claim older than this is treated as abandoned (server died mid-send) and may be retried. */
const STALE_CLAIM_MINUTES = 30;

/**
 * Opt-in: nothing is e-mailed unless PAYSTUB_EMAIL_ENABLED=true. These e-mails
 * go to real employees and the staging .env points at production data, so
 * sending must be switched on deliberately per deployment. NODE_ENV=development
 * (.env.local) is always off.
 */
const isEnabled = () =>
	process.env.NODE_ENV !== "development" &&
	String(process.env.PAYSTUB_EMAIL_ENABLED || "").toLowerCase() === "true";

/**
 * Only pay stubs that pay the employee something are e-mailed: net pay above
 * $0.00, the same rule as the payment run (reportController: currentNetPay > 0).
 * Net pay of $0.00 (nothing paid) or below (deductions above gross, a payroll
 * error) is never e-mailed. A superficial balance run always shows $0.00 on the
 * statement (ChequeDetails), so it is never e-mailed either.
 */
const PAYABLE = {
	currentNetPay: { $gt: 0 },
	reportType: { $ne: PAYRUN_TYPE_CODE.SUPERFICIAL },
};
const isPayable = (stub) =>
	stub?.reportType !== PAYRUN_TYPE_CODE.SUPERFICIAL && Number(stub?.currentNetPay) > 0;

const money = (n) =>
	new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(Number(n) || 0);
/** Shown in every pay stub e-mail (also in views/emails/paystub.ejs): the stub's pay
 * date is the scheduled one; the bank deposit (VoPay transfer) can land on another day. */
const PAY_DATE_NOTE =
	"Please note: the pay date shown on your pay stub is the scheduled pay date for this pay period. " +
	"The date the funds arrive in your bank account may be different, depending on when the payment " +
	"is processed and on your bank's processing times.";
const date = (d) => (d ? moment.utc(d).format("DD/MM/YYYY") : "-");
const periodLabel = (stub) => `${stub.payPeriodNum}${stub.isExtraRun ? " (extra run)" : ""}`;

/**
 * Builds subject, plain text, HTML (views/emails/paystub.ejs, values escaped by
 * EJS) and the PDF attachment for one stub. No I/O except the template read.
 */
const buildPayStubEmail = async (stub, employee = {}, { company = {} } = {}) => {
	const companyName = company?.name || stub.companyName;
	const name = employee?.fullName || employee?.firstName || "there";
	const subject = `${companyName} - Pay stub for pay period ${periodLabel(stub)} (pay date ${date(
		stub.payPeriodPayDate,
	)})`;
	const fileName = payStubFileName(stub, employee);

	const html = await ejs.renderFile(EMAIL_TEMPLATE, {
		company: companyName,
		name,
		periodLabel: periodLabel(stub),
		startDate: date(stub.payPeriodStartDate),
		endDate: date(stub.payPeriodEndDate),
		payDate: date(stub.payPeriodPayDate),
		net: money(stub.currentNetPay),
		fileName,
	});

	const text =
		`Hi ${name},\n\n` +
		`Your pay stub for pay period ${periodLabel(stub)} (${date(stub.payPeriodStartDate)} - ${date(
			stub.payPeriodEndDate,
		)}) is attached.\n\n` +
		`Pay date: ${date(stub.payPeriodPayDate)}\n` +
		`Net pay: ${money(stub.currentNetPay)}\n\n` +
		`${PAY_DATE_NOTE}\n\n` +
		`Your full earnings statement is attached (${fileName}).\n` +
		"Please download the attached PDF to view, save or print your pay stub, and keep it for your records.\n";

	const pdf = await buildPayStubPdf(stub, employee, company);
	const attachments = [
		// the statement, offered as a download (Content-Disposition: attachment)
		{
			filename: fileName,
			content: pdf,
			contentType: "application/pdf",
			contentDisposition: "attachment",
		},
		{
			filename: "BusinessN.png",
			path: FOOTER_LOGO,
			cid: "footerLogo",
			contentDisposition: "inline",
		},
	];
	return { subject, text, html, attachments };
};

/** Recipient and statement details for one employee in one company. */
const loadEmployee = async (empId, companyName) => {
	const [employee, profile, employment] = await Promise.all([
		Employee.findById(empId).select("fullName firstName email primaryAddress employeeNo").lean(),
		EmployeeProfileInfo.findOne({ empId: String(empId), companyName })
			.select("personalEmail businessEmail")
			.lean(),
		EmployeeEmploymentInfo.findOne({ empId: String(empId), companyName })
			.select("employeeNo")
			.lean(),
	]);
	if (!employee) return null;
	return {
		...employee,
		// Same address as the existing manual "send pay stub" (Employee.email, the
		// login e-mail), falling back to the e-mails on the payroll profile.
		email: employee.email || profile?.personalEmail || profile?.businessEmail || null,
		employeeNo: employment?.employeeNo || employee.employeeNo,
	};
};

const loadCompany = (name) =>
	Company.findOne({ name }).select("name registration_number address").lean();

const logKey = (stub) => ({
	companyName: stub.companyName,
	empId: String(stub.empId),
	payPeriodNum: String(stub.payPeriodNum),
	isExtraRun: Boolean(stub.isExtraRun),
	reportType: stub.reportType ?? null,
	payPeriodPayDate: normalisePayDate(stub.payPeriodPayDate),
});

/**
 * Atomically claims a stub for sending. Returns the log row, or null when it is
 * already SENT (and not forced) or being sent right now by another run.
 */
const claim = async (key, { force, triggeredBy }) => {
	const staleBefore = new Date(Date.now() - STALE_CLAIM_MINUTES * 60 * 1000);
	const claimable = force
		? { $or: [{ status: { $ne: "SENDING" } }, { claimedAt: { $lt: staleBefore } }] }
		: {
				$or: [{ status: "FAILED" }, { status: "SENDING", claimedAt: { $lt: staleBefore } }],
			};
	const update = {
		$set: { status: "SENDING", claimedAt: new Date(), triggeredBy },
		$inc: { attempts: 1 },
	};
	try {
		// existing row that may be (re)sent
		const row = await PayStubEmailLog.findOneAndUpdate({ ...key, ...claimable }, update, {
			new: true,
		});
		if (row) return row;
		// first send: insert; the unique index makes a concurrent insert fail
		return await PayStubEmailLog.create({
			...key,
			status: "SENDING",
			claimedAt: new Date(),
			attempts: 1,
			triggeredBy,
		});
	} catch (error) {
		if (error?.code === 11000) return null; // another run owns it, or it is already SENT
		throw error;
	}
};

/**
 * E-mails one processed stub. Returns "SENT" | "SKIPPED" | "FAILED".
 * Never throws for a single bad stub, so one failure cannot stop a batch.
 */
const emailPayStub = async (stub, { triggeredBy = "SCHEDULE", force = false } = {}) => {
	if (!isPayable(stub)) return "SKIPPED"; // net pay not above $0.00: never e-mailed
	const key = logKey(stub);
	const row = await claim(key, { force, triggeredBy });
	if (!row) return "SKIPPED";

	const finish = (fields) => PayStubEmailLog.updateOne({ _id: row._id }, { $set: fields });
	try {
		const [employee, company] = await Promise.all([
			loadEmployee(stub.empId, stub.companyName),
			loadCompany(stub.companyName),
		]);
		if (!employee?.email) {
			await finish({
				status: "FAILED",
				error: "Employee has no e-mail address",
				payStubId: stub._id,
			});
			return "FAILED";
		}
		const mail = await buildPayStubEmail(stub, employee, {
			company: company || {},
		});
		await sendEmail(employee.email, mail.subject, mail.text, mail.html, mail.attachments);
		await finish({
			status: "SENT",
			error: null,
			sentAt: new Date(),
			employeeEmail: employee.email,
			payStubId: stub._id,
		});
		return "SENT";
	} catch (error) {
		await finish({ status: "FAILED", error: String(error?.message || error).slice(0, 500) });
		return "FAILED";
	}
};

/** Processed stubs whose pay date falls on the given UTC day range. */
const findStubs = (filter) => EmployeePayStub.find({ isProcessed: true, ...filter }).lean();

/**
 * Pay dates due on `now` (Vancouver calendar day) and the CATCH_UP_DAYS before
 * it, as a UTC range: stub pay dates are stored at UTC start of day, older ones
 * may carry a time part, so the range covers whole UTC days.
 */
const dueWindow = (now = new Date()) => {
	const today = moment(now).tz(TIMEZONE).format("YYYY-MM-DD");
	const end = moment.utc(today).add(1, "day");
	const start = moment.utc(today).subtract(CATCH_UP_DAYS, "days");
	return { $gte: start.toDate(), $lt: end.toDate() };
};

const tally = async (stubs, options) => {
	const summary = { due: stubs.length, sent: 0, skipped: 0, failed: 0 };
	// sequential: keeps the SMTP provider within its rate limits
	for (const stub of stubs) {
		const result = await emailPayStub(stub, options);
		summary[result.toLowerCase()] += 1;
	}
	return summary;
};

/** The scheduled run: every stub due today (plus catch-up) that was not e-mailed yet. */
const sendDuePayStubs = async ({ now = new Date() } = {}) => {
	if (!isEnabled()) return { enabled: false, due: 0, sent: 0, skipped: 0, failed: 0 };
	const stubs = await findStubs({ payPeriodPayDate: dueWindow(now), ...PAYABLE });
	return { enabled: true, ...(await tally(stubs, { triggeredBy: "SCHEDULE" })) };
};

/**
 * The latest processed stub of one employee within the given companies, for
 * Send pay stub e-mail (userController.sendMailPaystub). null when there is none.
 */
const findLatestPayStub = async ({ empId, companyNames }) => {
	const [stub] = await findStubs({ empId: String(empId), companyName: { $in: companyNames } })
		.sort({ payPeriodPayDate: -1, _id: -1 })
		.limit(1);
	return stub || null;
};

module.exports = {
	buildPayStubEmail,
	emailPayStub,
	findLatestPayStub,
	isPayable,
	sendDuePayStubs,
	dueWindow,
	isEnabled,
	CATCH_UP_DAYS,
	TIMEZONE,
};
