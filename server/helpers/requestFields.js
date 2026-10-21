/**
 * NEW-12 / NEW-13: helpers for building Mongo filters and documents from an
 * explicit allow-list of request fields instead of passing `req.body` through.
 *
 * A "scalar" is what an HTML form field produces after JSON encoding: a string,
 * number, boolean or null. Objects and arrays are rejected because Mongo reads
 * `{ "$ne": null }`, `{ "$gt": "" }` etc. as query operators.
 */

const isScalar = (v) =>
	v === null ||
	v === undefined ||
	typeof v === "string" ||
	typeof v === "boolean" ||
	(typeof v === "number" && Number.isFinite(v));

/**
 * Copy the allow-listed fields that are present in `body`.
 * Returns { data, invalid } where `invalid` lists the allow-listed fields whose
 * value is not a scalar. Fields not on the list are ignored.
 */
const pickScalarFields = (body, fields) => {
	const data = {};
	const invalid = [];
	const src = body && typeof body === "object" ? body : {};
	for (const field of fields) {
		if (!Object.prototype.hasOwnProperty.call(src, field)) continue;
		const value = src[field];
		if (!isScalar(value)) invalid.push(field);
		else if (value !== undefined) data[field] = value;
	}
	return { data, invalid };
};

/** True when `key` could be read by Mongo as an operator or a dotted path. */
const isUnsafeKey = (key) =>
	typeof key !== "string" || key.startsWith("$") || key.includes(".") || key === "__proto__";

/**
 * NEW-12: a general-journal entry as sent by AccountingWorkview.jsx:
 * { transactionDate, description, companyName, entries: [{ accountName, debit, credit }] }.
 * Returns { data } or { error }.
 */
const JOURNAL_FIELDS = ["transactionDate", "description", "companyName"];
const MAX_JOURNAL_LINES = 500;

const pickJournalEntry = (body) => {
	const { data, invalid } = pickScalarFields(body, JOURNAL_FIELDS);
	if (invalid.length > 0) return { error: `Invalid value for: ${invalid.join(", ")}` };
	const entries = body?.entries;
	if (entries === undefined || entries === null) {
		if (entries === null) data.entries = null;
		return { data };
	}
	if (!Array.isArray(entries) || entries.length > MAX_JOURNAL_LINES) {
		return { error: "entries must be a list of journal lines" };
	}
	for (const line of entries) {
		if (!line || typeof line !== "object" || Array.isArray(line)) {
			return { error: "entries must be a list of journal lines" };
		}
		for (const [key, value] of Object.entries(line)) {
			if (isUnsafeKey(key) || !isScalar(value)) {
				return { error: "entries contain an invalid field" };
			}
		}
	}
	data.entries = entries;
	return { data };
};

module.exports = { isScalar, pickScalarFields, isUnsafeKey, pickJournalEntry };
