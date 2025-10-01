const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
	{
		fileId: { type: mongoose.Schema.Types.ObjectId, ref: "ProjectFile" },
		dueDate: Date,
		projectName: String,
		status: String,
		isOpen: Boolean,
		tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
		selectedAssigneesId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
		notes: String,
		completed: { type: Boolean, default: false },
		selectedAssignees: { type: Array, default: [] },
		timeToComplete: Number,
		actualHours: { type: Number, default: 0 },
		totalTasks: { type: Number, default: 0 },
		priority: { type: String, default: "low" },
		totalEstimatedHours: Number,
		completionPercent: Number,
		companyName: { type: String, ref: "Company" },
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
