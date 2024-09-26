const mongoose = require("mongoose");

const timecardRawSchema = new mongoose.Schema({
	user_id: String,
	timestamp: Date,
	status: String,
	punch: String,
	updatedOn: { type: Date, default: Date.now },
	createdOn: { type: Date, default: Date.now },
});

const TimecardRaw = mongoose.model("TimecardRaw", timecardRawSchema);

module.exports = TimecardRaw;
