const mongoose = require("mongoose");

const employeeGovernmentInfoSchema = new mongoose.Schema(
	{
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
		isCPPExempt: { type: Boolean, default: false },
		isEIExempt: { type: Boolean, default: false },
		// PAYROLL-CALC: TD1 claim code 0 - no personal amounts (e.g. a second job).
		// Otherwise a blank or 0 tax credit means the basic personal amount.
		isTD1ClaimCodeZero: { type: Boolean, default: false },
		isPIPExempt: Boolean,
		employmentCode: String,
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

// AUD-015 (docs/TECHNICAL.md U3/I4): lookup index for the (companyName, empId) filter.
// Not unique: onBoardNewUser creates this record without checking for an
// existing one, so duplicates can exist (see scripts/check-duplicates.js).
employeeGovernmentInfoSchema.index({ companyName: 1, empId: 1 });

const EmployeeGovernmentInfo = mongoose.model(
	"EmployeeGovernmentInfo",
	employeeGovernmentInfoSchema,
);

module.exports = EmployeeGovernmentInfo;
