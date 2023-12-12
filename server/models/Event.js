const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventType: String,
  description: String,
  meetingFromDate: Date,
  meetingToDate: Date,
  meetingFromTime: String,
  meetingToTime: String,
  meetingAttendees: String,
  meetingLocation: String,
  meetingLink: String,
  taskType: String,
  taskDueDate: Date,
  taskAssignee: String,
  taskDuration: Number,
  phoneNo: String,
  date: { type: Date, default: Date.now },
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
