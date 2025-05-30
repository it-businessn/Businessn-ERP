const jwt = require("jwt-simple");
const moment = require("moment");

const getResetPasswordLink = (user) => {
	try {
		const expiresIn = moment().add(3, "days").unix();
		const payload = {
			...user,
			exp: expiresIn,
		};
		const token = jwt.encode(payload, process.env.ACCESS_TOKEN_SECRET);
		return `${process.env.BASE_URL_LIVE}/api/reset-password/${user._id}/${token}`;
	} catch (error) {
		console.log(error);
		throw new Error("Password hashing failed");
	}
};

module.exports = { getResetPasswordLink };
