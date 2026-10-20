# Performance Optimization & Safe Refactoring — BusinessN ERP

Date: 2026-10-20. Scope: `server/` (Express 4 / Mongoose 8) and `client/` (React 18 / CRA 5 / Chakra UI 2), plus mobile responsiveness.
Companion: `docs/application-audit.md` (earlier security pass — all its tests still pass).

Environment: Linux sandbox, Node v22.22.2, npm 10.9.7. **MongoDB was not available**, so every database finding is code-level; no `explain()` output exists. Nothing below claims a measured query speed-up.

---

## 1. Architecture audit

| Layer | What exists | Assessment |
|---|---|---|
| Client | 621 JS/JSX files; `routes.js` already `lazy()`-splits every authenticated module; data via 45 `hooks/use*.js` → 33 `services/*Service.js` → one Axios instance (`api/index.js`). State: `localStorage`/`sessionStorage` + two small contexts. | Structure is reasonable for its size; no reorganisation is justified. Problems were assets, the mobile shell, and a few eager imports. |
| Server | `index.js` (bootstrap) → `app.js` (middleware + 47 routers) → 56 controllers → 10 services → 92 models. Tenant key = company **name string** on ~59 models. | Layering is fine. Problems were indexing, N+1 loops, and one guard that over-matched route params. |
| Tests | Server 80 (Jest + Supertest, models mocked), client 23 (CRA/Jest). | Kept; **+5 server, +2 client** added. |

## 2. Performance report

Severity: P0 correctness/stability · P1 high-impact · P2 medium · P3 maintainability. "Verified" = reproduced in this sandbox; "Code-level" = evident from the code but not measured.

| ID | Sev | Evidence | Status |
|---|---|---|---|
| F-01 Build fails on clean install (`chart.js` peer missing) | P0 | Verified: `npm ci && npm run build` → "Can't resolve 'chart.js/auto'" | **Fixed** — `chart.js@^3.9.1` (the exact peer range of `react-chartjs-2@3`) |
| F-14 Tenant guard treats every `:name` route param as a company → 5 schedule endpoints answered **403** for any crew name | **P0** | Verified by test (T-EMP-03 initially failed with 403) | **Fixed** — `name` removed from the app-wide key list; `GET /api/company/:name` guarded explicitly (`requireCompanyNameParam`). Tests T-TEN-18/19 |
| F-02 No navigation on phones (`Navbar` never rendered the drawer trigger; `Home` redirected every menu change to the employee dashboard) | P0 (mobile) | Verified by reading `header/index.jsx`, `Home.jsx`; C-NAV-01/02 | **Fixed** — hamburger → drawer with module switcher + sub-menu + quick links; first-load-only employee-dashboard landing |
| F-03 54 MB of hero JPEGs on the public `/support` page, 6 MB autoplay video, 4168² px badge thumbnails | P1 | Verified: build `static/media` 60 MB | **Fixed** — resized/re-encoded in place, same filenames (build 68 MB → **8.5 MB**) |
| F-04 7 index declarations in 92 models; `companyName` filter in 88 queries unindexed; membership check on every request unindexed | P1 | Code-level (grep + model review) | **Fixed** — 11 compound indexes on 7 hot models (see §6). Not measured. |
| F-05 N+1: one `findOne` per employee in employee listings and crew shifts | P1 | Code-level; tests prove 1 query now | **Fixed** — single `$in` query + `Map`; first-document-per-employee semantics preserved. T-EMP-01..03 |
| F-06 Timesheet pagination fake on both sides; whole date range fetched then filtered in JS | P1 | Verified in code (`skip/limit` and `<Pagination>` commented out) | **Open** — product decision: filters by employee/department must move into the Mongo query before DB-level pagination is correct |
| F-07 50 of 76 `<Table>`s without a scroll wrapper | P2 | Verified by grep | **Fixed** — one phone-only CSS rule makes every `.chakra-table` scroll horizontally |
| F-08 Public pages eager in `main.js` | P2 | Verified: `main.js` 395.95 kB gz | **Fixed** — `Support`, `AffiliateSignup`, `CustomerInfo` lazy; `main.js` **381.8 kB gz (−14 kB)**. Remaining weight is Chakra/emotion/router/moment, shared by every page. |
| F-09 Dead duplicate body parsers (`rawBody` never set, never read) | P2 | Verified (`req._body` short-circuit; grep) | **Fixed** — removed; the 50 MB `express.json` limit is unchanged |
| F-10 `mapTimesheet` looks up pay info by string while the `Map` is keyed by ObjectId → enrichment likely never matches | P2 potential | Code-level; needs data to confirm | **Open** — fixing it would change displayed pay rates; confirm against a real collection first |
| F-11 `getCompanyUsers` spread overwrites `empId: {$exists}` | P3 potential | Harmless today | Open (note) |
| F-12 Dead `* copy.jsx` files, `scheduling/not-used/` | P3 | 0 importers (grep) | **Fixed** — 13 files removed |
| F-13 `useTimesheet` refetch on array identity change | P3 | Code-level | **Fixed** — value-based dependency key |

### Not changed (recommendations)
* Unused dependencies `bootstrap`, `react-with-gesture` (0 imports) can be removed; `react-chartjs-2@3` is at its last 3.x and pairs with `chart.js@3` — upgrade both together later.
* Real pagination for timesheets (F-06): add `employeeId:{$in}` / `positions.employmentDepartment` to the query, then enable `skip/limit` + the client `<Pagination>`.
* Timecard/`/api/timecard` device auth, RBAC, token revocation: still open from the previous audit.
* Request logger prints every request with user-agent to stdout; switch to a sampled/structured logger (e.g. `pino`) in production.

## 3. Refactoring summary (files changed)

**Server**
* `models/{Timesheet,EmployeeEmploymentInfo,EmployeePayInfo,EmployeeProfileInfo,Company,UserActivity,Timecard}.js` — `schema.index(...)` only; no field changes.
* `services/userService.js` — new `findEmploymentInfoByEmpIds()`.
* `controllers/userController.js` — `getCompanyEmployees`, `getAllCompanyUsers` use the batched lookup.
* `controllers/scheduleController.js` — `getWorkWeekEmpShifts` batches `EmployeePayInfo`.
* `middleware/authorize.js` — `COMPANY_PARAM_KEYS` no longer includes `name`; new `requireCompanyNameParam`.
* `routes/companyRoutes.js` — explicit guard on `GET /:name`.
* `app.js` — dead `bodyParser` pair removed.
* `tests/api.employees.batch.test.js` — new (5 tests).

**Client**
* `components/header/index.jsx` — hamburger on phones; compact header.
* `components/sidebar/MobileSidebar.jsx` — module switcher + quick links.
* `components/sidebar/index.jsx`, `components/Home.jsx` — wiring; first-load-only mobile landing.
* `layouts/PageLayout.jsx` — detects the phone viewport itself (52 of 56 pages never passed `isMobile`).
* `App.css` — phone header offset, table horizontal scroll, touch-size controls.
* `routes.js` — public routes lazy + `withSuspense`.
* `hooks/useTimesheet.js` — stable dependency key.
* `components/header/Navbar.test.jsx` — new (2 tests).
* Assets: `assets/affiliate/{1..4}.jpg`, `assets/badge{1,2,3}.jpg`, `assets/logos/BusinessN_dark.jpg`, `assets/support_bg.mp4` re-encoded in place.
* Removed: 7 `* copy.*` files and `erp-modules/scheduling/not-used/` (6 files).

## 4. Before / after

| Metric | Before | After |
|---|---|---|
| Client production build | **fails** (missing peer) | passes |
| `build/` size | 68 MB | **8.5 MB** |
| `build/static/media` | ~60 MB (largest file 26.7 MB) | 1.9 MB (largest 0.8 MB) |
| `main.js` gzip | 395.95 kB | 381.82 kB |
| `src/assets/` | 70 MB | 8.6 MB |
| Employee list endpoints: Mongo round-trips for N employees | 2 + N | 2 |
| Crew week view: round-trips for N crew members | 1 + N + 1 | 3 |
| Server tests | 80 pass | 85 pass |
| Client tests | 23 pass | 29 pass |
| Phone navigation | none | drawer with modules, sub-menu, quick links |

Not measured (no DB / browser profiler here): query latency with the new indexes, React render counts, Lighthouse scores.

## 5. Testing report

```
# server
npm test        → Test Suites: 5 passed; Tests: 85 passed   (run 4×; one early run showed 1 transient
                                                              failure that did not reproduce in 3 reruns — suspected
                                                              rate-limit window overlap between suites; not suppressed)
node --check controllers/userController.js services/userService.js controllers/scheduleController.js
# client
CI=true npx react-scripts test --watchAll=false → Test Suites: 8 passed; Tests: 25 passed
npx eslint --ext .js,.jsx <changed files>        → 0 errors; 2 pre-existing warnings (Home.jsx exhaustive-deps, routes.js unused SignUp)
GENERATE_SOURCEMAP=false npx react-scripts build → Compiled with warnings (pre-existing lint warnings in untouched files)
```
Untested here: anything needing MongoDB, SMTP, VoPay or a browser (visual check of the drawer, table scrolling on a real phone).

## 6. Compatibility report

* **API**: no endpoint, method, request/response shape or status code changed. The five schedule `:name` endpoints now return 200 where they returned 403 (bug fix).
* **Schema**: no field changes; indexes only. Mongoose builds them in the background on first start (`autoIndex` default). Index list: Timesheet `{companyName,deleted,clockIn}`, `{companyName,employeeId,clockIn}`; EmployeeEmploymentInfo `{companyName,empId}`, `{companyName,payrollStatus,employmentRole}`; EmployeePayInfo `{companyName,empId}`; EmployeeProfileInfo `{companyName,empId}`; Company `{employees}`, `{registration_number}`; UserActivity `{userID,logoutTime}`, `{loginTime}`; Timecard `{companyName,badge_id,clockIn:-1}`. Write overhead: one extra index entry per Timesheet/Timecard insert.
* **Dependencies**: `react-chartjs-2` ^3.0.4 → ^5.3.1 and `chart.js` ^4.5.1 added (its declared peer), per follow-up request. Nothing else added, removed or upgraded.
* **Config / env**: unchanged. The `.env*` files with live credentials from the original archive are still in the project — rotate them (previous audit, AUD-025).
* **Assets**: same import paths; `affiliate/*.jpg` now ≤1200 px, badges 512 px, video 720×1280 at CRF 27.

## 6a. Chart library upgrade (follow-up request)

`react-chartjs-2 ^3.0.4` → **^5.3.1**, `chart.js ^3.9.1` → **^4.5.1** (both released >12 months before this work).

* v4+ of react-chartjs-2 no longer imports `chart.js/auto`, so nothing is registered implicitly. New module `client/src/components/ui/charts/index.js` registers exactly the parts the dashboards use (category/linear scales, bar/line/point/arc elements, Filler, Title, Tooltip, Legend) and re-exports `Bar`, `Line`, `Doughnut`. All 12 chart sites import from it instead of `react-chartjs-2`.
* chart.js v4 removed `scales[id].grid.drawBorder` and moved `grid.borderDash`; the four charts using them (`ProjectOverview`, `StaffOverview`, `sales/reports`, `SalesChart`) now use `scales[id].border: { display: false, dash: [3, 3] }` — same rendering as before. All other options (`beginAtZero`, `indexAxis`, `cutout`, `plugins.legend/tooltip`) are unchanged between v3 and v4.
* `sales/reports/index.jsx` set a top-level `legend: { display: false }` outside `plugins`, ignored by chart.js since v3, so the legend was always shown. Moved under `plugins.legend` at the user's request — the Calls report bar chart now hides its legend (intended behaviour, visible change).
* Test `components/ui/charts/charts.test.jsx` (C-CHART-01/02) asserts the registry contents. jsdom has no canvas, so a render alone cannot catch a missing registration — the registry assertion is the guard.
* Results: client tests 27/27, build passes, `main.js` 381.83 kB gz (unchanged; charts live in lazy chunks).

## 6b. Payroll dashboard responsiveness (follow-up request)

Screenshot review showed the "Payment Date" card clipped, the "Manage Payroll" button overlapping the pay-period dates, carousel chevrons drawn over the slide, and large dead margins. Causes and fixes (`erp-modules/payroll/dashboard/**`):

| Cause | Fix |
|---|---|
| `PageLayout p="1rem 7rem"` fixed gutters | `{ base: "0.5rem", md: "1rem 1.5rem", "2xl": "1rem 7rem" }` |
| Grid `templateColumns="70% 28%"` could not shrink | `minmax(0, 1fr) minmax(300px, 28%)` |
| Left pane: `HStack` with a hard `w="50%"` payroll column | `Stack direction={{ base: "column", xl: "row" }}`; payroll column first when stacked |
| Three stat cards in a non-wrapping `HStack` | `SimpleGrid columns={{ base: 1, sm: 3 }}`, `minW={0}`, wrapping labels |
| Chevrons absolutely positioned over the slide | Chevrons are flex siblings flanking the slide (never overlap); `aria-label`s added |
| `PayPeriodDetailCard` row never wrapped; button `w=120px` | `flexWrap="wrap"`, button `w="auto" minW="120px"` |
| Carousel `height="260px"`, card `h="380px"` + `overflowY="hidden"` clipped wrapped content | `minH` + `overflowY="auto"` |
| Announcements panel `calc(95vh - 145px)` pushed payroll cards off-screen when stacked | `{ base: "45vh", xl: … }`, items `w={{ base: "100%", md: "70%" }}` |

Verified: lint 0 errors, client tests 27/27, build passes. Visual check in a browser is still recommended (no browser in this sandbox).

## 6c. Print buttons (follow-up bug report)

Symptom: clicking the print icon logged `"react-to-print" did not receive a contentRef option` / `There is nothing to print` (`ModalLayout.jsx:78`).
Cause: `react-to-print` is installed at 3.3.0 but all four call sites used the v2 API (`content: () => ref.current`, `onBeforeGetContent`), which v3 ignores.
Fix: `contentRef: componentRef` and `documentTitle: <filename>` in `components/ui/modal/ModalLayout.jsx`, `payroll/roe/review/ReviewInfo.jsx`, `payroll/reports/EmpPayStatement.jsx`, `payroll/ROEFromXML.jsx`. `documentTitle` also replaces the old side effect of overwriting `document.title` for the whole app (it was never restored). The existing 1 s `setTimeout` before printing is untouched. Second report ("print option not working") after the API migration found two more defects in `ModalLayout.jsx` and `reports/EmpPayStatement.jsx`:
* `handleClick` toggled `isPrintDisabled` and nothing toggled it back, so the icon **disabled itself permanently after the first click** (cancelling the dialog once killed printing). Replaced with an `isPrinting` flag (spinner while in flight) cleared by `onAfterPrint` / `onPrintError`.
* The printed node (`ModalBody` / `DrawerBody`) carries `height: 100vh` and a scroll box; react-to-print clones it with those styles, clipping the printout to one screen. The node now has class `print-root` and `pageStyle` resets its height/overflow for print.
Regression tests `ModalLayout.print.test.jsx` (C-PRINT-01/02; both fail against the previous code). Client tests 29/29, build passes.

## 7. Run instructions

```bash
# Server
cd server
npm install
# .env (production) or .env.local (NODE_ENV=development) — see docs/application-audit.md for the key list
npm run devStart          # nodemon
npm start                 # node index.js
npm test                  # jest --runInBand

# Client
cd client
npm install --legacy-peer-deps
npm start                 # uses .env
npm run build             # uses .env.production (create it from .env / .env.staging)
CI=true npm test -- --watchAll=false
```
