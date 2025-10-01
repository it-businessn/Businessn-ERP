const mongoose = require("mongoose");

const logActivitySchema = new mongoose.Schema(
	{
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
		companyName: { type: String, ref: "Company" },
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const LogActivity = mongoose.model("LogActivity", logActivitySchema);

module.exports = LogActivity;
