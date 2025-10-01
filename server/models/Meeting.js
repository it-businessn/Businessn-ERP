const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
	{
		description: String,
		fromDate: Date,
		fromTime: String,
		location: String,
		meetingLink: String,
		toDate: Date,
		toTime: String,
		type: String,
		contactId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Contact",
		},
		createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
		attendees: { type: Array, default: [] },
		companyName: { type: String, ref: "Company" },
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const Meeting = mongoose.model("Meeting", meetingSchema);

module.exports = Meeting;
