const moment = require("moment");

const Activity = require("../models/Activity");
const SubTask = require("../models/SubTask");
const Task = require("../models/Task");

const getTasks = async (req, res) => {
	try {
		const tasks = await Task.find({}).sort({
			createdOn: -1,
		});
		return res.status(200).json(tasks);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getTaskById = async (req, res) => {
	const { id, company } = req.params;
	try {
		const tasks = await Task.find({
			selectedAssignees: id,
			companyName: company,
		});
		return res.status(200).json(tasks);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const createTask = async (req, res) => {
	const { contactId, dueDate, name, status } = req.body;

	try {
		const task = new Task({ contactId, date: moment(), dueDate, name, status });
		const newTask = await task.save();
		return res.status(201).json(newTask);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const isAllSubTaskComplete = async (savedTask) => {
	const subtasksPromises = savedTask.subtasks.map((id) =>
		SubTask.findById(id).then((task) => task?.completionPercent === 100),
	);

	const subtasksCompleted = await Promise.all(subtasksPromises);

	return subtasksCompleted.every((completed) => completed);
};

const isAllTaskComplete = async (savedTask) => {
	const tasksPromises = savedTask.tasks.map((id) =>
		Task.findById(id).then((task) => task?.completionPercent === 100),
	);

	const tasksCompleted = await Promise.all(tasksPromises);

	return tasksCompleted.every((completed) => completed);
};

const updateTask = async (req, res) => {
	const { taskId } = req.params;
	const { isOpen } = req.body;

	try {
		const updatedTask = await Task.findByIdAndUpdate(
			taskId,
			{ isOpen, completed: isOpen, updatedOn: moment() },
			{
				new: true,
			},
		);
		return res.status(201).json(updatedTask);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const updateInnerSubTask = async (req, res) => {
	const { id } = req.params;
	const { isOpen, index } = req.body;
	try {
		const savedSubtask = await SubTask.findOneAndUpdate(
			{ _id: id },
			{
				$set: {
					[`subtasks.${index}.isOpen`]: isOpen,
					[`subtasks.${index}.completed`]: isOpen,
					[`subtasks.${index}.updatedOn`]: moment(),
				},
			},
			{ new: true },
		);
		return res.status(201).json(savedSubtask);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const updateSubTask = async (req, res) => {
	const { id } = req.params;
	const { isOpen } = req.body;
	try {
		const updatedSubtask = await SubTask.findByIdAndUpdate(
			id,
			{ isOpen, completed: isOpen, updatedOn: moment() },
			{
				new: true,
			},
		);
		return res.status(201).json(updatedSubtask);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const updateActivity = async (req, res) => {
	const { id } = req.params;
	const { isOpen } = req.body;
	try {
		const updatedActivity = await Activity.findByIdAndUpdate(
			id,
			{ isOpen, completed: isOpen, updatedOn: moment() },
			{
				new: true,
			},
		);

		return res.status(201).json(updatedActivity);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

module.exports = {
	createTask,
	getTaskById,
	getTasks,
	updateSubTask,
	updateTask,
	updateActivity,
	updateInnerSubTask,
};
