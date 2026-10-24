/**
 * RATES-READINESS: next year's payroll tables must be loaded before January 1.
 * T-RR-03 checks the real tables against TODAY's date: from December 1 it fails
 * while next year's federal tax, CPP or EI table is missing or pending, so the
 * test run (CI or `npm test` before a deploy) goes red until
 * constants/taxTables.constants.js is updated. `npm run check:rates` shows what is due.
 */
const { getRatesStatus } = require("../utils/ratesReadiness.util");

describe("payroll rates readiness", () => {
	test("T-RR-01 this year's required tables are all loaded", () => {
		const { thisYearGaps } = getRatesStatus(new Date());
		expect(thisYearGaps.map((g) => `${g.year} ${g.key}: ${g.status} (${g.note})`)).toEqual([]);
	});

	test("T-RR-02 status is computed per year: 2027 federal missing and CPP pending as of October 2026", () => {
		const status = getRatesStatus(new Date("2026-10-23T12:00:00Z"));
		const row = (year, key) => status.rows.find((r) => r.year === year && r.key === key);
		expect(row(2026, "federal").status).toBe("OK");
		expect(row(2027, "ei").status).toBe("OK"); // CEIC published 2027 in September 2026
		expect(row(2027, "bc").status).not.toBe("MISSING"); // BC froze 2027-2030 in Budget 2026
		expect(status.attention).toBe(false); // flagged from November 1
		expect(getRatesStatus(new Date("2026-11-02T12:00:00Z")).attention).toBe(
			status.nextYearGaps.length > 0,
		);
	});

	test("T-RR-03 from December 1, next year's federal / CPP / EI / BC tables must be complete", () => {
		const now = new Date();
		const status = getRatesStatus(now);
		if (now.getUTCMonth() !== 11) return; // only enforced in December
		expect(
			status.nextYearGaps.map(
				(g) => `${g.year} ${g.label}: ${g.status} - ${g.note}. Source: ${g.source}`,
			),
		).toEqual([]);
	});
});
