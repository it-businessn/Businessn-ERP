const mongoose = require("mongoose");

const logActivitySchema = new mongoose.Schema({
	contactId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Contact",
	},
	createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
	description: String,
	type: String,
	duration: String,
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
});

const LogActivity = mongoose.model("LogActivity", logActivitySchema);

module.exports = LogActivity;
