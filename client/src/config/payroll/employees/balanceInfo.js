export const EMP_VACATION_BALANCE_CONFIG = [
	{
		type: "Carry forward adjustment",
		control: "checkbox",
		param_key: "carryFwd",
		params: [
			{
				name: "Available Balance",
				param_key: "YTDVacationBalance",
			},
			{
				name: "Available at the Start of the Year",
				param_key: "YTDVacationBalanceFwd",
			},
		],
	},
	{
		type: "sfsgdsgdsgdsg1",
		params: [
			{ name: "sfsgdsgdsgdsg", param_key: "sfsgdsgdsgdsg1" },
			{ name: "Accrued This Year", param_key: "YTDVacationAccrued" },
		],
	},

	{
		type: "sfsgdsgdsgdsg2",
		params: [
			{ name: "sfsgdsgdsgdsg", param_key: "sfsgdsgdsgdsg2" },
			{ name: "Used this year", param_key: "YTDVacationUsed" },
		],
	},
];

export const EMP_YTD_EARNINGS_CONFIG = [
	{
		type: "Hours",
		params: [
			{ name: "Regular Pay", param_key: "YTDRegHoursWorked" },
			{ name: "Overtime Pay", param_key: "YTDOvertimeHoursWorked" },
			{
				name: "Double Overtime Pay",
				param_key: "YTDDblOvertimeHoursWorked",
			},
			{
				name: "Statutory Worked Pay",
				param_key: "YTDStatDayHoursWorked",
			},
			{ name: "Statutory Pay", param_key: "YTDStatHoursWorked" },
			{ name: "Sick Pay", param_key: "YTDSickHoursWorked" },
			{ name: "Vacation Pay", param_key: "YTDVacationHoursWorked" },
		],
	},
	{
		type: "Dollars",
		params: [
			{ name: "Regular Pay", param_key: "YTDRegPayTotal" },
			{ name: "Overtime Pay", param_key: "YTDOverTimePayTotal" },
			{
				name: "Double Overtime Pay",
				param_key: "YTDDblOverTimePayTotal",
			},
			{
				name: "Statutory Worked Pay",
				param_key: "YTDStatWorkPayTotal",
			},
			{ name: "Statutory Pay", param_key: "YTDStatPayTotal" },
			{ name: "Sick Pay", param_key: "YTDSickPayTotal" },
			{ name: "Vacation Pay", param_key: "YTDVacationPayTotal" },
		],
	},
];

export const EMP_YTD_DEDUCTIONS_CONFIG = [
	{
		type: "Dollars",
		params: [
			{
				name: "Long Term Disability - EE",
				param_key: "longTermDisabilityEE_YTD",
			},
			{ name: "Dental - EE", param_key: "dentalEE_YTD" },
			{
				name: "Extended Health - EE",
				param_key: "extendedHealthEE_YTD",
			},
			{ name: "Union Dues (%)", param_key: "unionDuesYTD" },
		],
	},
	{
		type: "Dollars",
		params: [
			{
				name: "Long Term Disability - ER",
				param_key: "longTermDisabilityER_YTD",
			},
			{ name: "Dental - ER", param_key: "dentalER_YTD" },
			{
				name: "Extended Health - ER",
				param_key: "extendedHealthER_YTD",
			},
		],
	},
];

export const getInitialBalanceInfo = (empId, companyName) => {
	return {
		empId,
		companyName,
		carryFwd: false,
		vacationAvailableBalance: 0,
		availableStartOFYear: 0,
		accruedBalance: 0,
		usedBalance: 0,
		regPayHoursYTD: 0,
		overTimePayHoursYTD: 0,
		dblOverTimePayHoursYTD: 0,
		statWorkPayHoursYTD: 0,
		statPayHoursYTD: 0,
		sickPayHoursYTD: 0,
		vacationPayHoursYTD: 0,
		regPayDollarsYTD: 0,
		overTimePayDollarsYTD: 0,
		dblOverTimePayDollarsYTD: 0,
		statWorkPayDollarsYTD: 0,
		statPayDollarsYTD: 0,
		sickPayDollarsYTD: 0,
		vacationDollarsYTD: 0,
		longTermDisabilityEE_YTD: 0,
		dentalEE_YTD: 0,
		extendedHealthEE_YTD: 0,
		unionDuesYTD: 0,
		longTermDisabilityER_YTD: 0,
		dentalER_YTD: 0,
		extendedHealthER_YTD: 0,
	};
};
