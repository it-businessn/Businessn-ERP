# BusinessN ERP: changes, open issues and testing

This file records the documentation, testing and hardening work on the `docs-tests-improvements` branch, the issues that remain open, and how everything was tested. Architecture and API details are in [TECHNICAL.md](TECHNICAL.md); setup and commands are in the [README](../README.md).

* **Base:** `erp.zip` as uploaded, committed unchanged as `7c2beb9`. All later work is on this branch.
* **Features:** none were added. The brief's feature section was the unfilled placeholder `[PASTE THE FEATURE REQUIREMENTS HERE]`, so every change is a bug fix, security fix, test or documentation change.
* **Evidence:** the raw test, lint and build outputs, the smoke-boot log and every before-fix run were kept in `docs/test-evidence/` during the work. They were removed when the documentation was consolidated into three files and remain in the git history of this branch (commit range `7c2beb9..HEAD`). Regenerate them with the commands in the README.

## 1. What was done

| Pass | Scope | IDs used |
|---|---|---|
| Earlier security audit | Password reset/change, tenant guard, rate limits, uploads, webhook, build fixes; then an independent review of those fixes | AUD-001..034, REV-001..018 |
| Earlier performance pass | Client build, asset sizes, mobile navigation, indexes, N+1 queries; follow-ups for charts, the payroll dashboard and printing | F-01..14, C-PRINT |
| Pass 1 (documentation and testing) | Tenant-guard bypasses, hanging handlers, payroll maths bugs, first full docs, +71 server and +12 client tests | BUG-xx, SEC-01, API-xx, NEW-01..16 |
| Pass 2 (owner-approved fixes) | Five parallel streams, each test-first with a saved failing run: A1 tenant scoping, A2 remaining bugs, B VoPay and pay calendar, C server-side RBAC, D pay-run integrity and device auth; follow-ups E2 (leftovers) and E (payroll year) | LEFT-01..05, PAYYEAR-01 |
| Follow-ups | Found while regenerating the API reference and by the final smoke boot; duplicate-resolution script | SUBMIT-01, SIGNUP-01, RBAC-REPORT-01, SOCK-01, T-DEDUP |

`API #n` refers to the numbered API issue list kept in earlier versions of the API reference; code comments use those numbers.

### 1.1 Fixes by area

Severity: P0 data loss, money or cross-tenant exposure · P1 high · P2 medium · P3 low.

**Authentication and sessions**

| ID | Sev | What was wrong | What changed | Tests |
|---|---|---|---|---|
| AUD-001 | P0 | Reset-password routes never verified `:token`; anyone knowing a user id could set their password | Token verified (signature, expiry, id); signed with the current password hash so links are single-use (REV-003) | T-RST-01..06, T-RESET-01..05 |
| AUD-002 | P0 | `PUT /api/change-password/:id` unauthenticated, current password never checked | Token + `requireSelf`; current password, 8–128 length, confirmation, must differ | T-PWD-01..07 |
| AUD-004 | P0 | `PUT /api/user/:userId` `$set` the whole body, so any user could overwrite another's password hash | `password`, `otp`, `_id`, timestamps stripped; id validated | T-USR-01/02 |
| AUD-005, REV-001 | P1 | Login, reset and refresh had no rate limit; then a proxy-IP global lockout risk | `authLimiter` 20/15 min keyed by IP + e-mail; `TRUST_PROXY` opt-in | T-RL-01..05 |
| BUG-04 | P1 | Login and forgot-password accepted operator objects (`{"$ne":null}`) | Non-strings → 400 before any lookup | T-AUTH-13, T-AUTH-21 |
| API-12 | P2 | Forgot-password messages revealed whether an e-mail exists | One identical response | T-AUTH-25 |
| SIGNUP-01 | P1 | Public sign-up 201 returned the bcrypt hash and OTP | Both stripped; non-string e-mail/password → 400 | T-AUTH-26/27 |
| API #19 | P3 | Any user could close another user's session via logout | Logout is self-only | T-FIX (A2) |
| AUD-017, AUD-018, REV-010 | P2 | Client refreshed tokens on every 403; password trimmed; change-password form unvalidated; double submit | Refresh only on token codes; validation, submitting ref, messages | C-API-01..06, C-PWD-01..05, C-LOGIN-05..08 |

**Tenancy (who can see which company's data)**

| ID | Sev | What was wrong | What changed | Tests |
|---|---|---|---|---|
| AUD-003 | P0 | No server-side tenant check: any user could read or change any company by name | `middleware/authorize.js`: body/query check app-wide, param guards on every router, membership = `Company.employees` | T-TEN-01..07 |
| NEW-02 | P0 | Guard only checked string values; `{"companyName":{"$ne":"x"}}` reached Mongo and returned every tenant's data | Non-string company → `400 INVALID_COMPANY` | T-TEN-20..23 |
| NEW-01 | P0 | `PUT /api/user/:id` could add the caller (with a role) to any company, or remove anyone from any company | Assigned/unassigned companies must be the caller's own | T-USR-04..08 |
| REV-002, REV-004, REV-005 | P1 | Ticket/resource routers, multipart uploads and `PUT /api/company/:id` bypassed the guard | Guards on those routers, after multer, and on company ids | T-TEN-12..16 |
| SEC-01 | P1 | Four schedule routes use `:name` as the company and weren't guarded | `requireCompanyNameParam("name")` | T-TEN-24 (×4), T-TEN-25 |
| NEW-06, API #7, API #11 | P1 | List endpoints without a company in the URL (users, companies, contacts, projects, ...) and announcements returned every tenant's data; ticket/resource `:id` routes unchecked | Lists scoped to the caller's companies; object-level check on ticket/resource ids | T-ANN-01, T-SCOPE-01..30 |
| NEW-05, NEW-14, LEFT-04 | P1 | Employee look-ups by full name and the profile/affiliate fallbacks matched other companies' employees | Matches limited to company members; unknown names reported as `notFound` | T-FIX (A2), T-LEFT |
| NEW-16 | P1 | Group chats, bulk lead opportunities, disbursement confirmation unscoped | Scoped to the company | T-SCOPE |
| RBAC-REPORT-01 | P1 | In `RBAC_MODE=report`, setup and payroll-submit `:id` routes let a member act on another company's record | Always `403 COMPANY_ACCESS_DENIED` | T-RBAC-32 |
| API #1 | P3 | `GET /api/resource/:fileType` shadowed `GET /api/resource/:companyName`, so the resources page was empty | Unused route removed | T-SCOPE |

**Roles, devices and real-time**

| ID | Sev | What was wrong | What changed | Tests |
|---|---|---|---|---|
| AUD-028 | P1 | Roles existed only in the UI; any member could run payroll, move money or change permissions | `middleware/rbac.js` role matrix (TECHNICAL.md 1.7), `RBAC_MODE` | T-RBAC-01..31 |
| AUD-013 | P1 | All `/api/timecard/*` routes public, including reads of every employee's time cards | Device key for ingest (`TIMECARD_DEVICE_KEYS`); token + membership for the rest; NW-only routes need NW membership | T-DEV-01..06 |
| LEFT-03 | P2 | A badge number used in two companies was booked to whichever record came first | Badge resolved within the punch's company; ambiguous device punches held and logged | T-LEFT |
| API #16, NEW-15 | P2 | socket.io unauthenticated; VoPay webhook events broadcast to every socket | JWT handshake, per-company rooms, per-company emit | T-VOPAY (socket) |
| AUD-007, AUD-010 | P1 | Webhook mounted after auth (always 401), non-constant-time compare; VoPay signature computed once at boot (fails after midnight) | Mounted before auth, `timingSafeEqual`; signature recomputed per call | T-WH-01/02 (AUD-010 manual) |
| SOCK-01 | P3 | Every socket.io request was also handed to Express (`ERR_HTTP_HEADERS_SENT` on every poll) | `/socket.io/` goes to socket.io only | M-SMOKE-02 |

**Payroll and money**

| ID | Sev | What was wrong | What changed | Tests |
|---|---|---|---|---|
| PAYYEAR-01 | P0 | Pay stubs were found by period number **without a year**, so each year's run of period N overwrote last year's period-N stubs. History lost this way is gone from the database | Stubs keyed and read by period + pay-date year; pay dates stored at UTC start of day; index `uniq_processed_paystub_v2`; year-scoped readers | T-YEAR-01..14 |
| SUBMIT-01 | P0 | Payroll submit called VoPay on every request, so a double click or retry **sent the money again**; funding totals matched by exact timestamp | Atomic claim on `fundTransferStatus`; repeats return `skipped`; failures retryable; whole-day match | T-VOPAY-19..22 |
| AUD-015, REV-009 | P1 | Pay run: no validation, no transaction, find-then-create races could duplicate stubs and funding totals; T4 failures unhandled | Validation (400); in-process lock (409); atomic upserts on unique keys in one transaction (`PAYRUN_TRANSACTIONS`); T4 failures logged; `check-duplicates.js` and `resolve-duplicates.js` | T-PAY-02, T-PAY-05, T-INT-01..11, T-DEDUP-01..05 |
| NEW-04 | P1 | Cornerstone fund transfer signed with the wrong key, so VoPay rejected it, and the outcome was invisible | Signed with Cornerstone's key; response gains `fundTransfer`; client warns on failure. **Transfers now move real money** | T-VOPAY-01..18 |
| NEW-07 | P1 | 2027 pay calendar started on Tuesday 2026-12-08; year fixed at boot | Start = `2023-12-18 + 364 × (year − 2024)` days (2027 → Monday 2026-12-14), computed per call | T-CAL-01..06 |
| BUG-01 | P2 | Time-card hours read the end of breaks 2 and 3 from `startBreaks`, overstating hours | Read `endBreaks[1]`, `endBreaks[2]` | T-HRS-04 |
| BUG-03 | P2 | `"semi-monthly"` taxed as bi-weekly (26 periods instead of 24) | Spelling normalised | T-TAX-03 |
| NEW-11, API-05 | P2 | Pay-schedule generation always answered 201 | 404/400/500 reported | T-FIX (A2) |
| API #3, NEW-15 | P2 | `transferWithdraw`, `partnerAccountTransfer`, `createClientAccountWallet` hung or threw; bodies were hard-coded test transfers | `501 NOT_IMPLEMENTED` behind AuthAdmin+ | T-VOPAY |
| NEW-13 | P2 | Leave requests: any field accepted, unlimited range | Hours allow-listed, 366-day cap | T-FIX (A2) |
| NEW-16 (stat holidays) | P3 | Duplicate check used the wrong year; pay rate 0 gave NaN hours | Holiday's year; 0 handled | T-FIX (A2) |

**Stability and API correctness**

| ID | Sev | What was wrong | What changed | Tests |
|---|---|---|---|---|
| NEW-03 | P1 | Device time-card ingest didn't await work: `[null]` gave a 500 and later rejections crashed the process | Payload validated; `await Promise.all`; process-level rejection logger | T-TC-01/02, M-SMOKE-01 |
| LEFT-01 | P2 | `POST /api/payroll/employmentInfo` always returned 500 | Works; 400 for missing/invalid ids | T-LEFT |
| LEFT-02 | P2 | `POST /api/timecard/manual` hung on `[]` and answered several times | Validates; answers once with per-entry results | T-LEFT |
| NEW-08, NEW-09, API-02, API-04, AUD-011 | P2 | Handlers that never responded or always failed: duplicate permission, unknown master user, disbursed leads (500), T4 listing, unknown order, unknown note type, pay-group stubs | 409 / 404 / 200 / 501 / 404 / 400 / 501 | T-PERM-01, T-USR-09, T-LEAD-01, T-T4-01/02, T-ORD-01, T-NOTE-01, T-PAY-01 |
| API-13, API #13 | P2 | Contact and task updates and conversation history read params that don't exist (updated nothing) | Correct params / body fields | T-CON-01, T-TASK-01, T-FIX (A2) |
| NEW-10 | P2 | Lead redistribution queried the wrong model, so weights never changed | Queries `Employee` | T-FIX (A2) |
| NEW-12, AUD-016, LEFT-05 | P2 | Raw `req.body` used as filter/document for contacts, journal entries, lead tickets; user text unescaped in e-mails | Allow-lists; support ticket validation; HTML escaping in all e-mails | T-SUP-01, T-FIX (A2), T-LEFT |
| AUD-008, AUD-009, REV-006..008 | P1 | Upload names used for paths (traversal), no size limit, public downloads, temp files kept, racing downloads, multer errors as 500 | Sanitised names, 10 MB limit, auth on downloads, unique temp files, 413/400 mapping | T-FILE-*, T-RES-01..04, T-TKT-01..03, T-ERR-03 |
| API #18 | P3 | Authenticated 500/min rate tier never applied | Token checked inside the limiter | T-FIX (A2) |
| AUD-012, AUD-023, AUD-024 | P2 | Shadowed `assignLeads` route; DB connection failure crashed the process; 500 messages leaked | Route order; connection errors logged; generic 5xx in the central handler | T-USR-03, T-ERR-01..03 |
| A1 (`GET /api/user`) | P2 | Always answered 500 (`.sort()` on a Promise) | Fixed while scoping | T-SCOPE |

**Build, client and maintenance**

| ID | What changed |
|---|---|
| F-01, AUD-020..022 | Client builds from a clean install (missing chart.js peer, removed icon); ESM helpers in the CommonJS server converted; client test harness repaired |
| F-02, F-07, F-08, 6b | Phone navigation drawer; tables scroll on phones; public pages lazy-loaded (`main.js` 396 → 382 kB gzip); payroll dashboard responsive layout |
| F-03 | Images and video re-encoded in place: client build 68 MB → 8.5 MB |
| F-04, F-05, F-14 | 11 compound indexes on hot models; N+1 employee and crew queries batched; `:name` route params no longer treated as companies (crew routes answered 403) |
| C-PRINT-01/02 | Print buttons migrated to react-to-print 3 (`contentRef`), no longer disable themselves or clip the printout |
| Charts | react-chartjs-2 5 + chart.js 4 with an explicit registry (`components/ui/charts`) |
| BUG-02 | Task/project completion % gave only 0 or 100 (C-UTIL-08) |
| UI-01 | Desktop UI looked magnified on 1080p laptops (125–150 % OS scaling = 1280–1536 CSS px): root font size 14 px below 1700 px and 15 px up to 2200 px (Chakra is rem-based, phones keep 16 px); module bar no longer hides the logo or pushes the profile menu off-screen (rem-sized buttons, shrinking/scrolling row); rem-based sidebar; `.main_content` overflow fixed; 4em 8em page gutters made responsive on the sales, scheduling and project-management dashboards; tab groups wrap. Verified with Chromium screenshots at 1920×1080, 1536×864 and 1280×720 (no horizontal overflow) |
| CHART-NULL | Scheduling page crashed with `Cannot read properties of null (reading 'labels')` and sent the user back to the login page: its chart data starts as `null` until the API answers (and stays `null` if a request fails), which react-chartjs-2 v5 rejects. The shared chart module (`components/ui/charts`) now renders an empty chart for missing data, covering all 12 charts in the app (C-CHART-03/04). Verified in Chromium: the old build reproduces the error, the new one loads the page with empty, `null` and `{}` API responses |
| UI-02 | Employee Dashboard (and 15 other two-pane pages) broken on phones: `SimpleGrid templateColumns={{ lg: "70% 30%" }}` overrides `columns` at every size, so below `lg` the grid had no column template and grew to its widest table (403 px on a 309 px phone). All 16 grids now have `base: "minmax(0, 1fr)"` and `fr` ratios on desktop (the % pairs plus the gap also overflowed by the gap width). Phone header: long company names end in "…", the header row no longer exceeds the screen next to the menu button, so the avatar and help icon stay visible. Verified in Chromium at 309 and 375 px (no page overflow) and re-checked desktop at 1280/1536/1920 |
| CLIENT-ENV | Close buttons on the public support, sign-up and affiliate pages went to `/undefined`: `process.env.WEBSITE` isn't exposed by CRA (only `REACT_APP_*`). Now `REACT_APP_WEBSITE` via `WEBSITE_URL` in `constant.js` with fallback `https://www.businessn.com`; the support page's back/close also falls back to the site when there is no history (C-WEB-01/02; verified by clicking the X in Chromium) |
| Clean-up | Removed 13 dead client files, a client config file with lint errors, and four `* copy.js` server models (one threw on load); client lint at 0 errors; `.env.example` files added |

**Compatibility.** No endpoint URL or successful response shape changed, except that payroll submit gained `fundTransfer` and sign-up no longer returns the password hash and OTP. New behaviour is limited to requests that used to hang, crash, leak data or silently do nothing (new 400/403/404/409/501 responses), the role gates, device keys, and the year-scoped pay stubs. New environment variables: `RBAC_MODE`, `PAYRUN_TRANSACTIONS`, `TIMECARD_DEVICE_KEYS`, `TRUST_PROXY`. New additive fields: `FundingTotalsPay.fundTransferStatus` and `fundTransferAt` (no backfill needed).

### 1.2 Feature: automatic pay stub e-mails on the pay date (PAYSTUB-EMAIL)

Each employee receives their earnings statement as a PDF by e-mail on the pay date. The attachment is the full printed `PayStubStatement` (same layout, rows and amount-in-words cheque part as Print in the app), drawn on the server. Off until `PAYSTUB_EMAIL_ENABLED=true` is set (details and environment variables: `docs/TECHNICAL.md` section 1.13; endpoints: section 2.2a).

| Area | Change |
|---|---|
| New files | `jobs/payStubEmail.js`, `services/payStubEmailService.js`, `services/payStubPdfService.js`, `constants/paystub.constants.js`, `assets/paystub/logo.jpg`, `assets/paystub/cover.jpg`, `assets/paystub/email-logo.png`, `views/emails/paystub.ejs`, `models/PayStubEmailLog.js`, `tests/api.paystubEmail.test.js` |
| Changed files | `index.js` (starts the job), `controllers/userController.js` (`sendMailPaystub`: the existing Send pay stub e-mail now sends the pay stub e-mail with the statement PDF instead of a "log in to view" notice), client `SendEmailList.jsx` (shows the server's message, e.g. who had no pay stub), `package.json` / `package-lock.json` (`pdfkit` 0.20.2 and `to-words` 4.1.0, the version the client uses; both pure JavaScript) |
| Design | Opt-in switch; due = pay date today (Vancouver) plus 3 catch-up days; atomic claim on a delivery log keyed by pay date (never twice, also across server instances and years); failures logged and retried; only stubs with net pay above $0.00 are e-mailed; the app's Send Paystub uses the same e-mail, PDF and log |
| Built on | A version of this feature in the earlier refactored archive. Changed from it: opt-in instead of on by default (staging points at production data), log keyed by pay date (its key had no year and would have skipped next year's stubs), atomic claim instead of check-then-send (two runs could both send), employee number from the company's employment record, recipient fallback to the profile e-mails, role gates |
| Bug fix (all multi-select lists) | Ticked employees showed as unchecked: the theme had no `facebook` palette, so a checked box (`colorScheme="facebook"`, 59 places) had a transparent background and an invisible white tick. Added the palette to `client/src/config/themeConfig.js`. Also `MultiSelectBox.jsx` / `PayrollMultiSelectBox.jsx`: the whole row toggles (clicking beside the name did nothing), and the checked state uses the same value as the toggle (string options and the timesheet filter could be selected but never shown checked). Tests C-MSB-01..05 |
| Tests | 32 automated (T-PSE-01..14, 23-31, 33, 34, 36: pay-date job, statement PDF, Send pay stub e-mail, net pay rule) plus an end-to-end run through the real nodemailer over TLS to a local capture server, and real server boots with the switch off and on |

### 1.3 Tax tables by pay date and BC statutory holidays (TAX-TABLES, STAT-HOLIDAYS)

| Area | Change |
|---|---|
| BC income tax | Was 5.06 % on the first bracket for every pay date. Now 5.06 % until June 30, 2026, **6.14 % from July 1, 2026** (CRA July 2026 T4127; BC Budget 2026 raised 2026 to 5.60 %), and **5.60 % from 2027** with the 2026 thresholds (frozen 2027-2030) |
| Federal income tax | 2026 values were already right (14 %, 58,523 / 117,045 / 181,440 / 258,482). 2025 editions added (15 % until June, 14 % from July). 2027 is not published yet: the 2026 table is used with a log warning until it is added |
| How | `constants/taxTables.constants.js` (editions by effective date, with sources), `taxService.getTaxTables(payDate)`, pay date passed from the pay run. Before: one hard-coded 2026 table for every pay date |
| Stat holidays | BC holidays computed for any year (`utils/bcStatHolidays.util.js`) and filled in for a BC company's empty year (holiday page, daily job); year picker on the holiday page (was current year only); editing a date into another year moves the holiday to that year (it stayed in the old year); punches compared on the Vancouver day (evening punches on a stat were missed); the daily job loads `moment-timezone` itself |
| Tests | `unit.taxTables.test.js` T-TT-01..08, `api.statHolidays.test.js` T-SH-01..09, client C-HOL-01; T-TAX-01 pinned to a March 2026 pay date |

### 1.4 Alerts and Violations duplicates; Support notices for every company (ALERTS-01, SUPPORT-01)

| Area | Change |
|---|---|
| Duplicate alerts | Alerts were stored once per pay period (the existence check included `payPeriodNum`) while the list ignored the period, so an unfixed problem was listed once per pay run. Now one row per (company, employee, type), updated on each inputs review and removed once fixed; the next review deletes legacy copies, and the list and count show one per problem until then. Unique index `uniq_alert_per_problem` (builds once copies are gone; `scripts/check-duplicates.js` / `resolve-duplicates.js --apply` also handle it) |
| Minimum wage | Was $17.85 hard-coded; BC raised it to **$18.25 on June 1, 2026**. Now `constants/minimumWage.constants.js` by date. The alert fired below 17.85 but was cleared only above 17.85, so a rate of exactly the minimum never cleared it; now equal meets it. No pay rate is "Pay rate missing." |
| Clearing alerts | Saving bank / pay rate / SIN clears that employee's alert in that company only (it cleared it in every company) |
| Support panel | Messages were Announcement rows for BusinessN only; since NEW-06 limited them to the company, other companies (Cornerstone) saw none, and nothing in the app creates them. General notices now live in `constants/supportNotices.constants.js` and are shown to every company with its own announcements. Each notice shows its own text (it was hard-coded by position, so "Minimum Wage Increase June 1, 2025" showed the stat-holiday text). Notices: BC tax change July 2026, minimum wage June 2026, moving a stat holiday |
| Tests | `api.alerts.test.js` T-ALERT-01..07, T-ANN-02, client C-SUP-01, T-DEDUP-05 updated |

### 1.5 CPP / EI by year with annual maximums, TD1 default, BC tax reduction (PAYROLL-CALC, RATES-READINESS)

| Area | Change |
|---|---|
| CPP | Was 5.95 % every period with no annual maximum (`MAX_CPP_CONTRIBUTION` unused) and no CPP2. Now by year (2025, 2026, 2027 rate 5.75 %), stopped at the annual maximum using this year's CPP so far, plus CPP2 (4 % between YMPE and YAMPE) |
| EI | Was capped per period at the 2023 maximum ($1,002.45). Now 2025 / 2026 / 2027 rates and maximums, stopped at the annual maximum using this year's EI so far; employer 1.4 x |
| Tax formula | Follows CRA T4127 Option 1: enhanced CPP deducted from income; base CPP, EI and the Canada employment amount credited (they were not, so tax was over-withheld) |
| TD1 default | A blank or 0 tax credit (the screen's default) gave no basic personal amount: on $2,000 bi-weekly about $83 too much tax per pay. Now blank / 0 = the basic personal amount (federal reduced for high incomes); new "Claim code 0" checkbox for employees who claim nothing. The screen shows blank instead of 0 and explains the field |
| BC tax reduction | Applied (factor S): 2025 $562, 2026 $575 then $805 prorated from July, 2027 $690 |
| Staying current | `npm run check:rates`; daily warning from Nov 1; T-RR-03 fails in December while next year is incomplete; calendar in TECHNICAL.md 1.14 |
| Tests | `unit.payrollCalc.test.js` T-PC-01..10, `unit.ratesReadiness.test.js` T-RR-01..03, T-YEAR-04b, T-TAX-01..08 rewritten with the T4127 arithmetic, client C-TD1-01 |

### 1.6 Bugs found in the full review (YTD-01 and others)

| Area | Bug | Fix |
|---|---|---|
| Year to date (all YTD totals, CPP / EI caps) | Read from "period N-1": a re-run extra run counted its own amounts twice; an extra run in period 1 restarted the year and later periods lost the regular period-1 pay; a period without a stub (unpaid leave) or a pay-schedule change restarted the year; an extra run paid between two regular runs could be lost | Sum of the per-pay amounts of the year's earlier stubs by pay date, all pay schedules (`findYtdBase`, `YTD_SUMS`); same result in any processing order; stored YTD totals not re-used. Opening balances from before the app are not supported |
| Holidays | Adding or renaming to a name already used that year (new unique index) gave 500 | 409 "already exists" |
| Pay stub e-mail | A database error or a stub without a pay date threw: the whole Send Paystub request failed (500) and the hourly batch stopped | `emailPayStub` never throws; that stub is FAILED; an overlapping send is reported "already being sent" |
| Stat holidays | Two fills at the same moment could insert the BC holidays twice | Unique index (company, year, name); dedupe scripts cover it |
| Timecard | (my earlier change) time-clock punches, stored as local time labelled UTC, were converted again, moving early-morning punches to the previous day | Only app punches are converted to Vancouver time |
| Multi-select (client) | A row without a name (deleted employee) crashed the picker (my earlier change); the accounting ledger filter could never untick a row | Nameless rows left out; object selections kept as objects |
| Holiday page | A year outside the 7-year range showed the wrong year; a slow answer could overwrite the current list | Selected year always listed; stale answers ignored |
| Others | Accented names lost letters in PDF file names; undated announcements sorted randomly; credentials toast hid names not found; claim code 0 sent as "true" ignored | Fixed |
| Tests | | T-YEAR-20..30 (a full year of real pay runs; 22-29 fail on earlier versions), T-PSE-37..39, T-SH-10..11, T-ANN-03, C-MSB-06..07, C-HOL-02 |

### 1.7 Vacation accrual and carry-over (VAC-01)

Built on the existing logic: `calcVacBalance` (per-period accrued / used / balance adjustment) is unchanged, and so is the balance formula `forward + accrued - used` the code already used for period 1. What was broken is how the per-period amounts were added up over the year.

| Field on the stub | Before | Now |
|---|---|---|
| Accrued (`YTDVacationAccrued`) | Period 1's accrual, then frozen: the current period was never added | This year's per-period accruals added up (vacation % x gross pay + "vacation accrual" adjustment), in pay-date order like the other YTD totals |
| Balance forward (`YTDVacationBalanceFwd`) | Period 1: last year's *accrued* total; period 2 on: only this period's adjustment, so the carry-over disappeared | Last year's **closing balance** + this year's balance adjustments, the same all year |
| Used (`YTDVacationUsed`) | Vacation payouts + vacation pay taken | Vacation payouts + the per-period "used" from `calcVacBalance`: vacation pay taken (Accrued) or the accrual itself (Payout), + the "vacation used" adjustment |
| Balance (`YTDVacationBalance`) | Period 1: forward + accrued - used; later: accrued - used (no carry-over) | forward + accrued - used on every stub |

Decisions where the code did not say:
- **Carry-over = last year's closing balance**, from the employee's last stub paid in the previous pay year (any pay schedule; `findVacationCarryIn`). Carrying last year's *accrued* total, as before, would carry again vacation already taken or paid out. No stub last year: nothing carried. Stubs processed before this fix carry their stored closing balance; if one is wrong, correct it once with a "vacation balance adjustment" on the first pay run of the year.
- **Always carried.** The `carryFwd` flag on the employee's balance info is not used by payroll (it was never read, and the current screen no longer saves it).
- Extra runs and every pay schedule count, in the same order as the YTD totals (YTD-01): re-running, or processing out of order, gives the same balances.
- Sick balances unchanged (they are always 0 today).
- Open: VAC-02 ("Payout" treatment's 4 % is not added to gross pay).

Tests: `api.payrunYear.test.js` T-VAC-01..07 (real pay runs; all 7 fail on the previous code); T-YEAR-05, 06, 26 now carry the closing balance.

### 1.8 Issue ROE completed (ROE-01)

Five tabs, each confirmed before the next opens; confirmed sections fold up and can be reopened.

| Tab | What it does |
|---|---|
| Employee Info | All employees of the company (no active/inactive filter); Confirm Selection fills the personal information from the profile (SIN masked, read only); an employee with a submitted ROE gets "View / print copy" or "Start a new ROE" |
| Employment Info | Tenure and positions; final pay period end date filled in from the last day worked (pay period containing it, from the employee's pay group schedule); reason code; expected recall default "U - Unknown"; recall date shown and required only for "Y" (not for E/G/M reasons); optional separation payments |
| Employer Info | Company name, address, CRA payroll account number (read only); contact and issuer from the company's admins, default the logged-in user; tel / ext; English by default |
| Earnings Info | Block 15C from processed pay stubs: ROE PP 1 = final pay period, going back (27 / 53 / 25 / 13 by pay period type); insurable earnings = gross pay, hours = all paid hours; runs ending the same day are one period; odd / even columns with a merge toggle; totals 15A / 15B |
| Review | The ROE as the Service Canada form; comments; print; submit. Draft: DRAFT COPY watermark. Submitted: printed copy with the filed-copy notice |

Server: `GET /api/payroll/roe/employer/:company`, `GET /roe/earnings/:company/:empId?finalPayPeriodEndDate=&firstDayWorked=&frequency=` (`utils/roe.util.js`), `POST /roe` validated (422) with `submit: true` to submit; latest ROE per employee; a submitted ROE is never overwritten; SIN stored encrypted from the profile and returned masked; all ROE routes administrator-only. Fixed: month printed 0-based, full SIN, hard-coded 15A/15B, crashes on a missing company address or a country stored as "CA". Not done: electronic filing with Service Canada (ROE Web); Submit records the ROE as issued.

Tests: `api.roe.test.js` T-ROE-01..11, client `roe.test.jsx` C-ROE-01..03 (whole flow).

## 2. Open issues

Deduplicated from the changelog, the API issue list and the feature gap register, in priority order.

| ID | Sev | Issue | What's needed |
|---|---|---|---|
| AUD-025 / PII-01 | P0 | Live credentials were in the delivered `.env*` files (and are in the baseline commit); `server/generated-T4-xml/` holds real T4 slips with names and SIN fields; `server/uploads/` holds documents | Owner: rotate every credential, keep these out of archives, never push the baseline commit publicly |
| PAYYEAR-YTD | P1 | Year-to-date reset is keyed on period number, not the pay year (section 4) | Payroll SME decision, then a small change with golden-file tests |
| VAC-02 | P1 | Vacation "Payout" treatment: the 4 % (vacation percent) is counted as paid each period on the stub's vacation balance, but it is not added to gross pay (`calcCurrentGrossPay`), so it is only paid if entered as a Vacation Payout amount (existing logic, not changed: it changes net pay and taxes) | Owner decision: add `currentVacationAccrued` to gross pay for Payout employees, with tests |
| FEAT-GAP-06 | P1 | BC is the only province; RRSP / union dues are not deducted from taxable income and other TD1 credits (K3) are not applied (CPP/EI maximums, CPP2 and the BC tax reduction: fixed in 1.5); tax values come from published sources but have not been compared with PDOC by a payroll specialist | Payroll SME review against the CRA PDOC calculator |
| VOPAY-ACCT | P1 | `fundEmployerWallet` and `createClientAccountEmployee` are commented as Cornerstone but use the default (staging) account | Owner decision; test in the VoPay sandbox |
| AUD-030 | P1 | Public `/api/signup` lets anyone join any company by name; no auth limiter; 409 reveals known e-mails; unknown company → 500 | Product decision (invite-only?) |
| RBAC-ROLES | P2 | Users with an empty role, and Employees given pages through custom permissions, are refused on gated endpoints | Deploy with `RBAC_MODE=report`, fix role data, then `enforce` |
| AUD-033, REV-017 | P2 | Object-level checks missing on most `:id`-only routes (e.g. `PUT /api/payroll/bankingInfo/:id`, `DELETE /api/schedule/:id`, `POST /api/timesheet/action`, `POST /api/conversations/history`); `PUT /api/user/:userId` has no self/admin check for profile fields | Apply `requireDocumentInCallerCompany(Model)` route by route |
| API #20, API #24 | P2 | VoPay `GET` routes (balance, transactions, wallets, bank accounts) are open to every user of every tenant; read routes aren't role-gated (any Employee sees everyone's login times) | Owner decision on read permissions |
| API #16 (remaining) | P2 | VoPay webhook signature is `sha1(key+secret+date)`: constant for a day, not bound to the payload, and the same value the server sends to VoPay | Check whether VoPay offers payload signing |
| API #14 | P2 | `GET /api/vopay/account/submit-extended-info` creates a VoPay account from a GET with bank details, outside the AuthAdmin+ gate | Make it a gated `POST` |
| API #22 | P2 | `POST /api/timecard/manual` answers 201 but its writes are commented out | Product decision: implement or remove |
| LEFT-03 (remaining) | P2 | Device punches carry no company; badges shared by companies need manual booking. With keys set, any user token is accepted in place of a device key, with no tenant check on the punches | Per-company device keys |
| A1-SKIP | P2 | Notification, Opportunity and the SetUp idle-lead rule have no company field (lists unscoped; any user can change the rule); `GET /api/leads/grouped-opportunities` and `GET /api/conversations/group` aggregate all companies | Schema change and backfill |
| AUD-029, REV-015 | P2 | Tokens can't be revoked: up to 2 h / 5 h after logout or deactivation | Denylist or rotation |
| DB-U1..U3 | P2 | `Employee.email` unique but not sparse or lower-cased; `Company.name` not unique; one-per-employee satellites not unique (onboarding creates some without checks) | Data clean-up (`check-duplicates.js` reports them), then unique indexes |
| DB-D1/D2 | P2 | Membership stored twice (`Company.employees`, `Employee.companyId`) with separate writes; `employees` updated by push + `save()` (lost updates under concurrency); AUD-019: unassign-only requests reset `companyId` | Single source or `$addToSet`/`$pull` in a transaction |
| DB-S, T4-IV | P2 | Money, rates and hours stored as strings; money as doubles; T4 XML saved with a mismatched IV, so it can't be decrypted (`t4SlipController.js:492`) | Migrations; fix the T4 helper |
| F-06, F-10, AUD-026 | P2 | Timesheet pagination in memory; pay-info looked up by string while the map is keyed by ObjectId; time-card query ignores `limit`/`endDate` | Need real data to confirm |
| FEAT-GAP-04 | P2 | Pay-group CRUD (`/api/payroll/payGroups`), T4 listing and `DELETE /api/payouts/:id` not implemented (501 / commented out) | Implement or remove |
| FEAT-GAP-05 | P2 | Live VoPay status isn't shown: the socket hook is ready but not mounted | Mount `useVoPayEvents` in the VoPay page |
| AUD-014 | P2 | `affiliateCode` index must be dropped once by hand so it is rebuilt as sparse | Deployment step (README) |
| REV-014 | P2 | After a membership is revoked, the UI keeps the stored company and shows per-screen 403s | Reset to the first allowed company |
| FEAT-GAP-09 | P2 | HR module is a placeholder | Product decision |
| AUD-034 | P3 | Rate limits, membership/role caches and the pay-run lock are per process | Redis before running more than one instance |
| API #17, AUD-024 | P3 | Most 500s include the raw error object; bare-string bodies; updates return 201; `setNewPassword` returns HTML to JSON clients | Consistent error helper |
| API #11 (remaining) | P3 | `updateTicket` `$set`s the raw body onto a ticket of the caller's company | Allow-list fields |
| REV-016 | P3 | A user without a password can't use change-password and must use the reset flow | Acceptable; documented |
| LEGACY | P3 | 21 unused legacy model files; unused client dependencies `bootstrap`, `react-with-gesture`; request logger prints every request | Delete after confirming old collections aren't needed; structured logger |

## 3. Testing

### 3.1 Setup

| Side | Framework | Database / network |
|---|---|---|
| Server | Jest 30 + Supertest 7 (`server/jest.config.js`, `tests/setupEnv.js` sets **fake** secrets) | None. Mongoose models are replaced with `jest.mock` and a chainable `query()` stub (`tests/helpers.js`). The real Express app is built with `buildApp()`, so routing, middleware order, rate limits, JWT, bcrypt and validation run for real. The token helper `auth()` signs a valid token for a user who belongs to company **Acme** only. |
| Client | CRA 5 Jest 27 + React Testing Library 13 (`moduleNameMapper` for Chakra subpath exports, `src/setupTests.js`) | jsdom; services mocked per test |

Only `api.payrun.concurrency.test.js` mocks service modules and resets the module registry, so it runs in its own file. `unit.resolveDuplicates.test.js` uses an in-memory fake of the MongoDB driver.

### 3.2 Suites

| File | Tests | Scope | IDs |
|---|---|---|---|
| `api.security.test.js` | 50 | Earlier audit: tenant guard, password change/reset, mass assignment, tickets/resources/files, webhook | T-TEN-01..19, T-PWD, T-RST, T-USR-01..03, T-TKT, T-RES, T-FILE, T-SUP, T-PAY-01..04, T-WH, T-404, T-LOGIN |
| `unit.middleware.test.js` | 20 | JWT, `requireSelf`, company extraction, filename sanitising, reset tokens, error handler | T-AUTH-01..05, T-AUTHZ, T-RESET, T-ERR |
| `api.ratelimit.test.js` | 9 | Credential limiter, proxy trust, pay-run validation | T-RL-01..05 |
| `api.employees.batch.test.js` | 5 | Batched employee/crew look-ups, `:name` routes | T-EMP-01..03 |
| `api.payrun.concurrency.test.js` | 1 | Concurrent pay-run lock (409) | T-PAY-05 |
| `unit.payroll.test.js` | 29 | Tax/CPP/EI, percent and time utilities, hours by earning type, contributions, time-card hours | T-TAX-01..08, T-PCT, T-UTIL, T-PAYH, T-CONTR, T-HRS-01..05 |
| `unit.taxTables.test.js` | 8 | Federal and BC tables by pay date: 2025, 2026 (July BC 6.14 %), 2027 BC freeze, missing-year fallback, table structure, credit handling | T-TT-01..08 |
| `api.statHolidays.test.js` | 9 | BC holiday rules (2026 official list, 2027, Easter, rule changes), BC companies, auto-fill once per empty year, non-BC, bad year, edit moves year | T-SH-01..09 |
| `api.alerts.test.js` | 7 | One alert per problem across pay runs, fixed problems removed, legacy copies cleaned, minimum wage by date, company-scoped clearing, pay rate missing | T-ALERT-01..07 |
| `unit.payrollCalc.test.js` | 10 | TD1 default and claim code 0, federal BPA phase-out, CPP / EI / CPP2 annual maximums, enhanced CPP deduction, BC tax reduction by edition | T-PC-01..10 |
| `unit.ratesReadiness.test.js` | 3 | Tables loaded for this year; status per year; fails in December while next year is incomplete | T-RR-01..03 |
| `api.payrunYear.test.js` | 18 | A whole year of real pay runs: CPP / CPP2 / EI stop exactly at the maximums, re-runs and extra runs in any order, two extra runs or two schedules on one day, period without a stub, schedule change, re-dated first stub, vacation carry into period 1, new year; vacation accrual, carry-over, adjustments, payouts, Payout treatment, re-runs (VAC-01) | T-YEAR-20..30, T-VAC-01..07 |
| `api.auth.test.js` | 18 | Login, refresh, forgot-password, logout, sign-up response | T-AUTH-10..27 |
| `api.defects.test.js` | 26 | Operator bypasses, company (un)assignment, time-card ingest, hanging/no-op handlers | T-TEN-20..25, T-USR-04..09, T-TC, T-LEAD, T-PERM, T-T4, T-CON, T-TASK, T-ORD, T-NOTE, T-ANN |
| `api.scoping.test.js` | 50 | List-endpoint and object-level tenant scoping, resource route shadowing | T-SCOPE-01..30 |
| `api.bugfixes.test.js` | 42 | Name look-ups, lead redistribution, pay-schedule errors, allow-lists, leave limits, stat holidays, rate tier, logout | T-FIX-01..38 |
| `unit.vopay.test.js` | 22 | Cornerstone signing, credential isolation, `fundTransfer`, 501s, socket auth and rooms, idempotent submit | T-VOPAY-01..22 |
| `unit.paycalendar.test.js` | 6 | Calendar starts 2024–2027, Mondays, invalid years, per-call year | T-CAL-01..06 |
| `api.rbac.test.js` | 50 | Every matrix row allowed/denied, `ROLE_ACCESS`, missing role, report mode, cache, Shadow Admin, unknown target, report mode never crosses companies | T-RBAC-01..32 |
| `api.integrity.test.js` | 17 | Natural-key upserts, transaction and fallbacks, `PAYRUN_TRANSACTIONS=off`, T4 failure handling, index-error logging, device keys | T-INT-01..11, T-DEV-01..06 |
| `api.leftovers.test.js` | 15 | Employment-info save, manual time cards, badge tenancy, affiliate fallback, HTML escaping in e-mails | T-LEFT-01..15 |
| `api.payyear.test.js` | 14 | Two years' period-N stubs coexist, year-scoped upsert and readers, previous period per frequency, index shape, whole-day matching | T-YEAR-01..14 |
| `unit.resolveDuplicates.test.js` | 5 | Dry run writes nothing; `--apply` keeps the newest, backs up, repoints orders, deletes; informational groups untouched | T-DEDUP-01..05 |
| `api.paystubEmail.test.js` | 32 | Pay stub e-mails (pay-date job and Send pay stub e-mail): content and PDF (statement rows, totals, hidden cells, amount in words, payment method, superficial runs, one A4 page), escaping, switch, schedule, Vancouver day and catch-up, exactly-once (re-run, concurrent runs, new year), SMTP failure retry, no address, profile fallback, stuck send, Send Paystub (latest stub, re-send, not found / no stub / net pay not above $0.00 / SMTP down), net pay rule | T-PSE-01..14, 23-31, 33, 34, 36 |
| **Server total** | **486** | | |
| Client: 10 suites | 29 | Navbar, chart registry, print modal, change password, sign-in, Axios interceptor, UI components | C-NAV, C-CHART, C-PRINT, C-PWD, C-LOGIN, C-API |
| Client: `src/utils/utils.test.js` | 12 | Formatting, role helpers, pay-period helpers, completion %, dates, bank validation | C-UTIL-01..10, C-VAL-01/02 |
| **Client total** | **41** | | |

Manual checks: M-SMOKE-01/02 (real server boot with fake env and no database; curl requests; a real socket.io client with no, forged and unverifiable tokens), M-BUILD-01 (production build), M-LINT-01 (lint).

### 3.3 Results

Node 22.22, npm 10.9.

| Check | Baseline (`erp.zip`) | After pass 1 | **Final** |
|---|---|---|---|
| Server tests | 85 / 85 | 156 / 156 | **486 / 486**, 0 skipped, stable across repeated runs |
| Client tests | 29 / 29 | 41 / 41 | **41 / 41** |
| Client lint | 3 errors, 375 warnings | 0 errors, 350 warnings | **0 errors**, 350 warnings |
| Client production build | passes, 8.5 MB | passes | **passes**, 8.5 MB, `main.js` 382 kB gzip |
| Server boot smoke test | — | pass | **pass** (found SOCK-01) |

Server coverage (`npx jest --coverage`), measured over the files the tests load. Every controller is loaded through `app.js`, so this is close to whole-server coverage. The final figures were measured at 374 tests, before the duplicate-script tests were added. Client coverage wasn't measured.

| Metric | Baseline | After pass 1 | **Final** |
|---|---|---|---|
| Statements | 33.4 % | 37.1 % | **51.3 %** |
| Branches | 11.7 % | 18.6 % | **42.0 %** |
| Functions | 12.5 % | 19.7 % | **43.2 %** |
| Lines | 33.7 % | 37.3 % | **51.2 %** |

Selected files after pass 1 (lines): `services/taxService.js` 97 %, `helpers/percent.js` and `utils/time.util.js` 100 %, `middleware/authorize.js` 94 %, `middleware/auth.js` 91 %, `passwordController.js` 84 %, `appController.js` 70 %, `helpers/payrollHelper.js` 38 %.

### 3.4 Before-fix verification

Each regression test was run against the code before its fix and failed there. Tests that passed on both are deliberate no-regression guards (e.g. "own company still allowed").

| Change set | New tests failing before the fix |
|---|---|
| Pass 1 | BUG-01 (T-HRS-04), BUG-03 (T-TAX-03), BUG-04 (T-AUTH-13, T-AUTH-21), NEW-02, NEW-01, NEW-03, NEW-08, NEW-09, SEC-01, API-02, BUG-02 (C-UTIL-08). API-12, API-13, API-04 and NEW-06 were written with the fix and checked by code diff |
| A1 tenant scoping | 39 of 50 |
| A2 remaining bugs | 37 of 42 |
| B VoPay and pay calendar | 23 of 24 |
| C RBAC | 32 of 49 (T-RBAC-32 added later, see below) |
| D integrity and device auth | 14 of 17 |
| E2 leftovers | 14 of 15 |
| E payroll year | 14 of 14 |
| SUBMIT-01 / SIGNUP-01 / RBAC-REPORT-01 | 3 of 4 (T-VOPAY-21 is a retry guard) / 2 of 2 / 1 of 1 |
| Resolve-duplicates script | new code; no before state |

The earlier performance report recorded one transient failure in four runs. The cause was found during the pass-2 merges: the tenant guard deleted a rejected upload asynchronously while answering 403, so T-TEN-14 sometimes saw the file. The delete now happens before the response, and no failure has occurred since.

### 3.5 Not run, and why

| Item | Reason | Suggested next step |
|---|---|---|
| Tests against a real MongoDB (query shapes, indexes, transactions, unique constraints, the duplicate scripts) | No MongoDB in the sandbox; all server tests mock models | `mongodb-memory-server` integration tests for the pay run, time-card mapping and the dry run of `resolve-duplicates.js` on a copy of production data |
| Full pay run end to end (`addEmployeePayStubInfo`) | Needs many collaborating models; only the maths is unit-tested | Golden-file test with a fixture employee once a payroll SME confirms the expected stubs |
| Tax constants (brackets, CPP/EI rates) | Tests pin the current formulas; they don't validate them against CRA tables | SME review against CRA PDOC |
| End-to-end browser flows with real data | No running stack with seed data. Layout was checked with Chromium against the production build with mocked API responses (login, sales and payroll dashboards at three desktop sizes), not with real data | Playwright smoke flow: login → employees → timesheets → pay-run preview with seed data; manual check of data-heavy tables at 1280 px |
| VoPay, SMTP, CRA XML validation | External services and credentials | VoPay sandbox, a test SMTP inbox |

## 4. Year-to-date findings for the payroll SME

Reported, **not changed**, because each needs a payroll decision:

1. **YTD resets on period number 1, not when the pay-date year changes.** A period-1 stub paid in December would reset YTD in the middle of a tax year. Stubs are now stored by pay-date year (PAYYEAR-01); the SME should confirm whether the YTD reset should follow the pay-date year too.
2. **`YTDPrimaryDeposit` never resets.**
3. **`YTDVacationAccrued` in periods 2 and later copies the previous value and never adds the current accrual.** This looks like a bug.
4. **`appendPrevPayInfoBalance`** (used only by the unused `runBalances`) sums `YTDRegPayTotal2` from `YTDRegPayTotal`, which looks like a typo.
5. **Annual maximums:** fixed in 1.5 (CPP, CPP2 and EI stop at the annual maximums using year to date). BC is still the only province.
6. **27-pay-date years:** if a bi-weekly year has 27 pay dates, two runs with the same period number in one pay year update the newer stub.
7. **Lost history:** pay stubs overwritten by the old period-only key before PAYYEAR-01 can only be restored from a backup.

## 5. Corrections to earlier statements

* An early summary said `client/package.json` lists `axios` and `react-router-dom` twice. The second entries are under `"overrides"` (security pins), not duplicates; nothing needed changing.
* Earlier documents stated that payroll submit could transfer twice, that the sign-up response contained the password hash, and that payroll submit matched funding totals by the exact timestamp. Those were fixed by SUBMIT-01 and SIGNUP-01 and are described as fixed here.
* Earlier reports gave server-test totals of 80, 85, 156 and 374 at different stages. The current total is 379; the 5 newest tests cover `resolve-duplicates.js`.
* Client lint at baseline was 378 problems: 3 errors and 375 warnings.
