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
	companyName: { type: String, ref: "Company" },
	regPay: String,
	overTimePay: String,
	dblOverTimePay: String,
	statWorkPay: String,
	statPay: String,
	sickPay: String,
	regHoursWorked: { type: Number, default: 40 },
	overtimeHoursWorked: { type: Number, default: 20 },
	dblOvertimeHoursWorked: { type: Number, default: 10 },
	statDayHoursWorked: { type: Number, default: 10 },
	statPayHours: { type: Number, default: 0 },
	sickHoursWorked: { type: Number, default: 0 },
	vacationHoursWorked: { type: Number, default: 0 },
});

const Timesheet = mongoose.model("Timesheet", timesheetSchema);

module.exports = Timesheet;
