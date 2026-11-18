#!/usr/bin/env node
/**
 * SCHEMA-CLEANUP: clears Employee fields that were removed from the schema
 * because nothing reads or writes them (see models/Employee.js
 * REMOVED_EMPLOYEE_FIELDS). Removing a field from a Mongoose schema does not
 * delete values already stored, so this script does.
 *
 * DRY RUN by default: prints how many employees have each field.
 *
 *   cd server
 *   node scripts/remove-unused-employee-fields.js            # dry run
 *   node scripts/remove-unused-employee-fields.js --apply    # $unset them
 *
 * Back up the database before --apply.
 */
if (process.env.NODE_ENV === "development") require("dotenv").config({ path: ".env.local" });
else require("dotenv").config();

const mongoose = require("mongoose");

const planCounts = async (collection, fields) => {
	const counts = {};
	for (const field of fields) {
		counts[field] = await collection.countDocuments({ [field]: { $exists: true } });
	}
	return counts;
};

const unsetAll = (fields) => ({ $unset: Object.fromEntries(fields.map((f) => [f, ""])) });

const main = async () => {
	const CONFIG = require("../config/app.config");
	const Employee = require("../models/Employee");
	const { REMOVED_EMPLOYEE_FIELDS } = Employee;
	const apply = process.argv.includes("--apply");

	await mongoose.connect(CONFIG.MONGO_URI);
	try {
		const collection = Employee.collection; // raw driver: fields outside the schema
		const counts = await planCounts(collection, REMOVED_EMPLOYEE_FIELDS);
		for (const [field, n] of Object.entries(counts)) console.log(`${field.padEnd(18)} ${n} employee(s)`);
		const any = Object.values(counts).some((n) => n > 0);
		if (!apply) {
			console.log(`\nDry run: nothing written.${any ? " Add --apply to clear these fields." : ""}`);
			return;
		}
		if (!any) {
			console.log("\nNothing to clear.");
			return;
		}
		const filter = { $or: REMOVED_EMPLOYEE_FIELDS.map((f) => ({ [f]: { $exists: true } })) };
		const result = await collection.updateMany(filter, unsetAll(REMOVED_EMPLOYEE_FIELDS));
		console.log(`\nCleared on ${result.modifiedCount} employee(s).`);
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

module.exports = { planCounts, unsetAll };
