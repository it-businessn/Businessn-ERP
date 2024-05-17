const mongoose = require("mongoose");

const timesheetSchema = new mongoose.Schema({
	department: String,
	approveStatus: String,
	payRate: Number,
	payType: String,
	// clockIn: Date,
	// clockOut: Date,
	// startBreak: Date,
	// endBreak: Date,
	employeeId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "Employee",
	},
	employeeName: String,
	clockIns: [Date],
	clockOuts: [Date],
	startBreaks: [Date],
	endBreaks: [Date],
	totalHours: Number,
	totalTimeCardHours: Number,
	projectEntries: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
});

const Timesheet = mongoose.model("Timesheet", timesheetSchema);

module.exports = Timesheet;
