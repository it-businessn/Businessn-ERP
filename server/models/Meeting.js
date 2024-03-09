const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
	attendees: String,
	contactId: { type: mongoose.Schema.Types.ObjectId, ref: "Contact" },
	date: { type: Date, default: Date.now },
	description: String,
	fromDate: Date,
	fromTime: String,
	location: String,
	meetingLink: String,
	toDate: Date,
	toTime: String,
	type: String,
});

const Meeting = mongoose.model("Meeting", meetingSchema);

module.exports = Meeting;
