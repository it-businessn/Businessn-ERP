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

// AUD-015 (docs/TECHNICAL.md U3/I4): lookup index for the (companyName, empId) filter.
// Not unique: onBoardNewUser creates this record without checking for an
// existing one, so duplicates can exist (see scripts/check-duplicates.js).
employeeBalanceInfoSchema.index({ companyName: 1, empId: 1 });

const EmployeeBalanceInfo = mongoose.model("EmployeeBalanceInfo", employeeBalanceInfoSchema);

module.exports = EmployeeBalanceInfo;
