/**
 * RATES-READINESS: which payroll tables are loaded for a year, and what is due.
 *
 * Every table in constants/taxTables.constants.js and the BC minimum wage has
 * a usual publication month. getRatesStatus(now) lists, for the current and
 * next year, each table as OK / CHECK (loaded, but a value was derived and
 * should be confirmed against the source) / PENDING (edition exists, some
 * values not published yet) / MISSING, with where to get it. Used by:
 *  - scripts/check-payroll-rates.js (npm run check:rates)
 *  - tests/unit.ratesReadiness.test.js (fails from Dec 1 while next year's
 *    federal tax, CPP or EI tables are missing or pending)
 *  - jobs/statHoliday.js (daily log warning from Nov 1)
 */
const {
	FEDERAL_EDITIONS,
	BC_EDITIONS,
	CPP_EDITIONS,
	EI_EDITIONS,
} = require("../constants/taxTables.constants");
const { MINIMUM_WAGE_EDITIONS } = require("../constants/minimumWage.constants");

const T4127 =
	"https://www.canada.ca/en/revenue-agency/services/forms-publications/payroll/t4127-payroll-deductions-formulas.html";

/** What each table is, when it is published, and where. `required` = needed before Jan 1. */
const TABLES = [
	{ key: "federal", label: "Federal tax brackets, basic personal amount, Canada employment amount", editions: FEDERAL_EDITIONS, published: "November (T4127 January edition, mid-December)", source: T4127, required: true },
	{ key: "cpp", label: "CPP / CPP2: YMPE, YAMPE, rates", editions: CPP_EDITIONS, published: "early November (CRA news release)", source: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/payroll-deductions-contributions/canada-pension-plan-cpp/cpp-contribution-rates-maximums-exemptions.html", required: true },
	{ key: "ei", label: "EI: rate and maximum insurable earnings", editions: EI_EDITIONS, published: "September (Canada Employment Insurance Commission)", source: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/payroll-deductions-contributions/employment-insurance-ei/ei-premium-rates-maximums.html", required: true },
	{ key: "bc", label: "BC tax brackets, basic personal amount, BC tax reduction", editions: BC_EDITIONS, published: "November (T4127); BC budget in February can change it mid-year", source: T4127, required: true },
	{ key: "minimumWage", label: "BC minimum wage (June 1)", editions: MINIMUM_WAGE_EDITIONS, published: "spring, effective June 1 (BC Gov News)", source: "https://www2.gov.bc.ca/gov/content/employment-business/employment-standards-advice/employment-standards/wages/minimum-wage", required: false },
];

/** Status of one table for one year: OK | PENDING | MISSING (+ the pending values). */
const tableStatus = (editions, year) => {
	const inYear = editions.filter((e) => e.from.slice(0, 4) === String(year));
	const latest = editions[editions.length - 1];
	if (!inYear.length) {
		// a frozen/continuing table published ahead (e.g. BC 2027-2030 freeze) counts
		// when an edition before the year says so in its source
		const continuing = latest.from.slice(0, 4) < String(year) && /frozen.*(\d{4})-(\d{4})/i.exec(latest.source || "");
		if (continuing && Number(continuing[2]) >= year) return { status: "OK", note: latest.source };
		return { status: "MISSING", note: `latest: ${latest.source || latest.from}` };
	}
	const pending = inYear.flatMap((e) => e.pending || []);
	if (pending.length) return { status: "PENDING", note: `${pending.join(", ")} not published yet` };
	const verify = inYear.map((e) => e.verify).filter(Boolean);
	if (verify.length) return { status: "CHECK", note: verify.join("; ") };
	return { status: "OK", note: inYear.map((e) => e.source || e.from).join("; ") };
};

/**
 * Status for the current and next year. `due` = the next year's required
 * tables must be in by January 1; from November 1 a missing or pending one is
 * flagged, from December 1 it is overdue.
 */
const getRatesStatus = (now = new Date()) => {
	const year = now.getUTCFullYear();
	const month = now.getUTCMonth() + 1;
	const rows = [];
	for (const y of [year, year + 1]) {
		for (const t of TABLES) {
			// the minimum wage changes on June 1; next year's is not expected yet
			if (t.key === "minimumWage" && y > year) continue;
			const { status, note } =
				t.key === "minimumWage"
					? MINIMUM_WAGE_EDITIONS.some((e) => e.from.slice(0, 4) === String(y))
						? { status: "OK", note: `$${MINIMUM_WAGE_EDITIONS.find((e) => e.from.slice(0, 4) === String(y)).rate}` }
						: { status: month >= 6 ? "MISSING" : "PENDING", note: "no June 1 increase entered for this year" }
					: tableStatus(t.editions, y);
			rows.push({ year: y, ...t, editions: undefined, status, note });
		}
	}
	const gap = (r) => r.required && (r.status === "MISSING" || r.status === "PENDING");
	const nextYearGaps = rows.filter((r) => r.year === year + 1 && gap(r));
	const thisYearGaps = rows.filter((r) => r.year === year && gap(r));
	return {
		rows,
		thisYearGaps,
		nextYearGaps,
		attention: month >= 11 && nextYearGaps.length > 0,
		overdue: (month === 12 && nextYearGaps.length > 0) || thisYearGaps.length > 0,
	};
};

module.exports = { getRatesStatus, TABLES };
