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
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
	roles: { type: Array, default: [] },
});

const EmployeeROE = mongoose.model("EmployeeROE", employeeROESchema);

module.exports = EmployeeROE;
