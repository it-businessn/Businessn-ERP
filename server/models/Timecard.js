const mongoose = require("mongoose");

const timecardSchema = new mongoose.Schema({
	user_id: String,
	timestamp: Date,
	status: String,
	punch: String,
	updatedOn: { type: Date, default: Date.now },
	createdOn: { type: Date, default: Date.now },
	employeeId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Employee",
	},
	employeeName: String,
});

const Timecard = mongoose.model("Timecard", timecardSchema);

module.exports = Timecard;
