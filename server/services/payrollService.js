const TAX_CONFIG = {
	HOURS_PER_WEEK: 40,
	ANNUAL_PAY_PERIODS: 26,
	TOTAL_WEEKS: 52,
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

//2024 FD tax brackets
const applyFederalTaxRate = (annualIncome, taxCredit) => {
	const personalCredit = taxCredit ? parseFloat(taxCredit) : 0;
	const taxBrackets = [
		{ upperLimit: 55867, rate: 0.15 },
		{ upperLimit: 111733, rate: 0.205 },
		{ upperLimit: 173205, rate: 0.26 },
		{ upperLimit: 246752, rate: 0.29 },
		{ upperLimit: Infinity, rate: 0.33 },
	];
	const projectedTaxes = [];

	for (let i = 0; i < taxBrackets.length; i++) {
		const bracket = taxBrackets[i];
		const lowerLimit = i === 0 ? personalCredit : taxBrackets[i - 1].upperLimit;
		let remainingIncome = annualIncome;

		if (remainingIncome > lowerLimit) {
			const taxableEarning = annualIncome < bracket.upperLimit ? annualIncome : bracket.upperLimit;
			const taxableIncome = taxableEarning - lowerLimit;

			const taxInBracket = taxableIncome * bracket.rate;
			projectedTaxes.push({
				bracket: `Income between $${lowerLimit.toFixed(2)} and $${bracket.upperLimit.toFixed(2)}`,
				taxableIncome,
				taxInBracket,
			});
			remainingIncome -= taxableIncome;
		} else {
			projectedTaxes.push({
				bracket: `Income between $${lowerLimit.toFixed(2)} and $${bracket.upperLimit.toFixed(2)}`,
				taxableIncome: 0,
				taxInBracket: 0,
			});
		}
	}

	const projectedAnnualTaxBill = projectedTaxes.reduce(
		(sum, bracketIncome) => sum + bracketIncome.taxInBracket,
		0,
	);
	return projectedAnnualTaxBill;
};

//2024 BC Provincial tax brackets
const applyProvincialTaxRate = (annualIncome, taxCredit) => {
	const personalCredit = taxCredit ? parseFloat(taxCredit) : 0;
	const taxBrackets = [
		{ upperLimit: 47937, rate: 0.506 },
		{ upperLimit: 95875, rate: 0.77 },
		{ upperLimit: 110076, rate: 0.105 },
		{ upperLimit: 133664, rate: 0.1229 },
		{ upperLimit: 181232, rate: 0.147 },
		{ upperLimit: 252752, rate: 0.168 },
		{ upperLimit: Infinity, rate: 0.205 },
	];
	const projectedTaxes = [];

	for (let i = 0; i < taxBrackets.length; i++) {
		const bracket = taxBrackets[i];
		const lowerLimit = i === 0 ? personalCredit : taxBrackets[i - 1].upperLimit;
		let remainingIncome = annualIncome;

		if (remainingIncome > lowerLimit) {
			const taxableEarning = annualIncome < bracket.upperLimit ? annualIncome : bracket.upperLimit;
			const taxableIncome = taxableEarning - lowerLimit;

			const taxInBracket = taxableIncome * bracket.rate;
			projectedTaxes.push({
				bracket: `Income between $${lowerLimit.toFixed(2)} and $${bracket.upperLimit.toFixed(2)}`,
				taxableIncome,
				taxInBracket,
			});
			remainingIncome -= taxableIncome;
		} else {
			projectedTaxes.push({
				bracket: `Income between $${lowerLimit.toFixed(2)} and $${bracket.upperLimit.toFixed(2)}`,
				taxableIncome: 0,
				taxInBracket: 0,
			});
		}
	}

	const projectedAnnualTaxBill = projectedTaxes.reduce(
		(sum, bracketIncome) => sum + bracketIncome.taxInBracket,
		0,
	);
	return projectedAnnualTaxBill;
};

const applyBCTaxRate = (annualIncome) => {
	const BC_TaxReductionAmount =
		annualIncome > 0 && annualIncome <= 23179
			? 521
			: annualIncome > 23179 && annualIncome < 37814
			? 521 - 0.0356 * (annualIncome - 23179)
			: 0;
	return BC_TaxReductionAmount;
};

// const getCalcAmount = (hrs, rate) => (hrs / 60).toFixed(2) * rate;
const getCalcAmount = (hrs, rate) => hrs * rate;

const getHrs = (num) => `${(num / 60).toFixed(0)}.${num % 60}`;

// const getSumHours = (hrs) => (hrs ? parseFloat(getHrs(hrs)) : 0);
const getSumHours = (hrs) => (hrs ? parseFloat(hrs) : 0);

const getSumTotal = (data1, data2) => (data1 ?? 0) + data2;

const getTaxDetails = (payRate, grossEarning, empTaxCreditResult) => {
	const { federalTaxCredit, regionalTaxCredit } = empTaxCreditResult;
	const projectedIncome = payRate * TAX_CONFIG.HOURS_PER_WEEK * TAX_CONFIG.ANNUAL_PAY_PERIODS;
	const adjustedProjectedIncome = projectedIncome - TAX_CONFIG.CPP_BASIC_EXEMPTION;
	const adjustedGrossEarning = adjustedProjectedIncome / TAX_CONFIG.ANNUAL_PAY_PERIODS;
	const CPPContribution = adjustedGrossEarning * TAX_CONFIG.TOTAL_CONTRIBUTION_RATE;

	const annualProjectedGrossEarning = grossEarning * TAX_CONFIG.ANNUAL_PAY_PERIODS;

	const federalTaxDeductionByPayPeriod =
		applyFederalTaxRate(annualProjectedGrossEarning, federalTaxCredit) /
		TAX_CONFIG.ANNUAL_PAY_PERIODS;

	const totalProvincialTaxDeduction =
		applyProvincialTaxRate(annualProjectedGrossEarning, regionalTaxCredit) /
		TAX_CONFIG.ANNUAL_PAY_PERIODS;

	const EmployeeEIContribution = TAX_CONFIG.EMP_CONTRIBUTION_RATE * grossEarning;

	const EmployeeEIByPayPeriodMax =
		EmployeeEIContribution > TAX_CONFIG.MAX_EMPLOYEE_EI_CONTRIBUTION
			? TAX_CONFIG.MAX_EMPLOYEE_EI_CONTRIBUTION
			: EmployeeEIContribution;

	const EmployerEIContribution = TAX_CONFIG.EMP_CONTRIBUTION_RATE * 1.4 * grossEarning;

	const EmployerEIByPayPeriodMax =
		EmployerEIContribution > TAX_CONFIG.MAX_EMPLOYER_EI_CONTRIBUTION
			? TAX_CONFIG.MAX_EMPLOYER_EI_CONTRIBUTION
			: EmployerEIContribution;

	return {
		CPPContribution,
		totalProvincialTaxDeduction,
		federalTaxDeductionByPayPeriod,
		EmployeeEIContribution: EmployeeEIByPayPeriodMax,
		EmployerEIContribution: EmployerEIByPayPeriodMax,
	};
};

module.exports = {
	TAX_CONFIG,
	applyFederalTaxRate,
	applyProvincialTaxRate,
	applyBCTaxRate,
	getTaxDetails,
	getHrs,
	getCalcAmount,
	getSumTotal,
	getSumHours,
};
