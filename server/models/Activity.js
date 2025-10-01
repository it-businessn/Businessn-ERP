const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
	{
		projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
		taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },

		completed: { type: Boolean, default: false },
		dueDate: Date,
		taskName: String,
		status: String,
		isOpen: Boolean,
		selectedAssignees: String,
		timeToComplete: Number,
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;
