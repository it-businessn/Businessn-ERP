const mongoose = require("mongoose");

const employeePayStubSchema = new mongoose.Schema(
	{
		empId: { type: String, ref: "Employee" },
		companyName: { type: String, ref: "Company" },
		payPeriodStartDate: Date,
		payPeriodEndDate: Date,
		payPeriodPayDate: Date,
		payPeriodProcessingDate: Date,
		payPeriodNum: String,
		isProcessed: { type: Boolean, default: false },
		isExtraRun: { type: Boolean, default: false },

		regPay: String,
		regPay2: String,
		currentRegPayTotal: { type: Number, default: 0 },
		currentRegPayTotal2: { type: Number, default: 0 },
		YTDRegPayTotal: { type: Number, default: 0 },
		YTDRegPayTotal2: { type: Number, default: 0 },
		totalRegHoursWorked: { type: Number, default: 0 },
		totalRegHoursWorked2: { type: Number, default: 0 },
		// totalPayoutRegHoursWorked: Number,
		// totalManualRegHoursWorked: Number,
		// totalSuperficialRegHoursWorked: Number,
		YTDRegHoursWorked: { type: Number, default: 0 },
		YTDRegHoursWorked2: { type: Number, default: 0 },

		overTimePay: String,
		currentOverTimePayTotal: { type: Number, default: 0 },
		YTDOverTimePayTotal: { type: Number, default: 0 },
		totalOvertimeHoursWorked: { type: Number, default: 0 },
		// totalPayoutOvertimeHoursWorked: Number,
		// totalManualOvertimeHoursWorked: Number,
		// totalSuperficialOvertimeHoursWorked: Number,
		YTDOvertimeHoursWorked: { type: Number, default: 0 },

		dblOverTimePay: String,
		currentDblOverTimePayTotal: { type: Number, default: 0 },
		YTDDblOverTimePayTotal: { type: Number, default: 0 },
		totalDblOvertimeHoursWorked: { type: Number, default: 0 },
		// totalPayoutDblOvertimeHoursWorked: Number,
		// totalManualDblOvertimeHoursWorked: Number,
		// totalSuperficialDblOvertimeHoursWorked: Number,
		YTDDblOvertimeHoursWorked: { type: Number, default: 0 },

		statPay: String,
		currentStatPayTotal: { type: Number, default: 0 },
		YTDStatPayTotal: { type: Number, default: 0 },
		totalStatHours: { type: Number, default: 0 },
		// totalPayoutStatHoursWorked: Number,
		// totalManualStatHoursWorked: Number,
		// totalSuperficialStatHoursWorked: Number,
		YTDStatHoursWorked: { type: Number, default: 0 },

		statWorkPay: String,
		currentStatWorkPayTotal: { type: Number, default: 0 },
		YTDStatWorkPayTotal: { type: Number, default: 0 },
		totalStatDayHoursWorked: { type: Number, default: 0 },
		// totalPayoutStatDayHoursWorked: Number,
		// totalManualStatDayHoursWorked: Number,
		// totalSuperficialStatDayHoursWorked: Number,
		YTDStatDayHoursWorked: { type: Number, default: 0 },

		sickPay: String,
		currentSickPayTotal: { type: Number, default: 0 },
		YTDSickPayTotal: { type: Number, default: 0 },
		totalSickHoursWorked: { type: Number, default: 0 },
		// totalPayoutSickHoursWorked: Number,
		// totalManualSickHoursWorked: Number,
		// totalSuperficialSickHoursWorked: Number,
		YTDSickHoursWorked: { type: Number, default: 0 },

		vacationPay: String,
		currentVacationPayTotal: { type: Number, default: 0 },
		YTDVacationPayTotal: { type: Number, default: 0 },
		totalVacationHoursWorked: { type: Number, default: 0 },
		// totalPayoutVacationHoursWorked: Number,
		// totalManualVacationHoursWorked: Number,
		// totalSuperficialVacationHoursWorked: Number,
		YTDVacationHoursWorked: { type: Number, default: 0 },

		bereavementPay: String,
		currentBereavementPayTotal: { type: Number, default: 0 },
		YTDBereavementPayTotal: { type: Number, default: 0 },
		totalBereavementHoursWorked: { type: Number, default: 0 },
		YTDBereavementHoursWorked: { type: Number, default: 0 },

		personalDayPay: String,
		currentPersonalDayPayTotal: { type: Number, default: 0 },
		YTDPersonalDayPayTotal: { type: Number, default: 0 },
		totalPersonalDayHoursWorked: { type: Number, default: 0 },
		YTDPersonalDayHoursWorked: { type: Number, default: 0 },

		sprayPay: { type: String, default: "1" },
		YTDSprayPayTotal: { type: Number, default: 0 },
		currentSprayPayTotal: { type: Number, default: 0 },
		totalSprayHoursWorked: { type: Number, default: 0 },
		YTDSprayHoursWorked: { type: Number, default: 0 },

		firstAidPay: { type: String, default: "0.5" },
		YTDFirstAidPayTotal: { type: Number, default: 0 },
		currentFirstAidPayTotal: { type: Number, default: 0 },
		totalFirstAidHoursWorked: { type: Number, default: 0 },
		YTDFirstAidHoursWorked: { type: Number, default: 0 },

		payInLieuPay: { type: Number, default: 0 },
		YTDPayInLieuPay: { type: Number, default: 0 },

		pILBenefitPay: { type: Number, default: 0 },
		YTDBenefitPay: { type: Number, default: 0 },

		bankedTimePay: { type: Number, default: 0 },
		YTDBankedTimePay: { type: Number, default: 0 },

		regularByAmount: { type: Number, default: 0 },
		YTDRegularByAmount: { type: Number, default: 0 },

		commission: { type: Number, default: 0 },
		YTDCommission: { type: Number, default: 0 },

		retroactive: { type: Number, default: 0 },
		YTDRetroactive: { type: Number, default: 0 },

		// reimbursement: { type: Number, default: 0 },

		vacationPayout: { type: Number, default: 0 },
		YTDVacationPayout: { type: Number, default: 0 },

		terminationPayout: { type: Number, default: 0 },
		YTDTerminationPayout: { type: Number, default: 0 },

		bonus: { type: Number, default: 0 },
		YTDBonus: { type: Number, default: 0 },

		currentFDTaxDeductions: { type: Number, default: 0 },
		YTD_FDTaxDeductions: { type: Number, default: 0 },

		currentStateTaxDeductions: { type: Number, default: 0 },
		YTDStateTaxDeductions: { type: Number, default: 0 },

		currentIncomeTaxDeductions: { type: Number, default: 0 },
		YTD_IncomeTaxDeductions: { type: Number, default: 0 },

		currentEmployeeEIDeductions: { type: Number, default: 0 },
		YTD_EmployeeEIDeductions: { type: Number, default: 0 },

		currentEmployerEIDeductions: { type: Number, default: 0 },
		YTD_EmployerEIDeductions: { type: Number, default: 0 },

		currentCPPDeductions: { type: Number, default: 0 },
		YTD_CPPDeductions: { type: Number, default: 0 },

		currentEmployerCPPDeductions: { type: Number, default: 0 },
		YTD_EmployerCPPDeductions: { type: Number, default: 0 },

		currentUnionDuesDeductions: { type: Number, default: 0 },
		YTDUnionDuesDeductions: { type: Number, default: 0 },

		currentEmployeeHealthContributions: { type: Number, default: 0 },
		YTDEmployeeHealthContributions: { type: Number, default: 0 },

		currentPrimaryDeposit: { type: Number, default: 0 },
		YTDPrimaryDeposit: { type: Number, default: 0 },

		currentEmployeePensionContributions: { type: Number, default: 0 },
		YTDEmployeePensionContributions: { type: Number, default: 0 },

		currentOtherDeductions: { type: Number, default: 0 },
		YTDOtherDeductions: { type: Number, default: 0 },

		currentGrossPay: { type: Number, default: 0 },
		YTDGrossPay: { type: Number, default: 0 },

		currentDeductionsTotal: { type: Number, default: 0 },
		YTDDeductionsTotal: { type: Number, default: 0 },

		currentNetPay: { type: Number, default: 0 },
		YTDNetPay: { type: Number, default: 0 },

		currentEmployerPensionContributions: { type: Number, default: 0 },
		YTDEmployerPensionContributions: { type: Number, default: 0 },

		currentEmployerHealthContributions: { type: Number, default: 0 },
		YTDEmployerHealthContributions: { type: Number, default: 0 },

		currentEmployerContributions: { type: Number, default: 0 },
		YTDEmployerContributions: { type: Number, default: 0 },

		currentVacationBalanceFwd: { type: Number, default: 0 },
		YTDVacationBalanceFwd: { type: Number, default: 0 },

		currentVacationAccrued: { type: Number, default: 0 },
		YTDVacationAccrued: { type: Number, default: 0 },

		currentVacationUsed: { type: Number, default: 0 },
		YTDVacationUsed: { type: Number, default: 0 },

		vacationBalance: { type: Number, default: 0 },
		YTDVacationBalance: { type: Number, default: 0 },

		currentSickAccrued: { type: Number, default: 0 },
		YTDSickAccrued: { type: Number, default: 0 },

		currentSickUsed: { type: Number, default: 0 },
		YTDSickUsed: { type: Number, default: 0 },

		sickBalance: { type: Number, default: 0 },
		YTDSickBalance: { type: Number, default: 0 },

		totalHoursWorked: { type: Number, default: 0 },
		totalPayoutHoursWorked: { type: Number, default: 0 },
		totalManualHoursWorked: { type: Number, default: 0 },
		totalSuperficialHoursWorked: { type: Number, default: 0 },

		totalAmountAllocated: { type: Number, default: 0 },
		reportType: String,
		scheduleFrequency: String,
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const EmployeePayStub = mongoose.model("EmployeePayStub", employeePayStubSchema);

module.exports = EmployeePayStub;
