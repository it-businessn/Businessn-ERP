const mongoose = require("mongoose");

const timecardSchema = new mongoose.Schema(
	{
		badge_id: {
			type: String,
			ref: "EmployeeProfileInfo",
		},
		employeeName: String,
		clockIn: Date,
		clockOut: Date,
		startBreaks: { type: [Date], default: [] },
		endBreaks: { type: [Date], default: [] },
		totalWorkedHours: String,
		companyName: { type: String, ref: "Company" },
		totalBreakHours: { type: String, default: "" },
		notDevice: Boolean,
		processedForTimesheet: Boolean,
		isDestroyedRecord: Boolean,
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const Timecard = mongoose.model("Timecard", timecardSchema);

module.exports = Timecard;
