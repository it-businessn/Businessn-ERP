import { CONTRIBUTION } from "constant";

export const EMP_FED_GOVT_CONFIG = [
	{
		type: "sfsgdsgdsgdsg16",
		params: [
			{ name: "Pension (EE)", param_key: "federalPensionEE" },
			{
				name: `${CONTRIBUTION.EI} (EE)`,
				param_key: "federalEmploymentInsuranceEE",
			},
		],
	},
	{
		type: "sfsgdsgdsgdsg17",
		params: [
			{ name: "Pension (ER)", param_key: "federalPensionER" },
			{
				name: `${CONTRIBUTION.EI} (ER)`,
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

export const EMP_CPP_EXEMPT = [
	// {
	// 	type: "Is CPP/QPP exempt",
	// 	control: "checkbox",
	// 	param_key: "isCPPExempt",
	// 	params: [
	// 		{
	// 			name: "Employees aged 18 or older are not exempt from CPP.",
	// 			param_key: "",
	// 			control: "label",
	// 		},
	// 	],
	// },
	// {
	// 	type: "Is EI exempt",
	// 	control: "checkbox",
	// 	param_key: "isEIExempt",
	// 	params: [],
	// },
];

export const getInitialGovernmentInfo = (empId, companyName) => {
	return {
		empId,
		companyName,
		federalTax: "Canada",
		regionalTax: "British Columbia",
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
		isCPPExempt: false,
		isEIExempt: false,
	};
};
