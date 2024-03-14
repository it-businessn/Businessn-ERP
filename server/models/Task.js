const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
	projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
	createdOn: { type: Date, default: Date.now },
	dueDate: Date,
	name: String,
	status: String,
	isOpen: Boolean,
	subtasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubTask" }],
	activities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }],
	selectedAssigneesId: [
		{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
	],
	selectedAssignees: Object,
	updatedOn: { type: Date, default: Date.now },
	timeToComplete: Number,
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
