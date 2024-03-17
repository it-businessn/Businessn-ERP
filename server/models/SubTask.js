const mongoose = require("mongoose");

const subTaskSchema = new mongoose.Schema({
	projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
	taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },

	completed: { type: Boolean, default: false },
	createdOn: { type: Date, default: Date.now },
	dueDate: Date,
	taskName: String,
	status: String,
	isOpen: Boolean,
	selectedAssignees: Object,
	updatedOn: { type: Date, default: Date.now },
	timeToComplete: Number,
});

const SubTask = mongoose.model("SubTask", subTaskSchema);

module.exports = SubTask;
