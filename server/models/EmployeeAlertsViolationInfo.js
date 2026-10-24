const mongoose = require("mongoose");
const { logIndexErrors } = require("../utils/db.util");

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

// ALERTS-01: one alert per problem (company, employee, type); see alertsController.
// The index builds at server start once legacy per-period copies are gone (the
// next inputs review removes them, or scripts/resolve-duplicates.js --apply);
// until then the build error is logged and the next restart tries again.
employeeAlertsInfoSchema.index(
	{ companyName: 1, empId: 1, type: 1 },
	{ unique: true, name: "uniq_alert_per_problem" },
);

const EmployeeAlertsViolationInfo = mongoose.model(
	"EmployeeAlertsViolationInfo",
	employeeAlertsInfoSchema,
);

module.exports = logIndexErrors(EmployeeAlertsViolationInfo);
