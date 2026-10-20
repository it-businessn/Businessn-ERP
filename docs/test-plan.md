# Test Plan — BusinessN ERP

Conventions used in every case below:
* **Env**: Server `cd server && npm test` (Jest + Supertest, Mongoose models mocked, fake env from `tests/setupEnv.js`). Client `cd client && CI=true npm test`. Manual cases assume a staging stack with MongoDB, SMTP sandbox and VoPay sandbox.
* **Fixtures**: user **U1** (`64a0…0001`) is a member of company **Acme** only; **U2** (`64a0…0002`) is a member of **Globex**. `auth(U1)` = valid 2 h access token for U1. Unless stated otherwise the DB state after a *negative* test must be unchanged (no write calls).
* **Priority**: P0 run on every commit; P1 before every release; P2/P3 weekly/regression.
* **Automation**: `Auto` = implemented and passing (ID in `tests/`), `Manual` = steps given, `Planned` = automatable once a Mongo test instance is available (see execution report → blockers).

## 1. Authentication

| Test ID | Scenario | Objective | Preconditions | Test data | Steps / input | Expected UI | Expected API | Expected DB/system | Pass criteria | Type | Auto | Pri | Trace |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| T-LOGIN-01 | Login missing field | Required-field validation | — | `{email}` only | `POST /api/login` | Form marks fields required | 400 `{message}` | none | 400 | int | Auto | P1 | login |
| T-LOGIN-02 | Unknown e-mail | No user enumeration | no user `a@b.c` | valid-shaped body | `POST /api/login` | "Invalid credentials. Please reset your password!" | 401, same message as wrong password | none | identical message for unknown user / wrong pwd / wrong company | int | Auto | P1 | login |
| T-LOGIN-03 | Wrong company id | Company binding | U1 exists, not in Globex | `companyId` of Globex | `POST /api/login` | same error | 401 | `UserActivity` unchanged | 401 | int | Planned | P1 | login |
| T-LOGIN-04 | Happy path | Tokens issued | U1 with bcrypt pwd | correct creds | `POST /api/login` | redirect to `/` | 200 `{accessToken, refreshToken, user, existingCompanyUser}`; access `exp` ≈ now+2h | `UserActivity` row with `loginTime`, previous open sessions closed | all fields present, password never returned | int | Planned | P0 | login |
| C-LOGIN-05 | Password with spaces | Client must not trim password; ids trimmed | mocked LoginService | `" 1234 "`, `" a@b.co "`, `" p a s s "` | fill + submit | — | `signIn({companyId:"1234", email:"a@b.co", password:" p a s s "})` | — | exact payload | unit (RTL) | Auto | P2 | AUD-017 |
| C-LOGIN-06 | Double submit | Duplicate submission | pending request | — | submit twice in one tick | one spinner | one `signIn` call | — | 1 call | unit (RTL) | Auto | P2 | REV-010 |
| C-LOGIN-07 | Server 401 | Error state | mocked 401 | — | submit | server message shown, button re-enabled | — | — | text visible, `not.toBeDisabled` | unit (RTL) | Auto | P2 | AUD-017 |
| C-LOGIN-08 | Network failure | Error state | rejected without `response` | — | submit | "Unable to reach the server…" | — | — | text visible | unit (RTL) | Auto | P2 | AUD-017 |
| T-AUTH-01 | No Authorization header | 401 + code | — | — | `GET /api/user/all/Acme` | redirect to `/login` | 401 `{code:"TOKEN_MISSING"}` | — | 401 | unit+int | Auto | P0 | auth |
| T-AUTH-02 | Expired access token | 403 + code | token `exp` in past | — | any protected call | interceptor refreshes once, retries | 403 `{code:"TOKEN_INVALID"}` | — | 403 | unit | Auto | P0 | auth |
| T-AUTH-03 | Forged signature | Reject | token signed with other secret | — | protected call | — | 403 | — | 403 | unit | Auto | P0 | auth |
| T-AUTH-04 | Valid token | `req.user` set | — | — | protected call | — | handler runs | — | next() called, `req.user.id` | unit | Auto | P0 | auth |
| T-AUTH-05 | Refresh with expired refresh token | Session expiry | refresh `exp` past | — | `POST /refresh-token` | "Session expired" banner → `/login`, storage cleared | 403 | — | banner shown, `sessionStorage` empty | int+e2e | Manual | P1 | session |
| T-AUTH-06 | Refresh happy path | New access token | valid refresh | — | `POST /refresh-token` | transparent | 200 `{accessToken}` | — | new token verifies | int | Planned | P1 | session |
| T-RL-01 | 21 logins in 15 min | Brute-force limiter | fresh app | bad creds | 21× `POST /login` | "Too many attempts…" | first 20 → 401, 21st → 429 `{code:"RATE_LIMITED"}` | — | 429 on 21st | int | Auto | P1 | AUD-005 |
| T-RL-02 | 21 forgot-password | Mail-flood limiter | — | — | 21× `POST /forgot-password` | — | 429 on 21st | ≤ 20 e-mails | 429 | int | Auto | P1 | AUD-005 |
| T-RL-03 | Behind proxy, `TRUST_PROXY` unset | X-Forwarded-For ignored | fresh app | 21 logins, 21 distinct XFF, same e-mail | — | — | 429 on 21st | — | 429 | int | Auto | P1 | REV-001 |
| T-RL-04 | `TRUST_PROXY=1` | per-client buckets | fresh app | 25 logins, 25 distinct XFF | — | — | all 401, never 429 | — | no 429 | int | Auto | P1 | REV-001 |
| T-RL-05 | Shared IP, two users | key = ip+email | fresh app | 21× alice, then bob, then `ALICE@b.c ` | — | — | bob 401; alice 429 (case/space-insensitive) | — | as stated | int | Auto | P1 | REV-001 |
| T-LOGIN-08 | Spoofed XFF with `TRUST_PROXY` unset | cannot escape limit | — | rotate XFF each call | — | — | 429 after 20 | — | 429 | int | Auto (= T-RL-03) | P1 | REV-001 |

## 2. Password reset & change

| Test ID | Scenario | Objective | Preconditions | Test data | Steps | Expected UI | Expected API | Expected DB | Pass | Type | Auto | Pri | Trace |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| T-RESET-01 | Token round-trip | Token bound to id | — | `_id` U1 | `getResetPasswordLink` → `verifyResetPasswordToken` | — | decoded `_id` = U1 | — | equal | unit | Auto | P0 | AUD-001 |
| T-RESET-02 | Expired token | Expiry enforced | `exp` past | — | verify | — | throws "expired" | — | throws | unit | Auto | P0 | AUD-001 |
| T-RESET-03 | Garbage/undefined token | Robustness | — | `"not-a-token"`, `undefined` | verify | — | throws | — | throws | unit | Auto | P0 | AUD-001 |
| T-RST-01 | POST with forged token | Reject | — | `/reset-password/U1/forged` | POST `{password}` | — | 400 `{code:"RESET_TOKEN_INVALID"}` | no `findByIdAndUpdate` | 400, no write | int | Auto | P0 | AUD-001 |
| T-RST-02 | Valid token of U1 used on U2's id | Cross-user | token(U1) | `/reset-password/U2/<token>` | POST | — | 400 | no write | 400 | int | Auto | P0 | AUD-001 |
| T-RST-03 | Valid token + valid password | Happy path | U1 exists | pwd 12 chars | POST | "Verified" page, prompt to login | 200 HTML | `Employee.password` = bcrypt hash; `EmployeeProfileInfo.password` unset | hash written once, legacy field unset | int | Auto | P0 | AUD-001 |
| T-RST-04 | Valid token, 5-char password | Min length | — | `"short"` | POST (Accept JSON) | — | 400 | no write | 400 | int | Auto | P1 | AUD-001 |
| T-RST-05 | GET page with bad token | Expired page | — | `/reset-password/U1/bad` | GET | page shows "invalid or has expired", no form | 400 HTML | — | text present | int | Auto | P1 | AUD-001 |
| T-RST-06 | Browser form post with short password | HTML error rendering | valid token | 3-char | submit EJS form | same page re-rendered with red alert | 400 HTML | no write | alert visible | manual | Manual | P2 | AUD-001 |
| T-RST-06 | Link used after a password change (incl. after its own success) | Single use | token issued for old hash | same link | POST again | expired page | 400 `RESET_TOKEN_INVALID` | no write | 400 | int | Auto | P1 | REV-003 |
| T-RESET-04/05 | Token/hash binding unit cases | token for old hash rejected; no-password user verifies only with empty hash | — | — | — | — | — | — | throws / verifies | unit | Auto | P1 | REV-003 |
| T-FORGOT-01 | Unknown e-mail | No enumeration | — | `nobody@x.y` | `POST /forgot-password` | "If the email exists…" | 200 | no mail | 200 | int | Planned | P1 | reset |
| T-PWD-01 | Change pwd, no token | Auth required | — | — | `PUT /change-password/U1` | redirect login | 401 | no write | 401 | int | Auto | P0 | AUD-002 |
| T-PWD-02 | Change another user's pwd | Self-only | auth(U1) | `/change-password/U2` | PUT | error alert | 403 `{code:"FORBIDDEN"}` | no write | 403 | int | Auto | P0 | AUD-002 |
| T-PWD-03 | Wrong current password | Verify current | auth(U1), hash of `OldPassw0rd!` | current `nope` | PUT | "Current password is incorrect" | 401 | no write | 401 | int | Auto | P0 | AUD-002 |
| T-PWD-04 | New pwd missing / 7 chars / whitespace / 129 chars | Boundaries (min 8, max 128) | auth(U1) | 4 variants | PUT | validation message | 400 each | no write | 400 ×4 | int | Auto | P1 | AUD-002 |
| T-PWD-05 | Confirmation mismatch | Match check | auth(U1) | confirm ≠ new | PUT | "Passwords do not match" | 400 | no write | 400 | int | Auto | P1 | AUD-002 |
| T-PWD-06 | Happy path | Hash stored | auth(U1), correct current | 12-char new | PUT | success alert, form closes | 200 `{message}` | `password` = bcrypt(new), ≠ plaintext | compareSync true | int | Auto | P0 | AUD-002 |
| T-PWD-07 | Invalid ObjectId | Input validation | token for id `not-an-id` | — | PUT | — | 400 | no write | 400 | int | Auto | P2 | AUD-002 |
| T-PWD-08 | 8-char password exactly | Lower boundary accepted | auth(U1) | 8 chars | PUT | success | 200 | hash written | 200 | int | Planned | P2 | AUD-002 |
| C-PWD-01…05 | Client form: empty / mismatch / short / happy+double-click / server 401 | UI validation & states | mocked service | see test file | fill + click Save | errors shown; one API call on double click; success closes form; server message surfaced | — | — | per test | unit (RTL) | Auto | P1 | AUD-018 |

## 3. Tenant authorization (AUD-003)

| Test ID | Scenario | Preconditions | Steps | Expected API | Pass | Type | Auto | Pri |
|---|---|---|---|---|---|---|---|---|
| T-TEN-01 | Own company param | U1∈Acme | `GET /api/company/Acme` | 200 company | 200 | int | Auto | P0 |
| T-TEN-02 | Foreign company param | U1∉Globex | `GET /api/user/all/Globex` | 403 `{code:"COMPANY_ACCESS_DENIED"}` | 403 | int | Auto | P0 |
| T-TEN-03 | Foreign company in body | U1 | `POST /api/payroll/process {companyName:"Globex"}` | 403 | 403 | int | Auto | P0 |
| T-TEN-04 | No token | — | `GET /api/user/all/Acme` | 401 | 401 | int | Auto | P0 |
| T-TEN-05 | Membership cache | U1 | 2 requests | 1 `Company.find` call | 1 | int | Auto | P2 |
| T-TEN-06 | `:company` and `:name` params | U1 | `/api/payroll/bankingInfo/Globex/U2`, `/api/company/Globex` | 403 both | 403 | int | Auto | P0 |
| T-TEN-07 | Placeholder segments `null`/`undefined` | U1 | `/api/user/payroll-active/Acme/null/undefined` | not 403 | ≠403 | int | Auto | P1 |
| T-TEN-08 | Membership revoked mid-session | U1 removed from Acme | call within 60 s, then after 60 s | first may still pass (cache), second 403 | 403 after TTL | int | Planned | P2 |
| T-TEN-09 | Query-string company | U1 | `GET /api/…?companyName=Globex` | 403 | 403 | int | Planned | P1 |
| T-TEN-10 | Company name with spaces/URL-encoding | U1∈"Acme Corp" | `GET /api/company/Acme%20Corp` | 200 | 200 | int | Planned | P1 |
| T-TEN-11 | Role escalation (Employee calls admin endpoint of own company) | U1 role Employee | `POST /api/vopay/transfer-withdraw` | currently **200** — **Known gap AUD-028** | documents gap | manual | Manual | P1 |
| T-TEN-12 | `:companyName` on ticket/resource routers | U1 | `GET /api/resource/type/pdf/Globex`, `GET /api/ticket/count/U1/Globex`; same without token | 403, 403, 401 | as stated | int | Auto | P0 |
| T-TEN-13 | Public ticket endpoints unaffected | — | `POST /api/ticket/support {}` | 400 (validation), not 401 | 400 | int | Auto | P1 |
| T-TEN-14 | Multipart upload for foreign company | U1 | `POST /api/resource/upload` fields `company=Globex`, file | 403; `uploads/<name>` absent | both | int | Auto | P0 |
| T-TEN-15 | `PUT /api/company/:id` of foreign company / invalid id | U1∈Acme(id aa) | `PUT /api/company/bb`, `PUT /api/company/not-an-id` | 403 no write / 400 | both | int | Auto | P0 |
| T-TEN-16 | `PUT /api/company/:id` of own company | U1 | `PUT /api/company/aa {revenue}` | handler reached (`findByIdAndUpdate` called) | called | int | Auto | P1 |
| T-TEN-17 | IDOR on `:id`-only routes (projects/tasks/tickets/notes) | U1, Globex task id | `PUT /api/tasks/<id>` | **currently 2xx — Known gap AUD-033** | documents gap | manual | Manual | P1 |
| C-STALE-01 | Stale selected company after membership revoked | U1 selected Globex in header, then removed from Globex | reload app | every call 403 → UI should reset to first allowed company and notify; **currently shows per-screen errors (REV-014)** | documents gap | e2e | Manual | P2 |

## 4. User update / routes

| Test ID | Scenario | Steps | Expected | Auto | Pri | Trace |
|---|---|---|---|---|---|---|
| T-USR-01 | Body contains `password`, `otp`, `_id` | `PUT /api/user/U2 {...}` as U1 | 201; `$set` has no `password/otp/_id`, keeps `firstName` | Auto | P0 | AUD-004 |
| T-USR-02 | Invalid user id | `PUT /api/user/nope` | 400 | Auto | P2 | AUD-004 |
| T-USR-03 | `PUT /api/user/assignLeads` | 4 disbursed leads, active users weights 1:3 | 200 "Leads assignee updated"; `findByIdAndUpdate` called with `[e1,1],[e2,3]` | Auto | P2 | AUD-012 / REV-011 |
| T-USR-05 | Non-admin edits another user's profile fields | `PUT /api/user/U2 {firstName}` as U1 | **currently 201 — Known gap REV-017/AUD-028** | Manual | P1 | open |
| T-USR-04 | Duplicate e-mail on update | set e-mail of existing user | currently 500 (E11000) — expected 409 | Planned | P3 | open |
| T-404-01 | Unknown `/api/...` route | `GET /api/does-not-exist` | 404 JSON `{message:"Not found"}` | Auto | P3 | — |

## 5. Files

| Test ID | Scenario | Input | Expected | Auto | Pri | Trace |
|---|---|---|---|---|---|---|
| T-FILE-01 | Traversal names | `../../index.js`, `..\..\win.ini`, `../.hidden` | `index.js`, `win.ini`, `hidden` | Auto | P0 | AUD-008 |
| T-FILE-02 | Unsafe chars / 300-char name | `re:port?.pdf`, `a*300.pdf` | `re_port_.pdf`, length 200 | Auto | P1 | AUD-008 |
| T-FILE-03 | `filePath` never escapes uploads | `../../etc/passwd`, `""`, `null` | inside uploads / throws / throws | Auto | P0 | AUD-008 |
| T-FILE-04 | 10 MB + 1 byte upload | multipart `POST /api/resource/upload`, `company=Acme` | 413 | Auto | P1 | AUD-008 / REV-008 |
| T-FILE-07 | Upload without a file | `POST /api/resource/upload` fields only | 400 "A file is required" | Auto | P2 | REV-006 |
| T-FILE-08 | Temp file removed after successful upload | upload, then `ls uploads/` | file absent; bytes in Mongo | Planned | P2 | REV-006 |
| T-ERR-03 | Multer error mapping | `MulterError("LIMIT_FILE_SIZE")`, `("LIMIT_UNEXPECTED_FILE")` | 413 / 400 | Auto | P1 | REV-008 |
| T-FILE-05 | 10 MB upload | — | 200, stored under sanitized name | Planned | P2 | AUD-008 |
| T-FILE-06 | Two files in one request | — | 400/413 `LIMIT_FILE_COUNT` | Planned | P3 | AUD-008 |
| T-RES-01 / T-TKT-02 | Download without token | — | 401 | Auto | P1 | AUD-009 |
| T-RES-02 / T-TKT-03 | Download unknown file | — | 404 (was 500) | Auto | P1 | AUD-009 |
| T-RES-03 | Download `..%2F..%2Findex.js` | — | 404, no file written outside uploads | Auto | P0 | AUD-008 |
| T-RES-04 | Two concurrent downloads of the same file | mocked resource `report.pdf` | both 200; `Content-Disposition` names `report.pdf`; `Content-Type` pdf | Auto | P1 | REV-007 |
| T-RES-05 | Temp file removed after download completes | real FS | `uploads/` contains no `<pid>-*-report.pdf` after response | Planned | P2 | REV-007 |
| T-TKT-01 | `PUT /api/ticket/:id` without token | — | 401 | Auto | P1 | AUD-006 |

## 6. Public endpoints

| Test ID | Scenario | Input | Expected | Auto | Pri | Trace |
|---|---|---|---|---|---|---|
| T-SUP-01 | Support ticket: empty / missing contactInfo / bad e-mail / whitespace issue | 4 bodies | 400 each, `SupportTicket.create` not called | Auto | P1 | AUD-016 |
| T-SUP-02 | Support ticket happy path | full valid body | 201/200, ticket created, 1 e-mail | Planned | P1 | AUD-016 |
| T-SUP-03 | HTML in `issue` | `<img onerror=…>` | stored verbatim, e-mail must render escaped — **Known gap** | Manual | P2 | AUD-016 |
| T-WH-01 | VoPay webhook without bearer, bad signature | `POST /api/vopay-webhook` | 401 "Invalid signature" (not 401 "Access token is required") | Auto | P1 | AUD-007 |
| T-WH-02 | Missing signature header | `x-vopay-signature: ""` | 401 (not 500) | Auto | P1 | AUD-007 |
| T-WH-03 | Valid signature | header = `sha1(key+secret+today)` | 200 "OK", `io.emit("vopay-event")` once | Planned | P1 | AUD-007 |
| T-WH-04 | Signature from yesterday after midnight | — | 401 (and API calls still succeed because signature is recomputed) | Manual (VoPay sandbox) | P1 | AUD-010 |

## 7. Payroll run (`POST /api/payroll/process`)

| Test ID | Scenario | Input | Expected | Auto | Pri | Trace |
|---|---|---|---|---|---|---|
| T-PAY-01 | `GET /payroll/payGroups/Acme/1` | — | 501 `{code:"NOT_IMPLEMENTED"}` within 1 s (was hang) | Auto | P2 | AUD-011 |
| T-PAY-02 | No body / missing `currentPayPeriod` / missing dates / extra run without `selectedEmp` | 4 bodies | 400 each | Auto | P1 | AUD-015 |
| T-PAY-03 | Happy path regular run | seeded Acme with 2 active employees + approved timesheets | 200 "Paystub created successfully"; 2 `EmployeePayStub` with `isProcessed`, 1 `FundingTotalsPay`, T4 XML file | Planned | P0 | payroll |
| T-PAY-04 | Same run submitted twice sequentially | repeat T-PAY-03 | still exactly 2 pay stubs (updates, not inserts) | Planned | P0 | AUD-015 |
| T-PAY-05 | Same run submitted concurrently (2 parallel requests) | services mocked, first run takes 300 ms | one 200, one 409 `PAYRUN_IN_PROGRESS`; a different period runs; same period runs again after completion | Auto | P1 | REV-009 |
| T-PAY-11 | Concurrent runs on two server instances | 2 instances behind LB | **still may duplicate — Known gap AUD-015 (needs DB lock)** | Manual | P1 | AUD-015 |
| T-PAY-06 | Employee with no timesheet in period | — | stub with 0 hours, no crash | Planned | P1 | payroll |
| T-PAY-07 | Extra run with empty `selectedEmp` | `[]` | 200 and no stubs (or 400 — decide) | Manual | P2 | payroll |
| T-PAY-08 | DB failure mid-loop | kill Mongo after first employee | 500; **partial write remains** — Known gap, needs transaction | Manual | P1 | AUD-015 |
| T-PAY-09 | Foreign company | U1 runs Globex | 403 | Auto (T-TEN-03) | P0 | AUD-003 |
| T-PAY-10 | Date boundary: period end = pay date, DST change week | Mar 8–21 2026 | hours attributed to correct day (`America/Vancouver`) | Manual | P2 | payroll |

## 8. Client UI / navigation / responsive / accessibility

| Test ID | Scenario | Steps | Expected | Type | Auto | Pri |
|---|---|---|---|---|---|---|
| C-API-01…06 | Interceptor decision matrix (TOKEN_INVALID, legacy no-code, COMPANY_ACCESS_DENIED, FORBIDDEN, retried, 401/500/network) | unit | refresh only for token errors, once | unit | Auto | P1 |
| C-NAV-01 | Direct URL to `/payroll/...` while logged out | open URL | redirect `/login` | e2e | Manual | P1 |
| C-NAV-02 | Browser refresh on deep route | F5 | page re-renders, user restored from storage, no 404 (Netlify `_redirects`) | e2e | Manual | P1 |
| C-NAV-03 | Back button after logout | logout, Back | still on `/login`, no cached data | e2e | Manual | P2 |
| C-SESS-01 | Access token expires during idle | wait 2 h (or shorten) | next request refreshed transparently | e2e | Manual | P1 |
| C-SESS-02 | Both tokens expired | wait 5 h | SessionExpiredBanner, click → `/login` | e2e | Manual | P1 |
| C-SESS-03 | Forbidden company 403 | force 403 with code | error surfaced to screen, **no** refresh attempt | e2e | Manual | P1 |
| C-LIST-01 | Employee list empty | company with 0 employees | `EmptyRowRecord` shown, no spinner forever | e2e | Manual | P2 |
| C-LIST-02 | Employee list 1 000 rows | seed | renders < 3 s, pagination works | perf | Manual | P2 |
| C-FORM-01 | Onboarding required fields | submit empty | each required field flagged, no API call | e2e | Manual | P1 |
| C-FORM-02 | Whitespace-only name | `"   "` | rejected client and server (server currently accepts — gap) | e2e | Manual | P2 |
| C-RESP-01 | Login page 375×667, 768×1024, 1440×900 | resize | no horizontal scroll, button reachable | manual | Manual | P2 |
| C-RESP-02 | Pay stub mobile view | 375 px | `MobilePayStub` used, totals visible | manual | Manual | P2 |
| C-A11Y-01 | Login & ChangePassword keyboard-only | Tab/Enter | all controls reachable, visible focus, submit on Enter | manual | Manual | P1 |
| C-A11Y-02 | Password toggle button has `aria-label` | inspect | SignInForm yes; ChangePassword toggles **missing** — gap | manual | Manual | P3 |
| C-A11Y-03 | Error alerts announced | screen reader | Chakra `Alert` has `role="alert"`; success uses `role="status"` | manual | Manual | P2 |
| C-A11Y-04 | Colour contrast of `--banner_bg` button | axe | ≥ 4.5:1 | manual | Manual | P3 |
| C-REFRESH-01 | Refresh during payroll processing | F5 while `POST /process` pending | request completes server-side; UI shows current stage on reload | e2e | Manual | P1 |

## 9. Security (additional)

| Test ID | Scenario | Expected | Auto | Pri |
|---|---|---|---|---|
| T-SEC-01 | NoSQL injection in login `{"email":{"$ne":""}}` | 401 (Mongoose casts to string / no match) | Planned | P1 |
| T-SEC-02 | `companyName` as object in body `{ "$ne": "" }` | ignored by guard (non-string) → handler receives object → must 400 (currently 500) | Auto (T-AUTHZ-04 partial) | P2 |
| T-SEC-03 | 51 MB JSON body | 413 from body-parser via error handler | Planned | P2 |
| T-SEC-04 | Stack trace leakage on 500 | body is exactly `{message:"Internal Server Error"}` | Auto (T-ERR-01) | P1 |
| T-SEC-05 | CORS from unknown origin | no `Access-Control-Allow-Origin` | Planned | P2 |
| T-SEC-06 | Helmet headers present | `X-Frame-Options`, CSP, `Referrer-Policy: no-referrer` | Planned | P3 |
| T-SEC-07 | Device posts to `/api/timecard` without credentials | currently 200 — **Known gap AUD-013** | Manual | P1 |

## 10. Database consistency / migration

| Test ID | Scenario | Expected | Auto | Pri |
|---|---|---|---|---|
| T-DB-01 | Create two `EmployeeProfileInfo` without `affiliateCode` | both succeed after sparse index migration | Planned | P1 |
| T-DB-02 | Startup with old non-sparse index still present | Mongoose logs index conflict, app still serves | Manual | P2 |
| T-DB-03 | Unreachable MongoDB at boot | process stays up, logs error, requests 500 after buffer timeout | Manual (verified by code review) | P1 |

## 11. Traceability matrix (defect → fix → tests)

| Defect | Fix location | Tests |
|---|---|---|
| AUD-001 | `passwordController.js`, `tokenService.js`, `views/layout.ejs` | T-RESET-01…03, T-RST-01…05 |
| AUD-002 | `appRoutes.js`, `authorize.requireSelf`, `passwordController.changePassword` | T-PWD-01…07, T-AUTHZ-01/02 |
| AUD-003 | `middleware/authorize.js`, `app.js` | T-TEN-01…07, T-AUTHZ-03/04 |
| AUD-004 | `userController.updateUser` | T-USR-01/02 |
| AUD-005 | `app.js` authLimiter | T-RL-01/02 |
| AUD-006 | `ticketRoutes.js` | T-TKT-01 |
| AUD-007 | `app.js`, `vopayController.receiveWebhook` | T-WH-01/02 |
| AUD-008 | `fileService.js` | T-FILE-01…03, T-RES-03 |
| AUD-009 | `resourceRoutes/ticketRoutes`, both `downloadResource` | T-RES-01/02, T-TKT-02/03 |
| AUD-011 | `payrollController.js` | T-PAY-01 |
| AUD-012 | `userRoutes.js` | T-USR-03 |
| AUD-015 (partial) | `payStubController.js` | T-PAY-02 |
| AUD-016 (partial) | `ticketController.createSupportTicket` | T-SUP-01 |
| AUD-017 | `client/src/api/index.js`, `SignInForm.jsx` | C-API-01…06 |
| AUD-018 | `ChangePassword.jsx` | C-PWD-01…05 |
| AUD-020/021/022 | `apiFetch.js`, `affiliateProfileInfoController.js`, client `package.json`, `setupTests.js`, `AddOpportunity.jsx` | suites load; build passes |
| AUD-024 (partial) | `middleware/auth.errorHandler` | T-ERR-01/02/03 |
| REV-001 | `app.js` (`TRUST_PROXY`, `keyGenerator`) | T-RL-03/04/05 |
| REV-002 | `routes/ticketRoutes.js`, `routes/resourceRoutes.js` | T-TEN-12/13 |
| REV-003 | `services/tokenService.js`, `passwordController.js`, `userController.sendMailCreds` | T-RESET-01/04/05, T-RST-06 |
| REV-004 | `authorize.authorizeMultipartCompany`, both upload routes | T-TEN-14 |
| REV-005 | `authorize.requireCompanyIdMembership`, `companyRoutes.js` | T-TEN-15/16 |
| REV-006 | `resourceController.createResource` | T-FILE-07 |
| REV-007 | both `downloadResource` | T-RES-04 |
| REV-008 | `middleware/auth.errorHandler` | T-ERR-03, T-FILE-04 |
| REV-009 | `payStubController` run lock | T-PAY-05 |
| REV-010 | `SignInForm.jsx`, `ChangePassword.jsx` refs | C-LOGIN-06, C-PWD-04 |
| REV-011 | tests only | T-TEN-07, T-USR-03 |
| Open: AUD-013/015(multi-instance)/028/029/030/033, REV-014/015/016/017 | — | manual procedures T-SEC-07, T-PAY-11, T-TEN-11/17, C-STALE-01, T-USR-05 |
