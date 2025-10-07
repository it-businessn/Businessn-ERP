const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema(
	{
		empName: String,
		payRate: { type: String, ref: "EmployeePayInfo" },
		role: String,
		notes: String,
		email: { type: String, ref: "Employee" },
		location: { type: String, ref: "Location" },
		shiftDate: Date,
		shiftStart: String,
		shiftEnd: String,
		repeatSchedule: Boolean,
		repeatDuration: String,
		breakStart: Date,
		breakDuration: String,
		crew: { type: String, ref: "Crew" },
		breakEnd: Date,
		companyName: { type: String, ref: "Company" },
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const WorkShift = mongoose.model("WorkShift", shiftSchema);

module.exports = WorkShift;
