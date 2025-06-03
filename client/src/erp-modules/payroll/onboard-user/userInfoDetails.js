export const COUNTRIES = [
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

export const userInfoDetails = {
	personalInfo: {
		firstName: "",
		middleName: "",
		lastName: "",
		birthDate: "",
		gender: "",
		SIN: "",
		workPermitNo: "",
		workPermitExpiryNo: "",
		citizenship: "Yes",
	},
	contactInfo: {
		personalEmail: "",
		businessEmail: "",
		personalPhoneNum: "",
		businessPhoneNum: "",
		streetAddress: "",
		city: "",
		streetAddressSuite: "",
		country: "Canada",
		province: "British Columbia",
		postalCode: "",
	},
	emergencyContact: {
		emergencyFirstName: "",
		emergencyLastName: "",
		emergencyPersonalEmail: "",
		emergencyPersonalPhoneNum: "",
		emergencyContactRelationship: "",
	},
	employmentInfo: {
		payrollStatus: "Payroll Active",
		employeeNo: "",
		employmentRole: "Employee",
		jobTitle: "",
		payGroup: "",
		timeManagementBadgeID: "",
		costCenter: "",
		employeeCardNumber: "",
		department: "",
		employmentStartDate: "",
		employmentCountry: "Canada",
		employmentRegion: "British Columbia",
		branch: "",
		branchAddress: "",
		branchCity: "",
		branchZipCode: "", //positions
	},
	payInfo: {
		salary: "",
		payType: "hourly",
		payFrequency: "biweekly",
		taxWithholding: "", //roles
		fullTimeStandardHours: 80,
		partTimeStandardHours: 40,
	},
	benefitsInfo: {
		// Vacation
		typeOfVacationTreatment: "Accrued",
		vacationPayPercent: "",
		YTDVacationAccrued: "0.00",
		YTDVacationUsed: "0.00",
		vacationAdjustment: "",

		// Employer Contributions
		typeOfPensionERTreatment: "No Pension Contributions",
		pensionERContribution: "",
		typeOfDentalERTreatment: "No Dental Contributions",
		dentalERContribution: "",
		typeOfExtendedHealthERTreatment: "No Extended Health Contributions",
		extendedHealthERContribution: "",

		// Employee Contributions
		typeOfPensionEETreatment: "No Pension Contributions",
		pensionEEContribution: "",
		typeOfDentalEETreatment: "No Dental Contributions",
		dentalEEContribution: "",
		typeOfExtendedHealthEETreatment: "No Extended Health Contributions",
		extendedHealthEEContribution: "",
		typeOfUnionDuesTreatment: "No Union Contributions",
		unionDuesContribution: "",
	},
	governmentInfo: {
		// Exemptions
		isCPPExempt: false,
		isEIExempt: false,

		// Income Tax
		federalTax: "Canada",
		regionalTax: "British Columbia",
		federalTaxCredit: "0",
		regionalTaxCredit: "0",

		// Federal Government Contributions
		federalPensionEE: "",
		federalEmploymentInsuranceEE: "",
		federalPensionER: "",
		federalEmploymentInsuranceER: "",

		// Regional Government Deductions
		regionalEmployeeInjury: "",
		regionalEmployeeHealth: "",
		regionalEmployerInjury: "",
		regionalEmployerHealth: "",
	},
	bankingInfo: {
		// Payment Notification
		payStubSendByEmail: "Yes",
		paymentEmail: "",

		// Banking Info
		directDeposit: "Yes",
		bankNum: "",
		transitNum: "",
		accountNum: "",
	},
};

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

// Labels for the personal info sub-steps
export const personalSubSteps = [
	{ title: "Basic Info", description: "Name & Identification" },
	{ title: "Contact Info", description: "Email & Phone" },
	{ title: "Emergency Contact", description: "Emergency details" },
];

// Labels for the employment info sub-steps
export const employmentSubSteps = [
	{ title: "Identification & Status", description: "Basic employment details" },
	{ title: "Position", description: "Job details" },
	{ title: "Region", description: "Location info" },
];

// Labels for the benefits sub-steps
export const benefitsSubSteps = [
	{ title: "Vacation", description: "Vacation settings" },
	{ title: "Employer Contributions", description: "Company benefits" },
	{ title: "Employee Contributions", description: "Employee deductions" },
];

// Labels for the government sub-steps
export const governmentSubSteps = [
	{ title: "Exemption", description: "CPP/EI exemptions" },
	{ title: "Income Tax", description: "Tax settings" },
	{ title: "Federal Contributions", description: "Federal deductions" },
	{ title: "Regional Deductions", description: "Provincial deductions" },
];

// Labels for the banking sub-steps
export const bankingSubSteps = [
	{ title: "Payment Notification", description: "Paystub delivery" },
	{ title: "Banking Info", description: "Direct deposit details" },
];

export const trimText = (str) => str.replace(/\s+/g, " ").trim();
