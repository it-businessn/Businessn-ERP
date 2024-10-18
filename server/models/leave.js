const mongoose = require("mongoose");
const { LeaveUtilization } = require("./additionalDetail");

const { Schema } = mongoose;
const employeeLeaveSchema = new Schema(
	{
		employeeId: {
			type: String,
			ref: "User",
			required: true,
		},
		startDate: {
			type: Date,
			required: true,
		},
		endDate: {
			type: Date,
			required: true,
		},
		reason: {
			type: String,
			required: true,
		},
		leaveRequestStatus: String,
		createdAt: Date,
		approver: {
			//approver name and email
			type: String,
			ref: "User",
			required: true,
		},
		approverComment: String,
		duration: Number,
		leaveBalance: LeaveUtilization,
		leaveType: {
			type: String,
		},
		accruedLeaves: Number,
		usedLeaves: Number,
		remainingLeaves: Number,
	},
	{ timestamps: true },
	{ collection: "LeaveDetails" },
);

module.exports = mongoose.model("LeaveDetails", employeeLeaveSchema);
