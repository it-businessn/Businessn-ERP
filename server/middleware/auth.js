const bcrypt = require("bcrypt");

const User = require("../models/User");

const authenticate = async (req, res, next) => {
	const { userId } = req.params;
	const { currentPassword } = req.body;
	const user = await User.find({ _id: userId });

	if (!user || !bcrypt.compareSync(currentPassword, user[0].password)) {
		return res.status(401).json({ error: "Invalid credentials" });
	}
	// if (!user || currentPassword !== user[0].password) {
	//   return res.status(401).json({ error: "Invalid credentials" });
	// }
	req.user = user;
	next();
};

module.exports = { authenticate };
