const Project = require("../models/Project");

const getProjects = () => async (req, res) => {
	try {
		const projects = (await Project.find()).sort((a, b) => b.date - a.date);
		res.status(200).json(projects);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};
// const createProject = () => async (req, res) => {
// 	const { hasChecklist, projectName, selectedAssignees, taskName, todoItems } =
// 		req.body;

// 	const project = new Project({
// 		projectName,
// 		taskName,
// 		selectedAssignees,
// 		hasChecklist,
// 		todoItems,
// 		date: Date.now(),
// 	});

// 	try {
// 		const newProject = await project.save();
// 		res.status(201).json(newProject);
// 	} catch (error) {
// 		res.status(400).json({ message: error.message });
// 	}
// };
const updateProjectTask = () => async (req, res) => {
	const { id } = req.params;

	const taskId = req?.body?.taskId;

	const { subtasks, action, timeToComplete, dueDate, taskName } = req.body;

	try {
		const project = await Project.findById(id);
		const status = getStatus(dueDate);
		if (taskId) {
			const taskIndex = project.tasks.findIndex(
				(task) => task._id.toString() === taskId,
			);

			if (taskIndex !== -1) {
				project.tasks[taskIndex].subtasks = subtasks;
				project.tasks[taskIndex].action = action;
				project.tasks[taskIndex].action = action;
				project.tasks[taskIndex].timeToComplete = timeToComplete;
				project.tasks[taskIndex].dueDate = dueDate;
				project.tasks[taskIndex].status = status;

				await project.save();
				return res.json(project);
			}
		} else {
			project.tasks.push({
				subtasks,
				action,
				timeToComplete,
				dueDate,
				taskName,
			});
			const updatedProject = await project.save();
			return res.json(updatedProject);
		}

		return res.status(404).json({ error: "Task not found." });
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
		return `Due Today  ${daysOverdue}`;
	} else if (dueDate > currentDate) {
		return `Upcoming  ${daysOverdue}`;
	} else {
		return `Completed  ${daysOverdue}`;
	}
};

const updateProject = () => async (req, res) => {
	const { id } = req.params;

	const { projectName, tasks, timeToComplete, dueDate } = req.body;
	const status = getStatus(dueDate);
	try {
		const updatedData = { projectName, tasks, timeToComplete, dueDate, status };
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
	const { projectName, tasks, timeToComplete, dueDate } = req.body;
	const status = getStatus(dueDate);
	const project = new Project({
		projectName,
		tasks,
		timeToComplete,
		dueDate,
		status,
	});

	try {
		const newProject = await project.save();
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
};
