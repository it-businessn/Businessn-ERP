const jwt = require("jsonwebtoken");

const authenticateToken = async (req, res, next) => {
	const token = req.cookies.token;
	if (!token) return res.status(401).json({ message: "Authentication required" });
	const JWT_SECRET = process.env.JWT_SECRET_KEY;

	jwt.verify(token, JWT_SECRET, (err, user) => {
		if (err) return res.status(403).json({ message: "Invalid or expired token" });
		req.user = user;
		next();
	});
};

module.exports = { authenticateToken };
