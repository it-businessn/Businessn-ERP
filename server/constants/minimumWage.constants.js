/**
 * BC general minimum wage, by effective date (Employment Standards Act). The
 * rate applies to hours worked on or after the date. Add a row each time BC
 * announces an increase (usually effective June 1, announced in the spring).
 *
 *  - June 1, 2025: $17.85
 *  - June 1, 2026: $18.25 (news.gov.bc.ca 2026LBR0021)
 */
const MINIMUM_WAGE_EDITIONS = [
	{ from: "2025-06-01", rate: 17.85 },
	{ from: "2026-06-01", rate: 18.25 },
];

/** Minimum wage in force on `date` (default today); before the first row: the first row. */
const minimumWageOn = (date = new Date()) => {
	const day = new Date(date).toISOString().slice(0, 10);
	const applicable = MINIMUM_WAGE_EDITIONS.filter((e) => e.from <= day);
	return (applicable[applicable.length - 1] || MINIMUM_WAGE_EDITIONS[0]).rate;
};

/** A pay rate meets the minimum wage (equal counts as meeting it). */
const meetsMinimumWage = (payRate, date) => Number(payRate) >= minimumWageOn(date);

module.exports = { MINIMUM_WAGE_EDITIONS, minimumWageOn, meetsMinimumWage };
