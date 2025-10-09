const mongoose = require("mongoose");

const dailyTotalsSchema = new mongoose.Schema(
	{
		crew: { type: String, ref: "Crew" },
		date: Date,
		dayHours: Number,
		dayWages: Number,
		crewMonthlyRunningTotal: Number,
		month: Number,
		year: Number,
		monthTotalsByRole: [
			{
				role: String,
				roleRunningTotal: Number,
			},
		],
		companyName: { type: String, ref: "Company" },
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const DailyTotals = mongoose.model("DailyTotals", dailyTotalsSchema);

module.exports = DailyTotals;
