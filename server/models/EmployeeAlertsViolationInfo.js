const mongoose = require("mongoose");

const employeeAlertsInfoSchema = new mongoose.Schema({
	empId: { type: String, ref: "Employee" },
	companyName: { type: String, ref: "Company" },
	description: String,
	actionRequired: Boolean,
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
	payPeriodNum: { type: String, ref: "EmployeePayStub" },
});

const EmployeeAlertsViolationInfo = mongoose.model(
	"EmployeeAlertsViolationInfo",
	employeeAlertsInfoSchema,
);

module.exports = EmployeeAlertsViolationInfo;
