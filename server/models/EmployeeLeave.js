const mongoose = require("mongoose");

const employeeLeaveSchema = new mongoose.Schema({
	employeeId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Employee",
	},
	type: String,
	startDate: Date,
	endDate: Date,
	updatedOn: { type: Date, default: Date.now },
	createdOn: { type: Date, default: Date.now },
	companyName: { type: String, ref: "Company" },
	totalLeaveHrs: Number,
	totalLeaveDays: Number,
});

module.exports = mongoose.model("EmployeeLeave", employeeLeaveSchema);
