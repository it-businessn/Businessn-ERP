const mongoose = require("mongoose");

const employeePayInfoSchema = new mongoose.Schema({
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
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
	roles: { type: Array, default: [] },
});

const EmployeePayInfo = mongoose.model("EmployeePayInfo", employeePayInfoSchema);

module.exports = EmployeePayInfo;
