const TICKET_STATUS = {
	OPEN: "Open",
	CLOSED: "Close",
	PROGRESS: "In Progress",
	ON_HOLD: "On Hold",
};

/** Category of tickets from the public support and website contact forms. */
const SUPPORT_CATEGORY = "Support";

/** Category filter name for "My tickets" (client CategoryFilter "My" channel). */
const MY_TICKETS_FILTER = "My";

/** Tickets created without an originator (customer tickets). */
const CUSTOMER_TICKET_PREFIX = "CUST";
const UNASSIGNED_ASSIGNEE = "NA";

/** LEAD-DETAILS: fields of a website lead form copied into ticket.lead. */
const LEAD_FIELDS = [
	"firstName",
	"lastName",
	"email",
	"phone",
	"companyName",
	"title",
	"country",
	"state",
	"annualRevenue",
	"totalEmployees",
	"message",
	"plan",
	"webinarTitle",
	"webinarTopic",
	"referrals",
	"marketingComms",
	"ticketType",
	"formName",
	"source",
];
const LEAD_NUMBER_FIELDS = ["totalEmployees"];
const LEAD_BOOLEAN_FIELDS = ["referrals", "marketingComms"];
const LEAD_DEFAULT_TOPIC = "Website Contact Form Submission";
const LEAD_DEFAULT_ISSUE = "A new lead has been generated from the website contact form.";
/** CRM Lead created for a website form (source option "Website Inquiry", first stage). */
const LEAD_SOURCE_WEBSITE = "Website Inquiry";
const LEAD_STAGE_NEW = "L1";
/** Lead fields sent with a ticket (ticket.leadId) for the "Lead details" section. */
const LEAD_POPULATE_FIELDS = [
	"name",
	"opportunityName",
	"roleTitle",
	"email",
	"phone",
	"country",
	"region",
	"annualRevenue",
	"totalEmployees",
	"referrals",
	"marketingComms",
	"message",
	"plan",
	"webinarTitle",
	"webinarTopic",
	"ticketType",
	"formName",
	"websiteSource",
	"stage",
].join(" ");

module.exports = {
	TICKET_STATUS,
	LEAD_FIELDS,
	LEAD_NUMBER_FIELDS,
	LEAD_BOOLEAN_FIELDS,
	LEAD_DEFAULT_TOPIC,
	LEAD_DEFAULT_ISSUE,
	LEAD_SOURCE_WEBSITE,
	LEAD_STAGE_NEW,
	LEAD_POPULATE_FIELDS,
	SUPPORT_CATEGORY,
	MY_TICKETS_FILTER,
	CUSTOMER_TICKET_PREFIX,
	UNASSIGNED_ASSIGNEE,
};
