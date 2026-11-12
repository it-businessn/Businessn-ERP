# Business-day submit-by and pay dates (PAYCAL-01)

## Rule (server/utils/payCalendar.util.js)
VoPay timing: submit Monday -> funds available Thursday -> withdrawn Friday,
so VoPay needs 4 business days (`SUBMIT_LEAD_BUSINESS_DAYS = 4`).

- Normal week (bi-weekly period ends Sunday): submit by MONDAY, paid FRIDAY.
- A holiday that would leave VoPay less than 4 business days: the pay date
  moves LATER, to the business day that gives the full 4 days. Paying earlier
  instead would risk the transfer not being funded on pay day.
- Never later than 8 days after the period ends: BC Employment Standards Act
  s.17 (`MAX_PAY_DAYS_AFTER_PERIOD_END = 8`). If 4 days do not fit before that,
  pay is on the last legal business day and VoPay gets less time.
- Submit by: 4 business days before the pay date, never before the first
  business day after the period ends.
- Closed days: weekends, BC stat holidays, Boxing Day, and the weekday the
  banks observe a holiday that falls on a weekend.

Bi-weekly 2026-2027, the only periods that are not Monday / Friday:

| Period | Holiday | Submit by | Pay | VoPay days |
|---|---|---|---|---|
| 2026 #1 (ends Dec 28, 2025) | New Year's Day | Mon Dec 29 | Mon Jan 5 | 4 |
| 2026 #11 (ends May 17) | Victoria Day | Tue May 19 | Mon May 25 | 4 |
| 2026 #14 (ends Jun 28) | Canada Day | Mon Jun 29 | Mon Jul 6 | 4 |
| 2026 #19 (ends Sep 6) | Labour Day | Tue Sep 8 | Mon Sep 14 | 4 |
| 2027 #1 (ends Dec 27, 2026) | Christmas, Boxing Day, New Year | Tue Dec 29 | Mon Jan 4 | **3** (legal limit) |
| 2027 #7 (ends Mar 21) | Good Friday | Mon Mar 22 | Mon Mar 29 | 4 |
| 2027 #14 (ends Jun 27) | Canada Day | Mon Jun 28 | Mon Jul 5 | 4 |
| 2027 #19 (ends Sep 5) | Labour Day | Tue Sep 7 | Mon Sep 13 | 4 |

For 2027 #1, submit on Tue Dec 29 as early as possible, or ask VoPay to
confirm a 3-day transfer that week.

Other frequencies follow the same rule (e.g. semi-monthly period ending Tue
Apr 14, 2026: submit Wed Apr 15, pay Tue Apr 21; it used to be Sun Apr 19).

## VoPay transfer is not affected
- The payroll submit (PUT /api/payroll/report/submit/:id) finds the run's
  funding totals by the period's STORED pay date and then calls
  vopayFundTransfer. If a stored pay date moved after payroll was set up, the
  submit would not find the funding totals and no transfer would be sent.
- So the rule only fills in dates that do not exist yet: a new pay group, or a
  new year. Rebuilding a year that already exists (PUT /groups/paycycle/:id)
  keeps every existing period's stored submit-by and pay dates.
- vopayController, reportController, routes, models, payYear.util and
  bcStatHolidays.util are unchanged (diff against the upload is empty).

## Moving this year's remaining dates (optional, your call)
    cd server
    npm run paydates:business                          # dry run, prints the changes
    npm run paydates:business -- --company "X" --year 2026
    npm run paydates:business -- --apply               # writes
Changes a period only when its old and new pay dates are both in the future, it
is not processed, and no funding totals or pay stubs exist for that company and
period number in that year. Everything else is listed as "kept". Run the dry
run first and, if you apply, do it after a database backup.

## Please confirm
- Easter Monday is treated as a business day (banks are generally open);
  Good Friday 2027 pay therefore lands on Mon Mar 29.
- BC stat holidays (incl. Family Day, Truth and Reconciliation Day,
  Remembrance Day) plus Boxing Day are treated as bank-closed.

## Tests
server/tests/unit.payCalendar.test.js, 8 tests, passing: the examples above,
every period end in 2026-2028 (business days, submit <= pay, within 8
days, 4 VoPay days unless at the legal limit), a new year gets business-day dates, rebuilding a year keeps
stored dates, and the script only moves safe periods.

Note: the uploaded server/package.json lists scripts/check-payroll-rates.js,
run-vopay-transfer.js and cancel-vopay-transfer.js, but the upload has no
server/scripts folder. Keep your copies of those files.
