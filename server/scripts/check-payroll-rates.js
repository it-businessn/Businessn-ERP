#!/usr/bin/env node
/**
 * Payroll rates readiness: are this year's and next year's CRA / BC tables in
 * constants/taxTables.constants.js and constants/minimumWage.constants.js?
 *
 *   npm run check:rates               # status + sample deductions to compare with CRA PDOC
 *   npm run check:rates -- 2027-01-09 # sample deductions for another pay date
 *
 * Exit code 2 when a required table for this year is missing, or in December
 * when next year's is still missing or pending (so a CI step can flag it).
 *
 * Yearly calendar (see docs/TECHNICAL.md 1.14):
 *   September  EI rate / maximum for next year (CEIC)
 *   November   CPP YMPE / YAMPE (early Nov) and indexed federal + BC amounts
 *   mid-Dec    T4127 January edition: confirm every value, then deploy before Jan 1
 *   Feb-May    BC budget (can change BC tax mid-year -> T4127 July edition)
 *   spring     BC minimum wage for June 1
 *   June       T4127 July edition (mid-year changes)
 */
const { getRatesStatus } = require("../utils/ratesReadiness.util");
const { getTaxDetails } = require("../services/taxService");

const payDate = process.argv[2] || new Date().toISOString().slice(0, 10);
const status = getRatesStatus(new Date());
const icon = { OK: "ok     ", CHECK: "CHECK  ", PENDING: "PENDING", MISSING: "MISSING" };

console.log("Payroll rates readiness\n");
for (const r of status.rows) {
	console.log(`${r.year}  ${icon[r.status]}  ${r.label}`);
	if (r.status !== "OK") {
		console.log(`               ${r.note}`);
		console.log(`               published: ${r.published}`);
		console.log(`               source: ${r.source}`);
	}
}

// sample deductions: enter the same cases in the CRA Payroll Deductions Online
// Calculator (BC, bi-weekly, claim code 1, no other deductions) and compare
console.log(`\nSample bi-weekly deductions for pay date ${payDate} (compare with CRA PDOC):`);
console.log("  gross      CPP      EI   federal       BC");
for (const gross of [1400, 2000, 3500, 6000]) {
	const r = getTaxDetails(0, gross, {}, "Biweekly", { payDate });
	const f = (n) => n.toFixed(2).padStart(8);
	console.log(`  ${String(gross).padStart(5)} ${f(r.CPPContribution)}${f(r.EmployeeEIContribution)}${f(r.federalTaxDeductionByPayPeriod)}${f(r.totalProvincialTaxDeduction)}`);
}
console.log("  (first pay of the year: no year-to-date CPP/EI; PDOC: https://www.canada.ca/en/revenue-agency/services/e-services/digital-services-businesses/payroll-deductions-online-calculator.html)");

if (status.overdue) {
	console.log("\nACTION NEEDED: required tables are missing or pending (see above).");
	process.exitCode = 2;
} else if (status.attention) {
	console.log("\nDue before January 1: next year's tables are not complete yet.");
}
