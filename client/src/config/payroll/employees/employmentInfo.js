import {
	COUNTRIES,
	REGIONS,
} from "erp-modules/project-management/workview/project/data";

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

export const DEPARTMENT_MULTI_OPTIONS = [
	{
		name: "Golf Maintenance",
		_id: "0001-",
	},
	{
		name: "Golf Other",
		_id: "0002-",
	},
	{
		name: "Restaurant Kitchen",
		_id: "0003-",
	},
	{
		name: "Restaurant Front of House",
		_id: "0004-",
	},
	{
		name: "Strata Maintenance",
		_id: "0005-",
	},
	{
		name: "All Operations Management",
		_id: "0006-",
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
	{
		type: "No Department",
		dependent: false,
		id: "0007-",
	},
];

export const EMP_COMPANY_CONFIG = [
	{
		type: "sfsgdsgdsgdsg13",
		params: [
			{
				name: "Pay Group",
				param_key: "employmentPayGroup",
				control: "select",
				options: [
					{
						type: "Paygroup: Test1",
						dependent: false,
					},
				],
			},
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

export const EMP_REGION_CONFIG = [
	{
		type: "sfsgdsgdsgdsg12",
		params: [
			{
				name: "Region",
				param_key: "employmentRegion",
				control: "select",
				options: REGIONS,
			},
		],
	},
	{
		type: "sfsgdsgdsgdsg12",
		params: [
			{
				name: "Country",
				param_key: "employmentCountry",
				control: "select",
				options: COUNTRIES,
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
				name: "Role",
				param_key: "employmentRole",
				control: "select",
				options: ROLE_OPTIONS,
			},
			// {
			// 	name: "Department",
			// 	param_key: "employmentDepartment",
			// 	control: "multiselect",
			// 	options: DEPARTMENT_MULTI_OPTIONS,
			// },
		],
	},
];

export const getInitialCorporateInfo = (
	empId,
	companyName,
	selectedPayGroupName,
) => {
	return {
		empId,
		companyName,
		employmentStartDate: null,
		employmentLeaveDate: null,
		employmentRole: "Employee",
		employmentPayGroup: selectedPayGroupName,
		employmentCostCenter: "",
		employmentDepartment: "No Department",
		companyDepartment: "No Department",
		employmentCountry: "Canada",
		employmentRegion: "British Columbia",
	};
};
