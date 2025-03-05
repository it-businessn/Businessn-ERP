const mongoose = require("mongoose");
const { TIMESHEET_STATUS } = require("../services/data");

const timesheetSchema = new mongoose.Schema({
	employeeId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Employee",
	},
	department: String,
	approveStatus: { type: String, default: TIMESHEET_STATUS.PENDING },
	payRate: Number,
	payType: String,
	employeeName: String,
	clockIn: Date,
	clockOut: Date,
	breakOut: Date,
	breakIn: Date,
	totalBreakHours: { type: String, default: "" },
	startBreaks: [Date],
	endBreaks: [Date],
	totalHours: Number,
	totalWorkedHours: String,
	projectEntries: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
	updatedOn: { type: Date, default: Date.now },
	createdOn: { type: Date, default: Date.now },
	companyName: { type: String, ref: "Company" },
	positions: { type: Array, default: [] },
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
	breakHoursWorked: { type: Number, default: 0 },
	overtimeHoursWorked: { type: Number, default: 0 },
	dblOvertimeHoursWorked: { type: Number, default: 0 },
	statDayHoursWorked: { type: Number, default: 0 },
	statDayHours: { type: Number, default: 0 },
	sickPayHours: { type: Number, default: 0 },
	vacationPayHours: { type: Number, default: 0 },
	notDevice: Boolean,
	deleted: { type: Boolean, default: false },
	manualAdded: { type: Boolean, default: false },
});

const Timesheet = mongoose.model("Timesheet", timesheetSchema);

module.exports = Timesheet;
