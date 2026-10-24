/**
 * STAT-HOLIDAYS: British Columbia statutory holidays for any year, from the
 * rules in the BC Employment Standards Act (no table to update each year).
 *
 *   New Year's Day                          January 1
 *   Family Day                              3rd Monday of February (2nd Monday 2013-2018)
 *   Good Friday                             Friday before Easter Sunday
 *   Victoria Day                            Monday before May 25
 *   Canada Day                              July 1 (July 2 when July 1 is a Sunday)
 *   B.C. Day                                1st Monday of August
 *   Labour Day                              1st Monday of September
 *   National Day for Truth and Reconciliation  September 30 (from 2023)
 *   Thanksgiving Day                        2nd Monday of October
 *   Remembrance Day                         November 11
 *   Christmas Day                           December 25
 *
 * Easter Monday and Boxing Day are not statutory holidays in BC. Other holidays
 * falling on a weekend do not move (the employee gets another day off with pay
 * instead), so they keep their date here.
 *
 * Dates are returned at UTC midnight, the form the Holiday collection and the
 * holiday page use (client dayMonthYear formats in UTC).
 */

const utc = (year, month, day) => new Date(Date.UTC(year, month - 1, day));

/** The n-th given weekday (0 = Sunday ... 6 = Saturday) of a month. */
const nthWeekday = (year, month, weekday, n) => {
	const first = utc(year, month, 1).getUTCDay();
	return utc(year, month, 1 + ((7 + weekday - first) % 7) + 7 * (n - 1));
};

/** Easter Sunday (Gregorian calendar, anonymous algorithm). */
const easterSunday = (year) => {
	const a = year % 19;
	const b = Math.floor(year / 100);
	const c = year % 100;
	const d = Math.floor(b / 4);
	const e = b % 4;
	const f = Math.floor((b + 8) / 25);
	const g = Math.floor((b - f + 1) / 3);
	const h = (19 * a + b - d - g + 15) % 30;
	const i = Math.floor(c / 4);
	const k = c % 4;
	const l = (32 + 2 * e + 2 * i - h - k) % 7;
	const m = Math.floor((a + 11 * h + 22 * l) / 451);
	const month = Math.floor((h + l - 7 * m + 114) / 31);
	const day = ((h + l - 7 * m + 114) % 31) + 1;
	return utc(year, month, day);
};

const addDays = (date, days) => new Date(date.getTime() + days * 86400000);

/** Monday before May 25 (May 18-24). */
const victoriaDay = (year) => {
	const may24 = utc(year, 5, 24);
	return addDays(may24, -((may24.getUTCDay() + 6) % 7));
};

const canadaDay = (year) => {
	const july1 = utc(year, 7, 1);
	return july1.getUTCDay() === 0 ? utc(year, 7, 2) : july1;
};

/** [{ name, date }] in date order. */
const bcStatHolidays = (year) => {
	const y = Number(year);
	if (!Number.isInteger(y) || y < 1900 || y > 2999) return [];
	const holidays = [
		{ name: "New Year's Day", date: utc(y, 1, 1) },
		...(y >= 2013
			? [{ name: "Family Day", date: nthWeekday(y, 2, 1, y >= 2019 ? 3 : 2) }]
			: []),
		{ name: "Good Friday", date: addDays(easterSunday(y), -2) },
		{ name: "Victoria Day", date: victoriaDay(y) },
		{ name: "Canada Day", date: canadaDay(y) },
		{ name: "B.C. Day", date: nthWeekday(y, 8, 1, 1) },
		{ name: "Labour Day", date: nthWeekday(y, 9, 1, 1) },
		...(y >= 2023
			? [{ name: "National Day for Truth and Reconciliation", date: utc(y, 9, 30) }]
			: []),
		{ name: "Thanksgiving Day", date: nthWeekday(y, 10, 1, 2) },
		{ name: "Remembrance Day", date: utc(y, 11, 11) },
		{ name: "Christmas Day", date: utc(y, 12, 25) },
	];
	return holidays.sort((a, b) => a.date - b.date);
};

/** Companies whose holidays follow BC rules: province BC, or not set (the payroll is BC-only). */
const isBCCompany = (company) => {
	const province = String(company?.address?.state || "").trim();
	return !province || /^(bc|b\.c\.?|british columbia)$/i.test(province);
};

module.exports = { bcStatHolidays, easterSunday, isBCCompany };
