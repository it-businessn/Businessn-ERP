const mongoose = require("mongoose");

const employeeT4Schema = new mongoose.Schema({
	empId: { type: String, ref: "Employee" }, //EMPE_NM,
	companyName: { type: String, ref: "Company" }, // bn: Business Number,
	employeeNo: { type: String, ref: "EmployeeEmploymentInfo" }, //empe_nbr,empt_prov_cd
	SIN: { type: String, ref: "EmployeeProfileInfo" }, //EMPE_ADDR,sin
	pensionDetails: { type: String, ref: "EmployeeGovernmentInfo" }, //rpp_dpsp_rgst_nbr,cpp_qpp_xmpt_cd,ei_xmpt_cd,prov_pip_xmpt_cd,empt_cd
	slipDataType: { type: String, default: "T4" }, //rpt_tcd
	employerDentalBenefitReportCode: { type: String, ref: "EmployeeBalanceInfo" }, //empr_dntl_ben_rpt_cd
	taxYear: Date,
	totalSlips: Number,
	proprietorSinType: String,
	fileAmendmentNotes: String,
	totalT4Amount: Number,
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
});

const EmployeeT4 = mongoose.model("EmployeeT4", employeeT4Schema);

module.exports = EmployeeT4;
