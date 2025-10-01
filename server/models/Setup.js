const mongoose = require("mongoose");

const setUpSchema = new mongoose.Schema(
	{
		AssignLeadTo: Boolean,
		idleTimeHours: Number,
		idleTimeMinutes: Number,
		isIdleLeadReassignment: String,
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const SetUp = mongoose.model("SetUp", setUpSchema);

module.exports = SetUp;
