const mongoose = require("mongoose");

const logTaskSchema = new mongoose.Schema({
	contactId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Contact",
	},
	createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
	description: String,
	status: { type: String, default: "Open" },
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
	dueDate: Date,
});

const LogTask = mongoose.model("LogTask", logTaskSchema);

module.exports = LogTask;
