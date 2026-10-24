const mongoose = require("mongoose");
const { logIndexErrors } = require("../utils/db.util");

/**
 * PAYSTUB-EMAIL: one row per pay stub e-mail. The unique key is the pay stub's
 * own natural key (company, employee, period, extra run, report type) plus its
 * pay date, because pay-period numbers restart every year (PAYYEAR-01): period 7
 * of 2027 is a different e-mail from period 7 of 2026.
 *
 * The row is claimed atomically before sending (status SENDING), so hourly runs,
 * Send pay stub e-mail and several server instances do not send a stub twice
 * (a server stopping between the SMTP send and recording SENT can resend it).
 * FAILED rows are retried on the next run; `attempts` and `error` say why.
 */
const payStubEmailLogSchema = new mongoose.Schema(
	{
		companyName: { type: String, ref: "Company", required: true },
		empId: { type: String, ref: "Employee", required: true },
		payPeriodNum: { type: String, required: true },
		isExtraRun: { type: Boolean, default: false },
		reportType: { type: String, default: null },
		// stored at UTC start of day (utils/payYear.util.js normalisePayDate)
		payPeriodPayDate: { type: Date, required: true },
		payStubId: { type: mongoose.Schema.Types.ObjectId, ref: "EmployeePayStub" },
		employeeEmail: String,
		status: { type: String, enum: ["SENDING", "SENT", "FAILED"], required: true },
		error: String,
		attempts: { type: Number, default: 0 },
		claimedAt: Date,
		sentAt: Date,
		triggeredBy: { type: String, enum: ["SCHEDULE", "MANUAL"], default: "SCHEDULE" },
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

payStubEmailLogSchema.index(
	{ companyName: 1, empId: 1, payPeriodNum: 1, isExtraRun: 1, reportType: 1, payPeriodPayDate: 1 },
	{ unique: true, name: "uniq_paystub_email" },
);

module.exports = logIndexErrors(mongoose.model("PayStubEmailLog", payStubEmailLogSchema));
