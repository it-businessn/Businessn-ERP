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

export const ER_PAID_BENEFITS_CONFIG = [
	{
		type: "",
		params: [
			{
				name: "Pension Contribution Treatment",
				param_key: "typeOfPensionERTreatment",
				control: "radio",
				options: [
					"No Pension Contributions",
					"Pension Contributions (%)",
					"Amount Pension Contributions",
				],
			},
			{ name: "Pension Contribution - ER", param_key: "pensionERContribution" },
			{
				name: "Dental - ER Treatment",
				param_key: "typeOfDentalERTreatment",
				control: "radio",
				options: [
					"No Dental Contributions",
					"Dental Contributions (%)",
					"Amount Dental Contributions",
				],
			},
			{ name: "Dental - ER", param_key: "dentalERContribution" },
			{
				name: "Extended Health - ER Treatment",
				param_key: "typeOfExtendedHealthERTreatment",
				control: "radio",
				options: [
					"No Extended Health Contributions",
					"Extended Health Contributions (%)",
					"Amount Extended Health Contributions",
				],
			},
			{ name: "Extended Health - ER", param_key: "extendedHealthERContribution" },
		],
	},
];

export const EE_PAID_BENEFITS_CONFIG = [
	{
		type: "",
		params: [
			{
				name: "Pension Contribution Treatment",
				param_key: "typeOfPensionEETreatment",
				control: "radio",
				options: [
					"No Pension Contributions",
					"Pension Contributions (%)",
					"Amount Pension Contributions",
				],
			},
			{ name: "Pension Contribution - EE", param_key: "pensionEEContribution" },
			{
				name: "Dental - EE Treatment",
				param_key: "typeOfDentalEETreatment",
				control: "radio",
				options: [
					"No Dental Contributions",
					"Dental Contributions (%)",
					"Amount Dental Contributions",
				],
			},
			{ name: "Dental - EE", param_key: "dentalEEContribution" },
			{
				name: "Extended Health - EE Treatment",
				param_key: "typeOfExtendedHealthEETreatment",
				control: "radio",
				options: [
					"No Extended Health Contributions",
					"Extended Health Contributions (%)",
					"Amount Extended Health Contributions",
				],
			},
			{ name: "Extended Health - EE", param_key: "extendedHealthEEContribution" },
			{
				name: "Union Dues Treatment",
				param_key: "typeOfUnionDuesTreatment",
				control: "radio",
				options: [
					"No Union Contributions",
					"Union Contributions (%)",
					"Amount Union Contributions",
				],
			},
			{ name: "Union Dues", param_key: "unionDuesContribution" },
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
		typeOfUnionDuesTreatment: "No Union Contributions",
		typeOfExtendedHealthEETreatment: "No Extended Health Contributions",
		typeOfDentalEETreatment: "No Dental Contributions",
		typeOfPensionEETreatment: "No Pension Contributions",
		typeOfExtendedHealthERTreatment: "No Extended Health Contributions",
		typeOfDentalERTreatment: "No Dental Contributions",
		typeOfPensionERTreatment: "No Pension Contributions",
		pensionEEContribution: 0,
		extendedHealthERContribution: 0,
		dentalERContribution: 0,
		pensionERContribution: 0,
		dentalEEContribution: 0,
		extendedHealthEEContribution: 0,
		unionDuesContribution: 0,
	};
};
