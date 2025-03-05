const mongoose = require("mongoose");

const employeeEmploymentInfoSchema = new mongoose.Schema({
	empId: { type: String, ref: "Employee" },
	companyName: { type: String, ref: "Company" },
	payrollStatus: String,
	employeeNo: String,
	employmentStartDate: Date,
	employmentLeaveDate: Date,
	employmentRole: String,
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
	regPay: String,
	employmentRegion: String,
	employmentCountry: String,
	positions: { type: Array, default: [] },
});

const EmployeeEmploymentInfo = mongoose.model(
	"EmployeeEmploymentInfo",
	employeeEmploymentInfoSchema,
);

module.exports = EmployeeEmploymentInfo;
