const mongoose = require("mongoose");

const employeeBalanceInfoSchema = new mongoose.Schema({
	empId: { type: String, ref: "Employee" },
	companyName: { type: String, ref: "Company" },
	carryFwd: Boolean,
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
});

const EmployeeBalanceInfo = mongoose.model(
	"EmployeeBalanceInfo",
	employeeBalanceInfoSchema,
);

module.exports = EmployeeBalanceInfo;
