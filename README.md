# BusinessN ERP

BusinessN ERP is a multi-tenant web application for running a small or mid-sized business, built around **Canadian (BC) payroll**: employee onboarding, time cards, pay runs, CRA T4/ROE data and VoPay EFT payouts. Around payroll it adds a sales CRM, project management, shift scheduling, accounting and budgeting. A React single-page app talks to an Express/MongoDB API; each company is a tenant identified by its name.

| Document                               | Contents                                                                                             |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [docs/TECHNICAL.md](docs/TECHNICAL.md) | Architecture, auth/tenancy/RBAC, pay-run flow, API reference, data model and indexes                 |
| [docs/CHANGES.md](docs/CHANGES.md)     | What was fixed (with test IDs), open-issues register, testing and results, notes for the payroll SME |

## Modules and status

**Working** means a complete implementation exists in client and server. Most of it has only been verified at code level, with mocked models and no live database (see CHANGES.md, Testing). **Partial** means usable with known gaps. **Placeholder** means a UI shell only.

| Area         | Feature                                                                                                               | Status                                                                                |
| ------------ | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Platform     | Login (e-mail, password, company registration number), token refresh, session-expiry banner                           | Working, API-tested                                                                   |
|              | Forgot / reset / change password                                                                                      | Working, API-tested                                                                   |
|              | Self sign-up                                                                                                          | Partial: anyone can join any company by name (AUD-030)                                |
|              | Company switcher and per-company tenancy (server-side guard)                                                          | Working, tested                                                                       |
|              | Roles and module permissions (server-side for money, payroll, setup, permission, company and role-assignment actions) | Working, tested; reads aren't role-gated                                              |
|              | Company configuration: modules, departments, cost centres, pay groups, roles                                          | Working                                                                               |
|              | Mobile navigation drawer, public support form, post-deploy reload prompt                                              | Working                                                                               |
| Payroll      | Employee onboarding (SIN and bank data AES-256-CBC encrypted), employee list and profile                              | Working                                                                               |
|              | Time cards from clock-in devices (device key optional)                                                                | Working; badges shared across companies are held for manual booking                   |
|              | Timesheets: approve/reject, manual entries                                                                            | Partial: pagination done in memory (F-06)                                             |
|              | Pay groups and pay calendars                                                                                          | Working; `/api/payroll/payGroups` CRUD stubs return 501                               |
|              | Pay run (setup → inputs → alerts → finalize), transactional and idempotent                                            | Working                                                                               |
|              | Payroll maths: hours, gross, CPP, EI, federal and BC tax, vacation, deductions                                        | Working, unit-tested; BC only, no YTD caps, no CPP2                                   |
|              | Extra / manual / payout / superficial runs; pay register, journals, funding totals, earnings statement                | Working                                                                               |
|              | T4 slips (CRA XML)                                                                                                    | Partial: generation works; listing endpoints return 501; saved XML can't be decrypted |
|              | ROE, stat holidays (daily cron), leave requests, affiliates                                                           | Working                                                                               |
|              | VoPay EFT: wallets, payroll fund transfer, webhooks                                                                   | Partial: three handlers return 501; two still use the default account                 |
| Sales CRM    | Leads (disbursement, docket, pipeline), opportunities, contacts, activities, calendar, meetings, events               | Working                                                                               |
|              | Products, orders, payouts, invoices; resources and assessments; sales reports and dashboard                           | Working                                                                               |
| Project mgmt | Projects / tasks / subtasks (workview, task board, Gantt, agenda), team chat, announcements, tickets                  | Working; group-message list unscoped                                                  |
| Scheduling   | Crews, locations, weekly scheduler, e-mailed schedules, budget vs actual                                              | Working                                                                               |
| Accounting   | Ledger, journal entries, budgeting, chart of accounts                                                                 | Working                                                                               |
| HR           | HR module                                                                                                             | Placeholder (`ComingSoon`; only `/hr/resources` works)                                |
| Operations   | Dashboard                                                                                                             | Minimal: order graph and orders page only                                             |
| Other        | Scheduling workview, payroll dashboard task/appointment history                                                       | Placeholder panels                                                                    |

No new product features were built in the documentation and hardening passes: the feature brief was the unfilled placeholder `[PASTE THE FEATURE REQUIREMENTS HERE]`.

## Tech stack

|                  |                                                                                                                                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Client**       | React 18, Create React App 5, Chakra UI 2, React Router 6, Axios, Formik/Yup, chart.js 4 with react-chartjs-2 5, socket.io-client, react-to-print 3. Hosted on Netlify.                                      |
| **Server**       | Node ≥ 18 (verified on 22.22), Express 4, Mongoose 8, jwt-simple (HS256), bcryptjs, multer, nodemailer, node-cron, socket.io, helmet, express-rate-limit, EJS. Runs from a `Procfile` (Render/Heroku style). |
| **Database**     | MongoDB (Atlas in production). Indexes are built by Mongoose `autoIndex` at start-up; there is no migration tooling.                                                                                         |
| **Integrations** | VoPay (EFT payouts, webhooks), Zoho SMTP, clock-in devices posting to `/api/timecard`, CRA T4 XML                                                                                                            |
| **Tests**        | Server: Jest 30 + Supertest 7 with mocked models. Client: CRA Jest 27 + React Testing Library 13.                                                                                                            |

## Repository layout

```
client/                 React SPA
  src/erp-modules/      payroll, sales, project-management, scheduling, accounting, budgeting, operations, hr
  src/features/         login, sign-up, user profile, configuration (VoPay), setup, support
  src/components/ hooks/ services/ api/ context/ layouts/
  scripts/write-version.js, netlify.toml
server/                 Express API
  index.js              bootstrap: env, HTTP + socket.io, cron, MongoDB connection, listen
  app.js                middleware stack and router mounting (imported by the tests)
  routes/ controllers/ services/ helpers/ models/ middleware/ jobs/ utils/ views/
  scripts/              check-duplicates.js, resolve-duplicates.js (deployment helpers)
  tests/                Jest + Supertest suites
docs/                   TECHNICAL.md, CHANGES.md
```

## Prerequisites

- Node.js 18 or later and npm 10
- MongoDB: a replica set (Atlas) for pay-run transactions; a standalone `mongod` works, with non-transactional writes
- For e-mail and payments: Zoho SMTP and VoPay credentials. The server won't start without the variables set, but placeholder values are enough to boot; those features then fail at call time.

## Setup

```bash
cd server
cp .env.example .env.local      # development; production reads .env
npm ci

cd ../client
cp .env.example .env            # REACT_APP_BASE_URL=http://localhost:5000/api
cp .env .env.production         # read by `npm run build`
npm ci --legacy-peer-deps       # the CRA dependency tree needs this flag
```

Never commit or distribute filled-in `.env*` files. `server/.env.example` and `client/.env.example` list the names only.

### Server environment variables

Every variable is required unless marked optional: `helpers/requireEnv.js` throws at start-up (SMTP variables are read on first e-mail).

| Variable                                                                                                       | Purpose                                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PORT`                                                                                                         | HTTP port                                                                                                                                          |
| `NODE_ENV`                                                                                                     | optional; `development` loads `.env.local` instead of `.env`                                                                                       |
| `TRUST_PROXY`                                                                                                  | optional; hop count (e.g. `1`) behind a reverse proxy, so rate limits see the real client IP                                                       |
| `RBAC_MODE`                                                                                                    | optional; `enforce` (default) or `report` (log role denials but allow the request)                                                                 |
| `PAYRUN_TRANSACTIONS`                                                                                          | optional; `on` (default) runs pay-run writes in one MongoDB transaction when supported; `off` disables it                                          |
| `TIMECARD_DEVICE_KEYS`                                                                                         | optional; comma-separated keys. When set, devices must send `x-device-key`. Unset means device posts are accepted unauthenticated (warning logged) |
| `DB_CONNECTION_URL_STAGING_CRM`                                                                                | MongoDB URI. It is the only URI the server uses, whatever the name says                                                                            |
| `BASE_URL_LIVE`                                                                                                | Public server URL used to build password-reset links                                                                                               |
| `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`                                                                  | JWT signing secrets (2 h access, 5 h refresh tokens); use two different values                                                                     |
| `SIN_ENCRYPTION_KEY`, `BANKING_ENCRYPTION_KEY`, `XML_ENCRYPTION_KEY`                                           | 32-byte AES keys as 64 hex characters, for SIN, bank numbers and T4 XML files                                                                      |
| `NODEMAILER_ZOHO_SMTP`, `NODEMAILER_ZOHO_SMTP_PORT`                                                            | SMTP host and port                                                                                                                                 |
| `NODEMAILER_ZOHO_SMTP_SUPPORT_EMAIL_ADMIN`, `NODEMAILER_ZOHO_SMTP_SUPPORT_PASSWORD_ADMIN`                      | SMTP account (sender and support-admin mailbox)                                                                                                    |
| `VOPAY_PARTNER_ACCOUNT_ID`, `VOPAY_API_KEY_PROD`, `VOPAY_SHARED_SECRET_PROD`, `VOPAY_BASE_URL_PROD`            | VoPay partner account, production                                                                                                                  |
| `VOPAY_API_KEY_STAGING`, `VOPAY_SHARED_SECRET_STAGING`, `VOPAY_BASE_URL_STAGING`                               | VoPay staging (the default account for most calls)                                                                                                 |
| `VOPAY_PARTNER_ACCOUNT_ID_PROD_TEST`, `VOPAY_API_KEY_PROD_TEST`, `VOPAY_SHARED_SECRET_PROD_TEST`               | VoPay production test account                                                                                                                      |
| `CORNERSTONE_ACCOUNT_ID`, `CORNERSTONE_CLIENTACCOUNTID`, `CORNERSTONE_SHARED_KEY`, `CORNERSTONE_SHARED_SECRET` | VoPay client account used for Cornerstone payroll fund transfers                                                                                   |
| `TECHCORP_ACCOUNT_ID`, `TECHCORP_SHARED_KEY`, `TECHCORP_SHARED_SECRET`                                         | VoPay client account for TechCorp                                                                                                                  |

### Client environment variables

| Variable             | Purpose                                                                                                                                               |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `REACT_APP_BASE_URL` | API base **including `/api`**, e.g. `http://localhost:5000/api`. The socket.io client uses its origin                                                 |
| `REACT_APP_WEBSITE`  | Marketing-site URL used by the public support and affiliate pages. CRA only exposes `REACT_APP_*` variables, so this is currently undefined in builds |

## Run

```bash
# server (from server/)
NODE_ENV=development npm run devStart   # nodemon, reads .env.local
npm start                                # production: node index.js, reads .env

# client (from client/)
npm start                 # dev server on :3000 with .env
npm run start-staging     # with .env.staging
npm run build             # production build with .env.production -> client/build (prebuild writes version.json)
npm run build-staging     # build with .env.staging
```

Deployment: Netlify builds the client (`client/netlify.toml`, SPA fallback). The server runs `node index.js` from `server/Procfile`; set `TRUST_PROXY=1` behind the platform proxy. Rate limits, caches and the pay-run lock are in-process, so run a single server instance (see TECHNICAL.md, Deployment).

## Test and lint

```bash
cd server && npm test                                              # Jest + Supertest, no database needed
cd server && npx jest --coverage                                   # coverage (text + lcov in server/coverage/)
cd client && CI=true npm test -- --watchAll=false                  # CRA Jest + Testing Library
cd client && NODE_ENV=development npx eslint --ext .js,.jsx src    # lint (the CRA babel preset needs NODE_ENV)
cd client && GENERATE_SOURCEMAP=false npx react-scripts build      # build check without .env.production
```

**Current results:** server **379/379** pass · client **41/41** pass · client lint **0 errors** (350 warnings) · client build passes (8.5 MB, `main.js` 382 kB gzip) · server coverage **~51 %** of statements. Details: [docs/CHANGES.md](docs/CHANGES.md#3-testing).

## Before the first deploy of this version

1. **Rotate every credential.** The archive this project arrived in contained real `.env`, `.env.local`, `.env.production` and `.env.staging` files (database, JWT, SMTP, VoPay and encryption keys). Treat them as compromised. The baseline commit of this repository contains them, so don't push it anywhere public.
2. **Keep personal data out of archives and repos:** `server/generated-T4-xml/` (real T4 slips with names and SIN fields) and `server/uploads/`.
3. **Back up the database**, then clear duplicates that would stop the new unique indexes from building:
   ```bash
   cd server
   node scripts/check-duplicates.js              # read-only report; exit 0 = clean, 2 = duplicates block an index
   node scripts/resolve-duplicates.js            # dry run: shows KEEP/REMOVE and money fields per group
   node scripts/resolve-duplicates.js --apply    # after the backup: copies removed docs to <collection>_dedupe_backup, repoints orders, deletes
   ```
   Restart the server afterwards so the indexes build. If an intermediate build of this branch was ever deployed, also run `db.employeepaystubs.dropIndex("uniq_processed_paystub")` (`check-duplicates.js` prints this reminder). If the old non-sparse `affiliateCode_1` index exists, drop it once so Mongoose recreates it as sparse.
4. **Deploy with `RBAC_MODE=report`.** Users with an empty or unknown role, and Employees granted pages through custom permissions, are now refused on role-gated endpoints. Review the `RBAC report-only: would deny` log lines, fix role data, then switch to `enforce`. Keep report mode short: it's a temporary relaxation.
5. **Set `TIMECARD_DEVICE_KEYS`** and configure the devices to send `x-device-key`, and set `TRUST_PROXY` behind a proxy.
6. **Cornerstone payroll transfers will now go through.** The transfer is now signed with Cornerstone's own key, so transfers VoPay used to reject will **move real money** on payroll submit. Confirm this with the owner and test in the VoPay sandbox first. Submit is idempotent per run; a run left `in_progress` by a crash must be checked in VoPay before it is reset by hand.
