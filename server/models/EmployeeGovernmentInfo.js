const mongoose = require("mongoose");

const employeeGovernmentInfoSchema = new mongoose.Schema({
	empId: { type: String, ref: "Employee" },
	companyName: { type: String, ref: "Company" },
	federalTax: String,
	regionalTax: String,
	federalTaxCredit: String,
	regionalTaxCredit: String,
	pensionPlanNumber: String,
	federalPensionEE: String,
	federalPensionER: String,
	federalEmploymentInsuranceEE: String,
	federalEmploymentInsuranceER: String,
	regionalEmployeeInjury: String,
	regionalEmployeeHealth: String,
	regionalEmployerInjury: String,
	regionalEmployerHealth: String,
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
	isCPPExempt: Boolean,
	isEIExempt: Boolean,
	isPIPExempt: Boolean,
	employmentCode: String,
});

const EmployeeGovernmentInfo = mongoose.model(
	"EmployeeGovernmentInfo",
	employeeGovernmentInfoSchema,
);

module.exports = EmployeeGovernmentInfo;
