const mongoose = require("mongoose");

const employeeBankingInfoSchema = new mongoose.Schema(
	{
		empId: { type: String, ref: "Employee" },
		companyName: { type: String, ref: "Company" },
		directDeposit: String,
		bankNum: String,
		transitNum: String,
		accountNum: String,
		accountIv: String,
		transitIv: String,
		bankIv: String,
		payStubSendByEmail: String,
		paymentEmail: String,
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const EmployeeBankingInfo = mongoose.model("EmployeeBankingInfo", employeeBankingInfoSchema);

module.exports = EmployeeBankingInfo;
