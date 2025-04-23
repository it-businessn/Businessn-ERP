const mongoose = require("mongoose");

const employeeTADProfileInfoSchema = new mongoose.Schema({
	empId: { type: String, ref: "Employee" },
	companyName: { type: String, ref: "Company" },
	firstName: String,
	middleName: String,
	lastName: String,
	cardNum: String,
	timeManagementBadgeID: String,
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
});

const EmployeeTADProfileInfo = mongoose.model(
	"EmployeeTADProfileInfo",
	employeeTADProfileInfoSchema,
);

module.exports = EmployeeTADProfileInfo;
