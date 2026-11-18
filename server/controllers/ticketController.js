const moment = require("moment");
const path = require("path");
const fs = require("fs");

const SupportTicket = require("../models/Ticket");
const Employee = require("../models/Employee");
const Lead = require("../models/Lead");

const { sendTemplate, newLeadEmail, newSupportTicketEmail, ticketAssignedEmail } = require("../services/emailTemplates");
const { filePath, fileContentType } = require("../services/fileService");
const { COMPANIES } = require("../constants/constant");
const { SUPPORT_ADMIN_CONTACT } = require("../constants/permissions.constants");
const {
	TICKET_STATUS,
	SUPPORT_CATEGORY,
	MY_TICKETS_FILTER,
	CUSTOMER_TICKET_PREFIX,
	UNASSIGNED_ASSIGNEE,
	LEAD_FIELDS,
	LEAD_NUMBER_FIELDS,
	LEAD_BOOLEAN_FIELDS,
	LEAD_DEFAULT_TOPIC,
	LEAD_DEFAULT_ISSUE,
	LEAD_SOURCE_WEBSITE,
	LEAD_STAGE_NEW,
	LEAD_POPULATE_FIELDS,
} = require("../constants/ticket.constants");
const { companyScopeFilter } = require("../middleware/authorize");
const { pickScalarFields } = require("../helpers/requestFields");
const { getEffectiveRole, ROLE_GROUPS } = require("../middleware/rbac");

// SUPPORT-QUEUE: tickets from the public support / contact forms are created in
// BusinessN Corporate with category SUPPORT_CATEGORY and no originator, assigned to
// SUPPORT_ADMIN_CONTACT. They were only listed for that one person (and for
// nobody when that employee was not found). Every admin-level user of BusinessN
// Corporate now sees all Support tickets there, assigned or not.
const seesSupportQueue = async (req, companyName) => {
	if (companyName !== COMPANIES.BUSINESSN_ORG || !req.user?.id) return false;
	const role = await getEffectiveRole(String(req.user.id), companyName);
	return ROLE_GROUPS.ADMIN_LEVEL.includes(role);
};
/** Tickets of `name` (originator or assignee), plus the support queue for its admins. */
const visibleTicketsFilter = async (req, name, companyName) => {
	const or = [{ originator: name }, { assignee: name }];
	if (await seesSupportQueue(req, companyName)) or.push({ category: SUPPORT_CATEGORY });
	return { $or: or };
};
// AUD-016: request data (incl. the public lead / support forms) is HTML-escaped in e-mail bodies.

const getAllTickets = async (req, res) => {
	const { id } = req.params;
	try {
		// NEW-06 (CHANGES.md API #11): any :id returned that user's tickets in every tenant.
		const tickets = await SupportTicket.find({
			$or: [{ originator: id }, { assignee: id }],
			...(await companyScopeFilter(req)),
		}).sort({ priority: 1 });
		return res.status(200).json(tickets);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getAggregateTicketCount = async (req, res) => {
	const { id, companyName } = req.params;

	try {
		const openTicketsByCategory = await SupportTicket.aggregate([
			{
				$match: {
					companyName,
					...(await visibleTicketsFilter(req, id, companyName)),
					status: { $in: [TICKET_STATUS.OPEN, TICKET_STATUS.PROGRESS, TICKET_STATUS.ON_HOLD] },
				},
			},
			{
				$group: {
					_id: { category: "$category", status: "$status" },
					count: { $sum: 1 },
				},
			},
			{
				$group: {
					_id: "$_id.category",
					statuses: {
						$push: {
							status: "$_id.status",
							count: "$count",
						},
					},
				},
			},
		]);

		const myTicketsCount = await SupportTicket.aggregate([
			{
				$match: { companyName, originator: id, status: { $ne: TICKET_STATUS.CLOSED } },
			},
			{
				$group: {
					_id: "$status",
					count: { $sum: 1 },
				},
			},
		]);

		return res.status(200).json({ openTicketsByCategory, myTicketsCount });
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getFilteredTickets = async (req, res) => {
	const { id, companyName, category } = req.params;
	try {
		const filterCriteria =
			category === MY_TICKETS_FILTER
				? {
						companyName,
						$or: [{ originator: id }, { assignee: id }],
						status: { $ne: TICKET_STATUS.CLOSED },
					}
				: {
						companyName,
						category,
						...(await visibleTicketsFilter(req, id, companyName)),
						status: { $ne: TICKET_STATUS.CLOSED },
					};
		const tickets = await SupportTicket.find(filterCriteria)
			.sort({ priority: 1 })
			.populate("leadId", LEAD_POPULATE_FIELDS);
		tickets.map((task) => {
			task.ticketDaysOpened = Math.round(
				moment.duration(moment().diff(moment(task.createdOn))).asDays(),
			);
			return task;
		});
		return res.status(200).json({ tickets, category });
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getOpenTickets = async (req, res) => {
	const { id, companyName } = req.params;
	try {
		const tickets = await SupportTicket.find({
			// companyName: { $exists: false },
			companyName,
			status: { $ne: TICKET_STATUS.CLOSED },
			...(await visibleTicketsFilter(req, id, companyName)),
		})
			.sort({ priority: 1 })
			.populate("leadId", LEAD_POPULATE_FIELDS);
		tickets.map((task) => {
			task.ticketDaysOpened = Math.round(
				moment.duration(moment().diff(moment(task.createdOn))).asDays(),
			);
			return task;
		});
		return res.status(200).json(tickets);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getClosedTickets = async (req, res) => {
	const { id, companyName } = req.params;
	try {
		const name = id.replace("  ", " ");
		const tickets = await SupportTicket.find({
			companyName,
			status: TICKET_STATUS.CLOSED,
			...(await visibleTicketsFilter(req, name, companyName)),
		}).populate("leadId", LEAD_POPULATE_FIELDS);
		return res.status(200).json(tickets);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const generateTicketNumber = (customerPrefix) => {
	const datePart = moment().format("YYMMDD");
	const randomSequence = Math.floor(Math.random() * 100000) + 1; // Random number between 1 and 100000
	const sequencePart = randomSequence.toString().padStart(5, "0");
	return `${datePart}${customerPrefix}#${sequencePart}`;
};

const downloadResource = async (req, res) => {
	try {
		const { filename } = req.params;
		// FIX: Model.find() returns an array, so `!resource` was never true and a
		// missing file crashed with a TypeError (500) instead of a 404.
		// NEW-06 (CHANGES.md API #11): look the attachment up within the caller's companies only.
		const resource = await SupportTicket.findOne({
			originalname: filename,
			...(await companyScopeFilter(req)),
		});
		if (!resource?.file?.data) {
			return res.status(404).json({ message: "Resource not found" });
		}
		// Unique temp name: two concurrent downloads of the same resource must not
		// unlink each other's file mid-stream (REV-007).
		const file = filePath(`${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}-${filename}`);
		fs.writeFileSync(file, resource.file.data);

		res.setHeader("Content-Type", fileContentType(file));

		res.download(file, path.basename(filePath(filename)), (err) => {
			try {
				fs.unlinkSync(file);
			} catch (_) {
				/* already removed */
			}
			if (err && !res.headersSent) {
				console.error("Error downloading file:", err);
				return res.status(404).json({ message: "File not found" });
			}
		});
	} catch (error) {
		console.error("downloadResource error:", error.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

// LEAD-DETAILS: the CRM Lead is the one record of what the website form sent;
// the ticket links to it with leadId (nothing is copied onto the ticket).
const createNewFreshLead = async (lead, interests) => {
	const newLeadOpportunity = {
		name: [lead?.firstName, lead?.lastName].filter(Boolean).join(" "),
		companyName: COMPANIES.BUSINESSN_ORG,
		email: lead?.email,
		opportunityName: lead?.companyName,
		phone: lead?.phone,
		productService: interests?.map((interest) => ({ name: interest })),
		region: lead?.state,
		source: LEAD_SOURCE_WEBSITE,
		stage: LEAD_STAGE_NEW,
		roleTitle: lead?.title,
		country: lead?.country,
		annualRevenue: lead?.annualRevenue,
		totalEmployees: lead?.totalEmployees != null ? String(lead.totalEmployees) : undefined,
		referrals: lead?.referrals,
		marketingComms: lead?.marketingComms,
		message: lead?.message,
		plan: lead?.plan,
		webinarTitle: lead?.webinarTitle,
		webinarTopic: lead?.webinarTopic,
		ticketType: lead?.ticketType,
		formName: lead?.formName,
		websiteSource: lead?.source,
	};
	const newLead = await Lead.create(newLeadOpportunity);
	return newLead;
};

const LEAD_TEXT_MAX = 500;
const LEAD_MESSAGE_MAX = 5000;
const toBoolean = (v) => {
	if (typeof v === "boolean") return v;
	const s = String(v).trim().toLowerCase();
	if (["true", "yes", "on", "1"].includes(s)) return true;
	if (["false", "no", "off", "0"].includes(s)) return false;
	return undefined;
};

/**
 * LEAD-DETAILS: the known lead fields of the request, for the CRM Lead. Only
 * plain values are copied (an object such as { "$gt": "" } is rejected, NEW-12);
 * text is trimmed and capped, numbers and yes/no values are converted, and a
 * value that cannot be converted is left out instead of failing the save.
 * The ERP's own form sends `province`; it is stored as `state`.
 */
const pickLeadDetails = (body) => {
	const { data, invalid } = pickScalarFields(body, LEAD_FIELDS);
	if (data.state == null && typeof body?.province === "string") data.state = body.province;
	const lead = {};
	for (const [key, value] of Object.entries(data)) {
		if (value === null || value === "") continue;
		if (LEAD_NUMBER_FIELDS.includes(key)) {
			const n = Number(value);
			if (Number.isFinite(n)) lead[key] = n;
		} else if (LEAD_BOOLEAN_FIELDS.includes(key)) {
			const b = toBoolean(value);
			if (b !== undefined) lead[key] = b;
		} else {
			const text = String(value).trim();
			if (text) lead[key] = text.slice(0, key === "message" ? LEAD_MESSAGE_MAX : LEAD_TEXT_MAX);
		}
	}
	return { lead, invalid };
};

/** e.g. "New Lead: Sales enquiry from ABC Store" */
const leadTopic = (lead) =>
	`New Lead: ${lead.ticketType || LEAD_DEFAULT_TOPIC}${lead.companyName ? ` from ${lead.companyName}` : ""}`;

const createLeadTicket = async (req, res) => {
	try {
		const { lead: leadDetails, invalid } = pickLeadDetails(req.body);
		const interests = req.body?.interests;
		if (
			invalid.length > 0 ||
			(interests !== undefined &&
				interests !== null &&
				(!Array.isArray(interests) || interests.some((i) => typeof i !== "string")))
		) {
			return res.status(400).json({ message: "Invalid lead form data" });
		}
		const lead = await createNewFreshLead(leadDetails, Array.isArray(interests) ? interests : undefined);

		const assigneeEmail = await Employee.findOne({ email: SUPPORT_ADMIN_CONTACT });

		// NEW-12: explicit document (the form fields are not ticket fields).
		const ticket = await SupportTicket.create({
			companyName: COMPANIES.BUSINESSN_ORG,
			category: SUPPORT_CATEGORY,
			priority: 1,
			ticketNumber: generateTicketNumber(leadDetails.companyName?.split(" ")[0]),
			assignee: assigneeEmail?.fullName,
			topic: leadTopic(leadDetails),
			issue: leadDetails.message || LEAD_DEFAULT_ISSUE,
			leadId: lead?._id,
		});

		if (assigneeEmail?.email) {
			await sendTemplate(
				assigneeEmail?.email,
				newLeadEmail({
					assigneeName: assigneeEmail?.fullName,
					ticketNumber: ticket?.ticketNumber,
					companyName: leadDetails.companyName || lead?.opportunityName,
					contactName: [leadDetails.firstName, leadDetails.lastName].filter(Boolean).join(" "),
					email: leadDetails.email,
					phone: leadDetails.phone,
					lead: leadDetails,
				}),
			);
		}
		return res.status(201).json(ticket);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isNonEmptyString = (v, max = 500) =>
	typeof v === "string" && v.trim().length > 0 && v.length <= max;

// FIX (AUD-016): public endpoint destructured nested objects without checks and
// crashed (500) on any malformed payload. Validate up front and answer 400.
const validateSupportTicket = (body) => {
	const { companyInfo, contactInfo, queryInfo } = body || {};
	if (!companyInfo || typeof companyInfo !== "object") return "companyInfo is required";
	if (!contactInfo || typeof contactInfo !== "object") return "contactInfo is required";
	if (!queryInfo || typeof queryInfo !== "object") return "queryInfo is required";
	if (!isNonEmptyString(companyInfo.companyName, 200)) return "companyInfo.companyName is required";
	if (!isNonEmptyString(contactInfo.clientFirstName, 100))
		return "contactInfo.clientFirstName is required";
	if (!isNonEmptyString(contactInfo.clientLastName, 100))
		return "contactInfo.clientLastName is required";
	if (!isNonEmptyString(contactInfo.clientEmail, 254) || !EMAIL_RE.test(contactInfo.clientEmail))
		return "contactInfo.clientEmail must be a valid email";
	if (!isNonEmptyString(queryInfo.issue, 5000)) return "queryInfo.issue is required";
	return null;
};

const createSupportTicket = async (req, res) => {
	try {
		const newTicket = req.body;
		const validationError = validateSupportTicket(newTicket);
		if (validationError) {
			return res.status(400).json({ message: validationError });
		}
		const { companyInfo, contactInfo, queryInfo } = newTicket;

		const { companyName, clientId } = companyInfo;
		const { clientFirstName, clientLastName, clientEmail, clientPhoneNumber, clientModeOfContact } =
			contactInfo;
		const { inquiryType, issue } = queryInfo;

		const companyNamePrefix = companyName.split(" ")[0];

		const ticketNumber = generateTicketNumber(companyNamePrefix);
		const category = SUPPORT_CATEGORY;
		const assigneeEmail = await Employee.findOne({ email: SUPPORT_ADMIN_CONTACT });

		const ticket = await SupportTicket.create({
			companyName: COMPANIES.BUSINESSN_ORG,
			assignee: assigneeEmail?.fullName,
			clientFirstName,
			clientLastName,
			clientEmail,
			clientPhoneNumber,
			clientModeOfContact,
			clientId,
			inquiryType,
			issue,
			ticketNumber,
			category,
		});

		if (assigneeEmail?.email) {
			await sendTemplate(
				assigneeEmail?.email,
				newSupportTicketEmail({
					assigneeName: assigneeEmail?.fullName,
					ticketNumber: ticket?.ticketNumber,
					companyName,
					clientName: [clientFirstName, clientLastName].filter(Boolean).join(" "),
					email: clientEmail,
					phone: clientPhoneNumber,
					modeOfContact: clientModeOfContact,
					inquiryType,
					issue,
				}),
			);
		}
		return res.status(201).json(ticket);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const createTicket = async (req, res) => {
	try {
		const newTicket = req.body;
		const attachment = req.file;
		const attachments = [];
		if (attachment) {
			attachments.push({
				filename: attachment.filename,
				path: attachment.path,
			});
			newTicket.file = {
				data: fs.readFileSync(attachment?.path),
				contentType: attachment?.mimetype,
				path: attachment?.path,
			};
			newTicket.originalname = attachment?.originalname;
		}
		if (newTicket?.originator) {
			const companyNamePrefix = newTicket.companyName?.startsWith("The")
				? newTicket.companyName.split(" ")[5]
				: newTicket.companyName.split(" ")[0];

			newTicket.ticketNumber = generateTicketNumber(companyNamePrefix);
			const newTask = await SupportTicket.create(newTicket);
			const assigneeEmail = await Employee.findOne({ fullName: newTicket.assignee }).select([
				"email",
			]);
			if (assigneeEmail?.email)
				await sendTemplate(
					assigneeEmail?.email,
					ticketAssignedEmail({
						assigneeName: newTask?.assignee,
						ticketNumber: newTask?.ticketNumber,
						topic: newTask?.topic,
						issue: newTask?.issue,
						originator: newTask?.originator,
						category: newTask?.category,
						hasAttachment: Boolean(attachment),
					}),
					attachments,
				);
			return res.status(201).json(newTask);
		}
		newTicket.ticketNumber = generateTicketNumber(CUSTOMER_TICKET_PREFIX);
		newTicket.category = SUPPORT_CATEGORY;
		newTicket.priority = 4;
		newTicket.assignee = UNASSIGNED_ASSIGNEE;
		const newTask = await SupportTicket.create(newTicket);
		return res.status(201).json(newTask);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	} finally {
		// NEW-16: the bytes are stored in MongoDB and the e-mail has been sent; the
		// multer temp file is no longer needed (same as resourceController, REV-006).
		if (req.file?.path) fs.unlink(req.file.path, () => {});
	}
};

const updateTicket = async (req, res) => {
	const { id } = req.params;
	try {
		const updatedTicket = req.body;
		const existingTicket = await SupportTicket.findById(id);

		if (existingTicket && !existingTicket?.originator)
			updatedTicket.originator = `${existingTicket.clientFirstName} ${existingTicket.clientLastName}`;

		if (updatedTicket?.status === TICKET_STATUS.CLOSED) {
			updatedTicket.ticketClosedDate = moment();
		} else {
			updatedTicket.ticketDaysOpened = Math.round(
				moment.duration(moment().diff(moment(existingTicket.createdOn))).asDays(),
			);
		}

		const setup = await SupportTicket.findByIdAndUpdate(id, { $set: updatedTicket }, { new: true });
		// SUPPORT-QUEUE: tell the new assignee when a ticket is reassigned
		const newAssignee = updatedTicket?.assignee;
		if (typeof newAssignee === "string" && newAssignee && newAssignee !== existingTicket?.assignee) {
			try {
				const assigneeEmail = await Employee.findOne({ fullName: newAssignee }).select(["email"]);
				if (assigneeEmail?.email)
					await sendTemplate(
						assigneeEmail.email,
						ticketAssignedEmail({
							assigneeName: newAssignee,
							ticketNumber: setup?.ticketNumber,
							topic: setup?.topic || setup?.inquiryType,
							issue: setup?.issue,
							originator: setup?.originator,
							category: setup?.category,
							hasAttachment: Boolean(setup?.originalname),
						}),
					);
			} catch (mailError) {
				console.error("Ticket reassigned, e-mail not sent:", mailError.message);
			}
		}
		return res.status(200).json(setup);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

module.exports = {
	getAllTickets,
	createTicket,
	updateTicket,
	getClosedTickets,
	getOpenTickets,
	downloadResource,
	getAggregateTicketCount,
	getFilteredTickets,
	createLeadTicket,
	createSupportTicket,
};
