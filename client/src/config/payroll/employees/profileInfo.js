export const EMP_EMERGENCY_CONTACT_CONFIG = [
	{
		type: "ss30",
		params: [
			{ name: "First Name ", param_key: "emergencyFirstName" },
			{
				name: "Personal Email ",
				param_key: "emergencyPersonalEmail",
			},
			{
				name: "Personal Phone",
				param_key: "emergencyPersonalPhoneNum",
			},
		],
	},
	{
		type: "ss31",
		params: [{ name: "Last Name", param_key: "emergencyLastName" }],
	},
];

export const EMP_CONTACT_CONFIG = [
	{
		type: "ss28",
		params: [
			{ name: "Personal Email ", param_key: "personalEmail" },
			{ name: "Personal Phone", param_key: "personalPhoneNum" },
			{ name: "Address", param_key: "address" },
			{ name: "Street Address", param_key: "streetAddress" },
			{ name: "City ", param_key: "city" },
			{ name: "Province/State", param_key: "province" },
			{ name: "Country ", param_key: "country" },
			{ name: "Postal Code ", param_key: "postalCode" },
		],
	},
	{
		type: "ss29",
		params: [
			{ name: "Work Email", param_key: "businessEmail" },
			{ name: "Work Phone", param_key: "businessPhoneNum" },
		],
	},
];

export const EMP_PERSONAL_INFO_CONFIG = [
	{
		type: "ss26",
		params: [
			{ name: "First Name", param_key: "firstName" },
			{ name: "Birthday", param_key: "birthDate" },
			{ name: "Social Insurance Number", param_key: "SIN" },
			{ name: "Marital Status", param_key: "maritalStatus" },
			{ name: "Citizenship", param_key: "citizenship" },
			{ name: "Work Permit Number", param_key: "workPermitNo" },
		],
	},
	{
		type: "ss27",
		params: [
			{ name: "Last Name", param_key: "lastName" },
			{ name: "ss", param_key: "ss5" },
			{ name: "ss", param_key: "ss6" },
			{ name: "ss", param_key: "ss7" },
			{ name: "ss", param_key: "ss8" },
			{ name: "Work Permit Expiry", param_key: "workPermitExpiryNo" },
		],
	},
];

export const EMP_IDENTIFICATION_STATUS_CONFIG = [
	{
		type: "ss23",
		params: [{ name: "Status", param_key: "payrollStatus" }],
	},
	{
		type: "ss24",
		params: [{ name: "Employee Number", param_key: "employeeNo" }],
	},
	{
		type: "ss25",
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
		lastName: "",
		emergencyFirstName: "",
		emergencyLastName: "",
		birthDate: new Date(),
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
