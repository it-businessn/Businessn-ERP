const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
	timeToComplete: Number,
	dueDate: Date,
	status: String,
	name: String,
	selectedAssignees: Object,
	tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
	completed: { type: Boolean, default: false },
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
