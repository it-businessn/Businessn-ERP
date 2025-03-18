const COUNTRIES = [
	{
		type: "Canada",
		dependent: false,
		provinces: [
			"Alberta",
			"British Columbia",
			"Manitoba",
			"New Brunswick",
			"Newfoundland and Labrador",
			"Nova Scotia",
			"Ontario",
			"Prince Edward Island",
			"Quebec",
			"Saskatchewan",
			"Northwest Territories",
			"Nunavut",
			"Yukon",
		],
	},
	{
		type: "US",
		dependent: false,
		provinces: [
			"Alabama",
			"Alaska",
			"Arizona",
			"Arkansas",
			"California",
			"Colorado",
			"Connecticut",
			"Delaware",
			"Florida",
			"Georgia",
			"Hawaii",
			"Idaho",
			"Illinois",
			"Indiana",
			"Iowa",
			"Kansas",
			"Kentucky",
			"Louisiana",
			"Maine",
			"Maryland",
			"Massachusetts",
			"Michigan",
			"Minnesota",
			"Mississippi",
			"Missouri",
			"Montana",
			"Nebraska",
			"Nevada",
			"New Hampshire",
			"New Jersey",
			"New Mexico",
			"New York",
			"North Carolina",
			"North Dakota",
			"Ohio",
			"Oklahoma",
			"Oregon",
			"Pennsylvania",
			"Rhode Island",
			"South Carolina",
			"South Dakota",
			"Tennessee",
			"Texas",
			"Utah",
			"Vermont",
			"Virginia",
			"Washington",
			"West Virginia",
			"Wisconsin",
			"Wyoming",
		],
	},
];

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
			{
				name: "Personal Email",
				param_key: "personalEmail",
				mandatory: true,
			},
			{ name: "Personal Phone", param_key: "personalPhoneNum" },
			{ name: "Address", param_key: "address", mandatory: true },
			{
				name: "Street Address",
				param_key: "streetAddress",
				mandatory: true,
			},
			{ name: "Suite", param_key: "streetAddressSuite" },
			{ name: "City", param_key: "city", mandatory: true },

			{
				name: "Country",
				param_key: "country",
				mandatory: true,
				control: "select",
				options: COUNTRIES,
			},
			{
				name: "Province/State",
				param_key: "province",
				mandatory: true,
				control: "select",
				options: COUNTRIES,
			},
			{ name: "Postal Code", mandatory: true, param_key: "postalCode" },
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
			{ name: "First Name", param_key: "firstName", mandatory: true },
			{
				name: "Birthday",
				param_key: "birthDate",
				control: "date",
				// mandatory: true,
			},
			{
				name: "Social Insurance Number",
				param_key: "SIN",
				submandatory: true,
			},

			{ name: "Work Permit Number", param_key: "workPermitNo" },
			{
				name: "Citizenship",
				param_key: "citizenship",
				control: "radio",
				options: ["Yes", "No"],
			},
			{
				name: "Marital Status",
				param_key: "maritalStatus",
				control: "radio",
				options: ["Single", "Married"],
			},
		],
	},
	{
		type: "sfsgdsgdsgdsg27",
		params: [
			{ name: "Middle Name", param_key: "middleName" },
			{ name: "sfsgdsgdsgdsg1", param_key: "sfsgdsgdsgdsg5" },
			{ name: "sfsgdsgdsgdsg2", param_key: "sfsgdsgdsgdsg6" },
			{ name: "Work Permit Expiry", param_key: "workPermitExpiryNo" },
			{
				name: "Password",
				param_key: "password",
				mandatory: true,
			},
		],
	},
	{
		type: "sfsgdsgdsgdsg27",
		params: [
			{ name: "Last Name", param_key: "lastName", mandatory: true },
			{ name: "sfsgdsgdsgdsg1", param_key: "sfsgdsgdsgdsg5" },
			{ name: "sfsgdsgdsgdsg2", param_key: "sfsgdsgdsgdsg6" },
			{ name: "sfsgdsgdsgdsg3", param_key: "sfsgdsgdsgdsg7" },
			{ name: "sfsgdsgdsgdsg5", param_key: "sfsgdsgdsgdsg8" },
		],
	},
];

export const getInitialProfileInfo = (empId, companyName) => {
	return {
		empId,
		companyName,
		firstName: null,
		middleName: "",
		lastName: "",
		password: "",
		emergencyFirstName: "",
		emergencyLastName: "",
		birthDate: null,
		SIN: null,
		maritalStatus: "",
		citizenship: "",
		workPermitNo: "",
		workPermitExpiryNo: "",
		personalEmail: null,
		personalPhoneNum: "",
		businessEmail: "",
		businessPhoneNum: "",
		emergencyPersonalEmail: "",
		emergencyPersonalPhoneNum: "",
		streetAddress: "",
		city: "",
		province: "British Columbia",
		country: "Canada",
		postalCode: "",
		streetAddressSuite: "",
	};
};
