import moment from "moment";

// ROE-01: helpers for the Issue ROE screens (no React, unit tested).

export const DEFAULT_RECALL = "U - Unknown";
export const COPY_NOTICE =
	"This is a print-friendly copy of the ROE. The official ROE has been filed with Service Canada.";

const dayKey = (d) => (d ? moment.utc(d).format("YYYY-MM-DD") : "");

/** "Mar 23, 2025" */
export const formatPayDate = (d) => (d ? moment.utc(d).format("MMM D, YYYY") : "");

/** Day / month / year as printed on the ROE (month 1-12). */
export const dmy = (d) => {
	if (!d) return { day: "", month: "", year: "" };
	const m = moment.utc(d);
	if (!m.isValid()) return { day: "", month: "", year: "" };
	return { day: m.format("DD"), month: m.format("MM"), year: m.format("YYYY") };
};

/** "XXX XX9 822" (block 8); an already masked value is kept. */
export const maskSIN = (sin) => {
	if (String(sin || "").startsWith("XXX")) return sin;
	const digits = String(sin || "").replace(/\D/g, "");
	return digits.length === 9 ? `XXX XX${digits.slice(5, 6)} ${digits.slice(6)}` : "";
};

/**
 * Pay periods the final pay period end date can be chosen from: the regular
 * periods of the employee's pay group (every year), else the periods the
 * employee was paid in. Newest first, one per end date.
 */
export const payPeriodOptions = (payGroup, paidPeriods = []) => {
	const fromGroup = (payGroup?.yearSchedules || []).flatMap(({ payPeriods }) =>
		(payPeriods || []).filter((p) => !p?.isExtraRun),
	);
	const source = fromGroup.length ? fromGroup : paidPeriods || [];
	const byEnd = new Map();
	source.forEach((p) => {
		const end = dayKey(p?.payPeriodEndDate);
		if (end && !byEnd.has(end))
			byEnd.set(end, {
				payPeriod: p.payPeriod ?? p.payPeriodNum,
				payPeriodStartDate: dayKey(p.payPeriodStartDate),
				payPeriodEndDate: end,
			});
	});
	return [...byEnd.values()].sort((a, b) => (a.payPeriodEndDate < b.payPeriodEndDate ? 1 : -1));
};

/** The pay period containing the last day worked (its end date is block 12). */
export const finalPayPeriodFor = (options, lastDayWorked) => {
	const day = dayKey(lastDayWorked);
	if (!day) return null;
	return (
		(options || []).find(
			(p) => p.payPeriodStartDate && p.payPeriodStartDate <= day && day <= p.payPeriodEndDate,
		) ||
		// no start dates: the first period ending on or after that day
		[...(options || [])].reverse().find((p) => !p.payPeriodStartDate && p.payPeriodEndDate >= day) ||
		null
	);
};

/** Block 15C split as on the form: ROE PP 1, 3, 5... left; 2, 4, 6... right. */
export const splitColumns = (periods = []) => ({
	left: periods.filter((_, i) => i % 2 === 0),
	right: periods.filter((_, i) => i % 2 === 1),
});

/** The pay group an employee is paid in (first position with one). */
export const employeePayGroup = (payGroups, positions) => {
	const name = (positions || []).find((p) => p?.employmentPayGroup)?.employmentPayGroup;
	return (payGroups || []).find((g) => g.name === name) || (payGroups || [])[0] || null;
};

const code = (v) => String(v || "").split("-")[0].trim().toUpperCase();
export const isReturnDate = (expectedRecallDate) => code(expectedRecallDate) === "Y";

/** Missing fields per step; [] = the step can be confirmed. */
export const stepErrors = {
	personal: ({ empInfo = {} }) =>
		[
			!empInfo.firstName && "First name",
			!empInfo.lastName && "Last name",
			!empInfo.streetAddress && "Street address",
			!empInfo.city && "City",
			!empInfo.postalCode && "Postal code",
		].filter(Boolean),
	employment: ({ employmentInfo = {} }) => {
		const e = employmentInfo;
		const errors = [
			!e.employmentLeaveDate && "Last day worked",
			!e.finalPayPeriodEndDate && "Final pay period end date",
			!e.reasonCode && "Reason code",
			!e.expectedRecallDate && "Expected date of recall",
			isReturnDate(e.expectedRecallDate) && !e.recallDate && "Recall date",
		].filter(Boolean);
		if (e.employmentStartDate && e.employmentLeaveDate && dayKey(e.employmentStartDate) > dayKey(e.employmentLeaveDate))
			errors.push("Start date must be on or before the last day worked");
		if (
			e.finalPayPeriodEndDate &&
			e.employmentLeaveDate &&
			dayKey(e.finalPayPeriodEndDate) < dayKey(e.employmentLeaveDate)
		)
			errors.push("Final pay period must end on or after the last day worked");
		if (isReturnDate(e.expectedRecallDate) && e.recallDate && dayKey(e.recallDate) <= dayKey(e.employmentLeaveDate))
			errors.push("Recall date must be after the last day worked");
		return errors;
	},
	employer: ({ employerInfo = {} }) =>
		[
			!employerInfo.contactName && "Contact name",
			!employerInfo.contactTelNumber && "Contact telephone number",
			!employerInfo.issuerName && "Issuer name",
		].filter(Boolean),
};

const PAY_PERIOD_TYPES = [
	{ code: "W", name: "Weekly", maxPeriods: 53, match: /^weekly$/ },
	{ code: "B", name: "Bi-weekly", maxPeriods: 27, match: /^bi-?weekly$/ },
	{ code: "S", name: "Semi-monthly", maxPeriods: 25, match: /^semi-?monthly$/ },
	{ code: "M", name: "Monthly", maxPeriods: 13, match: /^monthly$/ },
];

/** Block 6 for a pay schedule frequency ("Biweekly", "bi-weekly", ...). */
export const payPeriodTypeOf = (frequency) => {
	const key = String(frequency || "")
		.trim()
		.toLowerCase()
		.replace(/[\s_]/g, "");
	const type = PAY_PERIOD_TYPES.find(({ match }) => match.test(key));
	return type ? { code: type.code, name: type.name, maxPeriods: type.maxPeriods } : null;
};

const hasValue = (row) => Object.values(row || {}).some(Boolean);

/** The ROE as sent to the server: empty separation-payment rows left out. */
export const toPayload = (formData, extra = {}) => {
	const e = formData?.employmentInfo || {};
	return {
		...formData,
		employmentInfo: {
			...e,
			statHolidays: (e.statHolidays || []).filter(hasValue),
			otherMonies: (e.otherMonies || []).filter(hasValue),
			specialPayments: (e.specialPayments || []).filter(hasValue),
		},
		...extra,
	};
};
