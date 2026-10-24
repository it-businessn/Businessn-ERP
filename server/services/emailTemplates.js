const path = require("path");
const ejs = require("ejs");
const CONFIG = require("../config/app.config");
const { RESET_LINK_MINUTES } = require("./tokenService");
const emailService = require("./emailService");

/**
 * EMAIL-01: every e-mail the app sends, in one place and one layout
 * (views/emails/layout.ejs). Each builder returns { subject, text, html,
 * attachments }: the HTML and the plain-text part come from the same content,
 * every value is escaped by the template, and the BusinessN logo is attached
 * inline (cid:footerLogo).
 */

const LAYOUT = path.join(__dirname, "../views/emails/layout.ejs");
// assets/logos/BusinessN_dark1.png trimmed to the wordmark and resized for e-mail
const LOGO_PATH = path.join(__dirname, "../assets/paystub/email-logo.png");
const LOGO = { filename: "BusinessN.png", path: LOGO_PATH, cid: "footerLogo", contentDisposition: "inline" };

const BRAND = "BusinessN";
const AUTOMATED = `This is an automated message from ${BRAND}. Please do not reply to this e-mail.`;
const SIGN_OFF = ["Kind regards,", `The ${BRAND} Team`];

/** The app's sign-in page. */
const loginUrl = () => `${String(CONFIG.BASE_URL_LIVE || "").replace(/\/+$/, "")}/login`;

const clean = (v) => (v === null || v === undefined ? "" : String(v).trim());
const firstNameOf = (name) => clean(name).split(/\s+/)[0] || "";
const hello = (name) => (clean(name) ? `Hello ${clean(name)},` : "Hello,");

/** Plain-text part from the same content as the HTML. */
const toText = (c) =>
	[
		c.greeting,
		...(c.paragraphs || []),
		(c.details || []).map((d) => `${d.label}: ${d.value}`).join("\n"),
		c.button?.url ? `${c.button.label}: ${c.button.url}` : "",
		c.notice ? [c.notice.title, c.notice.text].filter(Boolean).join(" ") : "",
		(c.closing || []).join("\n"),
		"--",
		c.footer,
	]
		.filter(Boolean)
		.join("\n\n");

/** Render one e-mail. `content` follows views/emails/layout.ejs. */
const render = async (subject, content) => {
	const c = {
		preheader: "",
		eyebrow: "",
		greeting: "",
		paragraphs: [],
		details: [],
		button: null,
		linkNote: "",
		notice: null,
		closing: SIGN_OFF,
		footer: AUTOMATED,
		...content,
	};
	c.details = (c.details || []).filter((d) => clean(d.value));
	const html = await ejs.renderFile(LAYOUT, c);
	return { subject, text: toText(c), html, attachments: [LOGO] };
};

const ticketLink = () => ({
	label: "Sign in to view the ticket",
	url: loginUrl(),
});

/** New user: set the first password (POST /api/user/send-email). */
const setPasswordEmail = ({ firstName, link }) =>
	render(`Welcome to ${BRAND} - set your password`, {
		preheader: "Your account is ready. Set your password to sign in.",
		eyebrow: BRAND,
		title: "Set your password",
		greeting: hello(firstName),
		paragraphs: [
			`Your ${BRAND} account has been created. To sign in for the first time, please set your password using the button below.`,
			`For your security, this link expires in ${RESET_LINK_MINUTES} minutes and can be used once. If it has expired, choose "Forgot Password?" on the sign-in page to get a new one.`,
		],
		button: { label: "Set your password", url: link },
		linkNote: "If the button does not work, copy and paste this link into your browser:",
		notice: {
			title: "Didn't expect this e-mail?",
			text: "If you were not expecting an account, you can ignore this message or let your administrator know.",
		},
	});

/** Forgot password (POST /api/forgot-password). */
const resetPasswordEmail = ({ firstName, link }) =>
	render(`Reset your ${BRAND} password`, {
		preheader: "Use this link to choose a new password.",
		eyebrow: BRAND,
		title: "Reset your password",
		greeting: hello(firstName),
		paragraphs: [
			`We received a request to reset the password for your ${BRAND} account. To choose a new password, use the button below.`,
			`For your security, this link expires in ${RESET_LINK_MINUTES} minutes and can be used once.`,
		],
		button: { label: "Reset password", url: link },
		linkNote: "If the button does not work, copy and paste this link into your browser:",
		notice: {
			title: "Didn't request this?",
			text: "You can safely ignore this e-mail; your password will not change.",
		},
	});

/** Website enquiry acknowledgement (POST /api/contacts/followup). */
const contactFollowUpEmail = ({ firstName } = {}) =>
	render(`Thank you for contacting ${BRAND}`, {
		preheader: "We have received your enquiry.",
		eyebrow: BRAND,
		title: "Thank you for contacting us",
		greeting: hello(firstName),
		paragraphs: [
			`Thank you for your interest in ${BRAND}. We have received your enquiry, and a member of our team will contact you shortly to discuss your needs and answer any questions.`,
		],
	});

/** Weekly work schedule to an employee (POST /api/schedule/email). */
const weeklyScheduleEmail = ({ fullName, week, location, companyName, hasAttachment }) =>
	render(`Your work schedule for the week of ${clean(week)}`, {
		preheader: `Your schedule for the week of ${clean(week)}.`,
		eyebrow: [companyName, location].map(clean).filter(Boolean).join(" - ") || BRAND,
		title: "Your weekly schedule",
		greeting: hello(firstNameOf(fullName)),
		paragraphs: [
			hasAttachment
				? `Your work schedule for the week of ${clean(week)} is attached. Please review your shifts and keep the file for your reference.`
				: `Your work schedule for the week of ${clean(week)} has been published.`,
			"If you have any questions about your schedule, or need to request a change, please contact your manager.",
		],
		details: [
			{ label: "Week", value: week },
			{ label: "Location", value: location },
		],
		closing: ["Kind regards,", clean(companyName) || `The ${BRAND} Team`],
		footer: `This is an automated message from ${clean(companyName) || BRAND} scheduling. Please do not reply to this e-mail.`,
	});

/** Website contact form: new lead for the support administrator. */
const newLeadEmail = ({ assigneeName, ticketNumber, companyName, contactName, email, phone }) =>
	render(`New lead: ${clean(companyName) || "website enquiry"} (ticket ${clean(ticketNumber)})`, {
		preheader: `New lead from the website contact form: ${clean(companyName)}.`,
		eyebrow: "Sales",
		title: "New lead from the website",
		greeting: hello(firstNameOf(assigneeName)),
		paragraphs: [
			`A new lead was submitted through the website contact form and ticket ${clean(ticketNumber)} has been assigned to you.`,
		],
		details: [
			{ label: "Ticket", value: ticketNumber },
			{ label: "Company", value: companyName },
			{ label: "Contact", value: contactName },
			{ label: "E-mail", value: email },
			{ label: "Phone", value: phone },
		],
		button: ticketLink(),
		closing: [],
	});

/** Customer support form: new ticket for the support administrator. */
const newSupportTicketEmail = ({
	assigneeName,
	ticketNumber,
	companyName,
	clientName,
	email,
	phone,
	modeOfContact,
	inquiryType,
	issue,
}) =>
	render(`New support ticket ${clean(ticketNumber)}: ${clean(companyName)}`, {
		preheader: `${clean(companyName)} has logged a support request.`,
		eyebrow: "Customer Support",
		title: "New support ticket",
		greeting: hello(firstNameOf(assigneeName)),
		paragraphs: [`A customer has logged a support request and ticket ${clean(ticketNumber)} has been assigned to you.`],
		details: [
			{ label: "Ticket", value: ticketNumber },
			{ label: "Company", value: companyName },
			{ label: "Contact", value: clientName },
			{ label: "E-mail", value: email },
			{ label: "Phone", value: phone },
			{ label: "Preferred contact", value: modeOfContact },
			{ label: "Inquiry type", value: inquiryType },
			{ label: "Details", value: issue },
		],
		button: ticketLink(),
		closing: [],
	});

/** A ticket assigned to a team member (POST /api/tickets). */
const ticketAssignedEmail = ({ assigneeName, ticketNumber, topic, issue, originator, category, hasAttachment }) =>
	render(`Ticket ${clean(ticketNumber)} assigned to you${clean(topic) ? `: ${clean(topic)}` : ""}`, {
		preheader: `${clean(originator) || "A colleague"} assigned ticket ${clean(ticketNumber)} to you.`,
		eyebrow: clean(category) || "Tickets",
		title: "A ticket has been assigned to you",
		greeting: hello(firstNameOf(assigneeName)),
		paragraphs: [
			`Ticket ${clean(ticketNumber)} has been assigned to you${clean(originator) ? ` by ${clean(originator)}` : ""}.`,
			hasAttachment ? "A file is attached for your reference." : "",
		].filter(Boolean),
		details: [
			{ label: "Ticket", value: ticketNumber },
			{ label: "Topic", value: topic },
			{ label: "Description", value: issue },
			{ label: "Assigned by", value: originator },
			{ label: "Channel", value: category },
		],
		button: ticketLink(),
		closing: [],
	});

/** Build one of the e-mails above and send it. */
const sendTemplate = async (to, mail, extraAttachments = []) => {
	const { subject, text, html, attachments } = await mail;
	return emailService.sendEmail(to, subject, text, html, [...extraAttachments, ...attachments]);
};

module.exports = {
	sendTemplate,
	render,
	loginUrl,
	LOGO,
	BRAND,
	setPasswordEmail,
	resetPasswordEmail,
	contactFollowUpEmail,
	weeklyScheduleEmail,
	newLeadEmail,
	newSupportTicketEmail,
	ticketAssignedEmail,
};
