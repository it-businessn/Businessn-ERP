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

export const EMP_PAY_INFO_DEDUCTION_CONFIG = [
	{
		type: "Employer Paid Benefits",
		params: [
			{
				name: "Pension Contribution - ER",
				param_key: "YTDEmployerPensionContributions",
			},
			{ name: "Dental - ER", param_key: "dentalER" },
			{ name: "Extended Health - ER", param_key: "YTDEmployerHealthContributions" },
			{ name: "Union Dues", param_key: "YTDUnionDuesDeductions" },
		],
	},
	{
		type: "Employee Paid Benefits",
		params: [
			{
				name: "Pension Contribution - EE",
				param_key: "YTDEmployeePensionContributions",
			},
			{ name: "Dental - EE", param_key: "dentalEE" },
			{
				name: "Extended Health - EE",
				param_key: "YTDEmployeeHealthContributions",
			},
		],
	},
];

export const EMP_PAY_INFO_ACCRUALS_CONFIG = [
	{
		type: "",
		params: [
			{
				name: "Vacation treatment",
				param_key: "typeOfVacationTreatment",
				control: "radio",
				options: ["Payout", "Accrued"],
			},
			{ name: "Vacation (%)", param_key: "vacationPayPercent", mandatory: true },
		],
	},
];

export const getInitialBalanceInfo = (empId, companyName) => {
	return {
		empId,
		companyName,
		carryFwd: false,
		vacationPayPercent: null,
		typeOfVacationTreatment: null,
	};
};
