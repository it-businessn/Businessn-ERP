const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
	timeToComplete: Number,
	dueDate: Date,
	status: String,
	name: String,
	tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
