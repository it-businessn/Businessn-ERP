const SupportTicket = require("../models/Ticket");
const moment = require("moment");
const Employee = require("../models/Employee");
const { sendEmail } = require("../services/emailService");

const getAllTickets = async (req, res) => {
	const { id } = req.params;
	try {
		const tasks = await SupportTicket.find({
			$or: [{ originator: id }, { assignee: id }],
		}).sort({
			createdOn: -1,
		});
		res.status(200).json(tasks);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getOpenTickets = async (req, res) => {
	const { id, companyName } = req.params;
	try {
		const tasks = await SupportTicket.find({
			// companyName: { $exists: false },
			companyName,
			status: { $ne: "Close" },
			$or: [{ originator: id }, { assignee: id }],
		}).sort({
			// createdOn: -1,
			assignee: 1,
		});
		tasks.map((task) => {
			task.ticketDaysOpened = Math.round(
				moment.duration(moment().diff(moment(task.createdOn))).asDays(),
			);
			return task;
		});
		res.status(200).json(tasks);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getClosedTickets = async (req, res) => {
	const { id, companyName } = req.params;
	try {
		const tasks = await SupportTicket.find({
			companyName,
			status: "Close",
			$or: [{ originator: id }, { assignee: id }],
		}).sort({
			// createdOn: -1,
			assignee: 1,
		});
		res.status(200).json(tasks);
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

const createTicket = async (req, res) => {
	try {
		const newTicket = req.body;
		if (newTicket?.originator) {
			newTicket.ticketNumber = generateTicketNumber(newTicket.companyName.split(" ")[0]);
			const newTask = await SupportTicket.create(newTicket);
			const assigneeEmail = await Employee.findOne({ fullName: newTicket.assignee })
				.select(["email"])
				.sort({
					fullName: 1,
				});
			if (assigneeEmail?.email)
				await sendEmail(
					assigneeEmail?.email,
					`${newTicket.category} Ticket Assignment Confirmation`,
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
			<h3 style="margin: 0; margin-bottom: 2em">Hello ${newTask?.assignee}</h3>
			<p style="margin: 0">
				We are confirming that we have received ticket <span style="
				background: #d5efe2;">${newTask?.ticketNumber}</span> assigned to
				you.
			</p>
			<p style="font-weight: bold; margin: 5px 0">Topic:</p>
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
			<img
				alt="logo"
				src='/assets/logos/BusinessN_dark1.png'
				style="margin: 0 auto"
			/>
		</div>
	</body>
			`,
					// process.env.NODEMAILER_ZOHO_SMTP_USER_EMAIL1,
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
};
