/**
 * Pay calendar regression tests (stream B): NEW-07. The 2027 bi-weekly calendar
 * started on a Tuesday overlapping the last 2026 period, unknown years fell back
 * to 2024, and CURRENT_YEAR / NEXT_DAY were frozen at server start.
 */
jest.mock("../models/Group");

const Group = require("../models/Group");
const { query } = require("./helpers");

const DAY = 24 * 60 * 60 * 1000;
const iso = (d) => d.toISOString().slice(0, 10);

const loadSetUp = () => require("../controllers/setUpController");

afterEach(() => {
	jest.useRealTimers();
	jest.clearAllMocks();
});

describe("NEW-07 bi-weekly calendar start dates", () => {
	test("T-CAL-01 2024, 2025 and 2026 starts are unchanged", () => {
		const { getStartDate } = loadSetUp();
		expect(typeof getStartDate).toBe("function");
		for (const [year, start] of [
			[2024, "2023-12-18"],
			[2025, "2024-12-16"],
			[2026, "2025-12-15"],
		]) {
			expect(getStartDate(year).getTime()).toBe(new Date(start).getTime());
		}
	});

	test("T-CAL-02 2027 starts on Monday 2026-12-14, the day after the last 2026 period ends", () => {
		const { getStartDate } = loadSetUp();
		const start2027 = getStartDate(2027);
		expect(iso(start2027)).toBe("2026-12-14");
		expect(start2027.getUTCDay()).toBe(1);
		const last2026End = new Date(getStartDate(2026).getTime() + (26 * 14 - 1) * DAY);
		expect(iso(last2026End)).toBe("2026-12-13");
		expect(start2027.getTime() - last2026End.getTime()).toBe(DAY);
	});

	test("T-CAL-03 every computed start is a Monday, 364 days after the previous one", () => {
		const { getStartDate } = loadSetUp();
		for (let year = 2024; year <= 2040; year++) {
			const start = getStartDate(year);
			expect({ year, day: start.getUTCDay() }).toEqual({ year, day: 1 });
			if (year > 2024) expect(start.getTime() - getStartDate(year - 1).getTime()).toBe(364 * DAY);
		}
	});

	test("T-CAL-04 older or invalid years throw instead of silently using 2024", () => {
		const { getStartDate } = loadSetUp();
		for (const bad of [2023, 1999, "abc", undefined, null, 2026.5]) {
			expect(() => getStartDate(bad)).toThrow();
		}
		// numeric strings (e.g. from a request) still work
		expect(iso(getStartDate("2026"))).toBe("2025-12-15");
	});
});

describe("NEW-07 current year / next day are computed per call", () => {
	const FAKE = { doNotFake: ["nextTick", "setImmediate", "queueMicrotask", "setTimeout"] };

	test("T-CAL-05 date.util getCurrentYear / getNextDay follow the clock after module load", () => {
		const dateUtil = require("../utils/date.util");
		jest.useFakeTimers({ ...FAKE, now: new Date("2027-01-02T12:00:00Z") });
		expect(dateUtil.getCurrentYear()).toBe(2027);
		expect(dateUtil.getNextDay().toISOString().slice(0, 10)).toBe("2027-01-03");
		jest.setSystemTime(new Date("2028-06-01T12:00:00Z"));
		expect(dateUtil.getCurrentYear()).toBe(2028);
	});

	test("T-CAL-06 schedule generation uses the year at call time, not at module load", async () => {
		const { updateGroupPaySchedule } = loadSetUp();
		Group.findById.mockImplementation(() => query({ yearSchedules: [] }));
		Group.findByIdAndUpdate.mockResolvedValue({});
		jest.useFakeTimers({ ...FAKE, now: new Date("2027-01-05T12:00:00Z") });

		const res = { status: jest.fn(() => res), json: jest.fn(() => res) };
		await updateGroupPaySchedule(
			{ params: { id: "65c000000000000000000001" }, body: { scheduleFrequency: "Biweekly" } },
			res,
		);
		expect(Group.findByIdAndUpdate).toHaveBeenCalled();
		const { yearSchedules, scheduleSettings } = Group.findByIdAndUpdate.mock.calls[0][1].$set;
		expect(yearSchedules[0].year).toBe(2027);
		expect(scheduleSettings[0].year).toBe(2027);
		expect(iso(scheduleSettings[0].payPeriodStartDate)).toBe("2026-12-14");
		expect(scheduleSettings).toHaveLength(26);
	});
});
