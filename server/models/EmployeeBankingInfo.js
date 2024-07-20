const mongoose = require("mongoose");

const employeeBankingInfoSchema = new mongoose.Schema({
	empId: { type: String, ref: "Employee" },
	companyName: { type: String, ref: "Company" },
	directDeposit: String,
	bankNum: String,
	transitNum: String,
	accountNum: String,
	payStubSendByEmail: String,
	paymentEmail: String,
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
});

const EmployeeBankingInfo = mongoose.model(
	"EmployeeBankingInfo",
	employeeBankingInfoSchema,
);

module.exports = EmployeeBankingInfo;
