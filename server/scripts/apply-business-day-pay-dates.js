#!/usr/bin/env node
/**
 * PAYCAL-01: moves the submit-by and pay dates of pay periods that are already
 * in the database to the business-day rule (utils/payCalendar.util.js).
 * New years and new pay groups get the rule automatically; existing years keep
 * their stored dates until this script is run.
 *
 * SAFE FOR VOPAY: the payroll submit finds a run's funding totals by the
 * period's stored pay date. A period is therefore only changed when ALL hold:
 *  - its stored and its new pay date are both in the future,
 *  - it is not marked processed in the schedule,
 *  - no funding totals and no pay stubs exist for that company + period
 *    number in that pay year (any frequency, regular or extra run).
 * Everything else is left exactly as stored.
 *
 * DRY RUN by default: prints what would change, writes nothing.
 *
 *   cd server
 *   node scripts/apply-business-day-pay-dates.js                     # dry run
 *   node scripts/apply-business-day-pay-dates.js --company "X" --year 2027
 *   node scripts/apply-business-day-pay-dates.js --apply              # write
 */
const { payPeriodDates } = require("../utils/payCalendar.util");
const { payYearWindow } = require("../utils/payYear.util");

const parseArgs = (argv) => {
	const args = { year: new Date().getUTCFullYear() };
	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		if (a === "--apply") args.apply = true;
		else if (["--company", "--year"].includes(a)) args[a.slice(2)] = argv[++i];
	}
	args.year = Number(args.year);
	return args;
};

const day = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "-");
const sameDay = (a, b) => day(a) === day(b);

/**
 * Plans the changes for one group's year. `hasPayroll(companyName, periodNum)`
 * answers whether funding totals or pay stubs exist. Pure apart from that.
 */
const planGroup = async (group, year, hasPayroll, now = new Date()) => {
	const schedule = (group.yearSchedules || []).find((rec) => Number(rec?.year) === year);
	if (!schedule?.payPeriods?.length) return { changes: [], skipped: [], payPeriods: null };
	const changes = [];
	const skipped = [];
	const payPeriods = [];
	for (const period of schedule.payPeriods) {
		payPeriods.push(period);
		if (!period?.payPeriodEndDate || !period?.payPeriodPayDate) continue;
		const { processingDate, payDate } = payPeriodDates(new Date(period.payPeriodEndDate));
		if (sameDay(processingDate, period.payPeriodProcessingDate) && sameDay(payDate, period.payPeriodPayDate)) continue;
		const label = `#${period.payPeriod}`;
		let reason = null;
		if (new Date(period.payPeriodPayDate) <= now || payDate <= now) reason = "pay date passed";
		else if (period.isProcessed) reason = "processed";
		else if (await hasPayroll(group.companyName, period.payPeriod)) reason = "payroll already set up";
		if (reason) {
			skipped.push({ period: label, reason });
			continue;
		}
		changes.push({
			period: label,
			from: `${day(period.payPeriodProcessingDate)} / ${day(period.payPeriodPayDate)}`,
			to: `${day(processingDate)} / ${day(payDate)}`,
		});
		payPeriods[payPeriods.length - 1] = {
			...period,
			payPeriodProcessingDate: processingDate,
			payPeriodPayDate: payDate,
		};
	}
	return { changes, skipped, payPeriods };
};

const main = async () => {
	if (process.env.NODE_ENV === "development") require("dotenv").config({ path: ".env.local" });
	else require("dotenv").config();
	const mongoose = require("mongoose");
	const CONFIG = require("../config/app.config");
	const Group = require("../models/Group");
	const FundingTotalsPay = require("../models/FundingTotalsPay");
	const EmployeePayStub = require("../models/EmployeePayStub");

	const args = parseArgs(process.argv.slice(2));
	if (!Number.isInteger(args.year)) throw new Error("--year must be a year");
	await mongoose.connect(CONFIG.MONGO_URI);
	try {
		const window = payYearWindow(args.year);
		const hasPayroll = async (companyName, periodNum) => {
			const filter = { companyName, payPeriodNum: String(periodNum), payPeriodPayDate: window };
			return Boolean(
				(await FundingTotalsPay.exists(filter)) || (await EmployeePayStub.exists(filter)),
			);
		};
		const groupFilter = args.company ? { companyName: args.company } : {};
		const groups = await Group.find(groupFilter).select("name companyName yearSchedules");
		let total = 0;
		for (const group of groups) {
			const { changes, skipped, payPeriods } = await planGroup(group, args.year, hasPayroll);
			if (!changes.length && !skipped.length) continue;
			console.log(`\n${group.companyName} / ${group.name} (${args.year})  submit by / pay date`);
			changes.forEach((c) => console.log(`  ${c.period}: ${c.from}  ->  ${c.to}`));
			skipped.forEach((s) => console.log(`  ${s.period}: kept (${s.reason})`));
			total += changes.length;
			if (args.apply && changes.length) {
				await Group.updateOne(
					{ _id: group._id, "yearSchedules.year": args.year },
					{ $set: { "yearSchedules.$.payPeriods": payPeriods } },
				);
			}
		}
		console.log(
			`\n${total} period(s) ${args.apply ? "updated" : "would change (dry run, nothing written; add --apply)"}`,
		);
	} finally {
		await mongoose.disconnect();
	}
};

if (require.main === module) {
	main().catch((err) => {
		console.error(err.message);
		process.exitCode = 1;
	});
}

module.exports = { parseArgs, planGroup };
