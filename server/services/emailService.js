const nodemailer = require("nodemailer");
const requireEnv = require("../helpers/requireEnv");

const sendEmail = async (email, subject, text, html, attachments) => {
	try {
		const SMTP_HOST = requireEnv("NODEMAILER_ZOHO_SMTP");
		const SMTP_PORT = Number(requireEnv("NODEMAILER_ZOHO_SMTP_PORT"));

		const SMTP_USER = requireEnv("NODEMAILER_ZOHO_SMTP_SUPPORT_EMAIL_ADMIN");
		const SMTP_PASS = requireEnv("NODEMAILER_ZOHO_SMTP_SUPPORT_PASSWORD_ADMIN");

		const transporter = nodemailer.createTransport({
			host: SMTP_HOST,
			port: SMTP_PORT,
			secure: true,
			auth: {
				user: SMTP_USER,
				pass: SMTP_PASS,
			},
		});

		await transporter.sendMail({
			from: SMTP_USER,
			to: email,
			subject,
			text,
			html,
			attachments,
		});

		console.log("Email sent successfully");
	} catch (error) {
		console.error("Email send failed:", error.message);
		throw new Error("Failed to send email. Please try again later.");
	}
};

module.exports = { sendEmail };
