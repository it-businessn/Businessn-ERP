const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
	// message: String,
	// type: String, // 'sales', 'payroll', 'accounting', etc.
	content: String,
	created_at: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
