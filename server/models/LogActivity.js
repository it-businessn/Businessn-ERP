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
	email: String,
	linkedInContact: String,
	phone: String,
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
	companyName: { type: String, ref: "Company" },
});

const LogActivity = mongoose.model("LogActivity", logActivitySchema);

module.exports = LogActivity;
