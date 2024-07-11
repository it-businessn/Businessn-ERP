const Contact = require("../models/Contact");
const LogTask = require("../models/LogTask");

const getTasks = async (req, res) => {
	try {
		const tasks = (await LogTask.find()).sort(
			(a, b) => b.createdOn - a.createdOn,
		);
		res.status(200).json(tasks);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getTask = async (req, res) => {
	const { contactId } = req.params;
	try {
		const tasks = (await LogTask.find({ contactId })).sort(
			(a, b) => b.createdOn - a.createdOn,
		);
		res.status(200).json(tasks);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const createTask = async (req, res) => {
	const { contactId, dueDate, description, createdBy, companyName } = req.body;

	try {
		const newContactTask = await LogTask.create({
			contactId,
			dueDate,
			description,
			createdBy,
			companyName,
		});
		const contact = await Contact.findById(contactId);
		contact.tasks.push(newContactTask._id);

		await contact.save();

		res.status(201).json(newContactTask);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateTask = async (req, res) => {
	const { id } = req.params;
	const { checked } = req.body;
	try {
		const updatedData = { status: checked ? "Closed" : "Open" };
		const task = await LogTask.findByIdAndUpdate(
			id,
			{ $set: updatedData },
			{ new: true },
		);
		res.status(201).json(task);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = {
	createTask,
	getTask,
	getTasks,
	updateTask,
};
