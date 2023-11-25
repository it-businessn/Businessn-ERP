const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  contactId: { type: mongoose.Schema.Types.ObjectId, ref: "Contact" },
  description: String,
  date: { type: Date, default: Date.now },
});

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;
