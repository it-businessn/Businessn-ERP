export const EMP_VACATION_BALANCE_CONFIG = [
	{
		type: "sfsgdsgdsgdsg3",
		params: [
			{
				name: "Available Balance",
				param_key: "vacationAvailableBalance",
			},
			{
				name: "Available at the Start of the Year",
				param_key: "availableStartOFYear",
			},
		],
	},
	{
		type: "sfsgdsgdsgdsg1",
		params: [
			{ name: "sfsgdsgdsgdsg", param_key: "sfsgdsgdsgdsg1" },
			{ name: "Accrued This Year", param_key: "accruedBalance" },
		],
	},

	{
		type: "sfsgdsgdsgdsg2",
		params: [
			{ name: "sfsgdsgdsgdsg", param_key: "sfsgdsgdsgdsg2" },
			{ name: "Used this year", param_key: "usedBalance" },
		],
	},
];

export const EMP_YTD_EARNINGS_CONFIG = [
	{
		type: "Hours",
		params: [
			{ name: "Regular Pay ", param_key: "regPayHoursYTD" },
			{ name: "Overtime Pay ", param_key: "overTimePayHoursYTD" },
			{
				name: "Double Overtime Pay ",
				param_key: "dblOverTimePayHoursYTD",
			},
			{
				name: "Statutory Worked Pay",
				param_key: "statWorkPayHoursYTD",
			},
			{ name: "Statutory Pay", param_key: "statPayHoursYTD" },
			{ name: "Sick Pay ", param_key: "sickPayHoursYTD" },
			{ name: "Vacation Pay", param_key: "vacationPayHoursYTD" },
		],
	},
	{
		type: "Dollars",
		params: [
			{ name: "Regular Pay ", param_key: "regPayDollarsYTD" },
			{ name: "Overtime Pay ", param_key: "overTimePayDollarsYTD" },
			{
				name: "Double Overtime Pay ",
				param_key: "dblOverTimePayDollarsYTD",
			},
			{
				name: "Statutory Worked Pay",
				param_key: "statWorkPayDollarsYTD",
			},
			{ name: "Statutory Pay", param_key: "statPayDollarsYTD" },
			{ name: "Sick Pay ", param_key: "sickPayDollarsYTD" },
			{ name: "Vacation Pay", param_key: "vacationDollarsYTD" },
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
				name: "Extended Health - EE ",
				param_key: "extendedHealthEE_YTD",
			},
			{ name: "Union Dues", param_key: "unionDuesYTD" },
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
