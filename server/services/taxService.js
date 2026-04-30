const FREQUENCY_MAP = {
	Daily: { ANNUAL_PAY_PERIODS: 260, HOURS_PER_PERIOD: 8, TOTAL_WEEKS: 52 },
	Weekly: { ANNUAL_PAY_PERIODS: 52, HOURS_PER_PERIOD: 40, TOTAL_WEEKS: 52 },
	Biweekly: { ANNUAL_PAY_PERIODS: 26, HOURS_PER_PERIOD: 80, TOTAL_WEEKS: 52 },
	Semimonthly: { ANNUAL_PAY_PERIODS: 24, HOURS_PER_PERIOD: 86.67, TOTAL_WEEKS: 52 },
	Monthly: { ANNUAL_PAY_PERIODS: 12, HOURS_PER_PERIOD: 173.33, TOTAL_WEEKS: 52 },
	Quarterly: { ANNUAL_PAY_PERIODS: 4, HOURS_PER_PERIOD: 520, TOTAL_WEEKS: 52 },
	Annually: { ANNUAL_PAY_PERIODS: 1, HOURS_PER_PERIOD: 2080, TOTAL_WEEKS: 52 },
};
// const freqSettings = FREQUENCY_MAP[frequency];

const TAX_CONFIG = {
	// HOURS_PER_WEEK: freqSettings.HOURS_PER_PERIOD,
	// ANNUAL_PAY_PERIODS: freqSettings.ANNUAL_PAY_PERIODS,
	// TOTAL_WEEKS: freqSettings.TOTAL_WEEKS,
	TOTAL_CONTRIBUTION_RATE: 0.0595,
	CPP_BASIC_EXEMPTION: 3500,
	NUMBER_OF_MONTHS: 12,
	CPP_BASE_EMP_COMP_RATE: 0.0495,
	CPP_ADDITIONAL_EMP_COMP_RATE: 0.01,
	MAX_FEDERAL_BASIC: 15000,
	MIN_FEDERAL_BASIC: 13521,
	MAX_CPP_CONTRIBUTION: 3123.45,
	MAX_EMPLOYEE_EI_CONTRIBUTION: 1002.45,
	MAX_EMPLOYER_EI_CONTRIBUTION: 1403.43,
	EMP_CONTRIBUTION_RATE: 0.0163,
	MAX_CANADA_EMP_CREDIT: 1368,
	MIN_FEDERAL_TAX_RATE: 0.15,
	MIN_PROVINCIAL_TAX_RATE: 0.0506,
	UNION_DUES_RATE: 0.2,
	MAX_PROVINCIAL_CLAIM: 11981.0,
};

const FEDERAL_TAX_BRACKETS_2026 = [
	{ upperLimit: 58523, rate: 0.14 },
	{ upperLimit: 117045, rate: 0.205 },
	{ upperLimit: 181440, rate: 0.26 },
	{ upperLimit: 258482, rate: 0.29 },
	{ upperLimit: Infinity, rate: 0.33 },
];

const BC_TAX_BRACKETS_2026 = [
	{ upperLimit: 50363, rate: 0.0506 }, // or 0.056 if using updated budget rate
	{ upperLimit: 100728, rate: 0.077 },
	{ upperLimit: 115648, rate: 0.105 },
	{ upperLimit: 140430, rate: 0.1229 },
	{ upperLimit: 190405, rate: 0.147 },
	{ upperLimit: 265545, rate: 0.168 },
	{ upperLimit: Infinity, rate: 0.205 },
];

const normalizeFrequency = (frequency) => {
	if (!frequency) return "Biweekly";

	const map = {
		daily: "Daily",
		weekly: "Weekly",
		biweekly: "Biweekly",
		"bi-weekly": "Biweekly",
		semimonthly: "Semimonthly",
		monthly: "Monthly",
		quarterly: "Quarterly",
		annually: "Annually",
	};

	return map[frequency.toLowerCase()] || "Biweekly";
};

const calculateTax = (annualIncome, taxCredit = 0, brackets = []) => {
	const credit = Number(taxCredit) || 0;

	return brackets.reduce((tax, bracket, i) => {
		const lower = i === 0 ? credit : brackets[i - 1].upperLimit;
		const upper = bracket.upperLimit;

		if (annualIncome <= lower) return tax;

		const taxableIncome = Math.min(annualIncome, upper) - lower;
		return tax + taxableIncome * bracket.rate;
	}, 0);
};

const parseCurrency = (value) => {
	if (!value) return 0;
	if (typeof value === "number") return value;

	return parseFloat(value.replace(/[$,]/g, "")) || 0;
};

const getTaxDetails = (
	payRate,
	grossEarning,
	empTaxCreditResult = {},
	frequencyInput = "Biweekly",
) => {
	const frequency = normalizeFrequency(frequencyInput);
	const freq = FREQUENCY_MAP[frequency];

	if (!freq) {
		throw new Error(`Invalid frequency: ${frequency}`);
	}

	const annualPayPeriods = freq.ANNUAL_PAY_PERIODS;
	const annualIncome = grossEarning * annualPayPeriods;

	const federalCredit = parseCurrency(empTaxCreditResult?.federalTaxCredit);
	const provincialCredit = parseCurrency(empTaxCreditResult?.regionalTaxCredit);

	// CPP
	const adjustedIncome = annualIncome - TAX_CONFIG.CPP_BASIC_EXEMPTION;
	const cppPerPeriod = empTaxCreditResult?.isCPPExempt
		? 0
		: Math.max(0, (adjustedIncome / annualPayPeriods) * TAX_CONFIG.TOTAL_CONTRIBUTION_RATE);

	// Federal tax
	const federalTax =
		calculateTax(annualIncome, federalCredit, FEDERAL_TAX_BRACKETS_2026) / annualPayPeriods;

	// Provincial tax
	const provincialTax =
		calculateTax(annualIncome, provincialCredit, BC_TAX_BRACKETS_2026) / annualPayPeriods;

	// EI
	const employeeEI = empTaxCreditResult?.isEIExempt
		? 0
		: Math.min(
				TAX_CONFIG.EMP_CONTRIBUTION_RATE * grossEarning,
				TAX_CONFIG.MAX_EMPLOYEE_EI_CONTRIBUTION,
			);

	const employerEI = empTaxCreditResult?.isEIExempt
		? 0
		: Math.min(
				TAX_CONFIG.EMP_CONTRIBUTION_RATE * 1.4 * grossEarning,
				TAX_CONFIG.MAX_EMPLOYER_EI_CONTRIBUTION,
			);

	return {
		// annualIncome,
		// federalTaxPerPeriod: federalTax,
		// provincialTaxPerPeriod: provincialTax,
		CPPContribution: cppPerPeriod,
		totalProvincialTaxDeduction: provincialTax,
		federalTaxDeductionByPayPeriod: federalTax,
		EmployeeEIContribution: employeeEI,
		EmployerEIContribution: employerEI,
	};
};

module.exports = {
	getTaxDetails,
};
