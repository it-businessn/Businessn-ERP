/**
 * scripts/resolve-duplicates.js against an in-memory fake of the MongoDB
 * driver calls it uses (no MongoDB in CI). The fake really groups, finds,
 * inserts, updates and deletes, so the keep/backup/repoint/delete logic is
 * exercised end to end. Data shapes mirror a real check-duplicates report.
 */
const { Types } = require("mongoose");
const { CHECKS } = require("../scripts/check-duplicates");
const { resolveCheck } = require("../scripts/resolve-duplicates");

// ObjectId with a chosen creation time (the script keeps the newest).
const oid = (iso, n) =>
	new Types.ObjectId(Math.floor(Date.parse(iso) / 1000).toString(16).padStart(8, "0") + String(n).padStart(16, "0"));

const getPath = (doc, k) => (doc[k] === undefined ? null : doc[k]);
const matches = (doc, filter = {}) =>
	Object.entries(filter).every(([k, v]) => {
		if (k === "_id" && v?.$in) return v.$in.some((id) => String(id) === String(doc._id));
		if (k === "_id") return String(doc._id) === String(v);
		return getPath(doc, k) === v || (v instanceof Date && doc[k] instanceof Date && +v === +doc[k]);
	});

const fakeDb = (data) => {
	const collections = {};
	const collection = (name) => {
		collections[name] = collections[name] || (data[name] ? data[name].map((d) => ({ ...d })) : []);
		const docs = () => collections[name];
		return {
			aggregate: (pipeline) => ({
				toArray: async () => {
					const match = pipeline.find((s) => s.$match && !s.$match["ids.1"])?.$match;
					const keys = Object.keys(pipeline.find((s) => s.$group).$group._id);
					const groups = new Map();
					for (const d of docs().filter((x) => matches(x, match))) {
						const key = JSON.stringify(keys.map((k) => (d[k] instanceof Date ? d[k].toISOString() : getPath(d, k))));
						if (!groups.has(key)) groups.set(key, { _id: Object.fromEntries(keys.map((k) => [k, getPath(d, k)])), ids: [] });
						groups.get(key).ids.push(d._id);
					}
					return [...groups.values()].filter((g) => g.ids.length > 1);
				},
			}),
			find: (filter) => ({ toArray: async () => docs().filter((d) => matches(d, filter)).map((d) => ({ ...d })) }),
			insertOne: async (doc) => {
				docs().push({ ...doc });
				return { acknowledged: true };
			},
			updateMany: async (filter, update) => {
				let modifiedCount = 0;
				for (const d of docs()) if (matches(d, filter)) Object.assign(d, update.$set), (modifiedCount += 1);
				return { modifiedCount };
			},
			deleteOne: async (filter) => {
				const i = docs().findIndex((d) => matches(d, filter));
				if (i >= 0) docs().splice(i, 1);
				return { deletedCount: i >= 0 ? 1 : 0 };
			},
		};
	};
	return { collection, collections };
};

const PAY_DATE = new Date("2025-01-31T00:00:00.000Z");
const stubKey = { companyName: "BusinessN Corporate", payPeriodNum: "3", isExtraRun: false, scheduleFrequency: "Biweekly", reportType: null, payPeriodPayDate: PAY_DATE, isProcessed: true };
const fundKey = { companyName: "BusinessN Corporate", payPeriodNum: "3", isExtraRun: false, payPeriodPayDate: PAY_DATE, scheduleFrequency: "Biweekly" };

const seed = () => {
	const f = ["2025-05-09T20:31:00Z", "2025-05-10T01:30:00Z", "2025-05-10T01:32:00Z", "2025-05-10T01:33:00Z"].map((t, i) =>
		oid(t, i + 1),
	); // as in the real report; f[3] is the newest
	return {
		ids: { f },
		data: {
			employeepaystubs: [
				{ _id: oid("2025-05-09T20:31:00Z", 11), ...stubKey, empId: "A", currentNetPay: 100 },
				{ _id: oid("2025-05-10T01:48:00Z", 12), ...stubKey, empId: "A", currentNetPay: 110 },
				{ _id: oid("2025-05-09T20:31:00Z", 13), ...stubKey, empId: "B", currentNetPay: 200 },
				{ _id: oid("2025-05-10T01:48:00Z", 14), ...stubKey, empId: "B", currentNetPay: 210 },
				{ _id: oid("2025-05-10T01:48:00Z", 15), ...stubKey, empId: "C", currentNetPay: 300 }, // unique
				{ _id: oid("2025-05-10T01:48:00Z", 16), ...stubKey, empId: "C", isProcessed: false }, // not in the index
			],
			fundingtotalspays: [
				...f.map((_id, i) => ({ _id, ...fundKey, totalNetPay: 1000 + i })),
				{ _id: oid("2025-05-19T00:27:00Z", 21), ...fundKey, companyName: "Other Co", totalNetPay: 5 }, // unique
			],
			orders: [
				{ _id: oid("2025-05-10T02:00:00Z", 31), fundingTotalsId: String(f[1]) },
				{ _id: oid("2025-05-10T02:00:00Z", 32), fundingTotalsId: String(f[3]) },
				{ _id: oid("2025-05-19T02:00:00Z", 33), fundingTotalsId: "unrelated" },
			],
		},
	};
};

const check = (collection) => CHECKS.find((c) => c.enforced && c.collection === collection);
const quiet = { log: () => {} };

describe("scripts/resolve-duplicates.js", () => {
	test("T-DEDUP-01 dry run reports the groups and writes nothing", async () => {
		const { data } = seed();
		const db = fakeDb(data);
		const lines = [];
		const r = await resolveCheck(db, check("employeepaystubs"), { apply: false, log: (l) => lines.push(l) });
		expect(r).toEqual({ groups: 2, removed: 0 });
		expect(db.collections.employeepaystubs).toHaveLength(6);
		expect(db.collections.employeepaystubs_dedupe_backup || []).toHaveLength(0);
		expect(lines.join("\n")).toMatch(/KEEP/);
		expect(lines.join("\n")).toMatch(/REMOVE/);
	});

	test("T-DEDUP-02 apply keeps the newest stub per group, backs up the rest, leaves others alone", async () => {
		const { data } = seed();
		const db = fakeDb(data);
		const r = await resolveCheck(db, check("employeepaystubs"), { apply: true, ...quiet });
		expect(r).toEqual({ groups: 2, removed: 2 });
		const left = db.collections.employeepaystubs.map((d) => [d.empId, d.currentNetPay ?? "unprocessed"]);
		expect(left).toEqual(expect.arrayContaining([["A", 110], ["B", 210], ["C", 300], ["C", "unprocessed"]]));
		expect(left).toHaveLength(4);
		const backup = db.collections.employeepaystubs_dedupe_backup;
		expect(backup.map((d) => d.currentNetPay).sort()).toEqual([100, 200]);
		expect(backup.every((d) => d._dedupe?.keptId && d._dedupe.removedAt instanceof Date)).toBe(true);
	});

	test("T-DEDUP-03 funding totals: newest of 4 kept, orders repointed to it, unrelated orders untouched", async () => {
		const { data, ids } = seed();
		const db = fakeDb(data);
		const r = await resolveCheck(db, check("fundingtotalspays"), { apply: true, ...quiet });
		expect(r).toEqual({ groups: 1, removed: 3 });
		const kept = String(ids.f[3]);
		expect(db.collections.fundingtotalspays.map((d) => String(d._id))).toEqual(
			expect.arrayContaining([kept]),
		);
		expect(db.collections.fundingtotalspays).toHaveLength(2); // kept + "Other Co"
		expect(db.collections.orders.map((o) => o.fundingTotalsId)).toEqual([kept, kept, "unrelated"]);
		expect(db.collections.fundingtotalspays_dedupe_backup).toHaveLength(3);
	});

	test("T-DEDUP-04 running it twice is a no-op the second time", async () => {
		const { data } = seed();
		const db = fakeDb(data);
		await resolveCheck(db, check("fundingtotalspays"), { apply: true, ...quiet });
		const again = await resolveCheck(db, check("fundingtotalspays"), { apply: true, ...quiet });
		expect(again).toEqual({ groups: 0, removed: 0 });
	});

	test("T-DEDUP-05 only enforced keys are resolved (informational checks are never touched)", () => {
		const enforced = CHECKS.filter((c) => c.enforced).map((c) => c.collection);
		expect(enforced).toEqual(["employeepaystubs", "fundingtotalspays"]);
	});
});
