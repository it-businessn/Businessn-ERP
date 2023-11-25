require("dotenv").config();

const activityRoutes = require("./routes/activities");
const bodyParser = require("body-parser");
const contactRoutes = require("./routes/contacts");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const opportunityRoutes = require("./routes/opportunity");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use((request, response, next) => {
  console.log(request.path, request.method);
  next();
});

//routes
app.use("/api/activities", activityRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/opportunities", opportunityRoutes);

mongoose.connect(process.env.DB_CONNECTION_URL_LOCAL, {
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
