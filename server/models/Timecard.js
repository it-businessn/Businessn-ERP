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

// Performance (F-04): indexes for the query shapes used by the controllers.
// Fields are unchanged; Mongoose builds these in the background on startup.
timecardSchema.index({ companyName: 1, badge_id: 1, clockIn: -1 });

const Timecard = mongoose.model("Timecard", timecardSchema);

module.exports = Timecard;
