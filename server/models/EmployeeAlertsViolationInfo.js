const mongoose = require("mongoose");

const employeeAlertsInfoSchema = new mongoose.Schema(
	{
		empId: { type: String, ref: "Employee" },
		companyName: { type: String, ref: "Company" },
		description: String,
		type: String,
		actionRequired: Boolean,
		payPeriodNum: { type: String, ref: "EmployeePayStub" },
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const EmployeeAlertsViolationInfo = mongoose.model(
	"EmployeeAlertsViolationInfo",
	employeeAlertsInfoSchema,
);

module.exports = EmployeeAlertsViolationInfo;
