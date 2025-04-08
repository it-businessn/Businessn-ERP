import { HStack } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import { COLS, CONTRIBUTION } from "constant";
import { PAY_TYPES_TITLE } from "erp-modules/payroll/timesheets/data";

export const SUM_TOTALS = ["Gross ", "Total ", "Available ", "Net Pay"];
export const EARNINGS_COLS = ["", "Rate", "Hours", "Curr. Total", "YTD Hrs.", "YTD Totals"];

export const DEDUCTIONS_COLS = ["Deductions", "", "", "Curr. Total", "", "YTD Totals"];

export const NET_SUMMARY_COLS = ["Net Pay Summary", "", "", "Curr. Total", "", "YTD Totals"];

export const HeaderTable = ({ title1, title2, title3 }) => (
	<HStack justifyContent={"space-between"} w={"100%"} bg={"var(--primary_bg_1)"}>
		<TextTitle whiteSpace="wrap" title={title1} size={"xs"} />
		<TextTitle title={title2} size="xs" whiteSpace="wrap" align={"center"} p={0} />
		<TextTitle align={"center"} title={title3} size="xs" whiteSpace="wrap" />
	</HStack>
);

export const EARNINGS_TYPES = [
	{
		name: "Regular",
		rate: "regPay",
		totalHours: "totalRegHoursWorked",
		currentTotal: "currentRegPayTotal",
		YTDHoursTotal: "YTDRegHoursWorked",
		YTDTotal: "YTDRegPayTotal",
		isEarning: true,
	},
	{
		name: "Overtime",
		rate: "overTimePay",
		totalHours: "totalOvertimeHoursWorked",
		currentTotal: "currentOverTimePayTotal",
		YTDHoursTotal: "YTDOvertimeHoursWorked",
		YTDTotal: "YTDOverTimePayTotal",
		isEarning: true,
	},
	{
		name: "Double Overtime",
		rate: "dblOverTimePay",
		totalHours: "totalDblOvertimeHoursWorked",
		currentTotal: "currentDblOverTimePayTotal",
		YTDHoursTotal: "YTDDblOvertimeHoursWorked",
		YTDTotal: "YTDDblOverTimePayTotal",
		isEarning: true,
	},
	{
		name: PAY_TYPES_TITLE.STAT_PAY,
		rate: "statPay",
		totalHours: "totalStatHours",
		currentTotal: "currentStatPayTotal",
		YTDHoursTotal: "YTDStatHoursWorked",
		YTDTotal: "YTDStatPayTotal",
		isEarning: true,
	},
	{
		name: PAY_TYPES_TITLE.STAT_WORK_PAY,
		rate: "statWorkPay",
		totalHours: "totalStatDayHoursWorked",
		currentTotal: "currentStatWorkPayTotal",
		YTDHoursTotal: "YTDStatDayHoursWorked",
		YTDTotal: "YTDStatWorkPayTotal",
		isEarning: true,
	},
	{
		name: "Sick Pay",
		rate: "sickPay",
		totalHours: "totalSickHoursWorked",
		currentTotal: "currentSickPayTotal",
		YTDHoursTotal: "YTDSickHoursWorked",
		YTDTotal: "YTDSickPayTotal",
		isEarning: true,
	},
	{
		name: "Pay In Lieu",
		rate: 0,
		totalHours: 0,
		currentTotal: "payInLieuPay",
		YTDTotal: "YTDPayInLieuPay",
		YTDHoursTotal: 0,
		isEarning: false,
	},
	{
		name: "PIL Benefit",
		rate: 0,
		totalHours: 0,
		currentTotal: "pILBenefitPay",
		YTDTotal: "YTDBenefitPay",
		YTDHoursTotal: 0,
		isEarning: false,
	},
	{
		name: "Bonus",
		rate: 0,
		totalHours: 0,
		currentTotal: "bonus",
		YTDTotal: "YTDBonus",
		YTDHoursTotal: 0,
		isEarning: false,
	},
	{
		name: "Vacation Pay",
		rate: "vacationPay",
		totalHours: "totalVacationHoursWorked",
		currentTotal: "currentVacationPayTotal",
		YTDTotal: "YTDVacationPayTotal",
		YTDHoursTotal: "YTDVacationHoursWorked",
		isEarning: true,
	},
	{
		name: "Vacation Payout",
		rate: 0,
		totalHours: 0,
		currentTotal: "vacationPayout",
		YTDTotal: "YTDVacationPayout",
		YTDHoursTotal: 0,
		isEarning: false,
	},

	{
		name: "Termination Payout",
		rate: 0,
		totalHours: 0,
		currentTotal: "terminationPayout",
		YTDTotal: "YTDTerminationPayout",
		YTDHoursTotal: 0,
		isEarning: false,
	},
	{
		name: "Banked Time",
		rate: 0,
		totalHours: 0,
		currentTotal: "bankedTimePay",
		YTDTotal: "YTDBankedTimePay",
		YTDHoursTotal: 0,
		isEarning: false,
	},
	{
		name: "Regular By Amount",
		rate: 0,
		totalHours: 0,
		currentTotal: "regularByAmount",
		YTDTotal: "YTDRegularByAmount",
		YTDHoursTotal: 0,
		isEarning: false,
	},
	{
		name: "Spray",
		rate: "sprayPay",
		totalHours: "totalSprayHoursWorked",
		currentTotal: "currentSprayPayTotal",
		YTDTotal: "YTDSprayPayTotal",
		YTDHoursTotal: "YTDSprayHoursWorked",
		isEarning: true,
	},
	{
		name: "First Aid",
		rate: "firstAidPay",
		totalHours: "totalFirstAidHoursWorked",
		currentTotal: "currentFirstAidPayTotal",
		YTDTotal: "YTDFirstAidPayTotal",
		YTDHoursTotal: "YTDFirstAidHoursWorked",
		isEarning: true,
	},
	{
		name: "Retroactive",
		rate: 0,
		totalHours: 0,
		currentTotal: "retroactive",
		YTDTotal: "YTDRetroactive",
		YTDHoursTotal: 0,
		isEarning: false,
	},
	{
		name: "Commission",
		rate: 0,
		totalHours: 0,
		currentTotal: "commission",
		YTDTotal: "YTDCommission",
		YTDHoursTotal: 0,
		isEarning: false,
	},
	{
		name: "Regular 2",
		rate: "regPay2",
		totalHours: "totalRegHoursWorked2",
		currentTotal: "currentRegPayTotal2",
		YTDHoursTotal: "YTDRegHoursWorked2",
		YTDTotal: "YTDRegPayTotal2",
		isEarning: true,
	},
	{
		name: "Gross Earnings",
		rate: 0,
		totalHours: 0,
		currentTotal: "currentGrossPay",
		YTDTotal: "YTDGrossPay",
		YTDHoursTotal: 0,
		isEarning: false,
	},
];

export const DEDUCTION_TYPES = [
	{
		name: "Income Tax",
		rate: 0,
		totalHours: 0,
		currentTotal: "currentIncomeTaxDeductions",
		YTDTotal: "YTD_IncomeTaxDeductions",
	},
	{
		name: "Federal Tax",
		rate: 0,
		totalHours: 0,
		currentTotal: "currentFDTaxDeductions",
		YTDTotal: "YTD_FDTaxDeductions",
	},
	{
		name: "Provincial Tax",
		rate: 0,
		totalHours: 0,
		currentTotal: "currentStateTaxDeductions",
		YTDTotal: "YTDStateTaxDeductions",
	},
	{
		name: "EI",
		rate: 0,
		totalHours: 0,
		currentTotal: "currentEmployeeEIDeductions",
		YTDTotal: "YTD_EmployeeEIDeductions",
	},
	{
		name: "CPP",
		rate: 0,
		totalHours: 0,
		currentTotal: "currentCPPDeductions",
		YTDTotal: "YTD_CPPDeductions",
	},
	{
		name: COLS.UNION_DUE,
		rate: 0,
		totalHours: 0,
		currentTotal: "currentUnionDuesDeductions",
		YTDTotal: "YTDUnionDuesDeductions",
	},
	{
		name: "Health Contribution",
		rate: 0,
		totalHours: 0,
		currentTotal: "currentEmployeeHealthContributions",
		YTDTotal: "YTDEmployeeHealthContributions",
	},
	{
		name: "Primary Deposit",
		rate: 0,
		totalHours: 0,
		currentTotal: "currentPrimaryDeposit",
		YTDTotal: "YTDPrimaryDeposit",
	},
	{
		name: CONTRIBUTION.PENSION,
		rate: 0,
		totalHours: 0,
		currentTotal: "currentEmployeePensionContributions",
		YTDTotal: "YTDEmployeePensionContributions",
	},
	{
		name: "Total Deductions",
		rate: 0,
		totalHours: 0,
		currentTotal: "currentDeductionsTotal",
		YTDTotal: "YTDDeductionsTotal",
	},
];

export const NET_SUMMARY = [
	{
		name: "Gross Earnings",
		rate: 0,
		totalHours: 0,
		currentTotal: "currentGrossPay",
		YTDTotal: "YTDGrossPay",
	},
	{
		name: "Total Deductions",
		rate: 0,
		totalHours: 0,
		currentTotal: "currentDeductionsTotal",
		YTDTotal: "YTDDeductionsTotal",
	},
	{
		name: "Net Pay",
		rate: 0,
		totalHours: 0,
		currentTotal: "currentNetPay",
		YTDTotal: "YTDNetPay",
	},
];

const EMPLOYER_BENEFIT_TYPES = [
	{
		name: "EI",
		rate: 0,
		totalHours: 0,
		currentTotal: "currentEmployerEIDeductions",
		YTDTotal: "YTD_EmployerEIDeductions",
	},
	{
		name: "CPP",
		rate: 0,
		totalHours: 0,
		currentTotal: "currentCPPDeductions",
		YTDTotal: "YTD_CPPDeductions",
	},
	{
		name: CONTRIBUTION.PENSION,
		rate: 0,
		totalHours: 0,
		currentTotal: "currentEmployerPensionContributions",
		YTDTotal: "YTDEmployerPensionContributions",
	},
	{
		name: "Health Contribution",
		rate: 0,
		totalHours: 0,
		currentTotal: "currentEmployerHealthContributions",
		YTDTotal: "YTDEmployerHealthContributions",
	},
	{
		name: "Total Employer Paid Benefits",
		rate: 0,
		totalHours: 0,
		currentTotal: "currentEmployerContributions",
		YTDTotal: "YTDEmployerContributions",
	},
];

const SICK_TYPES = [
	{
		name: "Sick Accrual",
		rate: 0,
		totalHours: 0,
		currentTotal: "currentSickAccrued",
		YTDTotal: "YTDSickAccrued",
	},
	{
		name: "Sick Used",
		rate: 0,
		totalHours: 0,
		currentTotal: "currentSickUsed",
		YTDTotal: "YTDSickUsed",
	},
	{
		name: "Available Sick Balance",
		rate: 0,
		totalHours: 0,
		currentTotal: "sickBalance",
		YTDTotal: "YTDSickBalance",
	},
];

const VACATION_BENEFIT = [
	{
		name: "Balance Adjustment",
		rate: 0,
		totalHours: 0,
		currentTotal: "currentVacationBalanceFwd",
		YTDTotal: "YTDVacationBalanceFwd",
	},
	{
		name: "Vacation Accrual",
		rate: 0,
		totalHours: 0,
		currentTotal: "currentVacationAccrued",
		YTDTotal: "YTDVacationAccrued",
	},
	{
		name: "Vacation Used",
		rate: 0,
		totalHours: 0,
		currentTotal: "currentVacationUsed",
		YTDTotal: "YTDVacationUsed",
	},
	{
		name: "Available Balance",
		rate: 0,
		totalHours: 0,
		currentTotal: "vacationBalance",
		YTDTotal: "YTDVacationBalance",
	},
];

export const ACCRUAL_TYPES = [
	// {
	// 	type: "Sick",
	// 	items: SICK_TYPES,
	// },
	{
		type: "Employer Paid Benefits",
		items: EMPLOYER_BENEFIT_TYPES,
	},
	{
		type: "Vacation",
		items: VACATION_BENEFIT,
	},
];
