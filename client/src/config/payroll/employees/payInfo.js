import { PAY_TYPES_TITLE } from "erp-modules/payroll/timesheets/data";

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
			{ name: PAY_TYPES_TITLE.REG_PAY, param_key: "regPay" },
			{ name: "Standard Hours (FT)", param_key: "fullTimeStandardHours" },
			{ name: "Standard Hours (PT)", param_key: "partTimeStandardHours" },
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
		vacationPay: 0,
		typeOfEarning: "Hourly",
		fullTimeStandardHours: "80",
		partTimeStandardHours: "",
	};
};
