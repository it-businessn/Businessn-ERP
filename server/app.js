const express = require("express");
const crypto = require("crypto");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
const rateLimit = require("express-rate-limit");
const path = require("path");

const { authenticateToken, errorHandler, verifyToken } = require("./middleware/auth");
const { authorizeCompanyAccess, applyCompanyParamGuards } = require("./middleware/authorize");
const { warnIfDeviceKeysUnset } = require("./middleware/deviceAuth");

const accountingRoutes = require("./routes/accountingRoutes");
const budgetingRoutes = require("./routes/budgetingRoutes");
const activityRoutes = require("./routes/activityRoutes");
const alertRoutes = require("./routes/alertRoutes");
const appRoutes = require("./routes/appRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const companyRoutes = require("./routes/companyRoutes");
const contactRoutes = require("./routes/contactRoutes");
const holidayRoutes = require("./routes/holidayRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const eventRoutes = require("./routes/eventRoutes");
const industryRoutes = require("./routes/industryRoutes");
const leadRoutes = require("./routes/leadRoutes");
const leaveRequestRoutes = require("./routes/leaveRequestRoutes");
const logTaskRoutes = require("./routes/logTaskRoutes");
const meetingRoutes = require("./routes/meetingRoutes");
const noteRoutes = require("./routes/noteRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const opportunityRoutes = require("./routes/opportunityRoutes");
const orderRoutes = require("./routes/orderRoutes");
const payoutRoutes = require("./routes/payoutRoutes");
const payrollRoutes = require("./routes/payrollRoutes");
const payInfoRoutes = require("./routes/payInfoRoutes");
const affiliateRoutes = require("./routes/affiliateRoutes");
const profileInfoRoutes = require("./routes/profileInfoRoutes");
const roeRoutes = require("./routes/roeRoutes");
const employmentInfo = require("./routes/employmentInfoRoutes");
const governmentInfo = require("./routes/governmentInfoRoutes");
const bankingInfo = require("./routes/bankingInfoRoutes");
const additionalAllocationInfo = require("./routes/additionalAllocationInfoRoutes");
const balanceInfo = require("./routes/balanceInfoRoutes");
const permissionsRoutes = require("./routes/permissionRoutes");
const projectRoutes = require("./routes/projectRoutes");
const questionnaireRoutes = require("./routes/questionnaireRoutes");
const reportRoutes = require("./routes/reportRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const setUpRoutes = require("./routes/setupRoutes");
const taskRoutes = require("./routes/taskRoutes");
const timesheetRoutes = require("./routes/timesheetRoutes");
const timecardRoutes = require("./routes/timecardRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const userRoutes = require("./routes/userRoutes");
const t4SlipRoutes = require("./routes/t4SlipRoutes");
const vopayRoutes = require("./routes/vopayRoutes");
const vopayWebHookRoutes = require("./routes/vopayWebHookRoutes");
const CONFIG = require("./config/app.config");

// CHANGES.md API #18: cheap token check for choosing the global rate-limit tier. Same
// header parsing and validation as authenticateToken (signature + expiry + id).
const hasValidAccessToken = (req) => {
	const header = req.headers?.authorization;
	const token = typeof header === "string" ? header.split(" ")[1] : undefined;
	if (!token) return false;
	try {
		return Boolean(verifyToken(token, CONFIG.ACCESS_TOKEN_SECRET)?.id);
	} catch (_) {
		return false;
	}
};

// The express app is built here so it can be imported by tests without opening
// a database connection or listening on a port (see index.js for bootstrapping).
// `io` is injected by index.js (socket.io is bound to the http server there).
const buildApp = (io) => {
const app = express();

// FIX: Apply rate limiter BEFORE route handlers, not after.
// Previously: app.use("/api/timecard", timecardRoutes, apiLimiter) — limiter ran after routes.
const globalLimiter = rateLimit({
	windowMs: 60 * 1000,
	// CHANGES.md API #18: this limiter runs before authenticateToken, so req.user was never
	// set and every caller got 200/min. Check the bearer token here (signature and
	// expiry only, no DB); an invalid or missing token gets the anonymous tier.
	max: (req) => (req.user || hasValidAccessToken(req) ? 500 : 200),
	standardHeaders: true,
	legacyHeaders: false,
	handler: (req, res) => {
		console.log("Rate limit exceeded:", req.ip);
		res.status(429).json({
			message: "Too many requests. Please wait before retrying.",
		});
	},
});

const timecardLimiter = rateLimit({
	windowMs: 60 * 1000,
	max: 200,
	standardHeaders: true,
	legacyHeaders: false,
});

// REV-001: behind Render/Netlify every request shares the proxy's IP. Without
// `trust proxy` a per-IP limiter would lock out the whole customer base after 20
// bad logins. Honour X-Forwarded-For only when TRUST_PROXY is set (e.g. "1"),
// and key the credential limiter by IP + e-mail so one attacker cannot exhaust a
// shared office IP, and one IP cannot lock a victim out from everywhere.
if (process.env.TRUST_PROXY) {
	const tp = process.env.TRUST_PROXY;
	app.set("trust proxy", /^\d+$/.test(tp) ? Number(tp) : tp === "true" ? true : tp);
}

const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 20,
	standardHeaders: true,
	legacyHeaders: false,
	keyGenerator: (req) => {
		const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
		return `${req.ip}|${email}`;
	},
	handler: (req, res) => {
		res.status(429).json({
			message: "Too many attempts. Please wait 15 minutes before retrying.",
			code: "RATE_LIMITED",
		});
	},
});

// Middleware
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(expressLayouts);
// F-09: a second bodyParser.json/urlencoded pair used to follow these two lines.
// Express marks the body as parsed (req._body) after the first parser, so the
// second pair never ran: its `rawBody` verify hook was never populated and
// nothing in the codebase reads req.rawBody. Removed as dead middleware.
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(cors(CONFIG.corsOptions));

// FIX: Call helmet once with the full config (was called twice — once bare, once with CSP).
// The bare call ran first and the second overrode it, but both wasted a middleware slot.
app.use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'", "https://businessn-erp.com"],
				scriptSrc: ["'self'", "https://businessn-erp.com", "'unsafe-inline'"],
			},
		},
	}),
);
app.use(helmet.crossOriginEmbedderPolicy());
app.use(helmet.crossOriginResourcePolicy({ policy: "same-site" }));
app.use(helmet.crossOriginOpenerPolicy({ policy: "same-origin" }));
app.use(helmet.referrerPolicy({ policy: "no-referrer" }));
app.use(helmet.permittedCrossDomainPolicies({ policy: "none" }));
app.use(helmet.originAgentCluster());

// Request logging + nonce + global rate limit (skip auth routes, which get
// their own, stricter limiter below)
app.use((req, res, next) => {
	res.locals.nonce = crypto.randomBytes(16).toString("base64");
	console.log(
		new Date().toISOString(),
		req.method,
		req.originalUrl,
		req.ip,
		req.headers["user-agent"],
	);
	if (
		req.path.startsWith("/api/auth") ||
		req.path.startsWith("/api/login") ||
		req.path.startsWith("/api/refresh-token")
	) {
		return next();
	}
	return globalLimiter(req, res, next);
});

// FIX (AUD-005): credential endpoints were exempt from every limiter, allowing
// unlimited password brute force / reset-mail flooding. Apply a strict limiter.
app.use(["/api/login", "/api/forgot-password", "/api/reset-password", "/api/refresh-token"], authLimiter);

// Routes
app.use("/api", appRoutes);

// FIX: Timecard rate limiter applied BEFORE route handler
// AUD-013: mounted before authenticateToken because devices post punches here
// (POST /api/timecard, device key via TIMECARD_DEVICE_KEYS); the router itself
// requires a user token + tenant guard on every other time-card route.
warnIfDeviceKeysUnset();
app.use("/api/timecard", timecardLimiter, applyCompanyParamGuards(timecardRoutes));

app.use("/api/ticket", ticketRoutes);
app.use("/api/resource", resourceRoutes);

// FIX (AUD-007): VoPay webhook is called by VoPay's servers, which never carry a
// user bearer token. It was mounted after authenticateToken and therefore always
// answered 401. It authenticates with its own shared-secret signature instead.
app.use("/api/vopay-webhook", vopayWebHookRoutes(io));

// All routes below require authentication
app.use(authenticateToken);
// FIX (AUD-003): server-side tenant scoping. Every request that names a company
// is checked against the companies the caller belongs to: body/query here,
// route params via applyCompanyParamGuards() on each router below.
app.use(authorizeCompanyAccess);
// FIX: affiliate routes moved after authenticateToken (they were unprotected before)
app.use("/api/affiliate", applyCompanyParamGuards(affiliateRoutes));
app.use("/api/accounting", applyCompanyParamGuards(accountingRoutes));
app.use("/api/budgeting", applyCompanyParamGuards(budgetingRoutes));
app.use("/api/activities", applyCompanyParamGuards(activityRoutes));
app.use("/api/alert", applyCompanyParamGuards(alertRoutes));
app.use("/api/assessment", applyCompanyParamGuards(assessmentRoutes));
app.use("/api/company", applyCompanyParamGuards(companyRoutes));
app.use("/api/contacts", applyCompanyParamGuards(contactRoutes));
app.use("/api/conversations", applyCompanyParamGuards(conversationRoutes));
app.use("/api/announcements", applyCompanyParamGuards(announcementRoutes));
app.use("/api/events", applyCompanyParamGuards(eventRoutes));
app.use("/api/holiday", applyCompanyParamGuards(holidayRoutes));
app.use("/api/industry", applyCompanyParamGuards(industryRoutes));
app.use("/api/leads", applyCompanyParamGuards(leadRoutes));
app.use("/api/leaves", applyCompanyParamGuards(leaveRequestRoutes));
app.use("/api/log-tasks", applyCompanyParamGuards(logTaskRoutes));
app.use("/api/meetings", applyCompanyParamGuards(meetingRoutes));
app.use("/api/notes", applyCompanyParamGuards(noteRoutes));
app.use("/api/notification", applyCompanyParamGuards(notificationRoutes));
app.use("/api/opportunities", applyCompanyParamGuards(opportunityRoutes));
app.use("/api/orders", applyCompanyParamGuards(orderRoutes));
app.use("/api/payouts", applyCompanyParamGuards(payoutRoutes));
app.use("/api/payroll", applyCompanyParamGuards(payrollRoutes));
app.use("/api/payroll/payInfo", applyCompanyParamGuards(payInfoRoutes));
app.use("/api/payroll/profileInfo", applyCompanyParamGuards(profileInfoRoutes));
app.use("/api/payroll/roe", applyCompanyParamGuards(roeRoutes));
app.use("/api/payroll/employmentInfo", applyCompanyParamGuards(employmentInfo));
app.use("/api/payroll/governmentInfo", applyCompanyParamGuards(governmentInfo));
app.use("/api/payroll/bankingInfo", applyCompanyParamGuards(bankingInfo));
app.use("/api/payroll/balanceInfo", applyCompanyParamGuards(balanceInfo));
app.use("/api/payroll/additionalAllocation", applyCompanyParamGuards(additionalAllocationInfo));
app.use("/api/permissions", applyCompanyParamGuards(permissionsRoutes));
app.use("/api/projects", applyCompanyParamGuards(projectRoutes));
app.use("/api/questionnaire", applyCompanyParamGuards(questionnaireRoutes));
app.use("/api/payroll/report", applyCompanyParamGuards(reportRoutes));
app.use("/api/schedule", applyCompanyParamGuards(scheduleRoutes));
app.use("/api/setup", applyCompanyParamGuards(setUpRoutes));
app.use("/api/tasks", applyCompanyParamGuards(taskRoutes));
app.use("/api/timesheet", applyCompanyParamGuards(timesheetRoutes));
app.use("/api/user", applyCompanyParamGuards(userRoutes));
app.use("/api/generate-t4", applyCompanyParamGuards(t4SlipRoutes));
app.use("/api/vopay", applyCompanyParamGuards(vopayRoutes));

// Unknown API route -> JSON 404 instead of HTML / hanging
app.use("/api", (req, res) => res.status(404).json({ message: "Not found" }));

app.use(errorHandler);

return app;
};

module.exports = { buildApp };
