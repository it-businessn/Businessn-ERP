const fs = require("fs");
const SupportTicket = require("../models/Ticket");
const moment = require("moment");
const Employee = require("../models/Employee");
const { sendEmail } = require("../services/emailService");
const path = require("path");
const { filePath, fileContentType } = require("../services/fileService");
const { TICKET_STATUS } = require("../services/data");

const getAllTickets = async (req, res) => {
	const { id } = req.params;
	try {
		const tickets = await SupportTicket.find({
			$or: [{ originator: id }, { assignee: id }],
		}).sort({ priority: 1 });
		res.status(200).json(tickets);
	} catch (error) {
		res.status(404).json({ error: error.message });
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

		res.status(200).json({ openTicketsByCategory, myTicketsCount });
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getFilteredTickets = async (req, res) => {
	const { id, companyName, category } = req.params;
	try {
		const filterCriteria =
			category === "My"
				? {
						companyName,
						originator: id,
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
		res.status(200).json({ tickets, category });
	} catch (error) {
		res.status(404).json({ error: error.message });
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
		res.status(200).json(tickets);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getClosedTickets = async (req, res) => {
	const { id, companyName } = req.params;
	try {
		const tickets = await SupportTicket.find({
			companyName,
			status: "Close",
			$or: [{ originator: id }, { assignee: id }],
		}).sort({ priority: 1 });
		res.status(200).json(tickets);
	} catch (error) {
		res.status(404).json({ error: error.message });
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
		const resource = await SupportTicket.find({ originalname: filename });
		if (!resource) {
			return res.status(404).json({ error: "Resource not found" });
		}
		const file = filePath(filename);
		fs.writeFileSync(file, resource[0].file.data);

		res.setHeader("Content-Type", fileContentType(file));

		res.download(file, filename, (err) => {
			fs.unlinkSync(file);
			if (err) {
				console.error("Error downloading file:", err);
				res.status(404).json({ error: "File not found" });
			}
		});
	} catch (error) {
		res.status(404).json({ error: error.message });
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
			const assigneeEmail = await Employee.findOne({ fullName: newTicket.assignee })
				.select(["email"])
				.sort({ priority: 1 });
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
			<h3 style="margin: 0; margin-bottom: 1em">Hello ${newTask?.assignee}</h3>
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
		res.status(400).json({ message: error.message });
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
		res.status(200).json(setup);
	} catch (error) {
		console.log(error, "Error in updating");
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
};
