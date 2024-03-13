require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const activityRoutes = require("./routes/activity");
const contactRoutes = require("./routes/contact");
const eventRoutes = require("./routes/event");
const leadRoutes = require("./routes/lead");
const meetingRoutes = require("./routes/meeting");
const noteRoutes = require("./routes/note");
const opportunityRoutes = require("./routes/opportunity");
const projectRoutes = require("./routes/project");
const resourcesRoutes = require("./routes/resource");
const setUpRoutes = require("./routes/setup");
const taskRoutes = require("./routes/task");
const userRoutes = require("./routes/user");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use(cors());

app.use((request, response, next) => {
	console.log(request.path, request.method);
	next();
});

//routes
app.use("/api/activities", activityRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/resources", resourcesRoutes);
app.use("/api/set-up", setUpRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/user", userRoutes);

mongoose.connect(process.env.DB_CONNECTION_URL_STAGING_CRM, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// mongoose.connect(process.env.DB_CONNECTION_URL_PROD_CRM, {
// 	useNewUrlParser: true,
// 	useUnifiedTopology: true,
// });

const db = mongoose.connection;

db.once("open", () => {
	console.log("Connected to MongoDB");
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
