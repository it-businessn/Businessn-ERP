const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
	description: String,
	eventLink: String,
	eventType: String,
	fromDate: Date,
	fromTime: String,
	location: String,
	meetingAttendees: Object,
	toDate: Date,
	toTime: String,
	createdOn: { type: Date, default: Date.now },
	companyName: { type: String, ref: "Company" },
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
