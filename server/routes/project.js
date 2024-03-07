const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

router.get("/", async (req, res) => {
	try {
		const projects = (await Project.find()).sort((a, b) => b.date - a.date);
		res.status(200).json(projects);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
});

// router.get("/:id", async (req, res) => {
// 	const id = req.params.id;
// 	try {
// 		const notes = (await Task.find({ contactId: id })).sort(
// 			(a, b) => b.date - a.date,
// 		);
// 		res.status(200).json(notes);
// 	} catch (error) {
// 		res.status(404).json({ error: error.message });
// 	}
// });

router.post("/", async (req, res) => {
	const { projectName, taskName, selectedAssignees, hasChecklist, todoItems } =
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
});

// router.put("/:id", async (req, res) => {
// 	const taskId = req.params.id;
// 	try {
// 		const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, {
// 			new: true,
// 		});

// 		res.status(201).json(updatedTask);
// 	} catch (error) {
// 		res.status(400).json({ message: error.message });
// 	}
// });

module.exports = router;
