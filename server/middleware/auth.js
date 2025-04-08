const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

function generateAccessToken(user) {
	return jwt.sign(user, SECRET_KEY, { expiresIn: "2h" });
}

const refreshTokens = [];
function generateRefreshToken(user) {
	const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: "5h" });
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
