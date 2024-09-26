const mongoose = require("mongoose");

const timecardSchema = new mongoose.Schema({
	badge_id: {
		type: String,
		ref: "EmployeeProfileInfo",
	},
	employeeName: String,
	clockIn: Date,
	clockOut: Date,
	startBreaks: { type: [Date], default: [] },
	endBreaks: { type: [Date], default: [] },
	totalTimeCardHours: Number,
	updatedOn: { type: Date, default: Date.now },
	createdOn: { type: Date, default: Date.now },
	companyName: { type: String, ref: "Company" },
	totalBreakHours: { type: Number, default: "0" },
});

const Timecard = mongoose.model("Timecard", timecardSchema);

module.exports = Timecard;
