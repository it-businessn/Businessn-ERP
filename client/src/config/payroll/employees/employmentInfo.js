import { getDefaultDate } from "utils";

export const ROLE_OPTIONS = [
	{
		type: "Employee",
		dependent: false,
	},
	{
		type: "Manager",
		dependent: true,
	},
	{
		type: "Enroller",
		dependent: true,
	},
	{
		type: "Administrator",
		dependent: true,
	},
];

export const COST_CENTER_OPTIONS = [
	{
		type: "Golf Operations",
		dependent: false,
	},
	{
		type: "Restaurant",
		dependent: false,
	},
	{
		type: "Strata",
		dependent: false,
	},
	{
		type: "Management",
		dependent: false,
	},
];

export const DEPARTMENT_OPTIONS = [
	{
		type: "Golf Maintenance",
		dependent: false,
		id: "0001-",
	},
	{
		type: "Golf Other",
		dependent: false,
		id: "0002-",
	},
	{
		type: "Restaurant Kitchen",
		dependent: false,
		id: "0003-",
	},
	{
		type: "Restaurant Front of House",
		dependent: false,
		id: "0004-",
	},
	{
		type: "Strata Maintenance",
		dependent: false,
		id: "0005-",
	},
	{
		type: "All Operations Management",
		dependent: false,
		id: "0006-",
	},
];

export const EMP_COMPANY_CONFIG = [
	{
		type: "sfsgdsgdsgdsg13",
		params: [
			{ name: "Pay Group ", param_key: "employmentPayGroup" },
			{
				name: "Cost Center",
				param_key: "employmentCostCenter",
				control: "select",
				options: COST_CENTER_OPTIONS,
			},
			{
				name: "Department",
				param_key: "employmentDepartment",
				control: "select",
				options: DEPARTMENT_OPTIONS,
			},
		],
	},
];

export const EMP_ROLE_CONFIG = [
	{
		type: "sfsgdsgdsgdsg11",
		params: [
			{ name: "Start Date", param_key: "employmentStartDate", control: "date" },
			{ name: "Leave Date", param_key: "employmentLeaveDate", control: "date" },
		],
	},
	{
		type: "sfsgdsgdsgdsg12",
		params: [
			{
				name: "Role ",
				param_key: "employmentRole",
				control: "select",
				options: ROLE_OPTIONS,
			},
		],
	},
];

export const getInitialCorporateInfo = (empId, companyName) => {
	return {
		empId,
		companyName,
		employmentStartDate: getDefaultDate(),
		employmentLeaveDate: getDefaultDate(),
		employmentRole: "",
		employmentPayGroup: "",
		employmentCostCenter: "",
		employmentDepartment: "",
	};
};
