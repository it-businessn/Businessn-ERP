const moment = require("moment");
const path = require("path");
const fs = require("fs");

const SupportTicket = require("../models/Ticket");
const Employee = require("../models/Employee");
const Lead = require("../models/Lead");

const { sendEmail } = require("../services/emailService");
const { filePath, fileContentType } = require("../services/fileService");
const { COMPANIES } = require("../constants/constant");
const { SUPPORT_ADMIN_CONTACT } = require("../constants/permissions.constants");
const { TICKET_STATUS } = require("../constants/ticket.constants");

const getAllTickets = async (req, res) => {
	const { id } = req.params;
	try {
		const tickets = await SupportTicket.find({
			$or: [{ originator: id }, { assignee: id }],
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
		const resource = await SupportTicket.findOne({ originalname: filename });
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

const createLeadTicket = async (req, res) => {
	try {
		const data = req.body;
		const lead = await createNewFreshLead(data);

		const attachments = [
			{
				filename: "BusinessN_dark1.png",
				path: path.join(__dirname, "../", "assets/logos/BusinessN_dark1.png"),
				cid: "footerLogo",
			},
		];
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

		const ticket = await SupportTicket.create(newInfo);

		if (assigneeEmail?.email) {
			await sendEmail(
				assigneeEmail?.email,
				`New Lead Notification`,
				"You’ve got a new lead! Here are the basic details:",
				`
					<body style="margin: 0; font-family: Arial, Helvetica, sans-serif;height:'auto">
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
						class="category"
						style="color: #e8ccb7; font-weight: bold; margin: 0"
					>
						${ticket?.category}
					</p>
					<p
						class="topic"
						style="font-weight: bold; font-size: larger; margin: 5px 0"
					>
						New Lead Notification
					</p>
				</div>
			</div>
			<div
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
				<h3 style="margin: 0; margin-bottom: 1em">Hello Jesse,</h3>
				<p style="margin: 5px 0">
					We are confirming that we have received ticket <span style="
					background: #d5efe2;">${ticket?.ticketNumber}</span> assigned to
					you.
				</p>

				<p>You’ve got a new lead! Here are the basic details:</p>

				<p style="font-weight: bold; margin: 0">Company Name:</p>
				<p>${lead?.opportunityName}</p>
				<p style="font-weight: bold; margin: 0">Customer Name:</p>
				<p>${data?.firstName} ${data?.lastName}</p>
				<p style="font-weight: bold; margin: 0">Email:</p>
				<p>${data?.email}</p>
				<p style="font-weight: bold; margin: 0">Phone:</p>
				<p>${data?.phone}</p>
				<p style="font-weight: bold; margin: 0">View Ticket:</p>
				<p style="margin: 5px 0">
					To view the full ticket or add a reply, access your account via the link
					below:
				</p>
				<p style="margin: 5px 0">
					<a href="https://businessn-erp.com/" target="_blank"
						>https://businessn-erp.com/login/</a
					>
				</p>
				<p style="margin: 5px 0">
					Please do not reply to this email as responses are not monitored.
				</p>
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
		</body>
				`,
				attachments,
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
		const attachments = [
			{
				filename: "BusinessN_dark1.png",
				path: path.join(__dirname, "../", "assets/logos/BusinessN_dark1.png"),
				cid: "footerLogo",
			},
		];

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
			await sendEmail(
				assigneeEmail?.email,
				`New Support Ticket Logged`,
				"",
				`
					<body style="margin: 0; font-family: Arial, Helvetica, sans-serif;height:'auto">
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
						class="category"
						style="color: #e8ccb7; font-weight: bold; margin: 0"
					>
						${ticket?.category}
					</p>
					<p
						class="topic"
						style="font-weight: bold; font-size: larger; margin: 5px 0"
					>
						Customer Support Inquiry
					</p>
				</div>
			</div>
			<div
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
				<h3 style="margin: 0; margin-bottom: 1em">Hello Jesse,</h3>
				<p style="margin: 5px 0">
					We are confirming that we have received ticket <span style="
					background: #d5efe2;">${ticket?.ticketNumber}</span> assigned to
					you.
				</p>

				<p>You’ve got a new support ticket! Here are the basic details:</p>

				<p style="font-weight: bold; margin: 0">Company Name:</p>
				<p>${companyName}</p>
				
				<p style="font-weight: bold; margin: 0">View Ticket:</p>
				<p style="margin: 5px 0">
					To view the full ticket or add a reply, access your account via the link
					below:
				</p>
				<p style="margin: 5px 0">
					<a href="https://businessn-erp.com/" target="_blank"
						>https://businessn-erp.com/login/</a
					>
				</p>
				<p style="margin: 5px 0">
					Please do not reply to this email as responses are not monitored.
				</p>
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
		</body>
				`,
				attachments,
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
		const attachments = [
			{
				filename: "BusinessN_dark1.png",
				path: path.join(__dirname, "../", "assets/logos/BusinessN_dark1.png"),
				cid: "footerLogo",
			},
		];
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
				await sendEmail(
					assigneeEmail?.email,
					`Ticket Assignment Confirmation`,
					"We have received your inquiry. An agent will get in touch with you shortly to discuss your interests and provide more information.",
					`
				<body style="margin: 0; font-family: Arial, Helvetica, sans-serif;height:'auto">
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
					class="category"
					style="color: #e8ccb7; font-weight: bold; margin: 0"
				>
					${newTask?.category}
				</p>
				<p
					class="topic"
					style="font-weight: bold; font-size: larger; margin: 5px 0"
				>
					Ticket Assignment Confirmation
				</p>
			</div>
		</div>
		<div
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
			<h3 style="margin: 0; margin-bottom: 1em">Hello ${newTask?.assignee},</h3>
			<p style="margin: 5px 0">
				We are confirming that we have received ticket <span style="
				background: #d5efe2;">${newTask?.ticketNumber}</span> assigned to
				you. 
			</p>
			
			<p style="font-weight: bold; margin: 5px 0"> ${
				attachment ? "Please find attached file for your reference. " : ""
			}</p>
			
			<p style="font-weight: bold; margin: 0">Topic:</p>
			<p>${newTask?.topic}</p>
			<p style="font-weight: bold; margin: 0">Description:</p>
			<p>${newTask?.issue}</p>
			<p style="font-weight: bold; margin: 0">Assignor:</p>
			<p>${newTask?.originator}</p>
			<p style="font-weight: bold; margin: 0">Channel:</p>
			<p>${newTask?.category}</p>
			<p style="font-weight: bold; margin: 0">View Ticket:</p>
			<p style="margin: 5px 0">
				To view the full ticket or add a reply, access your account via the link
				below:
			</p>
			<p style="margin: 5px 0">
				<a href="https://businessn-erp.com/" target="_blank"
					>https://businessn-erp.com/login/</a
				>
			</p>
			<p style="margin: 5px 0">
				Please do not reply to this email as responses are not monitored.
			</p>
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
	</body>
			`,
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
