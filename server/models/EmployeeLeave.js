const mongoose = require("mongoose");

const employeeLeaveSchema = new mongoose.Schema(
	{
		employeeId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Employee",
		},
		type: String,
		startDate: Date,
		endDate: Date,
		companyName: { type: String, ref: "Company" },
		totalLeaveHrs: Number,
		totalLeaveDays: Number,
		status: { type: String, default: "Pending" },
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

module.exports = mongoose.model("EmployeeLeave", employeeLeaveSchema);
