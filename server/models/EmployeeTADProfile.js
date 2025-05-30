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
	isNewUser: { type: Boolean, default: true },
});

const EmployeeTADProfileInfo = mongoose.model(
	"EmployeeTADProfileInfo",
	employeeTADProfileInfoSchema,
);

module.exports = EmployeeTADProfileInfo;
