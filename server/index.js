console.log("NODE_ENV", process.env.NODE_ENV);

if (process.env.NODE_ENV === "development") {
	require("dotenv").config({ path: ".env.local" });
	console.log("Using .env.local file");
} else {
	require("dotenv").config();
}

const express = require("express");
const crypto = require("crypto");
const http = require("http");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const socketio = require("socket.io");
const expressLayouts = require("express-ejs-layouts");
const rateLimit = require("express-rate-limit");
const path = require("path");

const { authenticateToken, errorHandler } = require("./middleware/auth");

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
const runStatHolidayJob = require("./jobs/statHoliday");

const app = express();
const httpServer = http.createServer(app);

const io = socketio(httpServer, {
	cors: {
		origin: "*",
	},
});
const PORT = CONFIG.PORT;
const MONGO_URI = CONFIG.MONGO_URI;

const limiter = rateLimit({
	windowMs: 60 * 1000,
	max: 100,
	handler: (req, res) => {
		console.log("Rate limit exceeded:", req.ip);
		res.status(429).json({
			message: "Too many requests",
		});
	},
});

app.use(limiter);
// Middleware
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(
	bodyParser.json({
		verify: (req, res, buf) => {
			req.rawBody = buf.toString();
		},
	}),
);
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use(cookieParser());
app.use(cors(CONFIG.corsOptions));

app.use(helmet());
app.use((req, res, next) => {
	res.locals.nonce = crypto.randomBytes(16).toString("base64");
	console.log(
		new Date().toISOString(),
		req.method,
		req.originalUrl,
		req.ip,
		req.headers["user-agent"],
	);
	next();
});
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

// app.use(
// 	helmet.expectCt({
// 		enforce: true,
// 		maxAge: 30,
// 		reportUri: "https://businessn-erp.com",
// 	}),
// );

app.use(helmet.referrerPolicy({ policy: "no-referrer" }));

app.use(helmet.permittedCrossDomainPolicies({ policy: "none" }));

app.use(helmet.originAgentCluster());

// Routes
app.use("/api", appRoutes);
app.use("/api/timecard", timecardRoutes);
app.use("/api/ticket", ticketRoutes);
app.use("/api/resource", resourceRoutes);
app.use("/api/affiliate", affiliateRoutes);

app.use(authenticateToken);
app.use("/api/accounting", accountingRoutes);
app.use("/api/budgeting", budgetingRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/alert", alertRoutes);
app.use("/api/assessment", assessmentRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/holiday", holidayRoutes);
app.use("/api/industry", industryRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/leaves", leaveRequestRoutes);
app.use("/api/log-tasks", logTaskRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payouts", payoutRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/payroll/payInfo", payInfoRoutes);
app.use("/api/payroll/profileInfo", profileInfoRoutes);
app.use("/api/payroll/roe", roeRoutes);
app.use("/api/payroll/employmentInfo", employmentInfo);
app.use("/api/payroll/governmentInfo", governmentInfo);
app.use("/api/payroll/bankingInfo", bankingInfo);
app.use("/api/payroll/balanceInfo", balanceInfo);
app.use("/api/payroll/additionalAllocation", additionalAllocationInfo);
app.use("/api/permissions", permissionsRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/questionnaire", questionnaireRoutes);
app.use("/api/payroll/report", reportRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/setup", setUpRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/timesheet", timesheetRoutes);
app.use("/api/user", userRoutes);
// app.use("/api/generate-t4", t4SlipRoutes);
app.use("/api/vopay", vopayRoutes);
// app.use("/api/vopay-webhook", vopayWebHookRoutes(io));

// Scheduler job
runStatHolidayJob();

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", () => {
	console.log("Connected to MongoDB");
});

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
