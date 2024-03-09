const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
	contactId: { type: mongoose.Schema.Types.ObjectId, ref: "Contact" },
	date: { type: Date, default: Date.now },
	description: String,
	duration: Number,
	phoneCalls: Number,
	type: String,
});

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;
