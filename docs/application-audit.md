# Application Audit — BusinessN ERP

Audit date: 2026-10-20. Scope: `server/` (Express/Mongoose API) and `client/` (React SPA) as delivered in `erp.zip`.
Companion documents: `docs/test-plan.md`, `docs/test-execution-report.md`, `CHANGES.md`.

---

## 1. Architecture summary

| Layer | Technology | Notes |
|---|---|---|
| Client | React 18, Create React App 5 (`react-scripts`), Chakra UI 2, React Router 6, Axios, Formik/Yup (partially), Socket.io client | Routing in `client/src/routes.js`; auth state in `context/AuthContext.js` + `localStorage("user")`; access token in `sessionStorage`, refresh token in `localStorage`; all HTTP via `client/src/api/index.js` (Axios instance with refresh interceptor) and `src/services/*Service.js`. Deployed on Netlify (`netlify.toml`, `_redirects`). |
| Server | Node ≥ 18, Express 4, Mongoose 8, `jwt-simple`, bcryptjs, multer, nodemailer, socket.io, node-cron, helmet, express-rate-limit, EJS (reset-password page) | Entry `server/index.js` → (new) `server/app.js`. 47 route files under `routes/`, 55 controllers under `controllers/`, shared logic in `services/` and `helpers/payrollHelper.js`. Deployed on Render/Heroku-style host (`Procfile`). |
| Database | MongoDB Atlas via Mongoose | ~90 models in `server/models/`. No migrations directory; schema is code-defined with `autoIndex`. Tenant key is the **company name string** (`companyName`) duplicated into most collections; membership is `Company.employees[]`. |
| Integrations | VoPay (payments/EFT, webhooks), Zoho SMTP (nodemailer), time & attendance devices posting to `/api/timecard`, CRA T4 XML generation (`xmlbuilder`) | VoPay credentials for 3 partner accounts are read at module load. |
| Background jobs | `jobs/statHoliday.js` (daily cron) | Adds stat-holiday timesheets per company. |
| Tests (before audit) | Server: none (`npm test` exited 1). Client: 4 CRA test files, **all failing** at baseline (see execution report). | |

### Authentication / authorization model (as found)
* `POST /api/login` → bcrypt compare → 2 h access JWT + 5 h refresh JWT (`jwt-simple`, HS256). Payload `{ id, fullName, exp }`.
* `authenticateToken` validates signature + expiry and sets `req.user`.
* **No controller read `req.user`.** Authorization (role and tenant) existed only in the React UI (`constant.js` role tables, `permissions` collection).

### Critical workflows traced
1. **Login → dashboard**: `SignInForm.jsx` → `POST /login` → tokens stored → `storeUser` → router guards by `localStorage("user")`.
2. **Password reset**: `ForgotPassword.jsx` → `POST /forgot-password` → email with `/api/reset-password/:id/:token` → EJS page → `POST /reset-password/:id/:token`.
3. **Change password** (logged in): `ChangePassword.jsx` → `PUT /change-password/:id`.
4. **Employee onboarding / profile**: `onboard-user/*` → `POST /payroll/profileInfo/onboard`, `/employmentInfo`, `/payInfo`, `/bankingInfo` (AES-256-CBC for SIN/bank fields).
5. **Timesheets → payroll run**: devices/`/api/timecard` → `Timecard`/`Timesheet` → `process-payroll/*` UI → `POST /payroll/process` (`payStubController.addEmployeePayStubInfo`) → `EmployeePayStub`, `FundingTotalsPay`, T4 XML → reports/pay stubs → VoPay funding.
6. **Support ticket (public)**: `features/support` → `POST /ticket/support` (+ email).
7. **Sales CRM**: leads/opportunities/contacts/activities under `/api/leads`, `/api/contacts`, etc.
8. **Project management**: `/api/projects` (deeply nested task/subtask updates).

### Missing information (not invented)
* Intended RBAC matrix per endpoint (which of Super/Shadow/Auth Admin/Admin/Manager/Employee/Enroller may call what).
* Device authentication scheme for `/api/timecard` (currently fully public).
* Whether BusinessN staff ("Shadow Admin") should see companies they are *not* listed in `Company.employees` for (the login code says no, so the audit assumes membership is authoritative).
* Semantics of `Employee.companyId` vs `Company.employees` (both exist; `updateUser` rewrites the former from the request).

---

## 2. Findings (severity-ranked)

Status legend: **Fixed** = changed in this audit and covered by a test; **Partial** = narrowed, residual risk documented; **Open** = not changed (needs product decision or larger refactor).

| ID | Area | Finding (actual vs expected) | Reproduction | Sev | Fix / decision | Regression risk | Status |
|---|---|---|---|---|---|---|---|
| AUD-001 | Auth | `GET/POST /api/reset-password/:id/:token` never verified `:token`; any user's password could be set knowing only their ObjectId. Expected: signed, time-limited token bound to the id. (`passwordController.resetPassword/setNewPassword`) | `POST /api/reset-password/<id>/anything {password:"..."}` → 200, password changed | **P0** | Verify token signature+expiry and `_id === :id` on both GET and POST (`tokenService.verifyResetPasswordToken`). | Links older than 15 min now fail (they were always meant to). | Fixed (T-RST-01…05) |
| AUD-002 | Auth | `PUT /api/change-password/:id` unauthenticated; the protective line was commented out. Current password never checked. (`appRoutes.js`, `passwordController.changePassword`) | `curl -X PUT /api/change-password/<id> -d '{"newPassword":"12345678"}'` → 200 | **P0** | `authenticateToken` + `requireSelf("id")`; verify `currentPassword`, length 8–128, confirmation, not-same. | Client must send `currentPassword` (it already does). | Fixed (T-PWD-01…07) |
| AUD-003 | AuthZ | No server-side tenant check anywhere: any logged-in user could read/mutate any company by changing `companyName` in URL/body (`/api/user/all/:companyName`, `/api/payroll/process`, ~100 routes). | Login as company A, `GET /api/user/all/<CompanyB>` → 200 with B's employees | **P0** | `middleware/authorize.js`: body/query checked app-wide; route params via `router.param` guards applied to every protected router. Membership = `Company.employees ∋ user` (same rule as login), cached 60 s. | Users who switch to a company they are not a member of will now get 403 (previously silently worked). Routes with no company identifier remain unscoped. | Fixed (T-TEN-01…07) |
| AUD-004 | AuthZ | `PUT /api/user/:userId` `$set`s the whole body → any user could overwrite another user's `password` hash. (`userController.updateUser`) | `PUT /api/user/<victim> {"password":"<bcrypt hash>"}` | **P0** | Strip `password, otp, _id, createdOn, updatedOn`; validate ObjectId; guard `companyId?.name`. | None expected (email intentionally still editable). | Fixed (T-USR-01/02) |
| AUD-005 | Abuse | `/api/login`, `/forgot-password`, `/reset-password`, `/refresh-token` were excluded from every limiter → unlimited brute force / reset-mail flooding. | Loop 1000 logins → all 401, never 429 | P1 | Strict `authLimiter` 20 req / 15 min / IP on those paths. | Shared office IPs may hit the cap; tune `max` if needed. | Fixed (T-RL-01/02) |
| AUD-006 | AuthZ | `PUT /api/ticket/:id` unauthenticated (fix commented out). | `curl -X PUT /api/ticket/<id>` → 200 | P1 | Require `authenticateToken`. | None. | Fixed (T-TKT-01) |
| AUD-007 | Integration | VoPay webhook mounted after `authenticateToken` → VoPay always received 401; signature compared with `!==`. | `POST /api/vopay-webhook` → 401 "Access token is required" | P1 | Mount before auth; `crypto.timingSafeEqual`; reject missing header. | None. Note signature is still a static daily value (VoPay design), not an HMAC of the body. | Fixed (T-WH-01/02) |
| AUD-008 | Files | Uploaded `originalname` used verbatim as disk name and in `path.join` for downloads → path traversal / overwrite; no size limit. (`services/fileService.js`) | Upload with filename `../../index.js` | P1 | `sanitizeFilename` (basename + char allow-list), 10 MB limit, `filePath` traversal guard. | Files with exotic characters are renamed on upload. | Fixed (T-FILE-01…03, T-RES-03) |
| AUD-009 | AuthZ/Bug | `GET /api/resource/download/:filename` and `/api/ticket/download/:filename` public; `Model.find()` array null-check never fires → TypeError 500 for unknown files. | `GET /api/resource/download/x.pdf` (no token) → 500 | P1 | Require auth; `findOne` + 404; safe cleanup. | None. | Fixed (T-RES-01/02, T-TKT-02/03) |
| AUD-010 | Integration | VoPay `SIGNATURE = sha1(key+secret+YYYY-MM-DD)` computed once at boot → all VoPay calls fail after midnight until restart. (`vopayController.js`) | Start server, wait past midnight, call any `/api/vopay/*` | P1 | Lazy getter `SIGNATURE_HOLDER.value` recomputed per call. | None. | Fixed (manual verification only — needs VoPay sandbox) |
| AUD-011 | API | `getPayGroup/addPayGroup/updatePayGroup` are empty functions → request hangs until client timeout. | `GET /api/payroll/payGroups/Acme/1` | P2 | Return `501 NOT_IMPLEMENTED`. | None (endpoints were unusable). | Fixed (T-PAY-01) |
| AUD-012 | API | `PUT /api/user/assignLeads` declared after `PUT /:userId` → shadowed; lead assignment hit `updateUser` with `userId="assignLeads"`. | Lead disbursement screen → request lands in wrong handler | P2 | Reorder routes. | None. | Fixed (T-USR-03) |
| AUD-013 | AuthZ | All `/api/timecard/*` routes unauthenticated (device posts + reads of all employees' time cards for a company). | `GET /api/timecard/<company>/filter=...` without token → 200 | P2 | **Open** — needs a device auth scheme (API key / HMAC). Left public to avoid breaking devices; documented. | — | Open |
| AUD-014 | Data | `EmployeeProfileInfo.affiliateCode: unique` without `sparse` → second profile without a code fails with E11000 duplicate `null`. | Create two employees via onboarding | P2 | Schema → `sparse: true`. **Migration required**: `db.employeeprofileinfos.dropIndex("affiliateCode_1")` then restart (Mongoose recreates sparse index). | If the old index is not dropped, Mongoose logs an index conflict at startup; behaviour unchanged. | Partial (schema fixed; migration manual) |
| AUD-015 | Payroll | `POST /api/payroll/process`: no validation (TypeError 500 on bad body), no transaction, `findPayStub`→`create` race → concurrent double submit creates duplicate pay stubs / funding totals; partial failure leaves a half-written run; T4 generation fire-and-forget. | Double-click "Process" | P2 | Validation added (400). Idempotency/transaction **Open**: recommend a unique index on `(companyName, payPeriodNum, empId, isExtraRun, scheduleFrequency)` + a "run in progress" lock document, inside a Mongo session. | Needs business confirmation on uniqueness key. | Partial (T-PAY-02) |
| AUD-016 | API | Public `POST /api/ticket/support` destructures nested body → 500 on malformed input; user strings interpolated into HTML email. | `POST /api/ticket/support {}` → 500 | P2 | Validate shape, email format, lengths → 400. HTML escaping of email body **Open** (email template refactor). | None. | Partial (T-SUP-01) |
| AUD-017 | Client | Axios interceptor treats *every* 403 as "token expired" → authorization 403s triggered a refresh + silent retry; login form `trim()`ed the password. | Server 403 for forbidden company → spurious refresh | P2 | `shouldAttemptRefresh` uses `code` (`TOKEN_INVALID`/`TOKEN_MISSING`); password no longer trimmed; double-submit guard; network-error message. | None (no-code 403 still refreshes for old servers). | Fixed (C-API-01…06) |
| AUD-018 | Client | `ChangePassword.jsx` submitted without checking match/length, ignored double clicks, read `data.result` which the API never returns, showed no success state. | Submit empty form → API call → generic error | P2 | Client-side validation, submitting state, success alert, server message surfaced. | None. | Fixed (C-PWD-01…05) |
| AUD-019 | Data | `updateUser` sets `Employee.companyId = []` on an unassign-only request (wipes other memberships in that denormalised field). | Unassign one company from a user with two | P3 | **Open** — preserved existing behaviour; clarify whether `companyId` should merge. | — | Open |
| AUD-020 | Build | `helpers/apiFetch.js` used ESM `export` and `nanoid@5` is ESM-only, inside a CommonJS server → `require()` fails on Node 18/20 (allowed by `engines`) and under Jest. | `node index.js` on Node 20 | P2 | Converted to CommonJS; replaced `nanoid` with a `crypto`-based equivalent; dependency removed. | None. | Fixed (suite loads) |
| AUD-021 | Build | Client did not compile from the committed lockfile: `chart.js` (peer of `react-chartjs-2`) missing from `dependencies`; `SiMicrosoftexcel` removed in `react-icons@5.7.0`. | `npm ci && npm run build` → "Module not found" / "not exported" | P2 | Added `chart.js@^4`; swapped icon for `FaFileExcel`. | Icon looks different. | Fixed (build passes) |
| AUD-022 | Client tests | Baseline test suites all failed: Chakra 2.10 subpath exports unresolved by Jest 27, `toBeInTheDocument` without `setupTests.js`, broken relative import. | `npm test` | P3 | `jest.moduleNameMapper`, `src/setupTests.js`, import path fixed. | None. | Fixed |
| AUD-023 | Reliability | `mongoose.connect()` promise unhandled → unreachable DB crashes the process with an unhandled rejection (Node ≥ 15). | Start with bad URI | P2 | `.catch` + `db.on("error")` logging. | None. | Fixed (manual) |
| AUD-024 | Security | Error handler returned `err.message` for 500s; many controllers return `{ error }` objects (Mongo errors leak field names). | Any 500 | P3 | Generic message for ≥500 in the central handler. Per-controller `{ error }` payloads **Open** (~60 sites). | None. | Partial |
| AUD-025 | Secrets | `server/.env`, `.env.local`, client `.env*` with live DB URIs, JWT secrets, SMTP and VoPay keys are inside the delivered zip (and `.gitignore` lists only `.env`). Hard-coded staff e-mails in `permissions.constants.js`. | Inspect archive | **P0 (process)** | Rotate every credential in those files; remove from distributed artifacts; load from the host's secret store. | — | Open (operational) |
| AUD-026 | API | `GET /api/timecard/:companyName/:filter` ignores `limit` (commented out) and `endDate` (uses "now"); unbounded response. | Large company, 30-day filter | P3 | **Open** — intent unclear; documented. | — | Open |
| AUD-027 | API | `GET /api/company` returns every company including `employees[]` ObjectIds to any authenticated user. | — | P3 | Open — restrict to Super/Shadow Admin once RBAC exists. | — | Open |
| AUD-028 | AuthZ | No role-based checks server-side (admin-only screens such as permissions, payroll run, VoPay transfers rely on UI hiding). | Employee role calls `POST /api/vopay/transfer-withdraw` | P1 | **Open** — requires the RBAC matrix (missing info). Suggested: `requireRole([...])` middleware driven by `EmployeeEmploymentInfo.employmentRole` for the calling user in `req.userCompanies`. | — | Open |
| AUD-029 | Session | Refresh tokens cannot be revoked (stateless, 5 h); logout only closes an activity record. | Logout, reuse old refresh token → new access token | P2 | Open — persistent denylist / rotation. | — | Open |
| AUD-030 | Signup | `POST /api/signup` is public and attaches the new user to any company by name. | — | P1 | Open — confirm whether self-signup is intended; otherwise require an admin token or invitation. | — | Open |

### Confirmed vs potential
* **Confirmed by execution/tests**: AUD-001–009, 011, 012, 015 (validation part), 016, 017, 018, 020, 021, 022, 023.
* **Confirmed by static analysis only**: AUD-010 (needs VoPay sandbox), 013, 014, 019, 024–030.

---

## 3. Root causes and remediation decisions
* **Fixes left commented out** (AUD-002, 006): a previous hardening pass annotated the problems but shipped the insecure line. Decision: enable and add regression tests so this cannot recur silently.
* **Tenant key is a free-text string in the URL** with no central guard. Decision: central guard rather than editing ~100 handlers; membership rule reused from login so behaviour is consistent. Role checks deliberately *not* invented.
* **No test harness** made the above invisible. Decision: Jest + Supertest with model mocks (MongoDB unavailable in CI sandbox), `app.js` extracted so the app is importable without listening/connecting.
* **Module system drift** (ESM in CJS) only worked because production runs Node 22.12+. Decision: make the code valid on the declared `engines` range.

---

## 4. Independent QA review of the first pass (REV-xxx)

A second pass reviewed the fixes and tests above as if written by someone else. Findings, each with its failure mode, repro and the regression test now covering it:

| ID | Potential failure | Reproduction (preconditions → input) | Expected | Status / test |
|---|---|---|---|---|
| REV-001 | **Global lockout behind the reverse proxy.** The new `authLimiter` keyed on `req.ip`; on Render/Netlify every request carries the proxy's IP, so 20 failed logins company-wide in 15 min would 429 *everyone*. Conversely enabling `trust proxy` unconditionally lets a client spoof `X-Forwarded-For` to escape the limit. | Deploy behind proxy; 21 bad logins from 21 different users | each user has their own bucket; attacker cannot spoof | Fixed: `TRUST_PROXY` env (opt-in, numeric hop count or `true`), limiter key = `ip|email` (lower-cased, trimmed). **T-RL-03/04/05** |
| REV-002 | **Tenant guard missing on the ticket and resource routers.** `applyCompanyParamGuards` was only applied to routers mounted after `authenticateToken`; `/api/resource/type/:fileType/:companyName` and `/api/ticket/{count,open,closed,filter}/:id/:companyName` (per-route auth) stayed cross-tenant readable. Also a `router.param` guard would run *before* route-level `authenticateToken`, i.e. without `req.user`. | U1 → `GET /api/resource/type/pdf/Globex` | 403 | Fixed: both routers use `router.use(authenticateToken)` before protected routes + param guards; public `/support`, `/leads` declared first. **T-TEN-12/13** |
| REV-003 | **Reset link reusable** within its 15-min window (also after a successful reset or an unrelated password change). | reset once, POST the same link again | 400 | Fixed: token signed with `ACCESS_TOKEN_SECRET + current password hash` → any password change invalidates outstanding links, statelessly. `sendMailCreds` updated. **T-RESET-01/04/05, T-RST-06** |
| REV-004 | **Multipart uploads bypass the body company check** (body parsed by multer *inside* the route) and the upload used key `company`, not `companyName`. A denied upload also left the file on disk. | U1 multipart `company=Globex` to `/api/resource/upload` | 403, no file in `uploads/` | Fixed: `authorizeMultipartCompany` after multer, deletes `req.file` on 403; `company` added to body keys. **T-TEN-14** |
| REV-005 | **IDOR on `PUT /api/company/:id`** (and generally on `:id`-only routes): no company name → unscoped. | U1 → `PUT /api/company/<GlobexId>` | 403; `findByIdAndUpdate` not called | Fixed for companies: `requireCompanyIdMembership`. Other `:id` routes (projects, tasks, tickets, notes…) **remain open** (AUD-033). **T-TEN-15/16** |
| REV-006 | **Upload temp files never deleted** (bytes are stored in Mongo) → disk growth; `req.file` undefined → TypeError 500. | upload without file / many uploads | 400; temp file removed | Fixed. **T-FILE-07** |
| REV-007 | **Concurrent downloads of the same file race**: both wrote to the same temp path and the first `unlink` truncated the second stream. | two parallel `GET /download/report.pdf` | both 200 with full body | Fixed: unique temp name, original name in `Content-Disposition`. **T-RES-04** |
| REV-008 | **Multer limit errors returned 500**: `MulterError` carries no `status`, so my error handler masked an over-size upload as "Internal Server Error". | 10 MB + 1 byte upload | 413 | Fixed in `errorHandler`. **T-ERR-03, T-FILE-04** |
| REV-009 | **Concurrent duplicate pay run** (double-click/retry) created duplicate stubs — previously only documented. | two parallel `POST /payroll/process` same period | one 200, one 409 `PAYRUN_IN_PROGRESS`; lock released afterwards; other period unaffected | Fixed in-process (single instance). Multi-instance lock + Mongo transaction still **open** (AUD-015). **T-PAY-05** |
| REV-010 | **Double-submit guards relied on React state**, which is only safe because React 18 flushes discrete events synchronously; a ref is the robust guard. | two `submit` events in one tick | one request | Fixed (`submittingRef`) in `SignInForm` and `ChangePassword`. **C-LOGIN-06, C-PWD-04** |
| REV-011 | **Weak assertions that would pass on a real defect**: `T-TEN-07` asserted `≠403` (a 500 passed), `T-USR-03` asserted `≠400`. | — | assert concrete status + side effects | Fixed: T-TEN-07 → 200 + model called; T-USR-03 → 200 + exact `assignedLeads` distribution (1:3 of 4 leads). |
| REV-012 | **Membership cache unbounded** (one entry per user, never evicted) → slow memory growth on long-running processes. | — | bounded | Fixed: max 5 000 entries, FIFO eviction. |
| REV-013 | **Payroll 500 leaked the raw `error` object** (Mongo error with field names). | — | `{message}` only | Fixed. |
| REV-014 | **Stale frontend state after a 403**: the header's company switcher persists the selected company in `localStorage`; if the membership is revoked the UI keeps calling with that company and now gets 403 everywhere, showing per-screen errors instead of resetting the selection. | revoke membership; reload app | app falls back to the first allowed company and tells the user | **Open** (UI change) — manual procedure **C-SESS-03/C-STALE-01**. |
| REV-015 | **Deleted/deactivated user keeps a valid access token for up to 2 h**; refresh for 5 h. Company routes now 403 (no membership), but company-less routes still work. | delete user; reuse token | 401 | **Open** (AUD-029). |
| REV-016 | **User with no password yet** (invited, never set) cannot use change-password (401 "Current password is incorrect") and must use the reset flow. | — | explicit message | **Open**, acceptable; documented. |
| REV-017 | **`PUT /api/user/:userId` still has no self/admin check**: any authenticated user can edit another user's profile fields (name, phone, leads, `isActive`) within the same company, and across companies when the body carries no company name. | U1 → `PUT /api/user/U2 {firstName:"x"}` | 403 unless admin/self | **Open** — depends on RBAC (AUD-028). Password overwrite is blocked (AUD-004). |
| REV-018 | **Test determinism**: `jest.resetModules` + `doMock` in the concurrency test leaked into sibling suites. | — | suites independent | Fixed: isolated in `tests/api.payrun.concurrency.test.js`; partial mocks via `requireActual`. |

### Additional open items surfaced by the review
| ID | Finding | Sev |
|---|---|---|
| AUD-032 | `resourceRoutes`: `GET /:companyName` is unreachable (shadowed by `GET /:fileType`). Pre-existing. | P3 |
| AUD-033 | Object-level authorization on `:id`-only routes (projects, tasks, tickets, notes, leaves, payouts, etc.): the owning document's `companyName` is never compared to the caller's memberships. Requires per-controller lookups or a generic `loadAndCheck(Model)` middleware. | P1 |
| AUD-034 | Rate-limit stores are in-memory: limits are per instance and reset on deploy. Use a shared store (Redis) when running >1 instance. | P3 |
