const mongoose = require("mongoose");

const { Schema } = mongoose;
const notificationSchema = new Schema(
	{
		message: String,
		date: Date,
		updatedby,
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
	{ collection: "Notification" },
);

module.exports = mongoose.model("Notification", notificationSchema);
// eg-Reminder: You have new update on your leave request
// Upcoming Event: Payroll cutoff date on July 15th at 7:00 PM
// Important Deadline: Project submission due on September 20th
