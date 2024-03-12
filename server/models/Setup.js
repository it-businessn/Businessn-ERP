const mongoose = require("mongoose");

const setUpSchema = new mongoose.Schema({
	AssignLeadTo: Boolean,
	createdOn: { type: Date, default: Date.now },
	idleTimeHours: Number,
	idleTimeMinutes: Number,
	isIdleLeadReassignment: String,
});

const SetUp = mongoose.model("SetUp", setUpSchema);

module.exports = SetUp;
