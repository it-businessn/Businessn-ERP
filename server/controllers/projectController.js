const Project = require("../models/Project");

const getProjects = () => async (req, res) => {
	try {
		const projects = (await Project.find()).sort((a, b) => b.date - a.date);
		res.status(200).json(projects);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const createProject = () => async (req, res) => {
	const { hasChecklist, projectName, selectedAssignees, taskName, todoItems } =
		req.body;

	const project = new Project({
		projectName,
		taskName,
		selectedAssignees,
		hasChecklist,
		todoItems,
		date: Date.now(),
	});

	try {
		const newProject = await project.save();
		res.status(201).json(newProject);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = { createProject, getProjects };
