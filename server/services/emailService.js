const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text, html, fromEmail) => {
	try {
		const transporter = nodemailer.createTransport({
			host: process.env.NODEMAILER_ZOHO_SMTP,
			port: process.env.NODEMAILER_ZOHO_SMTP_PORT,
			secure: true,
			auth: {
				user: process.env.NODEMAILER_ZOHO_SMTP_SUPPORT_EMAIL_ADMIN,
				pass: process.env.NODEMAILER_ZOHO_SMTP_SUPPORT_PASSWORD_ADMIN,
			},
		});

		await transporter.sendMail({
			from: process.env.NODEMAILER_ZOHO_SMTP_SUPPORT_EMAIL_ADMIN,
			to: email,
			subject,
			text,
			html,
		});

		console.log("Email sent successfully");
	} catch (error) {
		console.log(error, "Email not sent");
	}
};

module.exports = { sendEmail };
