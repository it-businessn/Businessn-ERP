const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
	taskName: String,
	isOpen: Boolean,
	subtasks: Object,
	action: Object,
	selectedAssignees: Object,
	dueDate: Date,
	timeToComplete: Number,
	updatedOn: { type: Date, default: Date.now },
	status: String,
});

const projectSchema = new mongoose.Schema({
	projectName: String,
	date: { type: Date, default: Date.now },
	tasks: [taskSchema],
	timeToComplete: Number,
	dueDate: Date,
	updatedOn: { type: Date, default: Date.now },
	status: String,
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
