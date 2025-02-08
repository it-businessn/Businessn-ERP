import { COUNTRIES, REGIONS } from "erp-modules/project-management/workview/project/data";

export const EMP_INCOME_TAX_CONFIG = [
	{
		type: "sfsgdsgdsgdsg14",
		params: [
			{
				name: "Federal Tax",
				param_key: "federalTax",
				control: "select",
				options: COUNTRIES,
			},
			{
				name: "Regional Tax",
				param_key: "regionalTax",
				control: "select",
				options: REGIONS,
			},
		],
	},
	{
		type: "sfsgdsgdsgdsg15",
		params: [
			{
				name: "Personal Federal Tax Credit",
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
