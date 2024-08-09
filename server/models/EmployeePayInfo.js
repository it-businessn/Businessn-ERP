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
	salaryRate: String,
	dailyHours: String,
	longTermDisabilityEE: String,
	longTermDisabilityER: String,
	dentalEE: String,
	dentalER: String,
	extendedHealthEE: String,
	extendedHealthER: String,
	unionDues: String,
	commission: { type: Number, default: 0 },
	retroactive: { type: Number, default: 0 },
	reimbursement: { type: Number, default: 0 },
	vacationPayout: { type: Number, default: 0 },
	bonus: { type: Number, default: 0 },
	terminationPayout: { type: Number, default: 0 },
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
});

const EmployeePayInfo = mongoose.model(
	"EmployeePayInfo",
	employeePayInfoSchema,
);

module.exports = EmployeePayInfo;
