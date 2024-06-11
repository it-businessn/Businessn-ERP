const Activity = require("../models/Activity");
const Project = require("../models/Project");
const SubTask = require("../models/SubTask");
const Task = require("../models/Task");

const getTasks = () => async (req, res) => {
	try {
		const tasks = (await Task.find()).sort((a, b) => b.createdOn - a.createdOn);
		res.status(200).json(tasks);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getTaskById = () => async (req, res) => {
	const { id, company } = req.params;
	try {
		const tasks = await Task.find({
			selectedAssignees: id,
			companyName: company,
		});
		res.status(200).json(tasks);
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

const updateTask = () => async (req, res) => {
	const taskId = req.params.id;
	const { isOpen, actualHours } = req.body;

	try {
		const savedTask = await Task.findById(taskId);
		const completionPercent = (await isAllSubTaskComplete(savedTask))
			? 100
			: (actualHours / Math.max(savedTask.timeToComplete, actualHours)) * 100;

		const updatedTask = await Task.findByIdAndUpdate(
			taskId,
			{ isOpen, completed: isOpen, actualHours, completionPercent },
			{
				new: true,
			},
		);

		const savedSubtaskProject = await Project.findById(savedTask.projectId);

		let totalActualHoursTasks = 0;

		for (const task of savedSubtaskProject.tasks) {
			const savedTask = await Task.findById(task);
			if (savedTask?.actualHours) {
				totalActualHoursTasks += savedTask?.actualHours;
			}
		}

		const updatedProject = await Project.findByIdAndUpdate(
			savedTask.projectId,
			{
				actualHours: totalActualHoursTasks,
				completionPercent: (await isAllTaskComplete(savedSubtaskProject))
					? 100
					: (savedSubtaskProject.actualHours /
							Math.max(
								savedSubtaskProject.timeToComplete,
								savedSubtaskProject.actualHours,
							)) *
					  100,
			},
			{
				new: true,
			},
		);

		res.status(201).json(updatedProject);
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
			matchingInnerSubtask.actualHours = parseInt(Math.ceil(actualHours));
			matchingInnerSubtask.completed = isOpen;
			matchingInnerSubtask.completionPercent = 100;
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
			(savedSubtask.actualHours /
				Math.max(savedSubtask.timeToComplete, savedSubtask.actualHours)) *
			100;

		await savedSubtask.save();

		const savedSubtaskParent = await Task.findById(savedSubtask.taskId);

		let totalActualHoursSubTasks = 0;
		if (savedSubtaskParent.subtasks.length > 0) {
			for (const task of savedSubtaskParent.subtasks) {
				const savedTask = await SubTask.findById(task);
				if (savedTask?.actualHours) {
					totalActualHoursSubTasks += savedTask?.actualHours;
				}
			}
			savedSubtaskParent.actualHours = totalActualHoursSubTasks;
		}

		savedSubtaskParent.completionPercent =
			// (await isAllSubTaskComplete(
			// 	savedSubtaskParent,
			// ))
			// 	? 100
			// 	:
			(savedSubtaskParent.actualHours /
				Math.max(
					savedSubtaskParent.timeToComplete,
					savedSubtaskParent.actualHours,
				)) *
			100;

		await savedSubtaskParent.save();

		const savedSubtaskProject = await Project.findById(savedSubtask.projectId);

		let totalActualHoursTasks = 0;

		for (const task of savedSubtaskProject.tasks) {
			const savedTask = await Task.findById(task);
			if (savedTask?.actualHours) {
				totalActualHoursTasks += savedTask?.actualHours;
			}
		}
		savedSubtaskProject.actualHours = totalActualHoursTasks;
		savedSubtaskProject.completionPercent =
			// (await isAllTaskComplete(
			// 	savedSubtaskProject,
			// ))
			// 	? 100
			// 	:
			(savedSubtaskProject.actualHours /
				Math.max(
					savedSubtaskProject.timeToComplete,
					savedSubtaskProject.actualHours,
				)) *
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
		savedSubtask.actualHours = parseInt(Math.ceil(actualHours));

		const allSubTaskComplete = savedSubtask.subtasks.every(
			(completed) => completed,
		);

		savedSubtask.completionPercent = allSubTaskComplete
			? 100
			: (actualHours / Math.max(savedSubtask.timeToComplete, actualHours)) *
			  100;

		await savedSubtask.save();

		const savedSubtaskParent = await Task.findById(savedSubtask.taskId);

		let totalActualHoursSubTasks = 0;

		if (savedSubtaskParent.subtasks.length > 0) {
			for (const task of savedSubtaskParent.subtasks) {
				const savedTask = await SubTask.findById(task);
				if (savedTask?.actualHours) {
					totalActualHoursSubTasks += savedTask?.actualHours;
				}
			}

			savedSubtaskParent.actualHours = totalActualHoursSubTasks;
		}

		savedSubtaskParent.completionPercent =
			//  (await isAllSubTaskComplete(
			// 	savedSubtaskParent,
			// ))
			// 	? 100
			// 	:
			(savedSubtaskParent.actualHours /
				Math.max(
					savedSubtaskParent.timeToComplete,
					savedSubtaskParent.actualHours,
				)) *
			100;

		await savedSubtaskParent.save();

		const savedSubtaskProject = await Project.findById(savedSubtask.projectId);

		let totalActualHoursTasks = 0;

		for (const task of savedSubtaskProject.tasks) {
			const savedTask = await Task.findById(task);
			if (savedTask?.actualHours) {
				totalActualHoursTasks += savedTask?.actualHours;
			}
		}
		savedSubtaskProject.actualHours = totalActualHoursTasks;
		savedSubtaskParent.completionPercent =
			//  (await isAllTaskComplete(
			// 	savedSubtaskProject,
			// ))
			// 	? 100
			// 	:
			(savedSubtaskProject.actualHours /
				Math.max(
					savedSubtaskProject.timeToComplete,
					savedSubtaskProject.actualHours,
				)) *
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
