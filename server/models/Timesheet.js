const mongoose = require("mongoose");

const timesheetSchema = new mongoose.Schema({
	department: String,
	approveStatus: { type: String, default: "Pending" },
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
	updatedOn: { type: Date, default: Date.now },
	createdOn: { type: Date, default: Date.now },
});

const Timesheet = mongoose.model("Timesheet", timesheetSchema);

module.exports = Timesheet;
