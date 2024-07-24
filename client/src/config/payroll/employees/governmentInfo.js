export const EMP_INCOME_TAX_CONFIG = [
	{
		type: "sfsgdsgdsgdsg14",
		params: [
			{ name: "Federal Tax", param_key: "federalTax" },
			{ name: "Regional Tax", param_key: "regionalTax" },
		],
	},
	{
		type: "sfsgdsgdsgdsg15",
		params: [
			{
				name: "Personal Federal Tax  Credit",
				param_key: "federalTaxCredit",
			},
			{
				name: "Personal Regional Tax Credit",
				param_key: "regionalTaxCredit",
			},
		],
	},
];

export const EMP_FED_GOVT_CONFIG = [
	{
		type: "sfsgdsgdsgdsg16",
		params: [
			{ name: "Pension (EE)", param_key: "federalPensionEE" },
			{
				name: "Employment Insurance (EE)",
				param_key: "federalEmploymentInsuranceEE",
			},
		],
	},
	{
		type: "sfsgdsgdsgdsg17",
		params: [
			{ name: "Pension (ER)", param_key: "federalPensionER" },
			{
				name: "Employment Insurance (ER)",
				param_key: "federalEmploymentInsuranceER",
			},
		],
	},
];
export const EMP_REGN_GOVT_CONFIG = [
	{
		type: "sfsgdsgdsgdsg18",
		params: [
			{
				name: "Employee Injury",
				param_key: "regionalEmployeeInjury",
			},
			{
				name: "Employee Health",
				param_key: "regionalEmployeeHealth",
			},
		],
	},
	{
		type: "sfsgdsgdsgdsg19",
		params: [
			{
				name: "Employer Injury",
				param_key: "regionalEmployerInjury",
			},
			{
				name: "Employer Health",
				param_key: "regionalEmployerHealth",
			},
		],
	},
];

export const getInitialGovernmentInfo = (empId, companyName) => {
	return {
		empId,
		companyName,
		federalTax: "",
		regionalTax: "",
		federalTaxCredit: 0,
		regionalTaxCredit: 0,
		federalPensionEE: "",
		federalPensionER: "",
		federalEmploymentInsuranceEE: "",
		federalEmploymentInsuranceER: "",
		regionalEmployeeInjury: "",
		regionalEmployeeHealth: "",
		regionalEmployerInjury: "",
		regionalEmployerHealth: "",
	};
};
