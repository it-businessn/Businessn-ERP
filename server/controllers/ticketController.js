const SupportTicket = require("../models/Ticket");
const moment = require("moment");

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
			companyName,
			status: { $ne: "Close" },
			$or: [{ originator: id }, { assignee: id }],
		}).sort({
			createdOn: -1,
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
			createdOn: -1,
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
			newTicket.ticketNumber = generateTicketNumber("DEV");
			const newTask = await SupportTicket.create(newTicket);
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
