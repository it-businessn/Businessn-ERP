const mongoose = require("mongoose");

const timesheetSchema = new mongoose.Schema({
	employeeId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "Employee",
	},
	department: String,
	approveStatus: { type: String, default: "Pending" },
	payRate: Number,
	payType: String,
	employeeName: String,
	clockIns: [],
	clockOuts: [],
	startTime: { type: String, default: "00:00" },
	endTime: { type: String, default: "00:00" },
	startBreaks: [Date],
	endBreaks: [Date],
	totalHours: Number,
	totalTimeCardHours: Number,
	projectEntries: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
	updatedOn: { type: Date, default: Date.now },
	createdOn: { type: Date, default: Date.now },
	companyName: { type: String, ref: "Company" },
	regPay: String,
	totalBreaks: { type: Number, default: "0" },
	overTimePay: String,
	dblOverTimePay: String,
	statWorkPay: String,
	statPay: String,
	sickPay: String,
	vacationPay: String,
	statPayHours: Number,
	sickHoursWorked: Number,
	regHoursWorked: { type: Number, default: 0 },
	overtimeHoursWorked: { type: Number, default: 0 },
	dblOvertimeHoursWorked: { type: Number, default: 0 },
	statDayHoursWorked: { type: Number, default: 0 },
	statDayHours: { type: Number, default: 8 },
	sickPayHours: { type: Number, default: 0 },
	vacationPayHours: { type: Number, default: 0 },
});

const Timesheet = mongoose.model("Timesheet", timesheetSchema);

module.exports = Timesheet;
