const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
	{
		companyName: { type: String, ref: "Company" },
		message: String,
		title: String,
		senderId: String,
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const Announcement = mongoose.model("Announcement", announcementSchema);

module.exports = Announcement;
