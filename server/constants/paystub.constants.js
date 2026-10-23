/**
 * PAYSTUB-EMAIL: row definitions for the e-mailed pay stub PDF. A copy of the
 * in-app statement's definitions (client/src/erp-modules/payroll/process-payroll/
 * preview-reports/data.js: EARNINGS_TYPES, DEDUCTION_TYPES, NET_SUMMARY,
 * ACCRUAL_TYPES), same names, order and stub fields, so the attachment shows
 * exactly the lines the printed PayStubStatement shows. Keep the two in sync.
 *
 * `rate` / `totalHours` / `YTDHoursTotal` of 0 mean "no such column" (the client
 * reads data[0], i.e. undefined, and renders 0).
 */
const amountRow = (name, currentTotal, YTDTotal) => ({
	name,
	rate: 0,
	totalHours: 0,
	currentTotal,
	YTDTotal,
	YTDHoursTotal: 0,
	isEarning: false,
});

const hourlyRow = (name, rate, totalHours, currentTotal, YTDHoursTotal, YTDTotal) => ({
	name,
	rate,
	totalHours,
	currentTotal,
	YTDHoursTotal,
	YTDTotal,
	isEarning: true,
});

const EARNINGS_TYPES = [
	hourlyRow(
		"Regular",
		"regPay",
		"totalRegHoursWorked",
		"currentRegPayTotal",
		"YTDRegHoursWorked",
		"YTDRegPayTotal",
	),
	hourlyRow(
		"Overtime",
		"overTimePay",
		"totalOvertimeHoursWorked",
		"currentOverTimePayTotal",
		"YTDOvertimeHoursWorked",
		"YTDOverTimePayTotal",
	),
	hourlyRow(
		"Double Overtime",
		"dblOverTimePay",
		"totalDblOvertimeHoursWorked",
		"currentDblOverTimePayTotal",
		"YTDDblOvertimeHoursWorked",
		"YTDDblOverTimePayTotal",
	),
	hourlyRow(
		"Statutory Pay",
		"statPay",
		"totalStatHours",
		"currentStatPayTotal",
		"YTDStatHoursWorked",
		"YTDStatPayTotal",
	),
	hourlyRow(
		"Statutory Worked Pay",
		"statWorkPay",
		"totalStatDayHoursWorked",
		"currentStatWorkPayTotal",
		"YTDStatDayHoursWorked",
		"YTDStatWorkPayTotal",
	),
	hourlyRow(
		"Sick Pay",
		"sickPay",
		"totalSickHoursWorked",
		"currentSickPayTotal",
		"YTDSickHoursWorked",
		"YTDSickPayTotal",
	),
	amountRow("Pay In Lieu", "payInLieuPay", "YTDPayInLieuPay"),
	amountRow("PIL Benefit", "pILBenefitPay", "YTDBenefitPay"),
	amountRow("Bonus", "bonus", "YTDBonus"),
	hourlyRow(
		"Vacation Pay",
		"vacationPay",
		"totalVacationHoursWorked",
		"currentVacationPayTotal",
		"YTDVacationHoursWorked",
		"YTDVacationPayTotal",
	),
	hourlyRow(
		"Bereavement Pay",
		"bereavementPay",
		"totalBereavementHoursWorked",
		"currentBereavementPayTotal",
		"YTDBereavementHoursWorked",
		"YTDBereavementPayTotal",
	),
	hourlyRow(
		"Personal Day Pay",
		"personalDayPay",
		"totalPersonalDayHoursWorked",
		"currentPersonalDayPayTotal",
		"YTDPersonalDayHoursWorked",
		"YTDPersonalDayPayTotal",
	),
	amountRow("Vacation Payout", "vacationPayout", "YTDVacationPayout"),
	amountRow("Termination Payout", "terminationPayout", "YTDTerminationPayout"),
	amountRow("Banked Time", "bankedTimePay", "YTDBankedTimePay"),
	amountRow("Regular By Amount", "regularByAmount", "YTDRegularByAmount"),
	hourlyRow(
		"Spray",
		"sprayPay",
		"totalSprayHoursWorked",
		"currentSprayPayTotal",
		"YTDSprayHoursWorked",
		"YTDSprayPayTotal",
	),
	hourlyRow(
		"First Aid",
		"firstAidPay",
		"totalFirstAidHoursWorked",
		"currentFirstAidPayTotal",
		"YTDFirstAidHoursWorked",
		"YTDFirstAidPayTotal",
	),
	amountRow("Retroactive", "retroactive", "YTDRetroactive"),
	amountRow("Commission", "commission", "YTDCommission"),
	hourlyRow(
		"Regular 2",
		"regPay2",
		"totalRegHoursWorked2",
		"currentRegPayTotal2",
		"YTDRegHoursWorked2",
		"YTDRegPayTotal2",
	),
	amountRow("Gross Earnings", "currentGrossPay", "YTDGrossPay"),
];

const DEDUCTION_TYPES = [
	amountRow("Income Tax", "currentIncomeTaxDeductions", "YTD_IncomeTaxDeductions"),
	amountRow("Federal Tax", "currentFDTaxDeductions", "YTD_FDTaxDeductions"),
	amountRow("Provincial Tax", "currentStateTaxDeductions", "YTDStateTaxDeductions"),
	amountRow("EI", "currentEmployeeEIDeductions", "YTD_EmployeeEIDeductions"),
	amountRow("CPP", "currentCPPDeductions", "YTD_CPPDeductions"),
	amountRow("Union Dues", "currentUnionDuesDeductions", "YTDUnionDuesDeductions"),
	amountRow(
		"Health Contribution",
		"currentEmployeeHealthContributions",
		"YTDEmployeeHealthContributions",
	),
	amountRow("Primary Deposit", "currentPrimaryDeposit", "YTDPrimaryDeposit"),
	amountRow(
		"Pension Contribution",
		"currentEmployeePensionContributions",
		"YTDEmployeePensionContributions",
	),
	amountRow("Total Deductions", "currentDeductionsTotal", "YTDDeductionsTotal"),
];

const NET_SUMMARY = [
	amountRow("Gross Earnings", "currentGrossPay", "YTDGrossPay"),
	amountRow("Total Deductions", "currentDeductionsTotal", "YTDDeductionsTotal"),
	amountRow("Net Pay", "currentNetPay", "YTDNetPay"),
];

const ACCRUAL_TYPES = [
	{
		type: "Employer Paid Benefits",
		items: [
			amountRow("EI", "currentEmployerEIDeductions", "YTD_EmployerEIDeductions"),
			amountRow("CPP", "currentCPPDeductions", "YTD_CPPDeductions"),
			amountRow(
				"Pension Contribution",
				"currentEmployerPensionContributions",
				"YTDEmployerPensionContributions",
			),
			amountRow(
				"Health Contribution",
				"currentEmployerHealthContributions",
				"YTDEmployerHealthContributions",
			),
			amountRow(
				"Total Employer Paid Benefits",
				"currentEmployerContributions",
				"YTDEmployerContributions",
			),
		],
	},
	{
		type: "Vacation",
		items: [
			amountRow("Balance Adjustment", "currentVacationBalanceFwd", "YTDVacationBalanceFwd"),
			amountRow("Vacation Accrual", "currentVacationAccrued", "YTDVacationAccrued"),
			amountRow("Vacation Used", "currentVacationUsed", "YTDVacationUsed"),
			amountRow("Available Balance", "vacationBalance", "YTDVacationBalance"),
		],
	},
];

const SUM_TOTALS = ["Gross ", "Total ", "Available ", "Net Pay"];
const EARNINGS_COLS = ["", "Rate", "Hours", "Curr. Total", "YTD Hrs.", "YTD Totals"];
const DEDUCTIONS_COLS = ["Deductions", "", "", "Curr. Total", "", "YTD Totals"];
const NET_SUMMARY_COLS = ["Net Pay Summary", "", "", "Curr. Total", "", "YTD Totals"];

/** client/src/constant: PAYRUN_TYPE_CODE and getReportName */
const PAYRUN_TYPE_CODE = {
	REGULAR: "1",
	PAYOUT: "2",
	MANUAL: "3",
	SUPERFICIAL: "4",
};
const REPORT_NAMES = {
	[PAYRUN_TYPE_CODE.REGULAR]: "Regular",
	[PAYRUN_TYPE_CODE.PAYOUT]: "Paid out",
	[PAYRUN_TYPE_CODE.MANUAL]: "Manual Cheque",
	[PAYRUN_TYPE_CODE.SUPERFICIAL]: "Superficial Balance",
};
const getReportName = (code) => REPORT_NAMES[code] || "Regular";

module.exports = {
	EARNINGS_TYPES,
	DEDUCTION_TYPES,
	NET_SUMMARY,
	ACCRUAL_TYPES,
	SUM_TOTALS,
	EARNINGS_COLS,
	DEDUCTIONS_COLS,
	NET_SUMMARY_COLS,
	PAYRUN_TYPE_CODE,
	getReportName,
};
