const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
	try {
		const transporter = nodemailer.createTransport({
			host: process.env.NODEMAILER_ZOHO_SMTP,
			port: process.env.NODEMAILER_ZOHO_SMTP_PORT,
			secure: true,
			auth: {
				user: process.env.NODEMAILER_ZOHO_SMTP_USER_EMAIL,
				pass: process.env.NODEMAILER_ZOHO_SMTP_PASSWORD,
			},
		});

		await transporter.sendMail({
			from: process.env.NODEMAILER_ZOHO_SMTP_USER_EMAIL,
			to: email,
			subject,
			text,
		});

		console.log("Email sent successfully");
	} catch (error) {
		console.log(error, "Email not sent");
	}
};

module.exports = { sendEmail };
