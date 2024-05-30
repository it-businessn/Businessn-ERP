const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
	timeToComplete: Number, // estimatedHours
	actualHours: { type: Number, default: 0 },
	startDate: Date,
	dueDate: Date,
	status: String,
	name: String,
	notes: String,
	selectedAssignees: { type: Array, default: [] },
	managerName: String,
	createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
	managerId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
	tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
	completed: { type: Boolean, default: false },
	totalTasks: { type: Number, default: 0 },
	priority: { type: String, default: "low" },
	totalEstimatedHours: Number,
	completionPercent: Number,

	clockIns: [Date],
	clockOuts: [Date],
	startBreaks: [Date],
	endBreaks: [Date],
	totalHours: Number,
	totalTimeCardHours: Number,
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
