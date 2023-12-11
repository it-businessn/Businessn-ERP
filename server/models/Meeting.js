const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  contactId: { type: mongoose.Schema.Types.ObjectId, ref: "Contact" },
  type: String,
  description: String,
  attendees: String,
  location: String,
  fromDate: Date,
  fromTime: String,
  toDate: Date,
  toTime: String,
  date: { type: Date, default: Date.now },
  meetingLink: String,
});

const Meeting = mongoose.model("Meeting", meetingSchema);

module.exports = Meeting;
