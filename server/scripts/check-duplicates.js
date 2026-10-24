#!/usr/bin/env node
/**
 * AUD-015: READ-ONLY report of documents that would violate the natural-key
 * unique indexes (and of duplicates on keys that are expected to be unique but
 * are not enforced yet).
 *
 * A unique index cannot be built while duplicates exist. Mongoose then logs
 * "Index build failed for <Model>" at startup and the app keeps running without
 * the constraint. Run this script, resolve the reported groups by hand, then
 * restart the server (or call Model.syncIndexes()) to build the index.
 *
 * Usage (from server/, same .env / .env.local loading as index.js):
 *   node scripts/check-duplicates.js [--limit 20]
 *
 * It only runs aggregate() queries: no model is compiled, so connecting does
 * not trigger index builds, and nothing is written.
 * Exit code: 0 = no duplicates on enforced keys, 2 = duplicates on an enforced
 * key, 1 = error.
 *
 * PAYYEAR-01: the processed pay-stub index is now uniq_processed_paystub_v2
 * (key + payPeriodPayDate). If the old yearless index was ever built it still
 * rejects a second year's stub for the same period: drop it once in mongosh with
 *   db.employeepaystubs.dropIndex("uniq_processed_paystub")
 */
if (process.env.NODE_ENV === "development") {
	require("dotenv").config({ path: ".env.local" });
} else {
	require("dotenv").config();
}

const mongoose = require("mongoose");
const CONFIG = require("../config/app.config");

const CHECKS = [
	// PAYYEAR-01: pay-period numbers restart every year, so the processed-stub key
	// includes the pay date (uniq_processed_paystub_v2 replaces the yearless index).
	{
		collection: "employeepaystubs",
		index: "uniq_processed_paystub_v2",
		enforced: true,
		keys: [
			"companyName",
			"empId",
			"payPeriodNum",
			"isExtraRun",
			"scheduleFrequency",
			"reportType",
			"payPeriodPayDate",
		],
		match: { isProcessed: true },
	},
	// The pay run updates the stub of the same period in the same pay-date YEAR
	// (older stubs may carry a time part in payPeriodPayDate). Several stubs per
	// (key, year) are not an index violation but only the newest is updated.
	{
		collection: "employeepaystubs",
		index: "(key, pay-date year) - not enforced",
		enforced: false,
		keys: ["companyName", "empId", "payPeriodNum", "isExtraRun", "scheduleFrequency", "reportType"],
		computed: { payYear: { $year: "$payPeriodPayDate" } },
		match: { isProcessed: true, payPeriodPayDate: { $type: "date" } },
	},
	{
		collection: "fundingtotalspays",
		index: "uniq_funding_totals_run",
		enforced: true,
		keys: ["companyName", "payPeriodNum", "isExtraRun", "payPeriodPayDate", "scheduleFrequency"],
	},
	// ALERTS-01: one alert per problem; older versions stored one per pay period.
	// Safe to resolve: alerts are recomputed on every inputs review.
	{
		collection: "employeealertsviolationinfos",
		index: "uniq_alert_per_problem",
		enforced: true,
		keys: ["companyName", "empId", "type"],
	},
	// STAT-HOLIDAYS: one holiday per name per company and year.
	{
		collection: "holidays",
		index: "uniq_holiday_per_year",
		enforced: true,
		keys: ["companyName", "year", "name"],
	},
	// One-per-employee records (docs/TECHNICAL.md risk U3). Not enforced: onboarding
	// creates them without an existence check, so the report is informational.
	...[
		"employeeprofileinfos",
		"employeeemploymentinfos",
		"employeepayinfos",
		"employeebankinginfos",
		"employeegovernmentinfos",
		"employeebalanceinfos",
	].map((collection) => ({
		collection,
		index: "(companyName, empId) - not enforced",
		enforced: false,
		keys: ["companyName", "empId"],
	})),
	{
		collection: "companies",
		index: "(name) - not enforced",
		enforced: false,
		keys: ["name"],
	},
];

// PAYYEAR-01: printed on every run (the old index is not dropped automatically).
const OLD_PAYSTUB_INDEX_NOTE =
	"\nIf the yearless pay-stub index uniq_processed_paystub exists, drop it (mongosh):\n" +
	'  db.employeepaystubs.dropIndex("uniq_processed_paystub")';

const parseLimit = () => {
	const i = process.argv.indexOf("--limit");
	const n = i >= 0 ? parseInt(process.argv[i + 1], 10) : 20;
	return Number.isFinite(n) && n > 0 ? n : 20;
};

const findDuplicates = async (db, check, limit) => {
	// Missing fields are grouped as null, matching how a unique index treats them.
	const groupId = Object.fromEntries(check.keys.map((k) => [k, { $ifNull: [`$${k}`, null] }]));
	Object.assign(groupId, check.computed || {}); // PAYYEAR-01: e.g. pay-date year
	const pipeline = [
		...(check.match ? [{ $match: check.match }] : []),
		{ $group: { _id: groupId, count: { $sum: 1 }, ids: { $push: "$_id" } } },
		{ $match: { count: { $gt: 1 } } },
		{ $sort: { count: -1 } },
		{
			$facet: {
				total: [{ $count: "groups" }],
				sample: [{ $limit: limit }, { $project: { count: 1, ids: { $slice: ["$ids", 10] } } }],
			},
		},
	];
	const [res] = await db
		.collection(check.collection)
		.aggregate(pipeline, { allowDiskUse: true })
		.toArray();
	return { groups: res?.total?.[0]?.groups || 0, sample: res?.sample || [] };
};

const main = async () => {
	const limit = parseLimit();
	await mongoose.connect(CONFIG.MONGO_URI, { autoIndex: false, autoCreate: false });
	const db = mongoose.connection.db;
	let enforcedDuplicates = 0;
	for (const check of CHECKS) {
		const { groups, sample } = await findDuplicates(db, check, limit);
		console.log(
			`\n${check.collection} [${check.index}] key (${[...check.keys, ...Object.keys(check.computed || {})].join(", ")})` +
				`${check.match ? ` where ${JSON.stringify(check.match)}` : ""}: ` +
				(groups ? `${groups} duplicate group(s)` : "no duplicates"),
		);
		for (const g of sample) {
			console.log(`  x${g.count} ${JSON.stringify(g._id)} ids=${g.ids.map(String).join(",")}`);
		}
		if (groups > sample.length) console.log(`  ... ${groups - sample.length} more group(s)`);
		if (check.enforced) enforcedDuplicates += groups;
	}
	console.log(
		enforcedDuplicates
			? `\n${enforcedDuplicates} duplicate group(s) block the unique indexes above.`
			: "\nNo duplicates block the unique indexes.",
	);
	console.log(OLD_PAYSTUB_INDEX_NOTE);
	return enforcedDuplicates ? 2 : 0;
};

// Shared with scripts/resolve-duplicates.js (which must use the same keys).
module.exports = { CHECKS };

if (require.main === module) {
	main()
		.then((code) => {
			process.exitCode = code;
		})
		.catch((err) => {
			console.error("check-duplicates failed:", err.message);
			process.exitCode = 1;
		})
		.finally(() => mongoose.disconnect().catch(() => {}));
}
