const mongoose = require("mongoose");

const logTaskSchema = new mongoose.Schema(
	{
		contactId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Contact",
		},
		createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
		description: String,
		status: { type: String, default: "Open" },
		dueDate: Date,
		companyName: { type: String, ref: "Company" },
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const LogTask = mongoose.model("LogTask", logTaskSchema);

module.exports = LogTask;
