const jwt = require("jwt-simple");
const moment = require("moment");
const CONFIG = require("../config/app.config");

/**
 * Reset tokens are signed with ACCESS_TOKEN_SECRET + the user's *current*
 * password hash (REV-003). Changing the password therefore invalidates every
 * outstanding link for that user without any server-side state, which makes a
 * reset link effectively single-use.
 */
/** How long a set / reset password link is valid (the e-mails say so). */
const RESET_LINK_MINUTES = 15;

const resetSecret = (passwordHash) => `${CONFIG.ACCESS_TOKEN_SECRET}:${passwordHash || ""}`;

const getResetPasswordLink = (user, passwordHash = "") => {
	try {
		if (!user || !user._id) {
			throw new Error("Invalid user object. User ID is required to generate reset link.");
		}

		// const expiresIn = moment().add(3, "days").unix();

		const expiresIn = moment().add(RESET_LINK_MINUTES, "minutes").unix();

		const payload = {
			...user,
			exp: expiresIn,
		};

		let token;
		try {
			token = jwt.encode({ _id: String(user._id), exp: payload.exp }, resetSecret(passwordHash));
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

/**
 * Verifies a password-reset token (signature + expiry). Throws on failure.
 */
const verifyResetPasswordToken = (token, passwordHash = "") => {
	if (!token || typeof token !== "string") {
		throw new Error("Reset token is required");
	}
	const decoded = jwt.decode(token, resetSecret(passwordHash));
	if (!decoded?.exp || decoded.exp < moment().unix()) {
		throw new Error("Reset token has expired");
	}
	return decoded;
};

module.exports = { RESET_LINK_MINUTES, getResetPasswordLink, verifyResetPasswordToken };
