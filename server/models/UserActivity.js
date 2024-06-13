const mongoose = require("mongoose");

const userActivitySchema = new mongoose.Schema({
	loginTime: { type: Date, required: true },
	logoutTime: { type: Date },
	userID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Employee",
	},
});

const UserActivity = mongoose.model("UserActivity", userActivitySchema);

module.exports = UserActivity;
