/**
 * ROE-01: Record of Employment helpers (Service Canada ROE, blocks 6, 8, 15A-C).
 *
 * Block 15C lists insurable earnings by pay period, starting with the FINAL pay
 * period (ROE PP 1) and going back. How many periods depends on the pay period
 * type (block 6): weekly 53, bi-weekly 27, semi-monthly 25, monthly 13.
 * Insurable earnings = gross pay of the period; insurable hours = all paid
 * hours of the period. Pay runs that end on the same day (a regular run and an
 * extra run) are one pay period. Pay periods ending before the first day
 * worked are left out.
 */

const PAY_PERIOD_TYPES = [
	{ code: "W", name: "Weekly", maxPeriods: 53, match: /^weekly$/ },
	{ code: "B", name: "Bi-weekly", maxPeriods: 27, match: /^bi-?weekly$/ },
	{ code: "S", name: "Semi-monthly", maxPeriods: 25, match: /^semi-?monthly$/ },
	{ code: "M", name: "Monthly", maxPeriods: 13, match: /^monthly$/ },
];

/** Block 6 pay period type for a pay schedule frequency ("Biweekly", "bi-weekly", ...). */
const payPeriodType = (frequency) => {
	const key = String(frequency || "")
		.trim()
		.toLowerCase()
		.replace(/[\s_]/g, "");
	return PAY_PERIOD_TYPES.find(({ match }) => match.test(key)) || null;
};

const HOUR_FIELDS = [
	"totalRegHoursWorked",
	"totalRegHoursWorked2",
	"totalOvertimeHoursWorked",
	"totalDblOvertimeHoursWorked",
	"totalStatDayHoursWorked",
	"totalStatHours",
	"totalSickHoursWorked",
	"totalVacationHoursWorked",
	"totalBereavementHoursWorked",
	"totalPersonalDayHoursWorked",
	"totalSprayHoursWorked",
	"totalFirstAidHoursWorked",
];

const num = (v) => {
	const n = Number(v);
	return Number.isFinite(n) ? n : 0;
};
const round2 = (n) => Math.round(n * 100) / 100;
const dayKey = (d) => {
	const date = d ? new Date(d) : null;
	return date && !Number.isNaN(date.getTime()) ? date.toISOString().slice(0, 10) : null;
};

/** Insurable hours of one pay stub: every paid hour. */
const stubHours = (stub) => HOUR_FIELDS.reduce((t, k) => t + num(stub?.[k]), 0);

/**
 * Block 15C rows from the employee's processed pay stubs.
 * @returns {{ periods, totalInsurableHours, totalInsurableEarnings, payPeriodType }}
 *   periods: [{ roePP, payPeriodNum, payPeriodEndDate, currentGrossPay, insurableHours }]
 *   newest first (roePP 1 = final pay period).
 */
const insurablePeriods = (stubs, { finalPayPeriodEndDate, firstDayWorked, frequency } = {}) => {
	const type = payPeriodType(frequency);
	const last = dayKey(finalPayPeriodEndDate);
	const first = dayKey(firstDayWorked);
	const byEnd = new Map();
	for (const stub of stubs || []) {
		const end = dayKey(stub?.payPeriodEndDate);
		if (!end) continue;
		if (last && end > last) continue;
		if (first && end < first) continue;
		const row = byEnd.get(end) || {
			payPeriodNum: null,
			payPeriodEndDate: end,
			currentGrossPay: 0,
			insurableHours: 0,
		};
		row.currentGrossPay += num(stub.currentGrossPay);
		row.insurableHours += stubHours(stub);
		// the regular run's period number is the payroll reference
		if (row.payPeriodNum === null || !stub.isExtraRun) row.payPeriodNum = stub.payPeriodNum ?? null;
		byEnd.set(end, row);
	}
	const periods = [...byEnd.values()]
		.sort((a, b) => (a.payPeriodEndDate < b.payPeriodEndDate ? 1 : -1))
		.slice(0, type ? type.maxPeriods : 53)
		.map((row, i) => ({
			...row,
			roePP: i + 1,
			currentGrossPay: round2(row.currentGrossPay),
			insurableHours: round2(row.insurableHours),
		}));
	return {
		periods,
		totalInsurableHours: round2(periods.reduce((t, p) => t + p.insurableHours, 0)),
		totalInsurableEarnings: round2(periods.reduce((t, p) => t + p.currentGrossPay, 0)),
		payPeriodType: type ? { code: type.code, name: type.name, maxPeriods: type.maxPeriods } : null,
	};
};

/**
 * The pay period whose dates contain the last day worked (block 12 = its end
 * date). `periods`: [{ payPeriodStartDate, payPeriodEndDate }].
 */
const finalPayPeriodFor = (periods, lastDayWorked) => {
	const day = dayKey(lastDayWorked);
	if (!day) return null;
	return (
		(periods || []).find(
			(p) => dayKey(p.payPeriodStartDate) <= day && day <= dayKey(p.payPeriodEndDate),
		) || null
	);
};

/** Block 8 as printed on a copy: "XXX XX9 822". */
const maskSIN = (sin) => {
	const digits = String(sin || "").replace(/\D/g, "");
	if (digits.length !== 9) return "";
	return `XXX XX${digits.slice(5, 6)} ${digits.slice(6)}`;
};

const REASON_CODES = [
	"A00", "A01", "B00", "D00", "E00", "E02", "E03", "E04", "E05", "E06", "E09", "E10", "E11",
	"F00", "G00", "G07", "H00", "J00", "K00", "K12", "K13", "K14", "K15", "K16", "K17", "M00",
	"M08", "N00", "P00", "Z00",
];
const RECALL_CODES = ["N", "U", "Y"];
const codeOf = (value) =>
	String(value || "")
		.split("-")[0]
		.trim()
		.toUpperCase()
		.replace(/^AOO$/, "A00");

/** Problems that stop an ROE from being saved; [] = valid. */
const validateROE = ({ empId, empInfo, employmentInfo, employerInfo } = {}) => {
	const errors = [];
	const e = employmentInfo || {};
	if (!empId) errors.push("Choose an employee");
	if (!empInfo?.firstName || !empInfo?.lastName) errors.push("Employee first and last name are required");
	const start = dayKey(e.employmentStartDate);
	const lastDay = dayKey(e.employmentLeaveDate);
	const finalEnd = dayKey(e.finalPayPeriodEndDate);
	if (!lastDay) errors.push("Last day worked is required");
	if (!finalEnd) errors.push("Final pay period end date is required");
	if (start && lastDay && start > lastDay) errors.push("Start date must be on or before the last day worked");
	if (lastDay && finalEnd && finalEnd < lastDay)
		errors.push("Final pay period end date must be on or after the last day worked");
	if (!REASON_CODES.includes(codeOf(e.reasonCode))) errors.push("Select a reason code");
	const recall = codeOf(e.expectedRecallDate);
	if (!RECALL_CODES.includes(recall)) errors.push("Select the expected date of recall");
	if (recall === "Y") {
		const recallDay = dayKey(e.recallDate);
		if (!recallDay) errors.push("Recall date is required when a return date is expected");
		else if (lastDay && recallDay <= lastDay) errors.push("Recall date must be after the last day worked");
	}
	if (!employerInfo?.contactName) errors.push("Select a contact name");
	if (!employerInfo?.contactTelNumber) errors.push("Contact telephone number is required");
	if (!employerInfo?.issuerName) errors.push("Select an issuer");
	return errors;
};

module.exports = {
	PAY_PERIOD_TYPES,
	payPeriodType,
	stubHours,
	insurablePeriods,
	finalPayPeriodFor,
	maskSIN,
	validateROE,
	REASON_CODES,
	codeOf,
};
