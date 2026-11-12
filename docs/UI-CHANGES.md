# UI edge-case fixes (client only)

Scope: UI only. No API call, request payload, calculation, business rule,
navigation target or refetch was changed. Server untouched.

Checks: client tests 65/65 pass; production build compiles; ESLint 0 errors,
no new warnings (153 before, 152 after on the changed files); 131 files.

## 1. Fixed

### Shared (affects many screens)
- Every dialog (ModalLayout, ModalForm) was forced to the full screen height
  (`height="100vh"` on the body), so a two-line "Are you sure?" opened as a
  full-screen sheet. Dialogs now fit their content and scroll when taller
  than the window. Printing is unchanged.
- Delete confirmations (DeletePopUp, ~10 screens): "Yes" shows a spinner and
  ignores a second click. Before, a double click sent the delete twice and
  showed "Failed to delete" after the success message.
- Public pages (sign-up, support, ambassador sign-up, login) could not scroll,
  so on short screens the Submit button was unreachable.
- Invalid theme colour `--shift_row: ##f0f2f8` fixed (scheduled shift cells
  had no background).
- Negative amounts showed as positive (`getAmount` uses Math.abs): net pay on
  the pay stub preview, cheque and Inputs Review now keep the minus sign
  (new `getSignedAmount`; `getAmount` itself unchanged).

### Crashes on empty or loading data
- Calendar "Create Event", dashboard "New" and contact Meetings crashed for a
  company with no groups.
- General Ledger and Budget search crashed when typing before accounts loaded.
- Contact profile crashed when the primary contact was empty or a plain name.
- Payrun Reports crashed when the pay group has no schedule for the year.
- Extra-run Alerts step crashed when an alert's employee was removed, and
  said "No violations" while still loading.
- Ticket category bar showed full when a status count was missing.

### Wrong text on screen
- Funding Totals report: start, end and "date pulled" showed today's date
  when no record exists (now "-").
- Dashboard: "Next Payroll in 0 day" after the year's last payroll (now
  "Not scheduled"; correct day/days).
- Timesheet date filter: "Last pay period" meant today when there is no
  previous period (option now only offered when it exists).
- Overnight shift showed "-8h 0m" (label only; saved values unchanged).
- Accounting: totals showed raw floats (0.30000000000000004), a stray quote
  in the mismatch message, "Entry logged successful".
- Scheduling: unrounded averages (7.428571…), possible "NaN" in totals.
- Workview "Pay Rate 2" showed $0.00 for one-role employees (now blank).
- Leave total "0 day"; affiliate status/role/number blank pills (now "-").
- The literal "0" shown on empty contact Logs and Meetings tabs.

### Loading, empty and error states
- Spinners and double-click protection on: payroll Inputs Review confirm,
  Payrun Setup, clock in/out/break, employee onboarding save, the six
  Employee Info save tabs, accounting Post and New Account, budget account,
  shifts (save/delete), events, crews, sales onboarding, cost centers,
  support form, profile save, chat send, new sale.
- Saves that failed silently now show an error message: Employee Info tabs,
  Workview allocation edits, timesheet edits, leave approvals and requests,
  holidays, orders, opportunities, crews, project tasks/notes, logout,
  reports, ROE (earnings, start-up, draft), timesheet entry.
- Buttons that span forever after an error now stop (Payrun Setup, events,
  Employee Info tabs).
- Lists that showed a skeleton forever after a failed load now show an empty
  state; lists that said "No record found" before loading now show the
  skeleton; empty tables now say so (orders, payouts, customers, budget,
  weekly schedule, modules) and empty-state rows span all columns.
- Reports: a loading overlay while Register/Totals/Journal load; "No journal
  entry for this pay period" instead of nothing.
- Failed onboarding / cost-center saves no longer close the dialog and throw
  away what was typed.
- Chat errors no longer replace the typed message; empty messages can't be sent.

### Layout and phones
- Workview and earning-statement tables collapsed to zero rows on short
  screens (min 240px now).
- Onboarding and Employee Info steppers hidden on phones; form rows stack;
  tabs scroll instead of being cut off (desktop unchanged).
- ROE review scrolls instead of squeezing on narrow screens (print unchanged).
- Payrun Reports year picker, scheduling dashboard charts and filters,
  schedule header, company card, profile email wrap, chat member rows and
  bubbles, file due-date column alignment.
- Leftover debug red border on the Finalize checkbox removed.
- Off-theme colours (#381c34, #4e2847, #4a2b4a) replaced with the theme's
  var(--banner_bg) / var(--nav_menu).
- Accessibility: labels on icon-only buttons (sidebar, user menu, password
  eye, delete icons, workview row buttons — now the whole button is clickable).

## 3. Consistent look (second round)
- One primary button style everywhere: solid var(--banner_bg) purple, white
  text, one hover colour (new token --primary_btn_hover, #4a2b4a), one corner
  radius (new token --radius, 10px, set once in the theme). The shared
  PrimaryButton, ActionButton and LeftIconButton ("Add New") now use it (they
  were a lighter purple, a grey "Add New", and a hover that turned the button
  white with an outline). Screens that pass their own colours (approve/reject,
  leave colours) keep them.
- Hard-coded values replaced with the tokens across screens: #4a2b4a ->
  var(--primary_btn_hover), #371f37 -> var(--banner_bg), #718096 -> gray.500
  (same colour); hovers unified.
- Selects now have the same grey fill and border as inputs (set in the theme,
  so a screen's own select colour still wins).
- Secondary (Cancel / No: light grey), outline and link buttons unchanged.
- Not changed (your call, see 2.1): the global button press rule.

## 2. Suggested, not changed (needs your decision: changes behaviour)
1. `button:active { background: transparent !important; }` (App.css) makes
   filled buttons lose their background while pressed (white text vanishes
   for a moment). Removing it changes every button's press look.
2. Affiliates list: the View and Edit icons open `/info/undefined/0`
   (`handleClick(empId._id)` but `empId` is a string). Fix:
   `handleClick(empId?._id || empId)`.
3. Several fields can't be cleared (the last character comes back):
   `if (value)` guards in EditLead, AddNewSale, EditOpportunityForm,
   NewTicket, sign-up and EditUserInfo. Fixing changes what is submitted.
4. A new affiliate appears only after a page reload (list not refreshed).
5. After submitting a payroll whose VoPay transfer failed, "Submit payroll"
   turns back on but "Yes" does nothing (needs a state change to retry).
6. Leave approvals: a second action on the same row does nothing.
7. Orders: after a failed status save, later status changes are not saved.
8. Accounting: debit/credit are compared with `!==`, so totals like
   0.1 + 0.2 vs 0.3 block a valid entry (compare in cents).
9. Opportunities and Orders search boxes do nothing; Customers search removes
   rows permanently.
10. Weekly schedule title uses the current year, so January 2027 weeks are
    labelled 2026 (also used as the request key).
11. Task / sub-task checkboxes stay ticked when the status save fails (an
    error message now shows).
12. Lead docket bulk import fails silently (`data` used before it is set).
13. Dashboard calendar opens "New event" without company/user.
14. Smaller widths that are still tight on phones: Workview "Pay Number"
    header (30%), timesheet filters (15vw, 30%).
15. The uploaded package has no `client/src/assets/cover.mp4` and
    `support_bg.mp4`, but the payroll dashboard imports `support_bg.mp4`, so
    this package alone does not build. Keep your copies of those files.

## 4. Timesheets: "Invalid time range" on Statutory Pay rows (TS-01)
- The stat holiday job adds a Statutory Pay row starting at 1:00 PM and ending
  1:00 PM + the employee's stat hours. Payroll pays it from its stat hours
  (statDayHours), not from start/end. With 0 stat hours (no earnings in the
  30 days before the holiday) start = end, and "Approve all" showed
  "Invalid time range" for every such row.
- Approve all no longer checks the time range of Statutory Pay rows.
- Rows that really have an invalid range (start not before end) were shown the
  error but approved anyway; they are now left out of "Approve all", as the
  message says.
- Total Hours on a Statutory Pay row shows its stat hours (e.g. 0.00) instead
  of blank.
