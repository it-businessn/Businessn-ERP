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
const { TICKET_STATUS } = require("../constants/ticket.constants");
const { companyScopeFilter } = require("../middleware/authorize");
const { pickScalarFields } = require("../helpers/requestFields");
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
					$or: [{ originator: id }, { assignee: id }],
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
			category === "My"
				? {
						companyName,
						$or: [{ originator: id }, { assignee: id }],
						status: { $ne: TICKET_STATUS.CLOSED },
					}
				: {
						companyName,
						category,
						$or: [{ originator: id }, { assignee: id }],
						status: { $ne: TICKET_STATUS.CLOSED },
					};
		const tickets = await SupportTicket.find(filterCriteria).sort({ priority: 1 });
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
			status: { $ne: "Close" },
			$or: [{ originator: id }, { assignee: id }],
		}).sort({ priority: 1 });
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
			status: "Close",
			$or: [{ originator: name }, { assignee: name }],
		});
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

const createNewFreshLead = async (lead) => {
	const newLeadOpportunity = {
		name: `${lead?.firstName} ${lead?.lastName}`,
		companyName: COMPANIES.BUSINESSN_ORG,
		email: lead?.email,
		opportunityName: lead?.companyName,
		phone: lead?.phone,
		productService: lead?.interests?.map((interest) => {
			return { name: interest };
		}),
		region: lead?.province,
		source: "Website Inquiry",
		stage: "L1",
		roleTitle: lead?.title,
		country: lead?.country,
		annualRevenue: lead?.annualRevenue,
		totalEmployees: lead?.totalEmployees,
		referrals: lead?.referrals,
		marketingComms: lead?.marketingComms,
	};
	const newLead = await Lead.create(newLeadOpportunity);
	return newLead;
};

// NEW-12: fields of the public website form (client CustomerInfo.jsx). The
// public route used to pass the whole body to SupportTicket.create, so a caller
// could set status, file, originator, etc.; operator objects reached Mongo.
const LEAD_FORM_FIELDS = [
	"firstName",
	"lastName",
	"title",
	"email",
	"phone",
	"country",
	"province",
	"annualRevenue",
	"totalEmployees",
	"companyName",
	"referrals",
	"marketingComms",
];

const createLeadTicket = async (req, res) => {
	try {
		const { data, invalid } = pickScalarFields(req.body, LEAD_FORM_FIELDS);
		const interests = req.body?.interests;
		if (
			invalid.length > 0 ||
			(data.companyName != null && typeof data.companyName !== "string") ||
			(interests !== undefined &&
				interests !== null &&
				(!Array.isArray(interests) || interests.some((i) => typeof i !== "string")))
		) {
			return res.status(400).json({ message: "Invalid lead form data" });
		}
		if (Array.isArray(interests)) data.interests = interests;
		const lead = await createNewFreshLead(data);

		data.category = "Support";
		data.priority = 1;

		const companyNamePrefix = data?.companyName?.split(" ")[0];
		data.ticketNumber = generateTicketNumber(companyNamePrefix);
		const assigneeEmail = await Employee.findOne({ email: SUPPORT_ADMIN_CONTACT });
		data.assignee = assigneeEmail?.fullName;

		const newInfo = data;
		newInfo.companyName = COMPANIES.BUSINESSN_ORG;
		newInfo.topic = "New Lead: Website Contact Form Submission";
		newInfo.issue = "A new lead has been generated from the website contact form.";

		// NEW-12: explicit document (the form fields are not ticket fields).
		const ticket = await SupportTicket.create({
			companyName: newInfo.companyName,
			category: newInfo.category,
			priority: newInfo.priority,
			ticketNumber: newInfo.ticketNumber,
			assignee: newInfo.assignee,
			topic: newInfo.topic,
			issue: newInfo.issue,
		});

		if (assigneeEmail?.email) {
			await sendTemplate(
				assigneeEmail?.email,
				newLeadEmail({
					assigneeName: assigneeEmail?.fullName,
					ticketNumber: ticket?.ticketNumber,
					companyName: lead?.opportunityName || data?.companyName,
					contactName: [data?.firstName, data?.lastName].filter(Boolean).join(" "),
					email: data?.email,
					phone: data?.phone,
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
		const category = "Support";
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
		newTicket.ticketNumber = generateTicketNumber("CUST");
		newTicket.category = "Support";
		newTicket.priority = 4;
		newTicket.assignee = "NA";
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

		if (updatedTicket?.status === "Close") {
			updatedTicket.ticketClosedDate = moment();
		} else {
			updatedTicket.ticketDaysOpened = Math.round(
				moment.duration(moment().diff(moment(existingTicket.createdOn))).asDays(),
			);
		}

		const setup = await SupportTicket.findByIdAndUpdate(id, { $set: updatedTicket }, { new: true });
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
