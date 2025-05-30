const jwt = require("jwt-simple");
const moment = require("moment");

const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const refreshTokens = [];

function generateAccessToken(user) {
	const expiresIn = moment().add(2, "hours").unix();
	const payload = {
		...user,
		exp: expiresIn,
	};
	const token = jwt.encode(payload, SECRET_KEY);
	return token;
}

function generateRefreshToken(user) {
	const expiresIn = moment().add(5, "hours").unix();
	const payload = {
		...user,
		exp: expiresIn,
	};
	const refreshToken = jwt.encode(payload, REFRESH_TOKEN_SECRET);
	refreshTokens.push(refreshToken);
	return refreshToken;
}

const verifyToken = (token, secret) => {
	try {
		const decoded = jwt.decode(token, secret);
		if (decoded.exp && decoded.exp < moment().unix()) {
			throw new Error("Token has expired");
		}
	} catch (error) {
		throw new Error("Invalid token");
	}
};

const authenticateToken = async (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
	if (!token) return res.status(401).json({ message: "Access token is required" });

	try {
		const user = verifyToken(token, SECRET_KEY);
		req.user = user;
		next();
	} catch (err) {
		return res.status(403).json({ message: "Invalid or expired token" });
	}
};

module.exports = { authenticateToken, generateAccessToken, generateRefreshToken, verifyToken };
