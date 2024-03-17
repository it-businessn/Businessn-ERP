const Project = require("../models/Project");
const Task = require("../models/Task");
const SubTask = require("../models/SubTask");
const Activity = require("../models/Activity");

const getProjects = () => async (req, res) => {
	try {
		const projects = (await Project.find()).sort(
			(a, b) => b.createdOn - a.createdOn,
		);
		const populatedProjects = await Promise.all(
			projects.map(async (project) => {
				const populatedProject = await Project.findById(project._id)
					.populate({
						path: "tasks",
						populate: {
							path: "subtasks",
							model: "SubTask",
						},
					})
					.populate({
						path: "tasks",
						populate: {
							path: "activities",
							model: "Activity",
						},
					})
					.exec();

				return populatedProject;
			}),
		);
		res.status(200).json(populatedProjects);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const updateProjectSubTask = () => async (req, res) => {
	const { id } = req.params;

	const { subtasks, activities, timeToComplete, dueDate, taskName, taskId } =
		req.body;

	try {
		const savedSubtasks = await Promise.all(
			subtasks?.map(
				async ({ taskName, selectedAssignees, dueDate, timeToComplete }) => {
					const newSubtask = new SubTask({
						projectId: id,
						taskId,
						taskName,
						selectedAssignees,
						isOpen: true,
						dueDate,
						timeToComplete,
						status: getStatus(dueDate),
					});
					return await newSubtask.save();
				},
			),
		);

		const savedActivities = await Promise.all(
			activities?.map(
				async ({ taskName, selectedAssignee, dueDate, timeToComplete }) => {
					const newActivity = new Activity({
						projectId: id,
						taskId,
						taskName,
						selectedAssignees: selectedAssignee,
						isOpen: true,
						dueDate,
						timeToComplete,
						status: getStatus(dueDate),
					});
					return await newActivity.save();
				},
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
		savedTask.status = getStatus(dueDate);

		savedTask.timeToComplete = timeToComplete;
		savedTask.subtasks = savedTask.subtasks.concat(
			savedSubtasks.map((subtask) => subtask._id),
		);
		savedTask.activities = savedTask.activities.concat(
			savedActivities.map((activity) => activity._id),
		);

		const concatenatedTaskArray =
			savedTask.selectedAssignees.concat(mergedAssignees);
		const uniqueTaskSet = new Set(concatenatedTaskArray);
		const uniqueTaskArray = Array.from(uniqueTaskSet);
		savedTask.selectedAssignees = uniqueTaskArray;

		await savedTask.save();

		const savedProject = await Project.findById(id);

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

const createActivity = () => async (req, res) => {
	const { projectId, taskId, activities } = req.body;

	try {
		const savedTask = await Task.findById(taskId);
		const savedProject = await Project.findById(projectId);

		const savedActivities = await Promise.all(
			activities.map(
				async ({ taskName, selectedAssignee, dueDate, timeToComplete }) => {
					const newActivity = new Activity({
						projectId,
						taskId,
						taskName,
						selectedAssignees: selectedAssignee,
						isOpen: true,
						dueDate,
						timeToComplete,
						status: getStatus(dueDate),
					});
					return await newActivity.save();
				},
			),
		);

		savedTask.activities = savedTask.activities.concat(
			savedActivities.map((activity) => activity._id),
		);

		const mergedAssignees = [
			...savedActivities.reduce(
				(assignees, action) => assignees.concat(action.selectedAssignees),
				[],
			),
		];

		const concatenatedTaskArray =
			savedTask.selectedAssignees.concat(mergedAssignees);
		const uniqueTaskSet = new Set(concatenatedTaskArray);
		const uniqueTaskArray = Array.from(uniqueTaskSet);
		savedTask.selectedAssignees = uniqueTaskArray;

		await savedTask.save();

		const concatenatedProjectTaskArray = savedProject.selectedAssignees.concat(
			savedTask.selectedAssignees,
		);

		const uniqueProjectArray = Array.from(
			new Set(concatenatedProjectTaskArray),
		);
		savedProject.selectedAssignees = uniqueProjectArray;

		await savedProject.save();

		res.status(201).json(savedProject);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateProjectTask = () => async (req, res) => {
	const { id } = req.params;

	const {
		// subtasks,
		// action,
		timeToComplete,
		dueDate,
		taskName,
		selectedAssignees,
		// projectName,
		// projectId,
	} = req.body;

	const status = getStatus(dueDate);

	try {
		// 	const savedSubtasks = await Promise.all(
		// 		subtasks.map(async (subtask) => {
		// 			const newSubtask = new SubTask({
		// 				projectId: id,
		// 				name: subtask.taskName,
		// 				selectedAssignees: subtask.selectedAssignees,
		// 				isOpen: true,
		// 				dueDate,
		// 				timeToComplete,
		// 				status,
		// 			});
		// 			return await newSubtask.save();
		// 		}),
		// 	);

		// 	const savedActivities = await Promise.all(
		// 		action.map(async (activity) => {
		// 			const newActivity = new Activity({
		// 				projectId: id,
		// 				name: activity.taskName,
		// 				selectedAssignees: activity.selectedAssignee,
		// 				isOpen: true,
		// 				dueDate,
		// 				timeToComplete,
		// 				status,
		// 			});
		// 			return await newActivity.save();
		// 		}),
		// 	);

		// 	// const mergedAssignees = [
		// 	// 	...savedSubtasks.reduce((assignees, subtask) => assignees.concat(subtask._id), []),
		// 	// 	...savedActions.reduce((assignees, action) => assignees.concat(action._id), []),
		// 	//   ];

		// 	const mergedAssignees = [
		// 		...savedSubtasks.reduce(
		// 			(assignees, subtask) => assignees.concat(subtask.selectedAssignees),
		// 			[],
		// 		),
		// 		...savedActivities.reduce(
		// 			(assignees, action) => assignees.concat(action.selectedAssignees),
		// 			[],
		// 		),
		// 	];

		const newTask = new Task({
			projectId: id,
			dueDate,
			taskName,
			status,
			isOpen: true,
			// selectedAssignees: mergedAssignees,
			selectedAssignees,
			timeToComplete,
			// subtasks: savedSubtasks.map((subtask) => subtask._id),
			// activities: savedActivities.map((activity) => activity._id),
		});

		await newTask.save();

		const savedProject = await Project.findById(id);
		savedProject.selectedAssignees = selectedAssignees;
		savedProject.tasks.push(newTask._id);

		await savedProject.save();

		// 	// Update taskId in savedSubtasks
		// 	await Promise.all(
		// 		savedSubtasks.map(async (savedSubtask) => {
		// 			savedSubtask.taskId = newTask._id;
		// 			await savedSubtask.save();
		// 		}),
		// 	);

		// 	// Update taskId in savedActivities
		// 	await Promise.all(
		// 		savedActivities.map(async (savedActivity) => {
		// 			savedActivity.taskId = newTask._id;
		// 			await savedActivity.save();
		// 		}),
		// 	);

		res.status(201).json(newTask);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateTaskActivity = () => async (req, res) => {
	const { id } = req.params;

	const {
		projectId,
		action,
		taskId,
		dueDate,
		taskName,
		projectName,
		timeToComplete,
	} = req.body;
	const status = getStatus(dueDate);
	try {
		const savedTask = await Task.findById(id);
		if (req.body?.subtasks?.length > 0) {
			const savedSubTasks = await Promise.all(
				req.body?.subtasks.map(async (subtask) => {
					const newSubTask = new SubTask({
						projectId,
						taskId,
						name: subtask.taskName || subtask.name,
						selectedAssignees: subtask.selectedAssignees,
						isOpen: true,
						dueDate,
						timeToComplete,
						status,
					});
					return await newSubTask.save();
				}),
			);
			savedTask.subtasks = savedSubTasks.map((subtask) => subtask._id);
		}
		const savedActivities = await Promise.all(
			action.map(async (activity) => {
				const newActivity = new Activity({
					projectId,
					taskId,
					name: activity.taskName || activity.name,
					selectedAssignees:
						activity.selectedAssignees || activity.selectedAssignee,
					isOpen: true,
					dueDate,
					timeToComplete,
					status,
				});
				return await newActivity.save();
			}),
		);

		savedTask.name = taskName;
		savedTask.activities = savedActivities.map((activity) => activity._id);
		await savedTask.save();

		res.status(201).json(savedTask);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const getStatus = (dueDate) => {
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
		return `Pending ${daysOverdue}`;
	}
};

const updateProject = () => async (req, res) => {
	const { id } = req.params;

	const { projectName, timeToComplete, dueDate } = req.body;
	const status = getStatus(dueDate);
	try {
		// const savedProject = await Project.findById(id);
		// const savedTasks = await Promise.all(
		// 	tasks.map(async (task) => {
		// 		const newTask = new Task({
		// 			projectId: id,
		// 			dueDate: savedProject.dueDate,
		// 			name: task.name,
		// 			status: getStatus(savedProject.dueDate),
		// 			isOpen: true,
		// 			selectedAssignees: task.selectedAssignees,
		// 			timeToComplete: savedProject.timeToComplete,
		// 		});

		// 		return await newTask.save();
		// 	}),
		// );
		// savedTasks.forEach((savedTask) => {
		// 	savedProject.tasks.push(savedTask._id);
		// });
		// await savedProject.save();
		const updatedData = {
			name: projectName,
			// tasks: savedTasks,
			timeToComplete,
			dueDate,
			status,
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

const createProject = () => async (req, res) => {
	const { projectName, timeToComplete, dueDate } = req.body;
	const status = getStatus(dueDate);
	const project = new Project({
		name: projectName,
		timeToComplete,
		dueDate,
		status,
	});
	try {
		const savedProject = await project.save();
		// for (const task of tasks) {
		// 	// const selectedAssigneesId = task.selectedAssignees.map((assigneeId) =>
		// 	// 	mongoose.Types.ObjectId(assigneeId),
		// 	// );

		// 	const newTask = new Task({
		// 		projectId: savedProject._id,
		// 		dueDate: savedProject.dueDate,
		// 		name: task.taskName,
		// 		status: getStatus(savedProject.dueDate),
		// 		isOpen: true,
		// 		// selectedAssigneesId, // in future will use this for reference
		// 		selectedAssignees: task.selectedAssignees,
		// 		timeToComplete: savedProject.timeToComplete,
		// 	});

		// 	const savedTask = await newTask.save();

		// 	savedProject.tasks.push(savedTask._id);
		// 	await savedProject.save();
		// 	console.log("Project updated with task:", savedProject);
		// }

		res.status(201).json(savedProject);
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
};
