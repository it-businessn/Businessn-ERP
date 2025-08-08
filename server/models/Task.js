const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
	projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
	createdOn: { type: Date, default: Date.now },
	dueDate: Date,
	taskName: String,
	status: String,
	isOpen: Boolean,
	subtasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubTask" }],
	// activities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }],
	selectedAssigneesId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
	notes: String,
	completed: { type: Boolean, default: false },
	selectedAssignees: { type: Array, default: [] },
	updatedOn: { type: Date, default: Date.now },
	timeToComplete: Number, // estimatedHours
	actualHours: { type: Number, default: 0 },
	totalTasks: { type: Number, default: 0 },
	priority: { type: String, default: "low" },
	totalEstimatedHours: Number,
	completionPercent: Number,
	companyName: { type: String, ref: "Company" },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
