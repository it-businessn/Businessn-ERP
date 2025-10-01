const mongoose = require("mongoose");

const employeeT4Schema = new mongoose.Schema(
	{
		empId: { type: String, ref: "Employee" },
		companyName: { type: String, ref: "Company" },
		employeeNo: { type: String, ref: "EmployeeEmploymentInfo" },
		SIN: { type: String, ref: "EmployeeProfileInfo" },
		pensionDetails: { type: String, ref: "EmployeeGovernmentInfo" },
		slipDataType: { type: String, default: "T4" },
		employerDentalBenefitReportCode: { type: String, ref: "EmployeeBalanceInfo" }, //11. <empr_dntl_ben_rpt_cd>1</empr_dntl_ben_rpt_cd>

		taxYear: Date,
		totalSlips: Number,
		proprietorSinType: String,
		fileAmendmentNotes: String,
		totalT4Amount: Number, //12.T4AmtType
		otherInformationType: String, //13.OtherInformationType
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const EmployeeT4 = mongoose.model("EmployeeT4", employeeT4Schema);

module.exports = EmployeeT4;
