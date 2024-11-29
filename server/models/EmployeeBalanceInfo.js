const mongoose = require("mongoose");

const employeeBalanceInfoSchema = new mongoose.Schema({
	empId: { type: String, ref: "Employee" },
	companyName: { type: String, ref: "Company" },
	carryFwd: Boolean,
	typeOfVacationTreatment: { type: String, default: "Accrued" },
	vacationPayPercent: String,
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
	employerDentalBenefitReportCode: String,
});

const EmployeeBalanceInfo = mongoose.model("EmployeeBalanceInfo", employeeBalanceInfoSchema);

module.exports = EmployeeBalanceInfo;
