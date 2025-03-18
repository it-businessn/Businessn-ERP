import { COUNTRIES } from "./profileInfo";

export const PAYROLL_STATUS = [
	{
		type: "Payroll Active",
		dependent: false,
	},
	{
		type: "Include final pay in next pay period",
		dependent: false,
	},
	{
		type: "Do not include final pay in next pay period",
		dependent: false,
	},
	{
		type: "Payroll Terminated",
		dependent: false,
	},
];

export const EMP_IDENTIFICATION_STATUS_CONFIG = (roles) => [
	{
		type: "",
		params: [
			{
				name: "Status",
				param_key: "payrollStatus",
				control: "select",
				options: PAYROLL_STATUS,
			},
		],
	},
	{
		type: "",
		params: [{ name: "Employee Number", param_key: "employeeNo", mandatory: true }],
	},
	{
		type: "",
		params: [
			{
				name: "System Access Level",
				param_key: "employmentRole",
				control: "select",
				options: roles,
			},
		],
	},
];

export const EMP_TENURE_CONFIG = [
	{
		type: "",
		params: [{ name: "Start Date", param_key: "employmentStartDate", control: "date" }],
	},
	{
		type: "",
		params: [{ name: "Leave Date", param_key: "employmentLeaveDate", control: "date" }],
	},
];

export const EMP_REGION_CONFIG = [
	{
		type: "",
		params: [
			{
				name: "Country",
				param_key: "employmentCountry",
				control: "select",
				options: COUNTRIES,
			},
		],
	},
	{
		type: "",
		params: [
			{
				name: "Region",
				param_key: "employmentRegion",
				control: "select",
				options: COUNTRIES,
			},
		],
	},
];

export const getInitialCorporateInfo = (empId, companyName) => {
	return {
		empId,
		companyName,
		payrollStatus: "",
		employeeNo: null,
		employmentStartDate: null,
		employmentLeaveDate: null,
		employmentRole: "Employee",
		employmentCountry: "Canada",
		employmentRegion: "British Columbia",
		positions: [],
	};
};
