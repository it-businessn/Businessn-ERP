const mongoose = require("mongoose");

const employeeBalanceInfoSchema = new mongoose.Schema(
	{
		empId: { type: String, ref: "Employee" },
		companyName: { type: String, ref: "Company" },
		carryFwd: Boolean,
		typeOfVacationTreatment: String,
		vacationPayPercent: String,
		employerDentalBenefitReportCode: String,
		typeOfUnionDuesTreatment: String,
		unionDuesContribution: String,
		typeOfExtendedHealthEETreatment: String,
		extendedHealthEEContribution: String,
		typeOfDentalEETreatment: String,
		dentalEEContribution: String,
		typeOfPensionEETreatment: String,
		pensionEEContribution: String,
		typeOfExtendedHealthERTreatment: String,
		extendedHealthERContribution: String,
		typeOfDentalERTreatment: String,
		dentalERContribution: String,
		typeOfPensionERTreatment: String,
		pensionERContribution: String,
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const EmployeeBalanceInfo = mongoose.model("EmployeeBalanceInfo", employeeBalanceInfoSchema);

module.exports = EmployeeBalanceInfo;
