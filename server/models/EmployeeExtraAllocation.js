const mongoose = require("mongoose");

const employeeExtraAllocationSchema = new mongoose.Schema({
	empId: { type: String, ref: "Employee" },
	companyName: { type: String, ref: "Company" },
	additionalRegHoursWorked: { type: Number, default: 0 },
	additionalOvertimeHoursWorked: { type: Number, default: 0 },
	additionalDblOvertimeHoursWorked: { type: Number, default: 0 },
	additionalStatDayHoursWorked: { type: Number, default: 0 },
	additionalStatHoursWorked: { type: Number, default: 0 },
	additionalVacationHoursWorked: { type: Number, default: 0 },
	additionalSickHoursWorked: { type: Number, default: 0 },
	payPeriodStartDate: Date,
	payPeriodEndDate: Date,
	payPeriodPayDate: Date,
	payPeriodProcessingDate: Date,
	payPeriodNum: String,
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
});

const EmployeeExtraAllocation = mongoose.model(
	"EmployeeExtraAllocation",
	employeeExtraAllocationSchema,
);

module.exports = EmployeeExtraAllocation;
