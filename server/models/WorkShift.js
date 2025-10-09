const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema(
	{
		empId: { type: String, ref: "Employee" },
		empName: { type: String, ref: "Employee" },
		email: { type: String, ref: "Employee" },
		payRate: { type: String, ref: "EmployeePayInfo" },
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
		crew: { type: String, ref: "Crew" },
		breakEnd: Date,
		companyName: { type: String, ref: "Company" },
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const WorkShift = mongoose.model("WorkShift", shiftSchema);

module.exports = WorkShift;
