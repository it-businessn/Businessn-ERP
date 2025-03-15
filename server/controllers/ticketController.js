const SupportTicket = require("../models/Ticket");
const moment = require("moment");
const Employee = require("../models/Employee");

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
			newTicket.ticketNumber = generateTicketNumber(newTicket.category.slice(0, 5));
			const newTask = await SupportTicket.create(newTicket);
			// 	const assigneeEmail = await Employee.find({ fullName: newTicket.assignee })
			// 		.select(["email"])
			// 		.sort({
			// 			fullName: 1,
			// 		});
			// 	await sendEmail(
			// 		assigneeEmail,
			// 		`${newTicket.category} Ticket Assignment Confirmation`,
			// 		"We have received your inquiry. An agent will get in touch with you shortly to discuss your interests and provide more information.",
			// 		`
			// 	<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; border: 1px solid #ccc; border-radius: 5px;">
			// 		<div style="background-color: #f0f0f0; padding: 10px; text-align: center;">
			// 			<h2 style="margin: 0;">New File Attachment</h2>
			// 		</div>
			// 		<div style="padding: 20px;">
			// 			<p>Hello ${newTicket.assignee},</p>

			// 			<p>We wanted to inform you that a new resume has been uploaded to the system. Here are the details:</p>

			// 			<ul style="list-style-type: none; padding: 0;">

			// 			</ul>

			// 			<p style="margin-top: 20px;">Thank you for your attention.</p>

			// 			<p style="margin-top: 10px;">Best regards,</p>
			// 			<p style="margin-top: 10px;">Fractional Departments</p>

			// 			<p style="margin-top: 10px;">Thank you!</p>
			// 		</div>
			//   </div>
			// `,
			// 		process.env.NODEMAILER_ZOHO_SMTP_USER_EMAIL1,
			// 	);
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
