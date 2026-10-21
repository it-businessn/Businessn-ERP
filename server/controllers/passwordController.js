const path = require("path");
const mongoose = require("mongoose");

const Employee = require("../models/Employee");
const { sendEmail } = require("../services/emailService");
// AUD-016: user-editable names are HTML-escaped in e-mail bodies.
const { escapeHtml } = require("../helpers/escapeHtml");
const { hashPassword, comparePassword } = require("../services/passwordService");
const { getResetPasswordLink, verifyResetPasswordToken } = require("../services/tokenService");
const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;
const FORGOT_PASSWORD_RESPONSE =
	"If an account exists for this e-mail, a reset link has been sent. Please check your inbox.";

const validatePassword = (password) => {
	if (typeof password !== "string") return "Password is required";
	if (password.trim().length === 0) return "Password cannot be blank";
	if (password.length < MIN_PASSWORD_LENGTH)
		return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
	if (password.length > MAX_PASSWORD_LENGTH)
		return `Password must be at most ${MAX_PASSWORD_LENGTH} characters`;
	return null;
};

/**
 * FIX (AUD-001): the reset link carries a signed, 15-minute token but neither
 * GET nor POST /reset-password/:id/:token ever verified it — the password of
 * ANY user could be overwritten by knowing/guessing their ObjectId.
 */
const verifyResetRequest = async (id, token) => {
	if (!mongoose.isValidObjectId(id)) return { ok: false, reason: "Invalid reset link" };
	const user = await Employee.findById(id).select("email password");
	if (!user) return { ok: false, reason: "Invalid reset link" };
	try {
		const decoded = verifyResetPasswordToken(token, user.password);
		if (!decoded || String(decoded._id) !== String(id)) {
			return { ok: false, reason: "Invalid reset link" };
		}
		return { ok: true, user };
	} catch (error) {
		return { ok: false, reason: "This reset link is invalid or has expired" };
	}
};

const forgotPassword = async (req, res) => {
	const { email } = req.body;
	// BUG-04: reject operator objects ({ "$ne": null }) that would match any user.
	if (!email || typeof email !== "string") {
		return res.status(400).json({ message: "Email is required" });
	}
	try {
		const user = await Employee.findOne({ email });

		// FIX: Always return same response to prevent user enumeration
		if (!user) {
			return res.status(200).json({ message: FORGOT_PASSWORD_RESPONSE });
		}

		const resetLink = getResetPasswordLink({ _id: user._id }, user.password);
		if (!resetLink) {
			return res.status(500).json({ message: "Failed to generate reset link" });
		}

		await sendEmail(
			user.email,
			"Reset Password for Businessᴺ",
			resetLink,
			`<body style="margin: 0; font-family: Arial, Helvetica, sans-serif;height:'auto">
		<div
			class="header"
			style="
				background-color: #371f37;
				color: white;
				text-align: center;
				height: 150px;
				display: flex;
				align-items: center;
			"
		>
			<div
				id="header_content"
				style="
					display: flex;
					flex-direction: column;
					align-items: self-start;
					background: #4c364b;
					border-radius: 10px;
					gap: 1em;
					width: 80%;
					margin: 0 auto;
					padding: 1.5em;
				"
			>
				<p
					class="topic"
					style="font-weight: bold; font-size: larger; margin: 5px 0"
				>
				Reset Password
				</p>
			</div>
		</div><div
			class="container"
			style="
				background: #fdfdfd;
				color: #371f37;
				display: flex;
				flex-direction: column;
				align-items: self-start;
				padding: 2em 3em;
				gap: 1em;
				font-size: 14px;
			"
		>
      <p style="margin: 5px 0">Hello ${escapeHtml(user.firstName)},</p>
      <p>You requested a password reset.</p>
	  <p>If you would still like to reset your password, please click the following link. </p>
      <p><a href="${resetLink}" target="_blank">Reset Password</a></p>
      <p>If you did not request this, you can safely ignore this email.</p>
      <p>Kind Regards,</p>
	   <p>Administrator
	  <br>Businessᴺ</p>
   </div>
		<div
			class="footer"
			style="
				background-color: #371f37;
				color: white;
				text-align: center;
				height: 150px;
				display: flex;
				align-items: center;
			"
		>
      <img src="cid:footerLogo" 
			style="margin: 0 auto;width:300px" alt="Footer Logo"/>
		</div>
	</body> `,
			[
				{
					filename: "BusinessN_dark1.png",
					path: path.join(__dirname, "../", "assets/logos/BusinessN_dark1.png"),
					cid: "footerLogo",
				},
			],
		);

		// API-12: the success message used to differ from the "unknown e-mail"
		// one, which revealed whether an address has an account.
		return res.status(200).json({ message: FORGOT_PASSWORD_RESPONSE });
	} catch (error) {
		console.error("Reset Password Link error:", {
			message: error.message,
			stack: error.stack,
		});
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

const resetPassword = async (req, res) => {
	const { id, token } = req.params;
	try {
		const check = await verifyResetRequest(id, token);
		if (!check.ok) {
			return res.status(400).render("index", { email: "", status: "Expired", message: check.reason });
		}
		const { user } = check;
		return res.render("index", {
			email: user.email,
			status: "Not verified",
			message: "",
		});
	} catch (error) {
		console.error("User verification error:", {
			message: error.message,
			stack: error.stack,
		});
		return res.status(500).json({ message: "User not verified!" });
	}
};

const setNewPassword = async (req, res) => {
	const { id, token } = req.params;
	const { password } = req.body;

	try {
		const check = await verifyResetRequest(id, token);
		if (!check.ok) {
			return res.status(400).json({ message: check.reason, code: "RESET_TOKEN_INVALID" });
		}
		const { user } = check;
		const passwordError = validatePassword(password);
		if (passwordError) {
			// The reset form is a classic HTML form post: re-render with the error.
			if (req.accepts(["json", "html"]) === "html") {
				return res
					.status(400)
					.render("index", { email: user.email, status: "Not verified", message: passwordError });
			}
			return res.status(400).json({ message: passwordError });
		}
		const hashedPassword = await hashPassword(password);

		// FIX: Store HASHED password in Employee record.
		// FIX: Do NOT store plaintext or hashed password in EmployeeProfileInfo —
		//      EmployeeProfileInfo.password was a legacy plaintext field used for
		//      comparison in the old login flow. It is no longer used for auth.
		await Employee.findByIdAndUpdate(id, {
			$set: { password: hashedPassword },
		});

		// Remove stale plaintext password from EmployeeProfileInfo for security.
		// We unset it rather than storing the new value there.
		await EmployeeProfileInfo.updateMany({ empId: user._id }, { $unset: { password: "" } });

		return res.render("index", { email: user.email, status: "Verified", message: "" });
	} catch (error) {
		console.error("Set password error:", {
			message: error.message,
			stack: error.stack,
		});
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

/**
 * FIX (AUD-002): route is now authenticated + self-only (see appRoutes) and the
 * current password is verified before it is replaced. Previously anyone could
 * PUT /api/change-password/:id with a new password for any user.
 */
const changePassword = async (req, res) => {
	const { currentPassword, newPassword, confirmPassword } = req.body || {};
	const { id } = req.params;
	try {
		if (!mongoose.isValidObjectId(id)) {
			return res.status(400).json({ message: "Invalid user id" });
		}
		const passwordError = validatePassword(newPassword);
		if (passwordError) {
			return res.status(400).json({ message: `New password: ${passwordError.toLowerCase()}` });
		}
		if (confirmPassword !== undefined && confirmPassword !== newPassword) {
			return res.status(400).json({ message: "Passwords do not match" });
		}
		if (typeof currentPassword !== "string" || !currentPassword) {
			return res.status(400).json({ message: "Current password is required" });
		}

		const user = await Employee.findById(id).select("password");
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		const matches = user.password ? await comparePassword(currentPassword, user.password) : false;
		if (!matches) {
			return res.status(401).json({ message: "Current password is incorrect" });
		}
		if (currentPassword === newPassword) {
			return res.status(400).json({ message: "New password must differ from the current password" });
		}

		// FIX: Use async hashPassword consistently (not hashSyncPassword which blocks event loop)
		const hashedPassword = await hashPassword(newPassword);
		const result = await Employee.findByIdAndUpdate(
			id,
			{ $set: { password: hashedPassword } },
			{ new: true },
		);
		if (!result) {
			return res.status(404).json({ message: "User not found" });
		}
		return res.status(200).json({
			message: "Password changed successfully",
		});
	} catch (error) {
		console.error("Change password error:", {
			message: error.message,
			stack: error.stack,
		});
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

module.exports = {
	resetPassword,
	forgotPassword,
	setNewPassword,
	changePassword,
};
