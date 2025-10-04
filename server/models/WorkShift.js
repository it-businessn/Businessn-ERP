const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema(
	{
		empName: String,
		payRate: String,
		role: String,
		notes: String,
		location: { type: String, ref: "Location" },
		shiftDate: Date,
		shiftStart: String,
		shiftEnd: String,
		repeatSchedule: Boolean,
		repeatDuration: String,
		breakStart: Date,
		breakDuration: String,
		crew: String,
		breakEnd: Date,
		companyName: { type: String, ref: "Company" },
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const WorkShift = mongoose.model("WorkShift", shiftSchema);

module.exports = WorkShift;
