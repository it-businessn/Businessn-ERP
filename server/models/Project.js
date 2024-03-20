const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
	timeToComplete: Number,
	startDate: Date,
	dueDate: Date,
	status: String,
	name: String,
	priority: String,
	selectedAssignees: Object,
	managerName: String,
	managerId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
	tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
	completed: { type: Boolean, default: false },
	totalTasks: { type: Number, default: 0 },
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
