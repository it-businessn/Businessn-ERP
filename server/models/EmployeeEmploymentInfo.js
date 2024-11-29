const mongoose = require("mongoose");

const employeeEmploymentInfoSchema = new mongoose.Schema({
	empId: { type: String, ref: "Employee" },
	companyName: { type: String, ref: "Company" },
	payrollStatus: String,
	employeeNo: String,
	timeManagementBadgeID: String,
	employmentStartDate: Date,
	employmentLeaveDate: Date,
	employmentRole: String,
	employmentPayGroup: String,
	employmentCostCenter: String,
	employmentDepartment: { type: Array, default: [] },
	companyDepartment: String,
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
	regPay: String,
	employmentRegion: String,
	employmentCountry: String,
});

const EmployeeEmploymentInfo = mongoose.model(
	"EmployeeEmploymentInfo",
	employeeEmploymentInfoSchema,
);

module.exports = EmployeeEmploymentInfo;
