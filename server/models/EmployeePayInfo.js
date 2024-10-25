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
	typeOfEarning: { type: String, default: "Hourly" },
	fullTimeStandardHours: { type: String, default: "80" },
	partTimeStandardHours: String,
	typeOfVacationTreatment: { type: String, default: "Accrued" },
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
});

const EmployeePayInfo = mongoose.model(
	"EmployeePayInfo",
	employeePayInfoSchema,
);

module.exports = EmployeePayInfo;
