const mongoose = require("mongoose");

const employeeExtraAllocationSchema = new mongoose.Schema({
	empId: { type: String, ref: "Employee" },
	companyName: { type: String, ref: "Company" },
	additionalRegHoursWorked: { type: Number, default: 0 },
	additionalPayoutRegHoursWorked: { type: Number, default: 0 },
	additionalManualRegHoursWorked: { type: Number, default: 0 },
	additionalSuperficialRegHoursWorked: { type: Number, default: 0 },

	additionalOvertimeHoursWorked: { type: Number, default: 0 },
	additionalPayoutOvertimeHoursWorked: { type: Number, default: 0 },
	additionalManualOvertimeHoursWorked: { type: Number, default: 0 },
	additionalSuperficialOvertimeHoursWorked: { type: Number, default: 0 },

	additionalDblOvertimeHoursWorked: { type: Number, default: 0 },
	additionalPayoutDblOvertimeHoursWorked: { type: Number, default: 0 },
	additionalManualDblOvertimeHoursWorked: { type: Number, default: 0 },
	additionalSuperficialDblOvertimeHoursWorked: { type: Number, default: 0 },

	additionalStatDayHoursWorked: { type: Number, default: 0 },
	additionalPayoutStatDayHoursWorked: { type: Number, default: 0 },
	additionalManualStatDayHoursWorked: { type: Number, default: 0 },
	additionalSuperficialStatDayHoursWorked: { type: Number, default: 0 },

	additionalStatHoursWorked: { type: Number, default: 0 },
	additionalPayoutStatHoursWorked: { type: Number, default: 0 },
	additionalManualStatHoursWorked: { type: Number, default: 0 },
	additionalSuperficialStatHoursWorked: { type: Number, default: 0 },

	additionalVacationHoursWorked: { type: Number, default: 0 },
	additionalPayoutVacationHoursWorked: { type: Number, default: 0 },
	additionalManualVacationHoursWorked: { type: Number, default: 0 },
	additionalSuperficialVacationHoursWorked: { type: Number, default: 0 },

	additionalSickHoursWorked: { type: Number, default: 0 },
	additionalPayoutSickHoursWorked: { type: Number, default: 0 },
	additionalManualSickHoursWorked: { type: Number, default: 0 },
	additionalSuperficialSickHoursWorked: { type: Number, default: 0 },

	payPeriodStartDate: Date,
	payPeriodEndDate: Date,
	payPeriodPayDate: Date,
	payPeriodProcessingDate: Date,
	payPeriodNum: String,
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },

	commission: { type: Number, default: 0 },
	retroactive: { type: Number, default: 0 },
	reimbursement: { type: Number, default: 0 },
	bonus: { type: Number, default: 0 },
	terminationPayout: { type: Number, default: 0 },
	vacationPayout: { type: Number, default: 0 },
	vacationBalAdjust: { type: Number, default: 0 },
	vacationAccrual: { type: Number, default: 0 },
	vacationUsed: { type: Number, default: 0 },
	federalTax: { type: Number, default: 0 },
	provTax: { type: Number, default: 0 },
	incomeTax: { type: Number, default: 0 },

	commissionPayout: { type: Number, default: 0 },
	retroactivePayout: { type: Number, default: 0 },
	reimbursementPayout: { type: Number, default: 0 },
	bonusPayout: { type: Number, default: 0 },
	terminationPayoutPayout: { type: Number, default: 0 },
	vacationPayoutPayout: { type: Number, default: 0 },
	vacationBalAdjustPayout: { type: Number, default: 0 },
	vacationAccrualPayout: { type: Number, default: 0 },
	vacationUsedPayout: { type: Number, default: 0 },
	federalTaxPayout: { type: Number, default: 0 },
	provTaxPayout: { type: Number, default: 0 },
	incomeTaxPayout: { type: Number, default: 0 },

	commissionManual: { type: Number, default: 0 },
	retroactiveManual: { type: Number, default: 0 },
	reimbursementManual: { type: Number, default: 0 },
	bonusManual: { type: Number, default: 0 },
	terminationPayoutManual: { type: Number, default: 0 },
	vacationPayoutManual: { type: Number, default: 0 },
	vacationBalAdjustManual: { type: Number, default: 0 },
	vacationAccrualManual: { type: Number, default: 0 },
	vacationUsedManual: { type: Number, default: 0 },
	federalTaxManual: { type: Number, default: 0 },
	provTaxManual: { type: Number, default: 0 },
	incomeTaxManual: { type: Number, default: 0 },

	commissionSuperficial: { type: Number, default: 0 },
	retroactiveSuperficial: { type: Number, default: 0 },
	reimbursementSuperficial: { type: Number, default: 0 },
	bonusSuperficial: { type: Number, default: 0 },
	terminationPayoutSuperficial: { type: Number, default: 0 },
	vacationPayoutSuperficial: { type: Number, default: 0 },
	vacationBalAdjustSuperficial: { type: Number, default: 0 },
	vacationAccrualSuperficial: { type: Number, default: 0 },
	vacationUsedSuperficial: { type: Number, default: 0 },
	federalTaxSuperficial: { type: Number, default: 0 },
	provTaxSuperficial: { type: Number, default: 0 },
	incomeTaxSuperficial: { type: Number, default: 0 },

	totalAmountAllocated: { type: Number, default: 0 },
});

const EmployeeExtraAllocation = mongoose.model(
	"EmployeeExtraAllocation",
	employeeExtraAllocationSchema,
);

module.exports = EmployeeExtraAllocation;
