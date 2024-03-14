const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
	projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
	taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
	name: String,
	completed: { type: Boolean, default: false },
	createdOn: { type: Date, default: Date.now },
	dueDate: Date,
	name: String,
	status: String,
	isOpen: Boolean,
	selectedAssignees: String,
	updatedOn: { type: Date, default: Date.now },
	timeToComplete: Number,
});

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;
