const mongoose = require("mongoose");

const dailyTotalsSchema = new mongoose.Schema(
	{
		crew: { type: String, ref: "Crew" },
		date: Date,
		dayHours: Number,
		dayWages: Number,
		runningTotal: Number,
		month: Number,
		year: Number,
		companyName: { type: String, ref: "Company" },
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const DailyTotals = mongoose.model("DailyTotals", dailyTotalsSchema);

module.exports = DailyTotals;
