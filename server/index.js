require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const activityRoutes = require("./routes/activity");
const conversationRoutes = require("./routes/conversation");
const companyResourceRoutes = require("./routes/companyResource");
const companyRoutes = require("./routes/company");
const contactRoutes = require("./routes/contact");
const employeeRoutes = require("./routes/employee");
const eventRoutes = require("./routes/event");
const formRoutes = require("./routes/form");
const leadRoutes = require("./routes/lead");
const meetingRoutes = require("./routes/meeting");
const noteRoutes = require("./routes/note");
const notificationRoutes = require("./routes/notification");
const opportunityRoutes = require("./routes/opportunity");
const permissionsRoutes = require("./routes/permission");
const projectRoutes = require("./routes/project");
const scheduleRoutes = require("./routes/schedule");
const setUpRoutes = require("./routes/setup");
const userRoutes = require("./routes/user");
const timesheetRoutes = require("./routes/timesheet");
const taskRoutes = require("./routes/task");
const logTaskRoutes = require("./routes/logTask");
const questionnaireRoutes = require("./routes/questionnaire");

const app = express();
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const PORT = process.env.PORT;

app.use("/assets", express.static(path.join(__dirname, "assets")));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use(cors());

app.use((request, response, next) => {
	console.log(request.path, request.method);
	next();
});

//routes

app.use("/api", userRoutes);
app.use("/api/user", userRoutes);
app.use("/api/comms", conversationRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/companyResource", companyResourceRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/form", formRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/permissions", permissionsRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/setup", setUpRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/timesheet", timesheetRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/log-tasks", logTaskRoutes);
app.use("/api/questionnaire", questionnaireRoutes);
// app.use("/api/attendance", attendanceRoutes);
// app.use("/api/benefits", benefitsRoutes);
// app.use("/api/configuration", configurationRoutes);
// app.use("/api/dashboard", dashboardRoutes);
// app.use("/api/leave-balances", leaveBalanceRoutes);
// app.use("/api/leave-requests", leaveRequestRoutes);
// app.use("/api/payroll", payrollRoutes);
// app.use("/api/payslips", payslipRoutes);
// app.use("/api/tasks", taskRoutes);
// app.use("/api/tasks/:taskId/subtask", subTaskRoutes);
// app.use("/api/tax", taxRoutes);
// app.use("/api/user-roles", rolesRoutes);

mongoose.connect(process.env.DB_CONNECTION_URL_STAGING_CRM, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once("open", () => {
	console.log("Connected to MongoDB");
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
