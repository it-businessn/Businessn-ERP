/**
 * TAX-TABLES: federal and British Columbia income tax brackets, basic personal
 * amounts, BC tax reduction, CPP and EI, by pay date.
 *
 * CRA rule: payroll deductions use the tables in force on the date the
 * employee is PAID (the pay date), not the pay period dates. Each year can have
 * mid-year editions (CRA publishes a January and a July T4127); a pay date uses
 * the latest edition that started on or before it.
 *
 * Sources (verify against the CRA T4127 "Payroll Deductions Formulas" each
 * January and July, and the BC budget):
 *  - 2025 federal: thresholds 57,375 / 114,750 / 177,882 / 253,414; lowest rate
 *    15% until June, 14% for payroll from July 1, 2025 (T4127 July 2025; the
 *    annual rate is 14.5%).
 *  - 2026 federal: 58,523 / 117,045 / 181,440 / 258,482; 14%, 20.5%, 26%, 29%,
 *    33% (T4127 January 2026, 122nd edition; unchanged in July 2026).
 *  - 2025 BC: 49,279 / 98,560 / 113,158 / 137,407 / 186,306 / 259,829; 5.06% ...
 *  - 2026 BC: 50,363 / 100,728 / 115,648 / 140,430 / 190,405 / 265,545. BC
 *    Budget 2026 raised the lowest rate from 5.06% to 5.60% for the whole of 2026.
 *    January-June payroll withheld 5.06%, so CRA's July 2026 T4127 (123rd
 *    edition) withholds 6.14% from July 1 to catch up:
 *    (5.60% x 12 - 5.06% x 6) / 6 = 6.14%.
 *  - 2027-2030 BC: Budget 2026 froze the brackets (and credits) at 2026 levels;
 *    the lowest rate is 5.60% for the full year.
 *  - 2027 federal: NOT PUBLISHED YET (CRA announces indexed amounts in
 *    November). Until it is added below, 2027 pay dates use the latest federal
 *    table and a warning is logged (see getTaxTables).
 *
 * Adding a year: copy the last edition, change the numbers, keep the order by
 * `from`. The unit tests (tests/unit.taxTables.test.js) check the structure.
 */

const federal = (lowestRate, [t1, t2, t3, t4]) => [
	{ upperLimit: t1, rate: lowestRate },
	{ upperLimit: t2, rate: 0.205 },
	{ upperLimit: t3, rate: 0.26 },
	{ upperLimit: t4, rate: 0.29 },
	{ upperLimit: Infinity, rate: 0.33 },
];

const bc = (lowestRate, [t1, t2, t3, t4, t5, t6]) => [
	{ upperLimit: t1, rate: lowestRate },
	{ upperLimit: t2, rate: 0.077 },
	{ upperLimit: t3, rate: 0.105 },
	{ upperLimit: t4, rate: 0.1229 },
	{ upperLimit: t5, rate: 0.147 },
	{ upperLimit: t6, rate: 0.168 },
	{ upperLimit: Infinity, rate: 0.205 },
];

const FEDERAL_2025 = [57375, 114750, 177882, 253414];
const FEDERAL_2026 = [58523, 117045, 181440, 258482];
const BC_2025 = [49279, 98560, 113158, 137407, 186306, 259829];
// 2026 levels; frozen for 2027-2030 (BC Budget 2026)
const BC_2026 = [50363, 100728, 115648, 140430, 190405, 265545];

/**
 * Federal editions, oldest first. `from` is the first pay date (YYYY-MM-DD) it applies to.
 *  bpa:  basic personal amount (TD1 claim code 1) - max below `phaseOutFrom`,
 *        min above `phaseOutTo`, linear in between (T4127 BPAF)
 *  cea:  Canada employment amount (T4127 K4)
 * Credits are taken at the edition's lowest rate (brackets[0].rate).
 */
const FEDERAL_EDITIONS = [
	{
		from: "2025-01-01",
		source: "T4127 January 2025",
		brackets: federal(0.15, FEDERAL_2025),
		bpa: { max: 16129, min: 14538, phaseOutFrom: 177882, phaseOutTo: 253414 },
		cea: 1471,
	},
	{
		from: "2025-07-01",
		source: "T4127 July 2025",
		brackets: federal(0.14, FEDERAL_2025),
		bpa: { max: 16129, min: 14538, phaseOutFrom: 177882, phaseOutTo: 253414 },
		cea: 1471,
	},
	{
		from: "2026-01-01",
		source: "T4127 January 2026",
		brackets: federal(0.14, FEDERAL_2026),
		bpa: { max: 16452, min: 14829, phaseOutFrom: 181440, phaseOutTo: 258482 },
		cea: 1501,
	},
	// 2027: add the January 2027 T4127 values here when CRA publishes them (November 2026)
];

/**
 * British Columbia editions, oldest first.
 *  bpa:       BC basic personal amount (TD1BC claim code 1)
 *  reduction: BC tax reduction (T4127 factor S) as points [annual income, amount];
 *             full amount up to the first point, straight lines between points,
 *             nil after the last point.
 */
const BC_EDITIONS = [
	{
		from: "2025-01-01",
		source: "T4127 January 2025",
		brackets: bc(0.0506, BC_2025),
		bpa: 12932,
		// $562, less 3.56 % of income above $25,020
		reduction: [
			[25020, 562],
			[25020 + 562 / 0.0356, 0],
		],
	},
	{
		from: "2026-01-01",
		source: "T4127 January 2026",
		brackets: bc(0.0506, BC_2026),
		bpa: 13216,
		// $575, less 3.56 % of income above $25,570 (nil at $41,722)
		reduction: [
			[25570, 575],
			[25570 + 575 / 0.0356, 0], // nil at $41,722
		],
	},
	{
		from: "2026-07-01",
		source: "T4127 July 2026 (BC Budget 2026: 5.60% for 2026, withheld at 6.14% Jul-Dec)",
		brackets: bc(0.0614, BC_2026),
		bpa: 13216,
		verify: "BC tax reduction between $41,722 and $44,952 (derived; check T4127 July 2026 factor S)",
		// Budget 2026: $690 for the year (3.56 % above $25,570, nil at $44,952).
		// July-December withholds the prorated $805 (= 2 x 690 - 575), nil at
		// $44,952. The shape between those points is twice the annual reduction
		// minus the January one.
		reduction: [
			[25570, 805],
			[25570 + 575 / 0.0356, 805 - 575],
			[25570 + 690 / 0.0356, 0], // nil at $44,952
		],
	},
	{
		from: "2027-01-01",
		source: "BC Budget 2026: 2026 brackets and credits frozen for 2027-2030, lowest rate 5.60%",
		brackets: bc(0.056, BC_2026),
		bpa: 13216,
		verify: "BC tax reduction 2027 assumed frozen at 2026 ($690 above $25,570); check T4127 January 2027",
		reduction: [
			[25570, 690],
			[25570 + 690 / 0.0356, 0], // nil at $44,952
		],
	},
];

/**
 * CPP editions (T4127 / CRA "CPP contribution rates, maximums and exemptions").
 *  rate = base + first additional; baseRate gives the base part (federal and BC
 *  credit K2); the first additional part and CPP2 are deducted from income (F5).
 *  `pending` lists values not published yet; the warning names them.
 */
const CPP_EDITIONS = [
	{
		from: "2025-01-01",
		source: "CRA 2025",
		ympe: 71300,
		yampe: 81200,
		exemption: 3500,
		baseRate: 0.0495,
		rate: 0.0595,
		cpp2Rate: 0.04,
	},
	{
		from: "2026-01-01",
		source: "CRA 2026",
		ympe: 74600,
		yampe: 85000,
		exemption: 3500,
		baseRate: 0.0495,
		rate: 0.0595,
		cpp2Rate: 0.04,
	},
	{
		from: "2027-01-01",
		source:
			"Bill C-30: base rate 4.75% from 2027; YMPE/YAMPE 2027 not published yet (2026 values used)",
		ympe: 74600,
		yampe: 85000,
		exemption: 3500,
		baseRate: 0.0475,
		rate: 0.0575,
		cpp2Rate: 0.04,
		pending: ["YMPE", "YAMPE"],
		verify: "2027 base rate cut to 4.75% (total 5.75%): confirm in CRA's 2027 CPP announcement",
	},
];

/** EI editions (CEIC). Employer pays 1.4 x the employee premium. */
const EI_EDITIONS = [
	{ from: "2025-01-01", source: "CEIC 2025", rate: 0.0164, maxInsurable: 65700 },
	{ from: "2026-01-01", source: "CEIC 2026", rate: 0.0163, maxInsurable: 68900 },
	{ from: "2027-01-01", source: "CEIC September 2026", rate: 0.0164, maxInsurable: 70800 },
];
const EI_EMPLOYER_MULTIPLIER = 1.4;

/**
 * Last year each table is published for (pay dates after it reuse the latest
 * edition, with a warning). scripts/check-payroll-rates.js and
 * tests/unit.ratesReadiness.test.js use these to flag what is due.
 */
const LAST_FEDERAL_YEAR = 2026;
const LAST_BC_YEAR = 2030; // frozen at 2026 levels through 2030
const LAST_CPP_YEAR = 2026; // 2027 rate known, YMPE/YAMPE pending (edition marked `pending`)
const LAST_EI_YEAR = 2027;

module.exports = {
	FEDERAL_EDITIONS,
	BC_EDITIONS,
	CPP_EDITIONS,
	EI_EDITIONS,
	EI_EMPLOYER_MULTIPLIER,
	LAST_FEDERAL_YEAR,
	LAST_BC_YEAR,
	LAST_CPP_YEAR,
	LAST_EI_YEAR,
};
