const mongoose = require("mongoose");

const subTaskSchema = new mongoose.Schema({
	projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
	taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
	completed: { type: Boolean, default: false },
	createdOn: { type: Date, default: Date.now },
	dueDate: Date,
	taskName: String,
	status: String,
	notes: String,
	isOpen: { type: Boolean, default: true },
	selectedAssignees: { type: Array, default: [] },
	updatedOn: { type: Date, default: Date.now },
	timeToComplete: Number, // estimatedHours
	actualHours: { type: Number, default: 0 },
	totalTasks: { type: Number, default: 0 },
	subtasks: { type: Array, default: [] },
	totalEstimatedHours: Number,
	completionPercent: Number,
	priority: { type: String, default: "low" },
});

const SubTask = mongoose.model("SubTask", subTaskSchema);

module.exports = SubTask;
