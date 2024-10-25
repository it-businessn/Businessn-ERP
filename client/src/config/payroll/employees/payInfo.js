export const EMP_PAY_INFO_EARNINGS_CONFIG = [
	{
		type: "",
		params: [
			{
				name: "Select earning type",
				param_key: "typeOfEarning",
				control: "radio",
				options: ["Hourly", "Full Time Salaried", "Part Time Salaried"],
			},
			{ name: "Regular Pay", param_key: "regPay" },
			{ name: "Standard Hours (FT)", param_key: "fullTimeStandardHours" },
			{ name: "Standard Hours (PT)", param_key: "partTimeStandardHours" },
		],
	},
	// {
	// 	type: "Hourly",
	// 	params: [
	// 		{ name: "Regular Pay", param_key: "regPay" },
	// 		// { name: "Overtime Pay", param_key: "overTimePay" },
	// 		// { name: "Double Overtime Pay", param_key: "dblOverTimePay" },
	// 		// { name: "Statutory Worked Pay", param_key: "statWorkPay" },
	// 		// { name: "Statutory Pay", param_key: "statPay" },
	// 		// { name: "Sick Pay", param_key: "sickPay" },
	// 		// { name: "Vacation Pay", param_key: "vacationPay" },
	// 	],
	// },
	// {
	// 	type: "Salary",
	// 	params: [
	// 		{ name: "Salary Rate", param_key: "salaryRate" },
	// 		// { name: "Hours per Pay", param_key: "dailyHours" },
	// 	],
	// },
];

export const EMP_PAY_INFO_DEDUCTION_CONFIG = [
	{
		type: "sfsgdsgdsgdsg20",
		params: [
			{
				name: "Long Term Disability - EE",
				param_key: "longTermDisabilityEE",
			},
			{ name: "Dental - EE", param_key: "dentalEE" },
			{
				name: "Extended Health - EE",
				param_key: "extendedHealthEE",
			},
			{ name: "Union Dues", param_key: "unionDues" },
		],
	},
	{
		type: "sfsgdsgdsgdsg21",
		params: [
			{
				name: "Long Term Disability - ER",
				param_key: "longTermDisabilityER",
			},
			{ name: "Dental - ER", param_key: "dentalER" },
			{ name: "Extended Health - ER", param_key: "extendedHealthER" },
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
			{ name: "Vacation (%)", param_key: "vacationPay" },
		],
	},
];

export const getInitialPayInfo = (empId, companyName) => {
	return {
		empId,
		companyName,
		regPay: 0,
		overTimePay: 0,
		dblOverTimePay: 0,
		statWorkPay: 0,
		statPay: 0,
		sickPay: 0,
		salaryRate: 0,
		dailyHours: 0,
		longTermDisabilityEE: 0,
		longTermDisabilityER: 0,
		dentalEE: 0,
		dentalER: 0,
		extendedHealthEE: 0,
		extendedHealthER: 0,
		unionDues: 0,
		vacationPay: 0,
		typeOfEarning: "Hourly",
		typeOfVacationTreatment: "Accrued",
		fullTimeStandardHours: "80",
		partTimeStandardHours: "",
	};
};
