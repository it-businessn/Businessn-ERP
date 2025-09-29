const Contact = require("../models/Contact");
const LogTask = require("../models/LogTask");

const getTasks = async (req, res) => {
	try {
		const tasks = await LogTask.find({}).sort({
			createdOn: -1,
		});
		return res.status(200).json(tasks);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getTask = async (req, res) => {
	const { contactId } = req.params;
	try {
		const tasks = await LogTask.find({ contactId }).sort({
			createdOn: -1,
		});
		return res.status(200).json(tasks);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const createTask = async (req, res) => {
	const { contactId, dueDate, description, createdBy, companyName } = req.body;

	try {
		const data = { contactId, dueDate, description, createdBy, companyName };
		const existingRecord = await LogTask.findOne(data);
		if (existingRecord) {
			return res.status(409).json({ message: "Task already exists" });
		}
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

		return res.status(201).json(newContactTask);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const updateTask = async (req, res) => {
	const { id } = req.params;
	const { checked } = req.body;
	try {
		const updatedData = { status: checked ? "Closed" : "Open" };
		const task = await LogTask.findByIdAndUpdate(id, { $set: updatedData }, { new: true });
		return res.status(201).json(task);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

module.exports = {
	createTask,
	getTask,
	getTasks,
	updateTask,
};
