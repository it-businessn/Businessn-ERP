#!/usr/bin/env node
/**
 * Resolves the duplicates that block the unique indexes reported by
 * scripts/check-duplicates.js (only the ENFORCED keys: processed pay stubs and
 * funding totals). The informational "not enforced" groups are left alone.
 *
 * Rule: in each duplicate group the NEWEST document (by ObjectId creation time)
 * is kept. The pay run always updated the existing stub in place, so the
 * newest records are the ones that match the current stubs.
 *
 * DRY RUN by default: prints every group with its money fields so you can
 * compare the copies. Nothing is written.
 *
 *   node scripts/resolve-duplicates.js            # dry run
 *   node scripts/resolve-duplicates.js --apply    # back up, repoint, delete
 *
 * With --apply, for each removed document:
 *   1. a full copy is inserted into `<collection>_dedupe_backup` (with
 *      `_dedupe: { keptId, removedAt }`), so it can be restored;
 *   2. Order.fundingTotalsId references to a removed funding-totals record are
 *      repointed to the kept one (orders are the only stored reference);
 *   3. the document is deleted.
 * Then restart the server (or rerun check-duplicates) and the indexes build.
 *
 * Take a database backup first. Same .env / .env.local loading as index.js.
 */
const { CHECKS } = require("./check-duplicates");
const mongoose = require("mongoose");
const CONFIG = require("../config/app.config");

const APPLY_FLAG = process.argv.includes("--apply");

// Fields worth eyeballing before deciding which copy is right.
const SHOWN_FIELDS = {
	employeepaystubs: ["currentGrossPay", "currentNetPay", "currentDeductionsTotal", "payPeriodProcessingDate"],
	fundingtotalspays: ["totalNetPay", "totalFundingWithDrawals", "totalEmpPaymentRemitCost", "fundTransferStatus"],
};

const createdAt = (id) => id.getTimestamp().toISOString().replace(".000Z", "Z");

const duplicateGroups = async (db, check) => {
	const groupId = Object.fromEntries(check.keys.map((k) => [k, { $ifNull: [`$${k}`, null] }]));
	return db
		.collection(check.collection)
		.aggregate(
			[
				...(check.match ? [{ $match: check.match }] : []),
				{ $group: { _id: groupId, ids: { $push: "$_id" } } },
				{ $match: { "ids.1": { $exists: true } } },
			],
			{ allowDiskUse: true },
		)
		.toArray();
};

const resolveCheck = async (db, check, { apply = APPLY_FLAG, log = console.log } = {}) => {
	const col = db.collection(check.collection);
	const backup = db.collection(`${check.collection}_dedupe_backup`);
	const groups = await duplicateGroups(db, check);
	log(`\n${check.collection} [${check.index}]: ${groups.length} duplicate group(s)`);
	let removed = 0;
	for (const g of groups) {
		const docs = await col.find({ _id: { $in: g.ids } }).toArray();
		docs.sort((a, b) => b._id.getTimestamp() - a._id.getTimestamp()); // newest first
		const [keep, ...drop] = docs;
		log(`  ${JSON.stringify(g._id)}`);
		for (const d of docs) {
			const shown = (SHOWN_FIELDS[check.collection] || []).map((f) => `${f}=${JSON.stringify(d[f])}`);
			log(`    ${d === keep ? "KEEP  " : "REMOVE"} ${d._id} created ${createdAt(d._id)} ${shown.join(" ")}`);
		}
		if (!apply) continue;
		for (const d of drop) {
			await backup.insertOne({ ...d, _dedupe: { keptId: keep._id, removedAt: new Date() } });
			if (check.collection === "fundingtotalspays") {
				const r = await db
					.collection("orders")
					.updateMany({ fundingTotalsId: String(d._id) }, { $set: { fundingTotalsId: String(keep._id) } });
				if (r.modifiedCount) log(`      repointed ${r.modifiedCount} order(s) to ${keep._id}`);
			}
			await col.deleteOne({ _id: d._id });
			removed += 1;
		}
	}
	return { groups: groups.length, removed };
};

const main = async () => {
	await mongoose.connect(CONFIG.MONGO_URI, { autoIndex: false, autoCreate: false });
	const db = mongoose.connection.db;
	console.log(APPLY_FLAG ? "APPLY mode: backing up, repointing and deleting." : "DRY RUN: nothing is written (use --apply).");
	let totalRemoved = 0;
	for (const check of CHECKS.filter((c) => c.enforced)) {
		const { removed } = await resolveCheck(db, check, { apply: APPLY_FLAG });
		totalRemoved += removed;
	}
	console.log(
		APPLY_FLAG
			? `\nRemoved ${totalRemoved} document(s); copies are in the *_dedupe_backup collections. Restart the server to build the indexes.`
			: "\nReview the KEEP/REMOVE lines above, take a backup, then rerun with --apply.",
	);
};

module.exports = { resolveCheck, duplicateGroups };

if (require.main === module) {
	main()
		.catch((err) => {
			console.error("resolve-duplicates failed:", err.message);
			process.exitCode = 1;
		})
		.finally(() => mongoose.disconnect().catch(() => {}));
}
