const mongoose = require("mongoose");

const employeeBalanceInfoSchema = new mongoose.Schema({
	empId: { type: String, ref: "Employee" },
	companyName: { type: String, ref: "Company" },
	regPay: Number,
	overTimePay: Number,
	dblOverTimePay: Number,
	statWorkPay: Number,
	statPay: Number,
	sickPay: Number,
	salaryRate: Number,
	dailyHours: Number,
	longTermDisabilityEE: Number,
	longTermDisabilityER: Number,
	dentalEE: Number,
	dentalER: Number,
	extendedHealthEE: Number,
	extendedHealthER: Number,
	unionDues: Number,
	vacationPay: Number,
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
});

const EmployeeBalanceInfo = mongoose.model(
	"EmployeeBalanceInfo",
	employeeBalanceInfoSchema,
);

module.exports = EmployeeBalanceInfo;
