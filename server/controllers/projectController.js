const Project = require("../models/Project");
const Task = require("../models/Task");
const SubTask = require("../models/SubTask");
const Activity = require("../models/Activity");
const { TIMESHEET_STATUS } = require("../services/data");

const findProject = async (projects) =>
	await Promise.all(
		projects.map(
			async (project) =>
				await Project.findById(project._id)
					.populate({
						path: "tasks",
						populate: {
							path: "subtasks",
							model: "SubTask",
						},
					})
					// .populate({
					// 	path: "tasks",
					// 	populate: {
					// 		path: "activities",
					// 		model: "Activity",
					// 	},
					// })
					.exec(),
		),
	);

const getProjects = async (req, res) => {
	try {
		const projects = (await Project.find({})).sort((a, b) => b.createdOn - a.createdOn);
		const populatedProjects = await findProject(projects);
		res.status(200).json(populatedProjects);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getCompanyProjects = async (req, res) => {
	const { companyName } = req.params;
	try {
		const projects = (await Project.find({ companyName })).sort(
			(a, b) => b.createdOn - a.createdOn,
		);
		const populatedProjects = await findProject(projects);
		res.status(200).json(populatedProjects);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getAssigneeProjects = async (req, res) => {
	const { selectedAssignees, companyName } = req.params;
	try {
		const projects = (await Project.find({ selectedAssignees, companyName })).sort(
			(a, b) => b.createdOn - a.createdOn,
		);
		if (projects.length) {
			const populatedProjects = await findProject(projects);
			res.status(200).json(populatedProjects);
		} else {
			res.status(200).json(projects);
		}
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const addSubTask = async (req, res) => {
	const { id } = req.params;
	const {
		projectId,
		subTaskSelectedAssignees,
		subTaskTimeToComplete,
		subTaskDueDate,
		subTaskName,
		companyName,
	} = req.body;

	try {
		const newSubtask = await SubTask.create({
			projectId,
			taskId: id,
			taskName: subTaskName,
			selectedAssignees: subTaskSelectedAssignees,
			dueDate: subTaskDueDate,
			timeToComplete: subTaskTimeToComplete,
			status: getProjectStatus(subTaskDueDate),
			companyName,
		});

		const savedTask = await Task.findById(id);

		savedTask.subtasks = savedTask.subtasks.concat(newSubtask._id);
		savedTask.totalTasks += 1;

		const concatenatedTaskArray = savedTask.selectedAssignees.concat(newSubtask.selectedAssignees);
		const uniqueTaskSet = new Set(concatenatedTaskArray);
		const uniqueTaskArray = Array.from(uniqueTaskSet);
		savedTask.selectedAssignees = uniqueTaskArray;

		await savedTask.save();

		const savedProject = await Project.findById(projectId);

		const concatenatedProjectArray = savedProject.selectedAssignees.concat(
			savedTask.selectedAssignees,
		);
		const uniqueProjectSet = new Set(concatenatedProjectArray);
		const uniqueArray = Array.from(uniqueProjectSet);

		savedProject.selectedAssignees = uniqueArray;

		savedProject.totalTasks += 1;
		await savedProject.save();

		res.status(201).json(savedProject);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
const addTaskSubTasks = async (req, res) => {
	const { id } = req.params;
	const {
		projectId,
		taskId,
		subTaskId,
		subTaskSelectedAssignees,
		subTaskTimeToComplete,
		subTaskDueDate,
		subTaskName,
		companyName,
	} = req.body;

	try {
		const status = getProjectStatus(subTaskDueDate);
		const savedSubtask = await SubTask.findById(id);
		const updatedData = {
			projectId,
			taskId,
			completed: false,
			createdOn: Date.now,
			isOpen: true,
			subTaskId,
			selectedAssignees: subTaskSelectedAssignees,
			updatedOn: Date.now,
			timeToComplete: parseInt(Math.ceil(subTaskTimeToComplete)),
			dueDate: subTaskDueDate,
			taskName: subTaskName,
			status,
			totalTasks: 0,
			subtasks: [],
			companyName,
		};
		savedSubtask.subtasks.push(updatedData);
		await savedSubtask.save();
		res.status(201).json(savedSubtask);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateProjectSubTask = async (req, res) => {
	const { projectId } = req.params;

	const { subtasks, activities, timeToComplete, dueDate, taskName, taskId } = req.body;

	try {
		const savedSubtasks = await Promise.all(
			subtasks?.map(
				async ({ taskName, selectedAssignees, dueDate, timeToComplete }) =>
					await SubTask.create({
						projectId,
						taskId,
						taskName,
						selectedAssignees,
						isOpen: true,
						dueDate,
						timeToComplete,
						status: getProjectStatus(dueDate),
					}),
			),
		);

		const savedActivities = await Promise.all(
			activities?.map(
				async ({ taskName, selectedAssignee, dueDate, timeToComplete }) =>
					await Activity.create({
						projectId,
						taskId,
						taskName,
						selectedAssignees: selectedAssignee,
						isOpen: true,
						dueDate,
						timeToComplete,
						status: getProjectStatus(dueDate),
					}),
			),
		);

		const mergedAssignees = [
			...savedSubtasks.reduce(
				(assignees, subtask) => assignees.concat(subtask.selectedAssignees),
				[],
			),
			...savedActivities.reduce(
				(assignees, action) => assignees.concat(action.selectedAssignees),
				[],
			),
		];

		const savedTask = await Task.findById(taskId);

		savedTask.taskName = taskName;
		savedTask.dueDate = dueDate;
		savedTask.status = getProjectStatus(dueDate);

		savedTask.timeToComplete = timeToComplete;
		savedTask.subtasks = savedTask.subtasks.concat(savedSubtasks.map((subtask) => subtask._id));
		savedTask.activities = savedTask.activities.concat(
			savedActivities.map((activity) => activity._id),
		);

		const concatenatedTaskArray = savedTask.selectedAssignees.concat(mergedAssignees);
		const uniqueTaskSet = new Set(concatenatedTaskArray);
		const uniqueTaskArray = Array.from(uniqueTaskSet);
		savedTask.selectedAssignees = uniqueTaskArray;

		await savedTask.save();

		const savedProject = await Project.findById(projectId);

		const concatenatedProjectArray = savedProject.selectedAssignees.concat(
			savedTask.selectedAssignees,
		);
		const uniqueProjectSet = new Set(concatenatedProjectArray);
		const uniqueArray = Array.from(uniqueProjectSet);

		savedProject.selectedAssignees = uniqueArray;

		await savedProject.save();

		res.status(201).json(savedTask);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const createActivity = async (req, res) => {
	const { projectId, taskId, activities } = req.body;

	try {
		const task = await Task.findById(taskId);
		const project = await Project.findById(projectId);

		const activities = await Promise.all(
			activities.map(
				async ({ taskName, selectedAssignee, dueDate, timeToComplete }) =>
					await Activity.create({
						projectId,
						taskId,
						taskName,
						selectedAssignees: selectedAssignee,
						isOpen: true,
						dueDate,
						timeToComplete,
						status: getProjectStatus(dueDate),
					}),
			),
		);

		task.activities = task.activities.concat(activities.map((activity) => activity._id));

		const mergedAssignees = [
			...activities.reduce((assignees, action) => assignees.concat(action.selectedAssignees), []),
		];

		const concatenatedTaskArray = task.selectedAssignees.concat(mergedAssignees);
		const uniqueTaskSet = new Set(concatenatedTaskArray);
		const uniqueTaskArray = Array.from(uniqueTaskSet);
		task.selectedAssignees = uniqueTaskArray;

		await task.save();

		const concatenatedProjectTaskArray = project.selectedAssignees.concat(task.selectedAssignees);

		const uniqueProjectArray = Array.from(new Set(concatenatedProjectTaskArray));
		project.selectedAssignees = uniqueProjectArray;

		await project.save();

		res.status(201).json(project);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
const deleteTask = async (req, res) => {
	const { id } = req.params;
	try {
		const task = await Task.findByIdAndDelete({
			_id: id,
		});
		if (task) {
			res.status(200).json(`Task with id ${id} deleted successfully.`);
		} else {
			res.status(200).json("Task Details not found.");
		}
	} catch (error) {
		res.status(404).json({ error: "Error deleting Task:", error });
	}
};

const deleteSubTaskChild = async (req, res) => {
	const { id } = req.params;
	const { taskName } = req.body;
	try {
		const savedSubtask = await SubTask.findById(id);

		const matchingInnerSubtaskIndex = savedSubtask.subtasks.findIndex(
			(innerSubtask) => innerSubtask.taskName === taskName,
		);

		if (matchingInnerSubtaskIndex > -1) {
			savedSubtask.subtasks.splice(matchingInnerSubtaskIndex, 1);
		} else {
			console.log("InnerSubtask not found.");
		}
		await savedSubtask.save();
		res.status(201).json(savedSubtask);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const deleteSubTask = async (req, res) => {
	const { id } = req.params;
	try {
		const task = await SubTask.findByIdAndDelete({
			_id: id,
		});
		if (task) {
			res.status(200).json(`SubTask with id ${id} deleted successfully.`);
		} else {
			res.status(200).json("SubTask Details not found.");
		}
	} catch (error) {
		res.status(404).json({ error: "Error deleting SubTask:", error });
	}
};

const scheduleTask = async (req, res) => {
	const { assignee, taskName } = req.body;

	try {
		const savedProject = await Project.findOne({ name: "Scheduling Calendar" });
		if (!savedProject) {
			return res.status(404).json({ message: "Project not found" });
		}
		const newTask = await Task.create({
			projectId: savedProject._id,
			taskName,
			selectedAssignees: assignee,
		});

		savedProject.totalTasks = (savedProject.totalTasks || 0) + 1;
		savedProject.tasks.push(newTask._id);

		await savedProject.save();

		res.status(201).json(newTask);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const addProjectTask = async (req, res) => {
	const { projectId } = req.params;

	const { timeToComplete, dueDate, taskName, selectedAssignees, companyName } = req.body;

	try {
		const status = getProjectStatus(dueDate);
		const newTask = await Task.create({
			projectId,
			dueDate,
			taskName,
			status,
			isOpen: true,
			selectedAssignees,
			timeToComplete,
			companyName,
		});

		const savedProject = await Project.findById(projectId);

		if (savedProject?.selectedAssignees?.length === 0) {
			savedProject.selectedAssignees = newTask.selectedAssignees;
		} else {
			const concatenatedProjectArray = savedProject?.selectedAssignees?.concat(
				newTask.selectedAssignees,
			);
			const uniqueProjectSet = new Set(concatenatedProjectArray);
			const uniqueArray = Array.from(uniqueProjectSet);

			savedProject.selectedAssignees = uniqueArray;
		}
		savedProject.totalTasks += 1;
		savedProject.tasks.push(newTask._id);

		await savedProject.save();

		res.status(201).json(savedProject);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateProjectTask = async (req, res) => {
	const { id } = req.params;
	const { timeToComplete, dueDate, taskName, priority, selectedAssignees, projectId } = req.body;

	try {
		const status = getProjectStatus(dueDate);
		const updatedData = {
			timeToComplete,
			dueDate,
			taskName,
			status,
			priority,
			selectedAssignees,
		};

		const updatedTask = await Task.findByIdAndUpdate(id, { $set: updatedData }, { new: true });
		const savedProject = await Project.findById(projectId);

		if (savedProject?.selectedAssignees?.length === 0) {
			savedProject.selectedAssignees = updatedTask.selectedAssignees;
		} else {
			const concatenatedProjectArray = savedProject?.selectedAssignees?.concat(
				updatedTask.selectedAssignees,
			);
			const uniqueProjectSet = new Set(concatenatedProjectArray);
			const uniqueArray = Array.from(uniqueProjectSet);

			savedProject.selectedAssignees = uniqueArray;
		}
		await savedProject.save();
		res.status(201).json(savedProject);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateTaskSubTask = async (req, res) => {
	const { id } = req.params;
	const {
		subTaskName,
		subTaskDueDate,
		subTaskTimeToComplete,
		priority,
		selectedAssignees,
		taskId,
		projectId,
	} = req.body;

	try {
		const status = getProjectStatus(subTaskDueDate);
		const updatedData = {
			timeToComplete: parseInt(Math.ceil(subTaskTimeToComplete)),
			dueDate: subTaskDueDate,
			taskName: subTaskName,
			status,
			priority,
			selectedAssignees,
		};

		const updatedSubTask = await SubTask.findByIdAndUpdate(
			id,
			{ $set: updatedData },
			{ new: true },
		);
		const updatedTask = await Task.findById(taskId);
		if (updatedTask?.selectedAssignees?.length === 0) {
			updatedTask.selectedAssignees = updatedSubTask.selectedAssignees;
		} else {
			const concatenatedProjectArray = updatedTask?.selectedAssignees?.concat(
				updatedSubTask.selectedAssignees,
			);
			const uniqueProjectSet = new Set(concatenatedProjectArray);
			const uniqueArray = Array.from(uniqueProjectSet);

			updatedTask.selectedAssignees = uniqueArray;
			await updatedTask.save();
		}
		const savedProject = await Project.findById(projectId);

		if (savedProject?.selectedAssignees?.length === 0) {
			savedProject.selectedAssignees = updatedTask.selectedAssignees;
		} else {
			const concatenatedProjectArray = savedProject?.selectedAssignees?.concat(
				updatedTask.selectedAssignees,
			);
			const uniqueProjectSet = new Set(concatenatedProjectArray);
			const uniqueArray = Array.from(uniqueProjectSet);

			savedProject.selectedAssignees = uniqueArray;
		}
		await savedProject.save();
		res.status(201).json(savedProject);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateInnerSubTasks = async (req, res) => {
	const { id } = req.params;
	const {
		selectedAssignees,
		priority,
		subTaskDueDate,
		subTaskTimeToComplete,
		subTaskName,
		taskId,
		projectId,
	} = req.body;

	try {
		const savedSubtask = await SubTask.findById(id);

		const matchingInnerSubtaskIndex = savedSubtask.subtasks.findIndex(
			(innerSubtask) => innerSubtask.taskName === subTaskName,
		);
		const matchingInnerSubtask = savedSubtask.subtasks.find(
			(innerSubtask) => innerSubtask.taskName === subTaskName,
		);

		if (matchingInnerSubtaskIndex > -1) {
			matchingInnerSubtask.selectedAssignees = selectedAssignees;
			matchingInnerSubtask.priority = priority;
			matchingInnerSubtask.subTaskDueDate = subTaskDueDate;
			matchingInnerSubtask.subTaskTimeToComplete = subTaskTimeToComplete;
			matchingInnerSubtask.status = getProjectStatus(subTaskDueDate);
		} else {
			console.log("InnerSubtask not found.");
		}

		savedSubtask.subtasks[matchingInnerSubtaskIndex] = matchingInnerSubtask;

		await savedSubtask.save();

		const updatedTask = await Task.findById(taskId);
		if (updatedTask?.selectedAssignees?.length === 0) {
			updatedTask.selectedAssignees = savedSubtask.selectedAssignees;
		} else {
			const concatenatedProjectArray = updatedTask?.selectedAssignees?.concat(
				savedSubtask.selectedAssignees,
			);
			const uniqueProjectSet = new Set(concatenatedProjectArray);
			const uniqueArray = Array.from(uniqueProjectSet);

			updatedTask.selectedAssignees = uniqueArray;
			await updatedTask.save();
		}
		const savedProject = await Project.findById(projectId);

		if (savedProject?.selectedAssignees?.length === 0) {
			savedProject.selectedAssignees = updatedTask.selectedAssignees;
		} else {
			const concatenatedProjectArray = savedProject?.selectedAssignees?.concat(
				updatedTask.selectedAssignees,
			);
			const uniqueProjectSet = new Set(concatenatedProjectArray);
			const uniqueArray = Array.from(uniqueProjectSet);

			savedProject.selectedAssignees = uniqueArray;
		}
		await savedProject.save();
		res.status(201).json(savedProject);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateTaskActivity = async (req, res) => {
	const { id } = req.params;

	const { projectId, action, taskId, dueDate, taskName, projectName, timeToComplete } = req.body;
	const status = getProjectStatus(dueDate);
	try {
		const savedTask = await Task.findById(id);
		if (req.body?.subtasks?.length > 0) {
			const savedSubTasks = await Promise.all(
				req.body?.subtasks.map(
					async (subtask) =>
						await SubTask.create({
							projectId,
							taskId,
							name: subtask.taskName || subtask.name,
							selectedAssignees: subtask.selectedAssignees,
							isOpen: true,
							dueDate,
							timeToComplete,
							status,
						}),
				),
			);
			savedTask.subtasks = savedSubTasks.map((subtask) => subtask._id);
		}
		const savedActivities = await Promise.all(
			action.map(
				async (activity) =>
					await Activity.create({
						projectId,
						taskId,
						name: activity.taskName || activity.name,
						selectedAssignees: activity.selectedAssignees || activity.selectedAssignee,
						isOpen: true,
						dueDate,
						timeToComplete,
						status,
					}),
			),
		);

		savedTask.name = taskName;
		savedTask.activities = savedActivities.map((activity) => activity._id);
		await savedTask.save();

		res.status(201).json(savedTask);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const getProjectStatus = (dueDate) => {
	const currentDate = new Date().toISOString().split("T")[0];
	const daysOverdue = Math.floor(
		(new Date(currentDate) - new Date(dueDate)) / (1000 * 60 * 60 * 24),
	);
	if (dueDate < currentDate) {
		return `Overdue ${daysOverdue}`;
	} else if (dueDate === currentDate) {
		return `Due Today ${daysOverdue}`;
	} else if (dueDate > currentDate) {
		return `Upcoming ${daysOverdue}`;
	} else {
		return `${TIMESHEET_STATUS.PENDING} ${daysOverdue}`;
	}
};

const updateProject = async (req, res) => {
	const { id } = req.params;
	const {
		projectName,
		timeToComplete,
		startDate,
		dueDate,
		managerId,
		managerName,
		priority,
		selectedAssignees,
	} = req.body;
	try {
		const status = getProjectStatus(dueDate);
		const updatedData = {
			name: projectName,
			timeToComplete,
			status,
			startDate,
			dueDate,
			managerId,
			managerName,
			priority,
			selectedAssignees,
		};

		const updatedProject = await Project.findByIdAndUpdate(
			id,
			{ $set: updatedData },
			{ new: true },
		);
		res.status(201).json(updatedProject);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const createProject = async (req, res) => {
	const { projectName, timeToComplete, startDate, dueDate, managerId, managerName, companyName } =
		req.body;

	try {
		const status = getProjectStatus(dueDate);
		const newProject = await Project.create({
			name: projectName,
			timeToComplete,
			startDate,
			dueDate,
			managerName,
			status,
			managerId,
			companyName,
		});

		res.status(201).json(newProject);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = {
	createProject,
	getProjects,
	updateProjectTask,
	updateProject,
	updateTaskActivity,
	updateProjectSubTask,
	createActivity,
	addProjectTask,
	addSubTask,
	updateTaskSubTask,
	addTaskSubTasks,
	getProjectStatus,
	deleteTask,
	deleteSubTask,
	deleteSubTaskChild,
	updateInnerSubTasks,
	scheduleTask,
	getAssigneeProjects,
	getCompanyProjects,
};
