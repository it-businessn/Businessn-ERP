const cron = require("node-cron");
const moment = require("moment");
const { getAllCompanies } = require("../controllers/companyController");
const { getHolidays, addStatHolidayTimesheet } = require("../controllers/statHolidayController");

const runStatHolidayJob = () => {
	cron.schedule("0 0 * * *", async () => {
		try {
			// every 15sec
			// cron.schedule("*/15 * * * * *", async () => {
			const allCompanies = await getAllCompanies();

			await Promise.all(
				(allCompanies || []).map(async (company) => {
					const statHolidays = await getHolidays({ companyName: company.name });
					if (!statHolidays?.length) return;

					const today = moment().format("YYYY-MM-DD");

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
		} catch (error) {
			console.error("❌ Cron job failed:", error.message);
		}
	});
};

module.exports = runStatHolidayJob;
