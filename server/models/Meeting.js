const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
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
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
	companyName: { type: String, ref: "Company" },
});

const Meeting = mongoose.model("Meeting", meetingSchema);

module.exports = Meeting;
