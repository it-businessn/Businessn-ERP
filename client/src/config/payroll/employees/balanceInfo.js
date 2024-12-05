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
					"Amount per Hour Pension Contributions",
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
					"Amount per Hour Dental Contributions",
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
					"Amount per Hour Extended Health Contributions",
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
					"Amount per Hour Pension Contributions",
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
					"Amount per Hour Dental Contributions",
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
					"Amount per Hour Extended Health Contributions",
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
					"Amount per Hour Union Contributions",
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
		vacationPayPercent: "",
		typeOfVacationTreatment: "",
		typeOfUnionDuesTreatment: "",
		typeOfExtendedHealthEETreatment: "",
		typeOfDentalEETreatment: "",
		typeOfPensionEETreatment: "",
		typeOfExtendedHealthERTreatment: "",
		typeOfDentalERTreatment: "",
		typeOfPensionERTreatment: "",
		pensionEEContribution: "",
		extendedHealthERContribution: "",
		dentalERContribution: "",
		pensionERContribution: "",
		dentalEEContribution: "",
		extendedHealthEEContribution: "",
		unionDuesContribution: "",
	};
};
