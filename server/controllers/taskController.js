const Activity = require("../models/Activity");
const SubTask = require("../models/SubTask");
const Task = require("../models/Task");

const getTasks = () => async (req, res) => {
	try {
		const tasks = (await Task.find()).sort((a, b) => b.date - a.date);
		res.status(200).json(tasks);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getTaskById = () => async (req, res) => {
	const id = req.params.id;

	try {
		const notes = (await Task.find({ contactId: id })).sort(
			(a, b) => b.date - a.date,
		);
		res.status(200).json(notes);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const createTask = () => async (req, res) => {
	const { contactId, dueDate, name, status } = req.body;

	const task = new Task({ contactId, date: Date.now(), dueDate, name, status });

	try {
		const newTask = await task.save();
		res.status(201).json(newTask);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateTask = () => async (req, res) => {
	const taskId = req.params.id;
	try {
		const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, {
			new: true,
		});

		res.status(201).json(updatedTask);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateSubTask = () => async (req, res) => {
	const { id } = req.params;
	try {
		const updatedSubTask = await SubTask.findByIdAndUpdate(id, req.body, {
			new: true,
		});

		res.status(201).json(updatedSubTask);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
const updateActivity = () => async (req, res) => {
	const { id } = req.params;
	try {
		const updatedActivity = await Activity.findByIdAndUpdate(id, req.body, {
			new: true,
		});

		res.status(201).json(updatedActivity);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = {
	createTask,
	getTaskById,
	getTasks,
	updateSubTask,
	updateTask,
	updateActivity,
};
