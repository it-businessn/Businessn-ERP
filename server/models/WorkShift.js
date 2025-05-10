const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema({
	empName: String,
	role: String,
	notes: String,
	location: { type: String, ref: "Location" },
	shiftDate: Date,
	shiftStart: String,
	shiftEnd: String,
	repeatSchedule: Boolean,
	repeatDuration: String,
	createdOn: { type: Date, default: Date.now },
	breakStart: Date,
	breakDuration: String,
	crew: String,
	breakEnd: Date,
	companyName: { type: String, ref: "Company" },
});

const WorkShift = mongoose.model("WorkShift", shiftSchema);

module.exports = WorkShift;
