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

//2025 FD tax brackets
const applyFederalTaxRate = (annualIncome, taxCredit) => {
	const personalCredit = taxCredit ? parseFloat(taxCredit) : 0;
	const taxBrackets = [
		{ upperLimit: 57375, rate: 0.15 },
		{ upperLimit: 114750, rate: 0.205 },
		{ upperLimit: 177882, rate: 0.26 },
		{ upperLimit: 253414, rate: 0.29 },
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

//2025 BC Provincial tax brackets
const applyProvincialTaxRate = (annualIncome, taxCredit) => {
	const personalCredit = taxCredit ? parseFloat(taxCredit) : 0;
	const taxBrackets = [
		{ upperLimit: 49279, rate: 0.0506 },
		{ upperLimit: 98560, rate: 0.077 },
		{ upperLimit: 113158, rate: 0.105 },
		{ upperLimit: 137407, rate: 0.1229 },
		{ upperLimit: 186306, rate: 0.147 },
		{ upperLimit: 259829, rate: 0.168 },
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

// const calcSalary = (hrs, rate) => (hrs / 60).toFixed(2) * rate;
const calcSalary = (hrs, rate) => hrs * rate;

const getHrs = (num) => `${(num / 60).toFixed(0)}.${num % 60}`;

// const convertHrsToFloat = (hrs) => (hrs ? parseFloat(getHrs(hrs)) : 0);
const convertHrsToFloat = (hrs) => (hrs ? parseFloat(hrs) : 0);

const getSumTotal = (data1, data2) => (data1 || 0) + data2;

const getTaxDetails = (payRate, grossEarning, empTaxCreditResult, frequency = "Biweekly") => {
	frequency = "bi-weekly" || "Biweekly" ? "Biweekly" : frequency;
	const annualPayPeriods = FREQUENCY_MAP[frequency].ANNUAL_PAY_PERIODS;
	const hrsPayPeriods = FREQUENCY_MAP[frequency].HOURS_PER_PERIOD;
	const annualProjectedGrossEarning = grossEarning * annualPayPeriods;

	// const projectedIncome = payRate * hrsPayPeriods * annualPayPeriods;
	const projectedIncome = annualProjectedGrossEarning;
	const adjustedProjectedIncome = projectedIncome - TAX_CONFIG.CPP_BASIC_EXEMPTION;
	const adjustedGrossEarning = adjustedProjectedIncome / annualPayPeriods;

	const CPPAmount = empTaxCreditResult?.isCPPExempt
		? 0
		: adjustedGrossEarning * TAX_CONFIG.TOTAL_CONTRIBUTION_RATE;
	const CPPContribution = CPPAmount < 0 ? 0 : CPPAmount;

	if (empTaxCreditResult?.federalTaxCredit) {
		empTaxCreditResult.federalTaxCredit = parseFloat(
			empTaxCreditResult.federalTaxCredit.replace(/[$,]/g, ""),
		);
	}
	if (empTaxCreditResult?.regionalTaxCredit) {
		empTaxCreditResult.regionalTaxCredit = parseFloat(
			empTaxCreditResult.regionalTaxCredit.replace(/[$,]/g, ""),
		);
	}

	const federalTaxDeductionByPayPeriod =
		applyFederalTaxRate(annualProjectedGrossEarning, empTaxCreditResult?.federalTaxCredit) /
		annualPayPeriods;

	const totalProvincialTaxDeduction =
		applyProvincialTaxRate(annualProjectedGrossEarning, empTaxCreditResult?.regionalTaxCredit) /
		annualPayPeriods;

	const EE_EIContribution = empTaxCreditResult?.isEIExempt
		? 0
		: TAX_CONFIG.EMP_CONTRIBUTION_RATE * grossEarning;
	const EmployeeEIContribution = EE_EIContribution < 0 ? 0 : EE_EIContribution;

	const EmployeeEIByPayPeriodMax =
		EmployeeEIContribution > TAX_CONFIG.MAX_EMPLOYEE_EI_CONTRIBUTION
			? TAX_CONFIG.MAX_EMPLOYEE_EI_CONTRIBUTION
			: EmployeeEIContribution;

	const ER_EIContribution = empTaxCreditResult?.isEIExempt
		? 0
		: TAX_CONFIG.EMP_CONTRIBUTION_RATE * 1.4 * grossEarning;
	const EmployerEIContribution = ER_EIContribution < 0 ? 0 : ER_EIContribution;

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

const getSumRegHrs = (regHrs1, regHrs2) => (regHrs2 ? regHrs1 - regHrs2 : regHrs1);

module.exports = {
	TAX_CONFIG,
	applyFederalTaxRate,
	applyProvincialTaxRate,
	applyBCTaxRate,
	getTaxDetails,
	getHrs,
	calcSalary,
	getSumTotal,
	convertHrsToFloat,
	getSumRegHrs,
};
