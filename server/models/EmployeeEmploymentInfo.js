const mongoose = require("mongoose");

const employeeEmploymentInfoSchema = new mongoose.Schema(
	{
		empId: { type: String, ref: "Employee" },
		companyName: { type: String, ref: "Company" },
		payrollStatus: String,
		employeeNo: String,
		employmentStartDate: Date,
		employmentLeaveDate: Date,
		employmentRole: String,
		regPay: String,
		employmentRegion: String,
		employmentCountry: String,
		positions: { type: Array, default: [] },
		timeManagementBadgeID: String,
		lastBadgeId: Object,
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

// Performance (F-04): indexes for the query shapes used by the controllers.
// Fields are unchanged; Mongoose builds these in the background on startup.
employeeEmploymentInfoSchema.index({ companyName: 1, empId: 1 });
employeeEmploymentInfoSchema.index({ companyName: 1, payrollStatus: 1, employmentRole: 1 });

const EmployeeEmploymentInfo = mongoose.model(
	"EmployeeEmploymentInfo",
	employeeEmploymentInfoSchema,
);

module.exports = EmployeeEmploymentInfo;
