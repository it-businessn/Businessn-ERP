const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
	companyName: { type: String, ref: "Company" },
	message: String,
	title: String,
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
	senderId: String,
});

const Announcement = mongoose.model("Announcement", announcementSchema);

module.exports = Announcement;
