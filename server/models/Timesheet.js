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
	regHoursWorked: { type: String, default: "00:00" },
	overtimeHoursWorked: { type: String, default: "00:00" },
	dblOvertimeHoursWorked: { type: String, default: "00:00" },
	statDayHoursWorked: { type: String, default: "00:00" },
	statDayHours: { type: String, default: "8.0" },
	sickPayHours: { type: String, default: "00:00" },
	vacationPayHours: { type: String, default: "00:00" },
});

const Timesheet = mongoose.model("Timesheet", timesheetSchema);

module.exports = Timesheet;
