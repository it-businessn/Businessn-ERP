const mongoose = require("mongoose");

const employeeProfileInfoSchema = new mongoose.Schema({
	empId: { type: String, ref: "Employee" },
	companyName: { type: String, ref: "Company" },
	payrollStatus: String,
	employeeNo: String,
	timeManagementBadgeID: String,
	firstName: String,
	middleName: String,
	lastName: String,
	emergencyFirstName: String,
	emergencyLastName: String,
	birthDate: Date,
	SIN: String,
	maritalStatus: String,
	citizenship: String,
	workPermitNo: String,
	workPermitExpiryNo: String,
	personalEmail: String,
	personalPhoneNum: String,
	businessEmail: String,
	businessPhoneNum: String,
	emergencyPersonalEmail: String,
	emergencyPersonalPhoneNum: String,
	streetAddress: String,
	city: String,
	province: String,
	country: String,
	postalCode: String,
	password: String,
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
});

const EmployeeProfileInfo = mongoose.model(
	"EmployeeProfileInfo",
	employeeProfileInfoSchema,
);

module.exports = EmployeeProfileInfo;
