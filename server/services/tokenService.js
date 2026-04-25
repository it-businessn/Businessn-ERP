const jwt = require("jwt-simple");
const moment = require("moment");
const CONFIG = require("../config/app.config");

const getResetPasswordLink = (user) => {
	try {
		if (!user || !user._id) {
			throw new Error("Invalid user object. User ID is required to generate reset link.");
		}

		// const expiresIn = moment().add(3, "days").unix();

		const expiresIn = moment().add(15, "minutes").unix();

		const payload = {
			...user,
			exp: expiresIn,
		};

		let token;
		try {
			token = jwt.encode(payload, CONFIG.ACCESS_TOKEN_SECRET);
		} catch (jwtError) {
			throw new Error(`Token generation failed: ${jwtError.message}`);
		}

		const resetLink = `${CONFIG.BASE_URL_LIVE}/api/reset-password/${user._id}/${token}`;

		return resetLink;
	} catch (error) {
		console.error("❌ Error generating reset password link:", {
			message: error.message,
			stack: error.stack,
		});

		throw new Error("Unable to generate reset password link. Please try again later.");
	}
};

module.exports = { getResetPasswordLink };
