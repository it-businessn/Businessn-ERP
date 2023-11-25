const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  message: String,
  type: String, // 'sales', 'payroll', 'accounting', etc.
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
