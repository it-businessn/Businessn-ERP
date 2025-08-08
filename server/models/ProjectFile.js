const mongoose = require("mongoose");

const projectFileSchema = new mongoose.Schema({
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
	timeToComplete: Number,
	actualHours: { type: Number, default: 0 },
	startDate: Date,
	dueDate: Date,
	status: String,
	fileName: String,
	notes: String,
	selectedAssignees: { type: Array, default: [] },
	managerName: String,
	createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
	managerId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
	projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
	completed: { type: Boolean, default: false },
	totalProjects: { type: Number, default: 0 },
	priority: { type: String, default: "low" },
	totalEstimatedHours: Number,
	completionPercent: Number,
	clockIns: [Date],
	clockOuts: [Date],
	startBreaks: [Date],
	endBreaks: [Date],
	totalHours: Number,
	totalTimeCardHours: Number,
	companyName: { type: String, ref: "Company" },
});

const ProjectFile = mongoose.model("ProjectFile", projectFileSchema);

module.exports = ProjectFile;
