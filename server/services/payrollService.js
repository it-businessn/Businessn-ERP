const TAX_CONFIG = {
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
	MAX_EI_CONTRIBUTION: 1002.45,
	EMP_CONTRIBUTION_RATE: 0.0163,
	MAX_CANADA_EMP_CREDIT: 1368,
	MIN_FEDERAL_TAX_RATE: 0.15,
	MIN_PROVINCIAL_TAX_RATE: 0.0506,
};

const applyFederalTaxRate = (annualIncome) => {
	let taxRateConstant =
		annualIncome > 0 && annualIncome <= 53359
			? { rate: 0.15, kRate: 0 }
			: annualIncome > 53359.01 && annualIncome <= 106717
			? { rate: 0.205, kRate: 2935 }
			: annualIncome > 106717.01 && annualIncome < 165430.0
			? { rate: 0.26, kRate: 8804 }
			: annualIncome > 165430.01 && annualIncome < 235675
			? { rate: 0.29, kRate: 13767 }
			: { rate: 0.33, kRate: 23194 };
	return taxRateConstant;
};

const applyProvincialTaxRate = (annualIncome) => {
	let taxRateConstant =
		annualIncome > 0 && annualIncome <= 45654
			? { rate: 0.0506, kRate: 0 }
			: annualIncome > 45654.01 && annualIncome <= 91310
			? { rate: 0.077, kRate: 1205 }
			: annualIncome > 91310.01 && annualIncome < 104835.0
			? { rate: 0.105, kRate: 3762 }
			: annualIncome > 104835.01 && annualIncome < 127299
			? { rate: 0.1229, kRate: 5638 }
			: annualIncome > 127299.01 && annualIncome < 172602.0
			? { rate: 0.147, kRate: 8706 }
			: annualIncome > 172602.01 && annualIncome < 240716.0
			? { rate: 0.168, kRate: 12331 }
			: { rate: 0.205, kRate: 21238 };
	return taxRateConstant;
};

const applyBCTaxRate = (annualIncome) => {
	let BCtaxReductionAmount =
		annualIncome > 0 && annualIncome <= 23179
			? 521
			: annualIncome > 23179 && annualIncome < 37814
			? 521 - 0.0356 * (annualIncome - 23179)
			: 0;
	return BCtaxReductionAmount;
};

const getCalcAmount = (hrs, rate) => (hrs / 60).toFixed(2) * rate;

const getHrs = (num) => `${(num / 60).toFixed(0)}.${num % 60}`;

const getSumHours = (hrs) => (hrs ? parseFloat(getHrs(hrs)) : 0);

const getSumTotal = (data1, data2) => (data1 ?? 0) + data2;

const getTaxDetails = (grossSalary) => {
	const annualSalaryByPayPeriod = grossSalary * TAX_CONFIG.ANNUAL_PAY_PERIODS;

	const grossSalaryByPayPeriod = grossSalary;

	const CPPContribution =
		TAX_CONFIG.TOTAL_CONTRIBUTION_RATE *
		(grossSalaryByPayPeriod -
			TAX_CONFIG.CPP_BASIC_EXEMPTION / TAX_CONFIG.NUMBER_OF_MONTHS);

	const EIContribution =
		TAX_CONFIG.EMP_CONTRIBUTION_RATE * grossSalaryByPayPeriod;

	const CPPAdditionalContribution =
		CPPContribution *
		(TAX_CONFIG.CPP_ADDITIONAL_EMP_COMP_RATE /
			TAX_CONFIG.TOTAL_CONTRIBUTION_RATE);

	const netRemuneration = grossSalaryByPayPeriod - CPPAdditionalContribution;
	const annualNetIncome = netRemuneration * TAX_CONFIG.NUMBER_OF_MONTHS;
	const zoneDeduction = 0;
	const annualTaxableIncome = annualNetIncome - zoneDeduction;

	const federalTaxRate = applyFederalTaxRate(annualTaxableIncome).rate;

	const federalTaxConstantRate = applyFederalTaxRate(annualTaxableIncome).kRate;

	const federalTax =
		annualTaxableIncome * federalTaxRate - federalTaxConstantRate;

	const federalClaim = TAX_CONFIG.MAX_FEDERAL_BASIC;

	const CPPByPayPeriod =
		CPPContribution *
		(TAX_CONFIG.CPP_BASE_EMP_COMP_RATE / TAX_CONFIG.TOTAL_CONTRIBUTION_RATE) *
		TAX_CONFIG.NUMBER_OF_MONTHS;

	const CPPByPayPeriodMax =
		CPPByPayPeriod > TAX_CONFIG.MAX_CPP_CONTRIBUTION
			? TAX_CONFIG.MAX_CPP_CONTRIBUTION
			: CPPByPayPeriod;
	// const EIByPayPeriod =
	// EIContribution *
	//   (CPP_BASE_EMP_COMP_RATE / TOTAL_CONTRIBUTION_RATE) *
	//   NUMBER_OF_MONTHS;
	const EIByPayPeriodMax = TAX_CONFIG.MAX_EI_CONTRIBUTION;
	const totalFederalTaxCredits =
		federalClaim +
		CPPByPayPeriodMax +
		EIByPayPeriodMax +
		TAX_CONFIG.MAX_CANADA_EMP_CREDIT;
	const totalFederalTaxCreditsRate =
		totalFederalTaxCredits * TAX_CONFIG.MIN_FEDERAL_TAX_RATE;
	const totalFederalTaxPayable = federalTax - totalFederalTaxCreditsRate;

	const provincialTaxRate = applyProvincialTaxRate(annualTaxableIncome).rate;
	const provincialTaxConstantRate =
		applyProvincialTaxRate(annualTaxableIncome).kRate;

	const provincialTax =
		annualTaxableIncome * provincialTaxRate - provincialTaxConstantRate;
	const provincialClaim = 11981.0;
	const totalProvincialTaxCredits =
		provincialClaim + CPPByPayPeriodMax + EIByPayPeriodMax;
	const totalProvincialTaxCreditsRate =
		totalProvincialTaxCredits * TAX_CONFIG.MIN_PROVINCIAL_TAX_RATE;
	const totalProvincialTaxPayableBeforeReduction =
		provincialTax - totalProvincialTaxCreditsRate;
	const BCTaxReductionAmount = applyBCTaxRate(annualNetIncome);

	const totalProvincialTaxPayableAfterReduction =
		totalProvincialTaxPayableBeforeReduction - BCTaxReductionAmount;

	const totalFederalProvincialTax =
		totalFederalTaxPayable + totalProvincialTaxPayableAfterReduction;

	const totalProvincialTaxDeduction =
		totalFederalProvincialTax > 0 ? totalFederalProvincialTax : 0;

	const federalTaxDeductionByPayPeriod =
		totalProvincialTaxDeduction / TAX_CONFIG.ANNUAL_PAY_PERIODS;
	return {
		grossSalaryByPayPeriod,
		totalProvincialTaxDeduction,
		federalTaxDeductionByPayPeriod,
		CPPContribution,
		EIContribution,
		CPPAdditionalContribution,
		netRemuneration,
		annualNetIncome,
		zoneDeduction,
		annualTaxableIncome,
		federalTaxRate,
		federalTaxConstantRate,
		federalTax,
		federalClaim,
		CPPByPayPeriodMax,
		EIByPayPeriodMax,
		HOURLY_RATE: TAX_CONFIG.HOURLY_RATE,
		MAX_CANADA_EMP_CREDIT: TAX_CONFIG.MAX_CANADA_EMP_CREDIT,
		totalFederalTaxCredits,
		totalFederalTaxCreditsRate,
		totalFederalTaxPayable,
		provincialTaxRate,
		provincialTaxConstantRate,
		provincialTax,
		provincialClaim,
		totalProvincialTaxCredits,
		totalProvincialTaxCreditsRate,
		totalProvincialTaxPayableBeforeReduction,
		BCTaxReductionAmount,
		totalProvincialTaxPayableAfterReduction,
		totalFederalProvincialTax,
		MIN_PROVINCIAL_TAX_RATE: TAX_CONFIG.MIN_PROVINCIAL_TAX_RATE,
		MIN_FEDERAL_TAX_RATE: TAX_CONFIG.MIN_FEDERAL_TAX_RATE,
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
