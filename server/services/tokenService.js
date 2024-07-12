const jwt = require("jsonwebtoken");

const getResetPasswordLink = (userID) => {
	try {
		const token = jwt.sign({ _id: userID }, process.env.JWT_SECRET_KEY, {
			expiresIn: "3d",
		});
		return `${process.env.BASE_URL_LIVE}/api/reset-password/${userID}/${token}`;
	} catch (error) {
		console.log(error);
		throw new Error("Password hashing failed");
	}
};

module.exports = { getResetPasswordLink };
