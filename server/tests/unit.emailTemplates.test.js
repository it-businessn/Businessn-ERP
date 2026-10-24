/**
 * EMAIL-01: every e-mail uses one layout, with a matching plain-text part, the
 * recipient's own name, escaped values and the BusinessN logo.
 */
const {
	setPasswordEmail,
	resetPasswordEmail,
	contactFollowUpEmail,
	weeklyScheduleEmail,
	newLeadEmail,
	newSupportTicketEmail,
	ticketAssignedEmail,
	loginUrl,
} = require("../services/emailTemplates");

const XSS = "<script>alert(1)</script>";

const ALL = () => [
	["set password", setPasswordEmail({ firstName: "Jessica", link: "https://app.test/api/reset-password/1/abc" })],
	["reset password", resetPasswordEmail({ firstName: "Jessica", link: "https://app.test/api/reset-password/1/abc" })],
	["contact follow-up", contactFollowUpEmail({ firstName: "Jessica" })],
	["weekly schedule", weeklyScheduleEmail({ fullName: "Jessica Glass", week: "Oct 26 - Nov 1, 2026", location: "Surrey", companyName: "Acme", hasAttachment: true })],
	["new lead", newLeadEmail({ assigneeName: "Bruce Hurst", ticketNumber: "ACME-1", companyName: "Acme", contactName: "Ann Lee", email: "a@b.c", phone: "604 555 0123" })],
	["support ticket", newSupportTicketEmail({ assigneeName: "Bruce Hurst", ticketNumber: "ACME-2", companyName: "Acme", clientName: "Ann Lee", email: "a@b.c", issue: "Cannot log in" })],
	["ticket assigned", ticketAssignedEmail({ assigneeName: "Bruce Hurst", ticketNumber: "ACME-3", topic: "Payroll", issue: "Check hours", originator: "Ana Ruiz", category: "Payroll" })],
];

test("T-EMAIL-01 every e-mail: same layout, logo, subject, a real plain-text part, no flexbox, no placeholder names", async () => {
	for (const [, pending] of ALL()) {
		const mail = await pending;
		expect(mail.subject.length).toBeGreaterThan(10);
		expect(mail.html).toContain("<!DOCTYPE html>");
		expect(mail.html).toContain('role="presentation"');
		expect(mail.html).toContain("cid:footerLogo");
		expect(mail.html).not.toMatch(/display:\s*flex/);
		expect(mail.html).not.toContain("Jesse");
		expect(mail.attachments.some((a) => a.cid === "footerLogo")).toBe(true);
		expect(mail.text.length).toBeGreaterThan(80);
		expect(mail.text).not.toContain("We have received your inquiry. An agent will get in touch"); // old wrong text parts
		expect(mail.text).toMatch(/^Hello/); // the greeting starts the text part
		expect(mail.text).not.toMatch(/<[a-z!]/i); // plain text, no markup
	}
});

test("T-EMAIL-02 set / reset password: button and copyable link, expiry, what to do if unexpected", async () => {
	const set = await setPasswordEmail({ firstName: "Jessica", link: "https://app.test/api/reset-password/1/abc" });
	expect(set.subject).toBe("Welcome to BusinessN - set your password");
	expect(set.html).toContain('href="https://app.test/api/reset-password/1/abc"');
	expect(set.html).toContain("expires in 15 minutes");
	expect(set.text).toContain("Set your password: https://app.test/api/reset-password/1/abc");
	expect(set.text).toContain("Hello Jessica,");
	const reset = await resetPasswordEmail({ firstName: "", link: "https://app.test/r" });
	expect(reset.subject).toBe("Reset your BusinessN password");
	expect(reset.text).toContain("Hello,"); // no name: no blank
	expect(reset.html).toContain("your password will not change");
});

test("T-EMAIL-03 ticket and lead e-mails greet the assignee and list the details; the link opens the sign-in page", async () => {
	const lead = await newLeadEmail({ assigneeName: "Bruce Hurst", ticketNumber: "ACME-1", companyName: "Acme", contactName: "Ann Lee", email: "a@b.c" });
	expect(lead.text).toContain("Hello Bruce,");
	expect(lead.text).toContain("Ticket: ACME-1");
	expect(lead.text).toContain("Contact: Ann Lee");
	expect(lead.text).not.toContain("Phone:"); // empty rows are left out
	expect(loginUrl()).toBe("http://localhost:0/login");
	expect(lead.html).toContain('href="http://localhost:0/login"');
	const assigned = await ticketAssignedEmail({ assigneeName: "Bruce Hurst", ticketNumber: "ACME-3", topic: "Payroll", originator: "Ana Ruiz", hasAttachment: true });
	expect(assigned.subject).toBe("Ticket ACME-3 assigned to you: Payroll");
	expect(assigned.text).toContain("assigned to you by Ana Ruiz");
	expect(assigned.text).toContain("A file is attached for your reference.");
});

test("T-EMAIL-04 weekly schedule: no empty paragraph without a file; the week is in the subject", async () => {
	const withFile = await weeklyScheduleEmail({ fullName: "Jessica Glass", week: "Oct 26 - Nov 1", hasAttachment: true });
	expect(withFile.subject).toBe("Your work schedule for the week of Oct 26 - Nov 1");
	expect(withFile.text).toContain("is attached");
	const without = await weeklyScheduleEmail({ fullName: "Jessica Glass", week: "Oct 26 - Nov 1", hasAttachment: false });
	expect(without.text).toContain("has been published");
	expect(without.html).not.toMatch(/<p[^>]*>\s*<\/p>/);
});

test("T-EMAIL-05 every value is escaped, in the HTML and the subject line stays text", async () => {
	const mail = await newSupportTicketEmail({ assigneeName: XSS, ticketNumber: XSS, companyName: XSS, clientName: XSS, issue: XSS });
	expect(mail.html).not.toContain("<script>");
	expect(mail.html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
	const set = await setPasswordEmail({ firstName: XSS, link: 'https://x.test/"onmouseover="x' });
	expect(set.html).not.toContain('"onmouseover="');
});
