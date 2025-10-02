const path = require("path");

const Employee = require("../models/Employee");

const { sendEmail } = require("../services/emailService");
const { hashSyncPassword, hashPassword } = require("../services/passwordService");
const { getResetPasswordLink } = require("../services/tokenService");
const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");

const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await Employee.findOne({ email }).sort({
			createdOn: -1,
		});
		if (!user) {
			return res.status(404).json({
				message: "Please enter the email you used to register.",
			});
		}

		const resetLink = getResetPasswordLink({ _id: user._id });
		if (resetLink)
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
      <p style="margin: 5px 0">Hello ${user.firstName},</p>
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

		return res.status(200).json({
			message: "Please check your email inbox for a link to reset your password.",
		});
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const resetPassword = async (req, res) => {
	const { id } = req.params;
	try {
		const user = await Employee.findById(id);
		if (!user) {
			return res.status(404).json({ message: "User does not exist" });
		}
		res.render("index", {
			email: user.email,
			status: "Not verified",
		});
	} catch (error) {
		return res.status(500).json({ message: "User not verified!", error });
	}
};

const setNewPassword = async (req, res) => {
	const { id } = req.params;
	const { password } = req.body;

	const user = await Employee.findOne({ _id: id });
	if (!user) {
		return res.status(400).json({ message: "User Not Exist!" });
	}

	try {
		const hashedPassword = await hashPassword(password);
		await Employee.findByIdAndUpdate(
			{ _id: id },
			{
				$set: { password: hashedPassword },
			},
		);
		await EmployeeProfileInfo.updateMany({ empId: user._id }, { $set: { password } });
		return res.render("index", { email: user.email, status: "Verified" });
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const changePassword = async (req, res) => {
	const { newPassword } = req.body;
	const { id } = req.params;
	try {
		if (!newPassword) {
			throw new Error("New password is required");
		}
		const hashedPassword = await hashSyncPassword(newPassword);
		const result = await Employee.findByIdAndUpdate(
			id,
			{ $set: { password: hashedPassword } },
			{
				new: true,
			},
		);
		return res.status(201).json({
			message: "Password changed successfully",
			result,
		});
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

module.exports = {
	resetPassword,
	forgotPassword,
	setNewPassword,
	changePassword,
};
