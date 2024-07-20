const mongoose = require("mongoose");

const employeeEmploymentInfoSchema = new mongoose.Schema({
	empId: { type: String, ref: "Employee" },
	companyName: { type: String, ref: "Company" },
	employmentStartDate: Date,
	employmentLeaveDate: Date,
	employmentRole: String,
	employmentPayGroup: String,
	employmentCostCenter: String,
	employmentDepartment: String,
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
});

const EmployeeEmploymentInfo = mongoose.model(
	"EmployeeEmploymentInfo",
	employeeEmploymentInfoSchema,
);

module.exports = EmployeeEmploymentInfo;
