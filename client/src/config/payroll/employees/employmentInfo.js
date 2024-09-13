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
];

export const EMP_COMPANY_CONFIG = [
	{
		type: "sfsgdsgdsgdsg13",
		params: [
			{ name: "Pay Group", param_key: "employmentPayGroup" },
			{
				name: "Cost Center",
				param_key: "employmentCostCenter",
				control: "select",
				options: COST_CENTER_OPTIONS,
			},
			{
				name: "Department",
				param_key: "companyDepartment",
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

export const getInitialCorporateInfo = (empId, companyName) => {
	return {
		empId,
		companyName,
		employmentStartDate: null,
		employmentLeaveDate: null,
		employmentRole: "",
		employmentPayGroup: "",
		employmentCostCenter: "",
		employmentDepartment: "",
		companyDepartment: "",
	};
};
