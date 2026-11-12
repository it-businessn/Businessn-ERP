/**
 * PAYCAL-01: submit-by and pay dates fall on business days, and existing pay
 * dates are never moved in a way that would break the payroll submit / VoPay
 * transfer (it finds the run's funding totals by the stored pay date).
 */
jest.mock("../models/Group");
jest.mock("../utils/date.util", () => ({
	...jest.requireActual("../utils/date.util"),
	getCurrentYear: () => 2026,
}));

const Group = require("../models/Group");
const { query } = require("./helpers");
const {
	isBusinessDay,
	nextBusinessDay,
	subtractBusinessDays,
	payPeriodDates,
	SUBMIT_LEAD_BUSINESS_DAYS,
} = require("../utils/payCalendar.util");
const { updateGroupPaySchedule } = require("../controllers/setUpController");
const { planGroup } = require("../scripts/apply-business-day-pay-dates");

const D = (s) => new Date(`${s}T00:00:00.000Z`);
const day = (d) => new Date(d).toISOString().slice(0, 10);
const dates = (end) => {
	const { processingDate, payDate } = payPeriodDates(D(end));
	return [day(processingDate), day(payDate)];
};
const addDays = (d, n) => new Date(new Date(d).getTime() + n * 86400000);

describe("payPeriodDates", () => {
	test("PC-01 period ending on a Sunday: submit by Monday, paid Friday", () => {
		expect(dates("2026-11-01")).toEqual(["2026-11-02", "2026-11-06"]);
	});

	test("PC-02 a holiday that would cut VoPay's 4 days moves pay to the next business day, within 8 days", () => {
		expect(dates("2026-05-17")).toEqual(["2026-05-19", "2026-05-25"]); // Victoria Day Mon: Tue -> Mon
		expect(dates("2026-06-28")).toEqual(["2026-06-29", "2026-07-06"]); // Canada Day Wed: Mon -> Mon
		expect(dates("2027-03-21")).toEqual(["2027-03-22", "2027-03-29"]); // Good Friday: Mon -> Mon (was Thu)
		expect(dates("2026-04-14")).toEqual(["2026-04-15", "2026-04-21"]); // semi-monthly: was Sun Apr 19
	});

	test("PC-03 stat holidays and Boxing Day are not business days", () => {
		expect(isBusinessDay(D("2026-12-25"))).toBe(false);
		// weekend holidays are observed on the next free weekday
		expect(isBusinessDay(D("2027-12-27"))).toBe(false); // Christmas (Sat) observed Mon
		expect(isBusinessDay(D("2027-12-28"))).toBe(false); // Boxing Day (Sun) observed Tue
		expect(isBusinessDay(D("2027-12-29"))).toBe(true);
		expect(isBusinessDay(D("2028-07-03"))).toBe(false); // Canada Day (Sat) observed Mon
		expect(isBusinessDay(D("2026-07-01"))).toBe(false);
		// legal limit reached: pay on day 8 even though VoPay gets only 3 days
		expect(dates("2026-12-27")).toEqual(["2026-12-29", "2027-01-04"]); // Christmas + Boxing (observed) + New Year
	});

	test("PC-04 every period end in 2026-2028: business days, in order, within 8 days, full lead unless at the limit", () => {
		for (let end = D("2026-01-01"); end < D("2029-01-01"); end = addDays(end, 1)) {
			const { processingDate, payDate } = payPeriodDates(end);
			expect(isBusinessDay(processingDate)).toBe(true);
			expect(isBusinessDay(payDate)).toBe(true);
			expect(processingDate > end).toBe(true); // never before the period is over
			expect(processingDate <= payDate).toBe(true);
			expect(payDate <= addDays(end, 8)).toBe(true); // BC ESA: within 8 days
			const leadOk = processingDate <= subtractBusinessDays(payDate, SUBMIT_LEAD_BUSINESS_DAYS);
			const atLimit = nextBusinessDay(payDate) > addDays(end, 8); // no later legal business day
			expect(leadOk || atLimit).toBe(true); // 4 business days for VoPay, or the legal limit
		}
	});

	test("PC-05 lead time is 4 business days (Monday -> Friday) whenever the period allows it", () => {
		expect(SUBMIT_LEAD_BUSINESS_DAYS).toBe(4);
		expect(dates("2026-03-08")).toEqual(["2026-03-09", "2026-03-13"]); // Sun end: Mon -> Fri
		// holiday Monday (Thanksgiving Oct 12): submit Tuesday, pay the next Monday (4 days for VoPay)
		expect(dates("2026-10-11")).toEqual(["2026-10-13", "2026-10-19"]);
	});
});

describe("pay group schedule (PUT /groups/paycycle/:id)", () => {
	let saved;
	const res = () => {
		const r = { status: jest.fn(() => r), json: jest.fn(() => r) };
		return r;
	};
	const run = async (group, frequency = "Biweekly") => {
		Group.findById.mockImplementation(() => query(group));
		Group.findByIdAndUpdate.mockImplementation(async (id, update) => {
			saved = update.$set;
			return { _id: id };
		});
		const r = res();
		await updateGroupPaySchedule({ params: { id: "g1" }, body: { scheduleFrequency: frequency } }, r);
		expect(r.status).toHaveBeenCalledWith(201);
		return saved.yearSchedules.find((rec) => rec.year === 2026).payPeriods;
	};
	beforeEach(() => {
		jest.resetAllMocks();
		saved = null;
		jest.spyOn(console, "log").mockImplementation(() => {});
	});

	test("PC-06 a new year gets business-day submit and pay dates", async () => {
		for (const frequency of ["Weekly", "Biweekly", "Semimonthly", "Monthly"]) {
			const periods = await run({ _id: "g1", yearSchedules: [] }, frequency);
			expect(periods.length).toBeGreaterThan(0);
			for (const p of periods) {
				expect(isBusinessDay(p.payPeriodProcessingDate)).toBe(true);
				expect(isBusinessDay(p.payPeriodPayDate)).toBe(true);
			}
			expect(saved.scheduleSettings).toBe(periods);
		}
	});

	test("PC-07 rebuilding an existing year keeps every stored submit-by and pay date (VoPay submit still finds its funding totals)", async () => {
		const stored = [
			{ payPeriod: 22, payPeriodProcessingDate: D("2026-10-27"), payPeriodPayDate: D("2026-10-30"), payPeriodEndDate: D("2026-10-25") },
			{ payPeriod: 23, payPeriodProcessingDate: "2026-11-10T00:00:00.000Z", payPeriodPayDate: "2026-11-13T00:00:00.000Z" },
		];
		const periods = await run({ _id: "g1", yearSchedules: [{ year: 2026, payPeriods: stored }] });
		expect(periods).toHaveLength(26);
		const p22 = periods.find((p) => p.payPeriod === 22);
		const p23 = periods.find((p) => p.payPeriod === 23);
		expect(day(p22.payPeriodPayDate)).toBe("2026-10-30");
		expect(day(p22.payPeriodProcessingDate)).toBe("2026-10-27");
		expect(p23.payPeriodPayDate).toBe("2026-11-13T00:00:00.000Z");
		expect(p23.payPeriodProcessingDate).toBe("2026-11-10T00:00:00.000Z");
		// a period that had no stored dates gets the new rule
		expect(isBusinessDay(periods.find((p) => p.payPeriod === 24).payPeriodPayDate)).toBe(true);
		expect(saved.scheduleSettings).toBe(periods);
	});
});

describe("scripts/apply-business-day-pay-dates.js (dry run plan)", () => {
	const now = D("2026-11-12");
	const period = (n, end, submit, pay, extra = {}) => ({
		payPeriod: n,
		payPeriodEndDate: D(end),
		payPeriodProcessingDate: D(submit),
		payPeriodPayDate: D(pay),
		...extra,
	});
	const group = {
		companyName: "Co",
		yearSchedules: [
			{
				year: 2026,
				payPeriods: [
					period(1, "2026-04-14", "2026-04-16", "2026-04-19"), // past
					period(2, "2026-11-18", "2026-11-20", "2026-11-23", { isProcessed: true }),
					period(3, "2026-11-26", "2026-11-28", "2026-12-01"), // payroll set up
					period(4, "2026-12-14", "2026-12-16", "2026-12-19"), // moves
					period(5, "2026-11-29", "2026-11-30", "2026-12-04"), // already right
				],
			},
		],
	};

	test("PC-08 only future, unprocessed periods without funding totals or pay stubs are moved", async () => {
		const hasPayroll = jest.fn(async (company, n) => n === 3);
		const { changes, skipped, payPeriods } = await planGroup(group, 2026, hasPayroll, now);
		expect(skipped).toEqual([
			{ period: "#1", reason: "pay date passed" },
			{ period: "#2", reason: "processed" },
			{ period: "#3", reason: "payroll already set up" },
		]);
		expect(changes).toEqual([{ period: "#4", from: "2026-12-16 / 2026-12-19", to: "2026-12-15 / 2026-12-21" }]);
		const original = group.yearSchedules[0].payPeriods;
		[0, 1, 2, 4].forEach((i) => expect(payPeriods[i]).toBe(original[i])); // untouched
		expect(day(payPeriods[3].payPeriodPayDate)).toBe("2026-12-21");
	});
});
