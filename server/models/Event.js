const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
	date: { type: Date, default: Date.now },
	description: String,
	eventType: String,
	meetingAttendees: String,
	meetingFromDate: Date,
	meetingFromTime: String,
	meetingLink: String,
	meetingLocation: String,
	meetingToDate: Date,
	meetingToTime: String,
	phoneNo: String,
	taskAssignee: String,
	taskDueDate: Date,
	taskDuration: Number,
	taskType: String,
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
