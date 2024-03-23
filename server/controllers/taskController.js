const Activity = require("../models/Activity");
const Project = require("../models/Project");
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
	const { isOpen, actualHours } = req.body;
	try {
		const savedTask = await Task.findById(taskId);

		savedTask.isOpen = isOpen;

		savedTask.completed = isOpen;
		savedTask.actualHours = actualHours;
		savedTask.completionPercent =
			(actualHours / savedTask.timeToComplete) * 100;

		await savedTask.save();

		const savedSubtaskProject = await Project.findById(savedTask.projectId);

		let totalActualHoursTasks = 0;

		for (const task of savedSubtaskProject.tasks) {
			const savedTask = await Task.findById(task);
			totalActualHoursTasks += savedTask.actualHours;
		}

		savedSubtaskProject.actualHours = totalActualHoursTasks;
		savedSubtaskProject.completionPercent =
			(savedSubtaskProject.actualHours / savedSubtaskProject.timeToComplete) *
			100;

		await savedSubtaskProject.save();

		res.status(201).json(savedSubtaskProject);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateInnerSubTask = () => async (req, res) => {
	const { id } = req.params;
	const { isOpen, actualHours, taskName } = req.body;
	try {
		const savedSubtask = await SubTask.findById(id);

		const matchingInnerSubtaskIndex = savedSubtask.subtasks.findIndex(
			(innerSubtask) => innerSubtask.taskName === taskName,
		);
		const matchingInnerSubtask = savedSubtask.subtasks.find(
			(innerSubtask) => innerSubtask.taskName === taskName,
		);

		if (matchingInnerSubtaskIndex > -1) {
			matchingInnerSubtask.isOpen = isOpen;
			matchingInnerSubtask.actualHours = actualHours;
			matchingInnerSubtask.completed = isOpen;
			matchingInnerSubtask.completionPercent =
				(actualHours / matchingInnerSubtask.timeToComplete) * 100;
		} else {
			console.log("InnerSubtask not found.");
		}

		savedSubtask.subtasks[matchingInnerSubtaskIndex] = matchingInnerSubtask;

		let totalActualHoursInnerTasks = 0;
		if (savedSubtask.subtasks.length > 0) {
			for (const task of savedSubtask.subtasks) {
				if (task?.actualHours) {
					totalActualHoursInnerTasks += task.actualHours;
				}
			}

			savedSubtask.actualHours = totalActualHoursInnerTasks;
		}
		savedSubtask.completionPercent =
			(savedSubtask.actualHours / savedSubtask.timeToComplete) * 100;

		await savedSubtask.save();

		const savedSubtaskParent = await Task.findById(savedSubtask.taskId);

		let totalActualHoursSubTasks = 0;
		if (savedSubtaskParent.subtasks.length > 0) {
			for (const task of savedSubtaskParent.subtasks) {
				const savedTask = await SubTask.findById(task);
				totalActualHoursSubTasks += savedTask.actualHours;
			}

			savedSubtaskParent.actualHours = totalActualHoursSubTasks;
		}
		savedSubtaskParent.completionPercent =
			(savedSubtaskParent.actualHours / savedSubtaskParent.timeToComplete) *
			100;

		await savedSubtaskParent.save();

		const savedSubtaskProject = await Project.findById(savedSubtask.projectId);

		let totalActualHoursTasks = 0;

		for (const task of savedSubtaskProject.tasks) {
			const savedTask = await Task.findById(task);
			totalActualHoursTasks += savedTask.actualHours;
		}
		savedSubtaskProject.actualHours = totalActualHoursTasks;
		savedSubtaskProject.completionPercent =
			(savedSubtaskProject.actualHours / savedSubtaskProject.timeToComplete) *
			100;

		await savedSubtaskProject.save();

		res.status(201).json(savedSubtaskProject);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateSubTask = () => async (req, res) => {
	const { id } = req.params;
	const { isOpen, actualHours } = req.body;
	try {
		const savedSubtask = await SubTask.findById(id);

		savedSubtask.isOpen = isOpen;

		savedSubtask.completed = isOpen;
		savedSubtask.actualHours = actualHours;
		savedSubtask.completionPercent =
			(actualHours / savedSubtask.timeToComplete) * 100;

		await savedSubtask.save();

		const savedSubtaskParent = await Task.findById(savedSubtask.taskId);

		let totalActualHoursSubTasks = 0;
		if (savedSubtaskParent.subtasks.length > 0) {
			for (const task of savedSubtaskParent.subtasks) {
				const savedTask = await SubTask.findById(task);
				totalActualHoursSubTasks += savedTask.actualHours;
			}

			savedSubtaskParent.actualHours = totalActualHoursSubTasks;
		}

		savedSubtaskParent.completionPercent =
			(savedSubtaskParent.actualHours / savedSubtaskParent.timeToComplete) *
			100;

		await savedSubtaskParent.save();

		const savedSubtaskProject = await Project.findById(savedSubtask.projectId);

		let totalActualHoursTasks = 0;

		for (const task of savedSubtaskProject.tasks) {
			const savedTask = await Task.findById(task);
			totalActualHoursTasks += savedTask.actualHours;
		}
		savedSubtaskProject.actualHours = totalActualHoursTasks;
		savedSubtaskProject.completionPercent =
			(savedSubtaskProject.actualHours / savedSubtaskProject.timeToComplete) *
			100;

		await savedSubtaskProject.save();

		res.status(201).json(savedSubtaskProject);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateActivity = () => async (req, res) => {
	const { id } = req.params;
	const { isOpen } = req.body;
	try {
		const updatedActivity = await Activity.findByIdAndUpdate(
			id,
			{ isOpen, completed: isOpen },
			{
				new: true,
			},
		);

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
	updateInnerSubTask,
};
