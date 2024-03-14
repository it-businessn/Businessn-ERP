const mongoose = require("mongoose");

const { Schema } = mongoose;
const attendanceSchema = new Schema(
	{
		employeeId: {
			type: String,
			ref: "User",
			required: true,
		},
		clockInTime: {
			type: String,
			required: true,
		},
		clockOutTime: {
			type: String,
			required: true,
		},
		breakInTime: {
			type: String,
			required: true,
		},
		breakOutTime: {
			type: String,
			required: true,
		},
		attendanceStatus: String,
		isLate: Boolean,
		// breakStart: {
		//     type: Date,
		// },
		// breakEnd: {
		//     type: Date,
		// },
		totalWorkHours: Number,
		totalDaysPresent: Number,
	},
	{ timestamps: true },
	{ collection: "AttendanceLog" },
);

module.exports = mongoose.model("AttendanceLog", attendanceSchema);
