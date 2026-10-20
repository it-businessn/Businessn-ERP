const jwt = require("jwt-simple");
const moment = require("moment");
const CONFIG = require("../config/app.config");

const SECRET_KEY = CONFIG.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = CONFIG.REFRESH_TOKEN_SECRET;

// NOTE: Refresh token revocation requires a persistent store (Redis or DB).
// This is documented in PRODUCTION_READINESS.md as a required pre-launch step.
// For now tokens are validated by signature + expiry only.

function generateAccessToken(user) {
	const expiresIn = moment().add(2, "hours").unix();
	const payload = {
		...user,
		exp: expiresIn,
	};
	return jwt.encode(payload, SECRET_KEY);
}

function generateRefreshToken(user) {
	const expiresIn = moment().add(5, "hours").unix();
	const payload = {
		...user,
		exp: expiresIn,
	};
	return jwt.encode(payload, REFRESH_TOKEN_SECRET);
}

const verifyToken = (token, secret) => {
	try {
		const decoded = jwt.decode(token, secret);
		if (decoded.exp && decoded.exp < moment().unix()) {
			throw new Error("Token has expired");
		}
		return decoded;
	} catch (error) {
		console.error("Token verification failed:", error.message);
		throw new Error("Invalid or expired token");
	}
};

const authenticateToken = async (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
	if (!token) {
		return res.status(401).json({ message: "Access token is required", code: "TOKEN_MISSING" });
	}

	try {
		const user = verifyToken(token, SECRET_KEY);
		if (!user || !user.id) {
			return res.status(403).json({ message: "Invalid or expired token", code: "TOKEN_INVALID" });
		}
		req.user = user;
		next();
	} catch (err) {
		// `code` lets the client distinguish "refresh the token" from an
		// authorization failure (which also uses 403, see middleware/authorize.js).
		return res.status(403).json({ message: "Invalid or expired token", code: "TOKEN_INVALID" });
	}
};

const errorHandler = (err, req, res, next) => {
	console.error("❌ Unhandled Error:", {
		message: err.message,
		stack: err.stack,
		path: req.path,
		method: req.method,
	});

	if (res.headersSent) {
		return next(err);
	}

	// Body-parser errors carry their own status. Multer errors do NOT (REV-008):
	// map the size/count limits to 413 and other upload problems to 400.
	let statusCode = err.statusCode || err.status || 500;
	if (err.name === "MulterError") {
		statusCode = err.code === "LIMIT_FILE_SIZE" || err.code === "LIMIT_FILE_COUNT" ? 413 : 400;
	} else if (err.message === "Invalid file name") {
		statusCode = 400;
	}
	const message =
		statusCode >= 500 ? "Internal Server Error" : err.message || "Request could not be processed";

	return res.status(statusCode).json({ message });
};

module.exports = {
	authenticateToken,
	generateAccessToken,
	generateRefreshToken,
	verifyToken,
	errorHandler,
};
