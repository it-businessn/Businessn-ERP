const mongoose = require("mongoose");

const employeeScheduleEmailLogSchema = new mongoose.Schema(
	{
		employeeEmail: { type: String, ref: "Employee" },
		employeeName: { type: String, ref: "Employee" },
		scheduleWeek: String,
		sentAt: Date,
		status: { type: String, enum: ["SENT", "FAILED"], required: true },
		companyName: { type: String, ref: "Company" },
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const EmployeeScheduleEmailLog = mongoose.model(
	"EmployeeScheduleEmailLog",
	employeeScheduleEmailLogSchema,
);

module.exports = EmployeeScheduleEmailLog;
