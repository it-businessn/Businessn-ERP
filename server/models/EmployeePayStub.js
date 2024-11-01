const mongoose = require("mongoose");

const employeePayStubSchema = new mongoose.Schema({
	empId: { type: String, ref: "Employee" },
	companyName: { type: String, ref: "Company" },
	payPeriodStartDate: Date,
	payPeriodEndDate: Date,
	payPeriodPayDate: Date,
	payPeriodProcessingDate: Date,
	payPeriodNum: String,
	isProcessed: { type: Boolean, default: false },
	isExtraRun: { type: Boolean, default: false },
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },

	regPay: String,
	currentRegPayTotal: Number,
	YTDRegPayTotal: { type: Number, default: 0 },
	totalRegHoursWorked: Number,
	YTDRegHoursWorked: { type: Number, default: 0 },

	overTimePay: String,
	currentOverTimePayTotal: Number,
	YTDOverTimePayTotal: { type: Number, default: 0 },
	totalOvertimeHoursWorked: Number,
	YTDOvertimeHoursWorked: { type: Number, default: 0 },

	dblOverTimePay: String,
	currentDblOverTimePayTotal: Number,
	YTDDblOverTimePayTotal: { type: Number, default: 0 },
	totalDblOvertimeHoursWorked: Number,
	YTDDblOvertimeHoursWorked: { type: Number, default: 0 },

	statPay: String,
	currentStatPayTotal: Number,
	YTDStatPayTotal: { type: Number, default: 0 },
	totalStatHours: Number,
	YTDStatHoursWorked: { type: Number, default: 0 },

	statWorkPay: String,
	currentStatWorkPayTotal: Number,
	YTDStatWorkPayTotal: { type: Number, default: 0 },
	totalStatDayHoursWorked: Number,
	YTDStatDayHoursWorked: { type: Number, default: 0 },

	sickPay: String,
	currentSickPayTotal: Number,
	YTDSickPayTotal: { type: Number, default: 0 },
	totalSickHoursWorked: Number,
	YTDSickHoursWorked: { type: Number, default: 0 },

	vacationPay: String,
	currentVacationPayTotal: Number,
	YTDVacationPayTotal: { type: Number, default: 0 },
	totalVacationHoursWorked: Number,
	YTDVacationHoursWorked: { type: Number, default: 0 },

	sprayPay: { type: String, default: "1" },
	YTDSprayPayTotal: { type: Number, default: 0 },
	currentSprayPayTotal: Number,
	totalSprayHoursWorked: Number,
	YTDSprayHoursWorked: { type: Number, default: 0 },

	firstAidPay: { type: String, default: "0.5" },
	YTDFirstAidPayTotal: { type: Number, default: 0 },
	currentFirstAidPayTotal: Number,
	totalFirstAidHoursWorked: Number,
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

	currentFDTaxDeductions: Number,
	YTD_FDTaxDeductions: { type: Number, default: 0 },

	currentStateTaxDeductions: Number,
	YTDStateTaxDeductions: { type: Number, default: 0 },

	currentEmployeeEIDeductions: Number,
	YTD_EmployeeEIDeductions: { type: Number, default: 0 },

	currentEmployerEIDeductions: Number,
	YTD_EmployerEIDeductions: { type: Number, default: 0 },

	currentCPPDeductions: Number,
	YTD_CPPDeductions: { type: Number, default: 0 },

	currentUnionDuesDeductions: Number,
	YTDUnionDuesDeductions: { type: Number, default: 0 },

	currentEmployeeHealthContributions: Number,
	YTDEmployeeHealthContributions: { type: Number, default: 0 },

	currentPrimaryDeposit: { type: Number, default: 0 },
	YTDPrimaryDeposit: { type: Number, default: 0 },

	currentEmployeePensionContributions: Number,
	YTDEmployeePensionContributions: { type: Number, default: 0 },

	currentOtherDeductions: Number,
	YTDOtherDeductions: { type: Number, default: 0 },

	currentGrossPay: Number,
	YTDGrossPay: { type: Number, default: 0 },

	currentDeductionsTotal: Number,
	YTDDeductionsTotal: { type: Number, default: 0 },

	currentNetPay: Number,
	YTDNetPay: { type: Number, default: 0 },

	currentEmployerPensionContributions: Number,
	YTDEmployerPensionContributions: { type: Number, default: 0 },

	currentEmployerHealthContributions: Number,
	YTDEmployerHealthContributions: { type: Number, default: 0 },

	currentEmployerContributions: Number,
	YTDEmployerContributions: { type: Number, default: 0 },

	currentVacationBalanceFwd: Number,
	YTDVacationBalanceFwd: { type: Number, default: 0 },

	currentVacationAccrued: Number,
	YTDVacationAccrued: { type: Number, default: 0 },

	currentVacationUsed: Number,
	YTDVacationUsed: { type: Number, default: 0 },

	vacationBalance: Number,
	YTDVacationBalance: { type: Number, default: 0 },

	currentSickAccrued: Number,
	YTDSickAccrued: { type: Number, default: 0 },

	currentSickUsed: Number,
	YTDSickUsed: { type: Number, default: 0 },

	sickBalance: Number,
	YTDSickBalance: { type: Number, default: 0 },
});

const EmployeePayStub = mongoose.model(
	"EmployeePayStub",
	employeePayStubSchema,
);

module.exports = EmployeePayStub;
