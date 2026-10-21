const mongoose = require("mongoose");

/**
 * AUD-015: helpers for multi-document writes and index declarations.
 */

// Errors MongoDB returns when the server cannot run transactions (standalone
// mongod): code 20 / IllegalOperation, "Transaction numbers are only allowed on
// a replica set member or mongos".
const isTransactionUnsupportedError = (err) =>
	!!err &&
	(err.code === 20 ||
		err.codeName === "IllegalOperation" ||
		/Transaction numbers are only allowed on a replica set|replica set member or mongos|does not support (retryable writes|transactions|sessions)/i.test(
			String(err.message || ""),
		));

const transactionsEnabled = () =>
	String(process.env.PAYRUN_TRANSACTIONS || "on").trim().toLowerCase() !== "off";

let fallbackLogged = false;
const logFallbackOnce = (label, err) => {
	if (fallbackLogged) return;
	fallbackLogged = true;
	console.warn(
		`AUD-015: MongoDB transactions are not available (${err?.codeName || err?.code || "unknown"}: ${
			err?.message
		}); ${label} writes run without a transaction. Use a replica set or set PAYRUN_TRANSACTIONS=off.`,
	);
};

/**
 * Runs `work(session)` inside a MongoDB transaction and returns its result.
 * `work` must be safe to re-run (withTransaction retries transient errors; the
 * fallback re-runs it without a session). Falls back to `work(null)` when:
 *   - PAYRUN_TRANSACTIONS=off,
 *   - mongoose is not connected (writes would only buffer; tests never connect),
 *   - the server does not support transactions (logged once).
 * Any other error propagates.
 */
const runInTransaction = async (work, { label = "pay run", connection = mongoose.connection } = {}) => {
	if (!transactionsEnabled() || connection?.readyState !== 1) return work(null);

	let session;
	try {
		session = await connection.startSession();
	} catch (err) {
		if (!isTransactionUnsupportedError(err)) throw err;
		logFallbackOnce(label, err);
		return work(null);
	}

	try {
		let result;
		await session.withTransaction(async () => {
			result = await work(session);
		});
		return result;
	} catch (err) {
		if (!isTransactionUnsupportedError(err)) throw err;
		// The very first transactional write is rejected before anything is
		// written, so re-running the idempotent work without a session is safe.
		logFallbackOnce(label, err);
		return work(null);
	} finally {
		try {
			await session.endSession();
		} catch (e) {
			// ignore: the session is discarded either way
		}
	}
};

/**
 * Mongoose builds indexes in the background and only emits an `index` event
 * when a build fails (e.g. a new unique index over existing duplicates); the
 * app keeps running. Log the failure so operators notice it, and point at the
 * read-only duplicate report.
 */
const logIndexErrors = (model) => {
	model.on("index", (err) => {
		if (!err) return;
		console.error(`Index build failed for ${model.modelName}:`, {
			message: err.message,
			code: err.code,
			hint: "run `node scripts/check-duplicates.js` to list duplicate groups",
		});
	});
	return model;
};

module.exports = { runInTransaction, isTransactionUnsupportedError, logIndexErrors };
