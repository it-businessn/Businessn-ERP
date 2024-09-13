export const EMP_EMERGENCY_CONTACT_CONFIG = [
	{
		type: "sfsgdsgdsgdsg30",
		params: [
			{ name: "First Name", param_key: "emergencyFirstName" },
			{
				name: "Personal Email",
				param_key: "emergencyPersonalEmail",
			},
			{
				name: "Personal Phone",
				param_key: "emergencyPersonalPhoneNum",
			},
		],
	},
	{
		type: "sfsgdsgdsgdsg31",
		params: [{ name: "Last Name", param_key: "emergencyLastName" }],
	},
];

export const EMP_CONTACT_CONFIG = [
	{
		type: "sfsgdsgdsgdsg28",
		params: [
			{ name: "Personal Email", param_key: "personalEmail" },
			{ name: "Personal Phone", param_key: "personalPhoneNum" },
			{ name: "Address", param_key: "address" },
			{ name: "Street Address", param_key: "streetAddress" },
			{ name: "City", param_key: "city" },
			{ name: "Province/State", param_key: "province" },
			{ name: "Country", param_key: "country" },
			{ name: "Postal Code", param_key: "postalCode" },
		],
	},
	{
		type: "sfsgdsgdsgdsg29",
		params: [
			{ name: "Work Email", param_key: "businessEmail" },
			{ name: "Work Phone", param_key: "businessPhoneNum" },
		],
	},
];

export const EMP_PERSONAL_INFO_CONFIG = [
	{
		type: "sfsgdsgdsgdsg26",
		params: [
			{ name: "First Name", param_key: "firstName" },
			{ name: "Birthday", param_key: "birthDate", control: "date" },
			{ name: "Social Insurance Number", param_key: "SIN" },
			{ name: "Marital Status", param_key: "maritalStatus" },
			{ name: "Citizenship", param_key: "citizenship" },
			{ name: "Work Permit Number", param_key: "workPermitNo" },
		],
	},
	{
		type: "sfsgdsgdsgdsg27",
		params: [
			{ name: "Middle Name", param_key: "middleName" },
			{ name: "sfsgdsgdsgdsg1", param_key: "sfsgdsgdsgdsg5" },
			{ name: "sfsgdsgdsgdsg2", param_key: "sfsgdsgdsgdsg6" },
			{ name: "sfsgdsgdsgdsg3", param_key: "sfsgdsgdsgdsg7" },
			{ name: "sfsgdsgdsgdsg4", param_key: "sfsgdsgdsgdsg8" },
			{ name: "Work Permit Expiry", param_key: "workPermitExpiryNo" },
		],
	},
	{
		type: "sfsgdsgdsgdsg27",
		params: [
			{ name: "Last Name", param_key: "lastName" },
			{ name: "sfsgdsgdsgdsg1", param_key: "sfsgdsgdsgdsg5" },
			{ name: "sfsgdsgdsgdsg2", param_key: "sfsgdsgdsgdsg6" },
			{ name: "sfsgdsgdsgdsg3", param_key: "sfsgdsgdsgdsg7" },
			{ name: "sfsgdsgdsgdsg5", param_key: "sfsgdsgdsgdsg8" },
			{ name: "sfsgdsgdsgdsg6", param_key: "sfsgdsgdsgdsg8" },
		],
	},
];

export const PAYROLL_STATUS = [
	{
		type: "Payroll Active",
		dependent: false,
	},
	{
		type: "Payroll Terminated",
		dependent: false,
	},
];

export const EMP_IDENTIFICATION_STATUS_CONFIG = [
	{
		type: "sfsgdsgdsgdsg23",
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
		type: "sfsgdsgdsgdsg24",
		params: [{ name: "Employee Number", param_key: "employeeNo" }],
	},
	{
		type: "sfsgdsgdsgdsg25",
		params: [
			{
				name: "Time Management Badge ID",
				param_key: "timeManagementBadgeID",
			},
		],
	},
];

export const getInitialProfileInfo = (empId, companyName) => {
	return {
		empId,
		companyName,
		payrollStatus: "",
		employeeNo: "",
		timeManagementBadgeID: "",
		firstName: "",
		middleName: "",
		lastName: "",
		emergencyFirstName: "",
		emergencyLastName: "",
		birthDate: null,
		SIN: "",
		maritalStatus: "",
		citizenship: "",
		workPermitNo: "",
		workPermitExpiryNo: "",
		personalEmail: "",
		personalPhoneNum: "",
		businessEmail: "",
		businessPhoneNum: "",
		emergencyPersonalEmail: "",
		emergencyPersonalPhoneNum: "",
		streetAddress: "",
		city: "",
		province: "",
		country: "",
		postalCode: "",
	};
};
