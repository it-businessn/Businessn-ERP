const mongoose = require("mongoose");

const userActivitySchema = new mongoose.Schema({
	loginTime: { type: Date, required: true },
	logoutTime: { type: Date },
	userID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Employee",
	},
});

// Performance (F-04): indexes for the query shapes used by the controllers.
// Fields are unchanged; Mongoose builds these in the background on startup.
userActivitySchema.index({ userID: 1, logoutTime: 1 });
userActivitySchema.index({ loginTime: 1 });

const UserActivity = mongoose.model("UserActivity", userActivitySchema);

module.exports = UserActivity;
