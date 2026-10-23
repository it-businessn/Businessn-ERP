const cron = require("node-cron");
const { sendDuePayStubs, isEnabled, TIMEZONE } = require("../services/payStubEmailService");

/**
 * PAYSTUB-EMAIL: e-mails pay stubs on the pay date. Runs hourly 08:00-18:00
 * Vancouver time, so a payroll processed on the morning of the pay date still
 * goes out the same day; already-sent stubs are skipped (PayStubEmailLog).
 * Off unless PAYSTUB_EMAIL_ENABLED=true (see services/payStubEmailService.js).
 */
const runPayStubEmailJob = () => {
	if (!isEnabled()) {
		console.log("Pay stub e-mails are OFF (set PAYSTUB_EMAIL_ENABLED=true to send on pay dates)");
		return null;
	}
	console.log(`Pay stub e-mails ON: hourly 08:00-18:00 ${TIMEZONE}`);
	return cron.schedule(
		"0 8-18 * * *",
		async () => {
			try {
				const summary = await sendDuePayStubs();
				if (summary.due > 0) console.log("Pay stub e-mail run", summary);
			} catch (error) {
				console.error("Pay stub e-mail run failed:", error.message);
			}
		},
		{ timezone: TIMEZONE },
	);
};

module.exports = runPayStubEmailJob;
