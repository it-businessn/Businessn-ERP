const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

function generateAccessToken(user) {
	return jwt.sign(user, SECRET_KEY, { expiresIn: "15m" });
}

const refreshTokens = [];
function generateRefreshToken(user) {
	const refreshToken = jwt.sign(user, REFRESH_SECRET_KEY, { expiresIn: "1h" });
	refreshTokens.push(refreshToken);
	return refreshToken;
}

const authenticateToken = async (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
	if (!token) return res.status(401).json({ message: "Access token is required" });

	jwt.verify(token, SECRET_KEY, (err, user) => {
		if (err) return res.status(403).json({ message: "Invalid or expired token" });
		req.user = user;
		next();
	});
};

module.exports = { authenticateToken, generateAccessToken, generateRefreshToken };
