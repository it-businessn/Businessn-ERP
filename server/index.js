require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cron = require("node-cron");
const moment = require("moment");

const { addStatHolidayTimesheet } = require("./controllers/timesheetContoller");
const { STAT_HOLIDAYS } = require("./services/data");
const activityRoutes = require("./routes/activityRoutes");
const appRoutes = require("./routes/appRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const contactRoutes = require("./routes/contactRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const eventRoutes = require("./routes/eventRoutes");
const industryRoutes = require("./routes/industryRoutes");
const leadRoutes = require("./routes/leadRoutes");
const logTaskRoutes = require("./routes/logTaskRoutes");
const meetingRoutes = require("./routes/meetingRoutes");
const noteRoutes = require("./routes/noteRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const opportunityRoutes = require("./routes/opportunityRoutes");
const payoutRoutes = require("./routes/payoutRoutes");
const payrollRoutes = require("./routes/payrollRoutes");
const payInfoRoutes = require("./routes/payInfoRoutes");
const profileInfoRoutes = require("./routes/profileInfoRoutes");
const employmentInfo = require("./routes/employmentInfo");
const governmentInfo = require("./routes/governmentInfo");
const bankingInfo = require("./routes/bankingInfo");
const additionalAllocationInfo = require("./routes/additionalAllocationInfo");
const balanceInfo = require("./routes/balanceInfo");
const permissionsRoutes = require("./routes/permissionRoutes");
const projectRoutes = require("./routes/projectRoutes");
const questionnaireRoutes = require("./routes/questionnaireRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const setUpRoutes = require("./routes/setupRoutes");
const taskRoutes = require("./routes/taskRoutes");
const timesheetRoutes = require("./routes/timesheetRoutes");
const timecardRoutes = require("./routes/timecardRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const PORT = process.env.PORT;
const MONGO_URI = process.env.DB_CONNECTION_URL_STAGING_CRM;

// Middleware
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use(cors());

app.use((request, response, next) => {
	console.log(request.path, request.method);
	next();
});

// Routes

app.use("/api", appRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/assessment", assessmentRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/industry", industryRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/log-tasks", logTaskRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/payouts", payoutRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/payroll/payInfo", payInfoRoutes);
app.use("/api/payroll/profileInfo", profileInfoRoutes);
app.use("/api/payroll/employmentInfo", employmentInfo);
app.use("/api/payroll/governmentInfo", governmentInfo);
app.use("/api/payroll/bankingInfo", bankingInfo);
app.use("/api/payroll/balanceInfo", balanceInfo);
app.use("/api/payroll/additionalAllocation", additionalAllocationInfo);
app.use("/api/permissions", permissionsRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/questionnaire", questionnaireRoutes);
app.use("/api/resource", resourceRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/setup", setUpRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/timesheet", timesheetRoutes);
app.use("/api/timecard", timecardRoutes);
app.use("/api/user", userRoutes);

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
// app.use("/api/leave-requests", leaveRequestRoutes);

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;

// Scheduling to add timecard entry to run every day at midnight
cron.schedule("0 0 * * *", () => {
	// cron.schedule("*/15 * * * * *", () => { //every 15sec
	const isStatDay = STAT_HOLIDAYS.find(
		({ date }) => date === moment().format("YYYY-MM-DD"),
	);
	if (isStatDay) {
		console.log("Running daily task at midnight");
		addStatHolidayTimesheet("The Owners Of Strata Plan NW1378");
	} else return;
});

db.once("open", () => {
	console.log("Connected to MongoDB");
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
