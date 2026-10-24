/**
 * SUPPORT-01: Support Assistant notices shown on every company's payroll
 * dashboard (general BC payroll compliance, not company-specific). They used
 * to exist only as Announcement rows for one company, so after the company
 * filter was fixed (NEW-06) every other company's Support panel was empty.
 *
 * GET /api/announcements/:companyName returns these plus the company's own
 * announcements, newest first. Edit this list to publish or retire a notice;
 * a company's own announcement with one of RETIRED_TITLES (or the same title
 * as a notice here) is not shown, so old copies don't appear twice.
 */
const SUPPORT_NOTICES = [
	{
		_id: "notice-bc-tax-2026-07",
		title: "BC Income Tax Change from July 1, 2026",
		createdOn: "2026-06-20T16:00:00.000Z",
		message: `B.C. Budget 2026 raised the lowest provincial income tax rate from 5.06% to 5.60% for the whole of 2026, on taxable income up to $50,363.
Because January to June pay was withheld at 5.06%, the CRA payroll tables withhold 6.14% on that bracket for pay dates from July 1 to December 31, 2026. From January 1, 2027 the rate is 5.60%, with the 2026 brackets kept for 2027 to 2030.
What this means
•	Payroll applies the correct rate automatically by pay date.
•	Employees may see slightly more provincial tax on pay stubs from July 2026.
Reference: CRA T4127 Payroll Deductions Formulas, July 2026.
Please contact your representative if you have any questions — they'll be happy to help!`,
	},
	{
		_id: "notice-min-wage-2026",
		title: "Minimum Wage Increase Effective June 1, 2026",
		createdOn: "2026-05-15T16:00:00.000Z",
		message: `The B.C. general minimum wage increased from $17.85 to $18.25 per hour, effective June 1, 2026.
To ensure compliance with the Employment Standards Act, please follow the steps below:
Wage Adjustment Requirements
•	Effective Date: The new rate of $18.25/hour applies to all hours worked on or after June 1, 2026, regardless of the pay period or pay date.
•	Do Not Pro-rate: If an employee works a shift that begins in May and ends in June, only the June hours must be paid at the new rate.
•	Alerts: Employees paid below $18.25 are listed under Alerts and Violations when you review payroll inputs.
Please ask your representative if you have any questions and they will be happy to help you!`,
	},
	{
		_id: "notice-stat-holiday-substitution",
		title: "Can Statutory Holidays Be Moved to Another Day?",
		createdOn: "2025-07-15T16:00:00.000Z",
		message: `Yes! Employers and employees may agree in writing to observe a statutory holiday on a different day — for example, moving a mid-week holiday to Monday for convenience.
Key Points
•	Agreement: Both parties must consent in writing.
•	Entitlements: The substituted day must offer the same pay and benefits as the original holiday.
•	Records: Keep a copy of the agreement for at least four years.
Reference: Section 48, Employment Standards Act (British Columbia).
Please contact your representative if you have any questions — they'll be happy to help!`,
	},
];

/** Superseded notices still stored as company announcements; never shown. */
const RETIRED_TITLES = ["Minimum Wage Increase Effective June 1, 2025"];

module.exports = { SUPPORT_NOTICES, RETIRED_TITLES };
