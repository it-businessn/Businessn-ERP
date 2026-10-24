const cron = require("node-cron");
const moment = require("moment-timezone");
const { getAllCompanies } = require("../controllers/companyController");
const {
	getHolidays,
	addStatHolidayTimesheet,
	ensureStatHolidays,
} = require("../controllers/statHolidayController");

const TIMEZONE = "America/Vancouver";
const { getRatesStatus } = require("../utils/ratesReadiness.util");

// RATES-READINESS: from November 1, remind every day (server log) while next
// year's payroll tables are not complete; run `npm run check:rates` for details.
const warnIfRatesDue = () => {
	const status = getRatesStatus(new Date());
	if (!status.attention && !status.overdue) return;
	const gaps = [...status.thisYearGaps, ...status.nextYearGaps];
	console.warn(
		`PAYROLL RATES ${status.overdue ? "OVERDUE" : "DUE"}: ` +
			gaps.map((g) => `${g.year} ${g.key} ${g.status}`).join(", ") +
			" - update server/constants/taxTables.constants.js (npm run check:rates)",
	);
};

const runStatHolidayJob = () => {
	cron.schedule(
		"0 0 * * *",
		async () => {
			try {
				warnIfRatesDue();
				// every 15sec
				// cron.schedule("*/15 * * * * *", async () => {
				const allCompanies = await getAllCompanies();

				await Promise.all(
					(allCompanies || []).map(async (company) => {
						// STAT-HOLIDAYS: this year's (and, in December, next year's) BC
						// holidays are filled in if the company has none yet
						const now = moment().tz(TIMEZONE);
						await ensureStatHolidays(company.name, now.year());
						if (now.month() === 11) await ensureStatHolidays(company.name, now.year() + 1);

						const statHolidays = await getHolidays({ companyName: company.name });
						if (!statHolidays?.length) return;

						const today = now.format("YYYY-MM-DD");
						const isStatDay = statHolidays.find(
							({ date }) => moment.utc(date).format("YYYY-MM-DD") === today,
						);

						if (isStatDay) {
							console.log(
								`📅 Adding timecard for ${company.name} (holiday: ${isStatDay.name || today})`,
							);

							await addStatHolidayTimesheet(company.name);
						}
					}),
				);
				const now = new Date();

				var time = `Local: ${now.toLocaleString()} | UTC: ${now.toISOString()}`;
				console.log(`runStatHolidayJob job ran | ${time}`);
			} catch (error) {
				console.error("❌ Cron job failed:", error.message);
			}
		},
		{
			timezone: TIMEZONE,
		},
	);
};

module.exports = runStatHolidayJob;
