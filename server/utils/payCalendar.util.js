/**
 * PAYCAL-01: submit-by and pay dates on business days.
 *
 * Before: submit by = period end + 2 days and pay date = submit by + 3 days,
 * so they could fall on a weekend or stat holiday (e.g. semi-monthly
 * April 14, 2026 -> pay Sunday April 19).
 *
 * Now:
 *  - pay date: period end + 5 days (the same distance as before); when that is
 *    not a business day it moves to the business day before it. When a holiday
 *    would leave VoPay less than its lead time, it moves later instead, up to
 *    the legal limit of 8 days after the period ends (see payPeriodDates).
 *  - submit by: SUBMIT_LEAD_BUSINESS_DAYS business days before the pay date,
 *    so the funds have time to move (a period ending on a Sunday: submit by
 *    Monday, paid Friday). It is never before the first
 *    business day after the period ends: when the pay date had to move
 *    earlier, the lead time shrinks instead of asking for payroll before the
 *    period is over.
 *
 * Business day: Monday-Friday, not a BC statutory holiday and not December 26
 * (banks are closed on Boxing Day); a holiday on a weekend also closes the
 * next free weekday (the day the banks observe it).
 */
const { bcStatHolidays } = require("./bcStatHolidays.util");

/**
 * Business days between submit by and pay date (VoPay funding lead time).
 * 4: a bi-weekly period ending Sunday is submitted by Monday and paid Friday.
 */
const SUBMIT_LEAD_BUSINESS_DAYS = 4;
/** Calendar days from period end to the usual pay date (unchanged from before). */
const PAY_DAYS_AFTER_PERIOD_END = 5;
/** BC Employment Standards Act s.17: wages within 8 days after the period ends. */
const MAX_PAY_DAYS_AFTER_PERIOD_END = 8;

const dayKey = (date) => new Date(date).toISOString().slice(0, 10);

const holidayCache = new Map();
const closedDays = (year) => {
	if (!holidayCache.has(year)) {
		const holidays = [...bcStatHolidays(year).map(({ date }) => dayKey(date)), `${year}-12-26`]; // + Boxing Day
		const keys = new Set(holidays);
		// A holiday on a weekend is observed by the banks on the next free weekday
		// (Christmas on Saturday -> Monday, Boxing Day on Sunday -> Tuesday).
		for (const key of holidays.sort()) {
			const weekday = new Date(`${key}T00:00:00Z`).getUTCDay();
			if (weekday !== 0 && weekday !== 6) continue;
			let d = new Date(`${key}T00:00:00Z`);
			do d.setUTCDate(d.getUTCDate() + 1);
			while ([0, 6].includes(d.getUTCDay()) || keys.has(dayKey(d)));
			keys.add(dayKey(d));
		}
		holidayCache.set(year, keys);
	}
	return holidayCache.get(year);
};

// UTC so the weekday check matches the stored day whatever the server time zone
const addDays = (date, days) => {
	const result = new Date(date);
	result.setUTCDate(result.getUTCDate() + days);
	return result;
};

const isBusinessDay = (date) => {
	const d = new Date(date);
	const weekday = d.getUTCDay();
	if (weekday === 0 || weekday === 6) return false;
	return !closedDays(d.getUTCFullYear()).has(dayKey(d));
};

/** The date itself when it is a business day, else the business day before it. */
const onOrBeforeBusinessDay = (date) => {
	let d = new Date(date);
	while (!isBusinessDay(d)) d = addDays(d, -1);
	return d;
};

/** The first business day strictly after the date. */
const nextBusinessDay = (date) => {
	let d = addDays(date, 1);
	while (!isBusinessDay(d)) d = addDays(d, 1);
	return d;
};

const addBusinessDays = (date, count) => {
	let d = new Date(date);
	for (let left = count; left > 0; ) {
		d = addDays(d, 1);
		if (isBusinessDay(d)) left -= 1;
	}
	return d;
};

const subtractBusinessDays = (date, count) => {
	let d = new Date(date);
	for (let left = count; left > 0; ) {
		d = addDays(d, -1);
		if (isBusinessDay(d)) left -= 1;
	}
	return d;
};

/**
 * { processingDate, payDate } for a pay period ending on endDate.
 * Pay date: the usual day (end + 5, on or before a business day). When a
 * holiday leaves fewer than SUBMIT_LEAD_BUSINESS_DAYS between the first
 * possible submit day and that date, the pay date moves LATER to the day that
 * gives VoPay its full lead time, but never past the legal limit (end + 8).
 */
const payPeriodDates = (endDate) => {
	const earliest = nextBusinessDay(endDate);
	const usual = onOrBeforeBusinessDay(addDays(endDate, PAY_DAYS_AFTER_PERIOD_END));
	const fullLead = addBusinessDays(earliest, SUBMIT_LEAD_BUSINESS_DAYS);
	const legalLimit = onOrBeforeBusinessDay(addDays(endDate, MAX_PAY_DAYS_AFTER_PERIOD_END));
	let payDate = usual;
	if (fullLead > usual) payDate = fullLead <= legalLimit ? fullLead : legalLimit;
	if (payDate < earliest) payDate = earliest;
	const leadDate = subtractBusinessDays(payDate, SUBMIT_LEAD_BUSINESS_DAYS);
	let processingDate = leadDate < earliest ? earliest : leadDate;
	if (processingDate > payDate) processingDate = payDate;
	return { processingDate, payDate };
};

module.exports = {
	SUBMIT_LEAD_BUSINESS_DAYS,
	PAY_DAYS_AFTER_PERIOD_END,
	MAX_PAY_DAYS_AFTER_PERIOD_END,
	isBusinessDay,
	onOrBeforeBusinessDay,
	nextBusinessDay,
	subtractBusinessDays,
	payPeriodDates,
};
