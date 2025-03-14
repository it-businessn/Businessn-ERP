const mongoose = require("mongoose");

const employeeROESchema = new mongoose.Schema({
	empId: { type: String, ref: "Employee" },
	companyName: { type: String, ref: "Company" },
	employmentStartDate: Date,
	employmentLeaveDate: Date,
	finalPayPeriodEndDate: Date,
	reasonCode: String,
	expectedRecallDate: String,
	recallDate: Date,
	contactExtNumber: String,
	contactName: String,
	contactTelNumber: String,
	issuerExtNumber: String,
	issuerName: String,
	issuerTelNumber: String,
	preferredCommunication: String,
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
	positions: { type: Array, default: [] },
});

const EmployeeROE = mongoose.model("EmployeeROE", employeeROESchema);

module.exports = EmployeeROE;
