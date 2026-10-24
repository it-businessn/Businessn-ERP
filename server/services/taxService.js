const moment = require("moment");
const { safeNum } = require("../utils/time.util");
const {
	FEDERAL_EDITIONS,
	BC_EDITIONS,
	CPP_EDITIONS,
	EI_EDITIONS,
	EI_EMPLOYER_MULTIPLIER,
	LAST_FEDERAL_YEAR,
	LAST_BC_YEAR,
	LAST_CPP_YEAR,
	LAST_EI_YEAR,
} = require("../constants/taxTables.constants");

/**
 * PAYROLL-CALC: per-period CPP, CPP2, EI and federal / BC income tax, following
 * the CRA T4127 "Option 1" (annualised) formulas, with the tables in force on
 * the pay date (constants/taxTables.constants.js).
 *
 *   C   = CPP:  rate x (I - exemption / P), capped at the annual maximum less
 *                what was already deducted this year (year to date)
 *   C2  = CPP2: 4 % of earnings between the YMPE and the YAMPE (year to date)
 *   EI  = rate x I, capped at the annual maximum less year to date
 *   A   = P x (I - F5)          F5 = enhanced CPP (first additional + CPP2)
 *   federal = R x A - K - K1 - K2 - K4      (R/K from the brackets)
 *   BC      = V x A - KP - K1P - K2P - S    (S = BC tax reduction)
 *   K1 / K1P  personal amount (TD1 claim; basic personal amount when none)
 *   K2 / K2P  base CPP and EI credits;  K4  Canada employment amount
 * Credits are taken at the edition's lowest rate. Not included: RRSP, union
 * dues and other deductions from income (F, U1, HD), K3 / K3P other credits.
 */

const FREQUENCY_MAP = {
	Daily: { ANNUAL_PAY_PERIODS: 260, HOURS_PER_PERIOD: 8, TOTAL_WEEKS: 52 },
	Weekly: { ANNUAL_PAY_PERIODS: 52, HOURS_PER_PERIOD: 40, TOTAL_WEEKS: 52 },
	Biweekly: { ANNUAL_PAY_PERIODS: 26, HOURS_PER_PERIOD: 80, TOTAL_WEEKS: 52 },
	Semimonthly: { ANNUAL_PAY_PERIODS: 24, HOURS_PER_PERIOD: 86.67, TOTAL_WEEKS: 52 },
	Monthly: { ANNUAL_PAY_PERIODS: 12, HOURS_PER_PERIOD: 173.33, TOTAL_WEEKS: 52 },
	Quarterly: { ANNUAL_PAY_PERIODS: 4, HOURS_PER_PERIOD: 520, TOTAL_WEEKS: 52 },
	Annually: { ANNUAL_PAY_PERIODS: 1, HOURS_PER_PERIOD: 2080, TOTAL_WEEKS: 52 },
};
const warned = new Set();
/** Latest edition started on or before `day`; warns once per table/year when missing or pending. */
const editionFor = (editions, day, label, lastYear) => {
	const year = Number(day.slice(0, 4));
	const applicable = editions.filter((e) => e.from <= day);
	const edition = applicable[applicable.length - 1] || editions[0];
	const key = `${label}:${year}`;
	const pending = edition.pending?.length && edition.from.slice(0, 4) === String(year);
	if ((year > lastYear || !applicable.length || pending) && !warned.has(key)) {
		warned.add(key);
		console.warn(
			pending
				? `TAX-TABLES: ${label} ${year} ${edition.pending.join(", ")} not published yet; ` +
						`using "${edition.source}". Update constants/taxTables.constants.js.`
				: `TAX-TABLES: no ${label} table for ${year}; using "${edition.source}". ` +
						"Add the year to constants/taxTables.constants.js.",
		);
	}
	return edition;
};

const payDay = (payDate) => {
	const parsed = moment.utc(payDate);
	return (parsed.isValid() ? parsed : moment.utc()).format("YYYY-MM-DD");
};

/** Every table in force on the pay date (CRA uses the tables in force on the date paid). */
const getTaxTables = (payDate = new Date()) => {
	const day = payDay(payDate);
	const federal = editionFor(FEDERAL_EDITIONS, day, "federal", LAST_FEDERAL_YEAR);
	const provincial = editionFor(BC_EDITIONS, day, "BC", LAST_BC_YEAR);
	const cpp = editionFor(CPP_EDITIONS, day, "CPP", LAST_CPP_YEAR);
	const ei = editionFor(EI_EDITIONS, day, "EI", LAST_EI_YEAR);
	return {
		federal: federal.brackets,
		provincial: provincial.brackets,
		federalEdition: federal,
		provincialEdition: provincial,
		cpp,
		ei,
		sources: {
			federal: federal.source,
			provincial: provincial.source,
			cpp: cpp.source,
			ei: ei.source,
		},
	};
};

/** Tax on annual income before credits. */
const bracketTax = (annualIncome, brackets) =>
	brackets.reduce((tax, bracket, i) => {
		const lower = i === 0 ? 0 : brackets[i - 1].upperLimit;
		if (annualIncome <= lower) return tax;
		return tax + (Math.min(annualIncome, bracket.upperLimit) - lower) * bracket.rate;
	}, 0);

/**
 * Tax on annual income with a personal amount claimed at the lowest rate (kept
 * for callers and tests of the old helper; never below zero).
 */
const calculateTax = (annualIncome, taxCredit = 0, brackets = []) =>
	Math.max(0, bracketTax(annualIncome, brackets) - safeNum(taxCredit) * (brackets[0]?.rate || 0));

/** Federal basic personal amount for annual income A (T4127 BPAF, reduced for high incomes). */
const federalBasicAmount = ({ max, min, phaseOutFrom, phaseOutTo }, annualIncome) => {
	if (annualIncome <= phaseOutFrom) return max;
	if (annualIncome >= phaseOutTo) return min;
	return max - ((max - min) * (annualIncome - phaseOutFrom)) / (phaseOutTo - phaseOutFrom);
};

/** BC tax reduction (factor S) for annual income: piecewise linear through the edition's points. */
const bcTaxReduction = (points, annualIncome) => {
	if (!points?.length) return 0;
	if (annualIncome <= points[0][0]) return points[0][1];
	for (let i = 1; i < points.length; i++) {
		const [x0, y0] = points[i - 1];
		const [x1, y1] = points[i];
		if (annualIncome <= x1) return y0 + ((y1 - y0) * (annualIncome - x0)) / (x1 - x0);
	}
	return 0;
};

const normalizeFrequency = (frequency) => {
	if (!frequency) return "Biweekly";

	const map = {
		daily: "Daily",
		weekly: "Weekly",
		biweekly: "Biweekly",
		"bi-weekly": "Biweekly",
		semimonthly: "Semimonthly",
		// BUG-03: hyphenated spelling (as used on the ROE screens) used to fall
		// through to the Biweekly default and annualise with 26 periods.
		"semi-monthly": "Semimonthly",
		monthly: "Monthly",
		quarterly: "Quarterly",
		annually: "Annually",
	};

	return map[frequency.toLowerCase()] || "Biweekly";
};

const parseCurrency = (value) => {
	if (!value) return 0;
	if (typeof value === "number") return value;

	return parseFloat(value.replace(/[$,]/g, "")) || 0;
};

/**
 * The personal amount to claim: the TD1 amount entered on the employee, or,
 * when none was entered (blank or 0, the screen's old default), the basic
 * personal amount - what CRA prescribes when an employee gives no TD1 (claim
 * code 1). `isTD1ClaimCodeZero` = the employee claims nothing (claim code 0,
 * e.g. a second job).
 */
const claimAmount = (entered, claimCodeZero, basicAmount) => {
	if (claimCodeZero) return 0;
	const amount = parseCurrency(entered);
	return amount > 0 ? amount : basicAmount;
};

const round2 = (n) => Math.round(n * 100) / 100;

const getTaxDetails = (
	payRate,
	grossEarning,
	empTaxCreditResult = {},
	frequencyInput = "Biweekly",
	{ payDate, ytd = {} } = {},
) => {
	const tables = getTaxTables(payDate);
	const frequency = normalizeFrequency(frequencyInput);
	const freq = FREQUENCY_MAP[frequency];

	if (!freq) {
		throw new Error(`Invalid frequency: ${frequency}`);
	}

	const P = freq.ANNUAL_PAY_PERIODS;
	const I = Math.max(0, safeNum(grossEarning));
	const credits = empTaxCreditResult || {};
	const { cpp, ei } = tables;
	const prior = {
		cpp: Math.max(0, safeNum(ytd.cpp)),
		cpp2: Math.max(0, safeNum(ytd.cpp2)),
		ei: Math.max(0, safeNum(ytd.ei)),
		pensionable: Math.max(0, safeNum(ytd.pensionableEarnings)),
	};

	// CPP (first tier), capped at the annual maximum (T4127 C)
	const maxCPP = cpp.rate * (cpp.ympe - cpp.exemption);
	const cpp1 = credits.isCPPExempt
		? 0
		: Math.max(0, Math.min(maxCPP - prior.cpp, cpp.rate * (I - cpp.exemption / P)));
	// CPP2 on year-to-date earnings between YMPE and YAMPE (T4127 C2)
	const maxCPP2 = cpp.cpp2Rate * (cpp.yampe - cpp.ympe);
	const cpp2 = credits.isCPPExempt
		? 0
		: Math.max(
				0,
				Math.min(
					maxCPP2 - prior.cpp2,
					(prior.pensionable + I - Math.max(prior.pensionable, cpp.ympe)) * cpp.cpp2Rate,
				),
			);

	// EI, capped at the annual maximum (T4127 EI)
	const maxEI = ei.rate * ei.maxInsurable;
	const employeeEI = credits.isEIExempt ? 0 : Math.max(0, Math.min(maxEI - prior.ei, ei.rate * I));

	// annual taxable income: enhanced CPP (first additional + CPP2) is deductible (F5)
	const F5 = cpp1 * ((cpp.rate - cpp.baseRate) / cpp.rate) + cpp2;
	const A = Math.max(0, P * (I - F5));
	// base CPP and EI credit amounts (K2 / K2P)
	const cppEiCredit =
		Math.min(P * cpp1 * (cpp.baseRate / cpp.rate), cpp.baseRate * (cpp.ympe - cpp.exemption)) +
		Math.min(P * employeeEI, maxEI);

	// federal (T3)
	const fed = tables.federalEdition;
	const fedRate = fed.brackets[0].rate;
	const federalClaim = claimAmount(
		credits.federalTaxCredit,
		credits.isTD1ClaimCodeZero,
		federalBasicAmount(fed.bpa, A),
	);
	const federalAnnual = Math.max(
		0,
		bracketTax(A, fed.brackets) -
			fedRate * federalClaim -
			fedRate * cppEiCredit -
			fedRate * Math.min(A, fed.cea),
	);

	// British Columbia (T4, less the BC tax reduction S)
	const prov = tables.provincialEdition;
	const provRate = prov.brackets[0].rate;
	const provincialClaim = claimAmount(credits.regionalTaxCredit, credits.isTD1ClaimCodeZero, prov.bpa);
	const T4 = Math.max(
		0,
		bracketTax(A, prov.brackets) - provRate * provincialClaim - provRate * cppEiCredit,
	);
	const bcReduction = Math.min(T4, bcTaxReduction(prov.reduction, A));
	const provincialAnnual = Math.max(0, T4 - bcReduction);

	return {
		CPPContribution: cpp1 + cpp2,
		CPP2Contribution: cpp2,
		totalProvincialTaxDeduction: provincialAnnual / P,
		federalTaxDeductionByPayPeriod: federalAnnual / P,
		EmployeeEIContribution: employeeEI,
		EmployerEIContribution: employeeEI * EI_EMPLOYER_MULTIPLIER,
		// what was applied, for checking a stub against the CRA calculator
		details: {
			annualTaxableIncome: round2(A),
			federalClaim: round2(federalClaim),
			provincialClaim: round2(provincialClaim),
			bcTaxReduction: round2(bcReduction / P),
			sources: tables.sources,
		},
	};
};

module.exports = {
	getTaxDetails,
	getTaxTables,
	calculateTax,
	federalBasicAmount,
	bcTaxReduction,
};
