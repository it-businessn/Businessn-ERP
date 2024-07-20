export const EMP_INCOME_TAX_CONFIG = [
	{
		type: "ss14",
		params: [
			{ name: "Federal Tax ", param_key: "federalTax" },
			{ name: "Regional Tax ", param_key: "regionalTax" },
		],
	},
	{
		type: "ss15",
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
		type: "ss16",
		params: [
			{ name: "Pension (EE) ", param_key: "federalPensionEE" },
			{
				name: "Employment Insurance (EE)",
				param_key: "federalEmploymentInsuranceEE",
			},
		],
	},
	{
		type: "ss17",
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
		type: "ss18",
		params: [
			{
				name: "Employee Injury",
				param_key: "regionalEmployeeInjury",
			},
			{
				name: "Employee Health ",
				param_key: "regionalEmployeeHealth",
			},
		],
	},
	{
		type: "ss19",
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
