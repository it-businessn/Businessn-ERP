const mongoose = require("mongoose");

const employeePayStubSchema = new mongoose.Schema({
	empId: { type: String, ref: "Employee" },
	companyName: { type: String, ref: "Company" },

	regPay: String,
	overTimePay: String,
	dblOverTimePay: String,
	statWorkPay: String,
	statPay: String,
	sickPay: String,
	vacationPay: String,
	commission: { type: Number, default: 0 },
	retroactive: { type: Number, default: 0 },
	reimbursement: { type: Number, default: 0 },
	vacationPayout: { type: Number, default: 0 },
	bonus: { type: Number, default: 0 },
	terminationPayout: { type: Number, default: 0 },

	payPeriodStartDate: Date,
	payPeriodEndDate: Date,
	payPeriodPayDate: Date,
	payPeriodProcessingDate: Date,
	payPeriodNum: String,
	isProcessed: Boolean,
	isExtraRun: Boolean,

	totalRegHoursWorked: Number,
	totalOvertimeHoursWorked: Number,
	totalDblOvertimeHoursWorked: Number,
	totalStatDayHoursWorked: Number,
	totalStatHours: Number,
	totalSickHoursWorked: Number,
	totalVacationHoursWorked: Number,

	currentRegPayTotal: Number,
	currentOverTimePayTotal: Number,
	currentDblOverTimePayTotal: Number,
	currentStatWorkPayTotal: Number,
	currentStatPayTotal: Number,
	currentSickPayTotal: Number,
	currentVacationPayTotal: Number,

	YTDRegPayTotal: { type: Number, default: 0 },
	YTDOverTimePayTotal: { type: Number, default: 0 },
	YTDDblOverTimePayTotal: { type: Number, default: 0 },
	YTDStatWorkPayTotal: { type: Number, default: 0 },
	YTDStatPayTotal: { type: Number, default: 0 },
	YTDSickPayTotal: { type: Number, default: 0 },
	YTDVacationPayTotal: { type: Number, default: 0 },

	YTDCommission: { type: Number, default: 0 },
	YTDRetroactive: { type: Number, default: 0 },
	// reimbursement: { type: Number, default: 0 },
	YTDVacationPayout: { type: Number, default: 0 },
	YTDBonus: { type: Number, default: 0 },
	YTDTerminationPayout: { type: Number, default: 0 },

	currentGrossPay: Number,
	YTDGrossPay: { type: Number, default: 0 },

	currentFDTaxDeductions: Number,
	YTD_FDTaxDeductions: { type: Number, default: 0 },

	currentStateTaxDeductions: Number,
	YTDStateTaxDeductions: { type: Number, default: 0 },

	currentCPPDeductions: Number,
	YTD_CPPDeductions: { type: Number, default: 0 },

	currentEIDeductions: Number,
	YTD_EIDeductions: { type: Number, default: 0 },

	currentOtherDeductions: Number,
	YTDOtherDeductions: { type: Number, default: 0 },

	currentDeductionsTotal: Number,
	YTDDeductionsTotal: { type: Number, default: 0 },

	currentNetPay: Number,
	YTDNetPay: { type: Number, default: 0 },

	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
});

const EmployeePayStub = mongoose.model(
	"EmployeePayStub",
	employeePayStubSchema,
);

module.exports = EmployeePayStub;
