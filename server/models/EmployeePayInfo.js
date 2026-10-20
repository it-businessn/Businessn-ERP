const mongoose = require("mongoose");

const employeePayInfoSchema = new mongoose.Schema(
	{
		empId: { type: String, ref: "Employee" },
		companyName: { type: String, ref: "Company" },
		regPay: String,
		overTimePay: String,
		dblOverTimePay: String,
		statWorkPay: String,
		statPay: String,
		sickPay: String,
		vacationPay: String,
		bereavementPay: String,
		salaryRate: String,
		dailyHours: String,
		typeOfEarning: { type: String, default: "Hourly" },
		fullTimeStandardHours: { type: String, default: "80" },
		partTimeStandardHours: String,
		roles: { type: Array, default: [] },
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

// Performance (F-04): indexes for the query shapes used by the controllers.
// Fields are unchanged; Mongoose builds these in the background on startup.
employeePayInfoSchema.index({ companyName: 1, empId: 1 });

const EmployeePayInfo = mongoose.model("EmployeePayInfo", employeePayInfoSchema);

module.exports = EmployeePayInfo;
