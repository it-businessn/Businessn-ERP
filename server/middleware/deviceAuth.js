const crypto = require("crypto");
const { authenticateToken } = require("./auth");

/**
 * AUD-013: time & attendance devices post punches to POST /api/timecard without
 * a user session. When TIMECARD_DEVICE_KEYS (comma-separated) is set, a device
 * must send one of those keys in the `x-device-key` header. The web UI calls the
 * same endpoint (Timesheet.jsx "refresh") with a user bearer token, which is
 * accepted instead of a key. When the variable is unset, device posts stay
 * unauthenticated (backward compatible) and a warning is logged once.
 */
const DEVICE_KEY_HEADER = "x-device-key";

const configuredDeviceKeys = () =>
	String(process.env.TIMECARD_DEVICE_KEYS || "")
		.split(",")
		.map((k) => k.trim())
		.filter(Boolean);

const digest = (value) => crypto.createHash("sha256").update(String(value)).digest();

// Constant time: equal-length digests, and every configured key is compared.
const deviceKeyMatches = (provided, keys) => {
	if (typeof provided !== "string" || !provided) return false;
	const p = digest(provided);
	let ok = false;
	for (const key of keys) {
		ok = crypto.timingSafeEqual(p, digest(key)) || ok;
	}
	return ok;
};

let unsetWarningLogged = false;
const warnIfDeviceKeysUnset = () => {
	if (unsetWarningLogged || configuredDeviceKeys().length) return;
	unsetWarningLogged = true;
	console.warn(
		"AUD-013: TIMECARD_DEVICE_KEYS is not set; POST /api/timecard accepts device punches without authentication.",
	);
};

const authenticateTimecardDevice = (req, res, next) => {
	const keys = configuredDeviceKeys(); // read per request so rotation needs no code change
	if (!keys.length) return next();

	const provided = req.headers[DEVICE_KEY_HEADER];
	if (provided !== undefined) {
		if (deviceKeyMatches(provided, keys)) {
			req.isTimecardDevice = true;
			return next();
		}
		return res.status(401).json({ message: "Invalid device key", code: "DEVICE_KEY_INVALID" });
	}
	if (req.headers.authorization) return authenticateToken(req, res, next);
	return res.status(401).json({ message: "Device key is required", code: "DEVICE_KEY_MISSING" });
};

module.exports = {
	authenticateTimecardDevice,
	warnIfDeviceKeysUnset,
	deviceKeyMatches,
	DEVICE_KEY_HEADER,
};
