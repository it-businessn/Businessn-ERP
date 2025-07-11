console.log("NODE_ENV", process.env.NODE_ENV);

if (process.env.NODE_ENV === "development") {
	require("dotenv").config({ path: ".env.local" });
	console.log("Using .env.local file");
} else {
	require("dotenv").config();
}

const express = require("express");
const crypto = require("crypto");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cron = require("node-cron");
const moment = require("moment");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const { addStatHolidayTimesheet } = require("./controllers/timesheetController");
const accountingRoutes = require("./routes/accountingRoutes");
const activityRoutes = require("./routes/activityRoutes");
const appRoutes = require("./routes/appRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const contactRoutes = require("./routes/contactRoutes");
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
const payStubRoutes = require("./routes/payStubRoutes");
const payInfoRoutes = require("./routes/payInfoRoutes");
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
const resourceRoutes = require("./routes/resourceRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const setUpRoutes = require("./routes/setupRoutes");
const taskRoutes = require("./routes/taskRoutes");
const timesheetRoutes = require("./routes/timesheetRoutes");
const timecardRoutes = require("./routes/timecardRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const userRoutes = require("./routes/userRoutes");
const t4SlipRoutes = require("./routes/t4SlipRoutes");

const app = express();
const expressLayouts = require("express-ejs-layouts");
const rateLimit = require("express-rate-limit");
const path = require("path");
const { authenticateToken } = require("./middleware/auth");
const corsOptions = require("./config");
const { getAllCompanies, getHolidays } = require("./controllers/setUpController");
const PORT = process.env.PORT;
const MONGO_URI = process.env.DB_CONNECTION_URL_STAGING_CRM;
const limiter = rateLimit({
	windowMs: 60 * 1000, // 1 minutes
	max: 100, // Limit each IP to 100 requests per windowMs
	message: "Too many requests, please try again later.",
});

app.use(limiter);
// Middleware
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use(cookieParser());
app.use(cors(corsOptions));

app.use(helmet());
app.use((req, res, next) => {
	res.locals.nonce = crypto.randomBytes(16).toString("base64");
	console.log(req.path, req.method);
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
app.use(authenticateToken);
app.use("/api/accounting", accountingRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/assessment", assessmentRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/events", eventRoutes);
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
app.use("/api/payroll/payDetailsReport", payStubRoutes);
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
app.use("/api/schedule", scheduleRoutes);
app.use("/api/setup", setUpRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/timesheet", timesheetRoutes);
app.use("/api/user", userRoutes);
app.use("/api/generate-t4", t4SlipRoutes);

// app.use("/api/company", companyRoutes);
// app.use("/api/payslips", payslipRoutes);
// app.use("/api/tasks", taskRoutes);
// app.use("/api/tasks/:taskId/subtask", subTaskRoutes);
// app.use("/api/tax", taxRoutes);
// app.use("/api/user-roles", rolesRoutes);
// app.use("/api/attendance", attendanceRoutes);
// app.use("/api/benefits", benefitsRoutes);
// app.use("/api/configuration", configurationRoutes);
// app.use("/api/dashboard", dashboardRoutes);
// app.use("/api/leave-balances", leaveBalanceRoutes);

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;

// Scheduler
cron.schedule("0 0 * * *", async () => {
	// every 15sec
	// cron.schedule("*/15 * * * * *", async() => {
	// const isStatDay = STAT_HOLIDAYS.find(({ date }) => date === moment().format("YYYY-MM-DD"));

	const allCompanies = await getAllCompanies();
	allCompanies?.forEach(async (company) => {
		const currentYrSTAT_HOLIDAYS = await getHolidays({
			companyName: company.name,
		});
		if (!currentYrSTAT_HOLIDAYS.length) {
			return;
		}
		const isStatDay = currentYrSTAT_HOLIDAYS.find(
			({ date }) => moment.utc(date).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD"),
		);

		if (isStatDay) {
			console.log("Scheduling to add timecard entry to run every day at midnight", company.name);
			addStatHolidayTimesheet(company.name);
		} else return;
	});
});

db.once("open", () => {
	console.log("Connected to MongoDB");
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
