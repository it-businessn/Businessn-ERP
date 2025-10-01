const mongoose = require("mongoose");

const timecardRawSchema = new mongoose.Schema(
	{
		user_id: String,
		timestamp: Date,
		status: String,
		punch: String,
		notDevice: Boolean,
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const TimecardRaw = mongoose.model("TimecardRaw", timecardRawSchema);

module.exports = TimecardRaw;
