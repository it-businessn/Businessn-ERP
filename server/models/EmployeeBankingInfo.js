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

// AUD-015 (docs/TECHNICAL.md U3/I4): lookup index for the (companyName, empId) filter.
// Not unique: onBoardNewUser creates this record without checking for an
// existing one, so duplicates can exist (see scripts/check-duplicates.js).
employeeBankingInfoSchema.index({ companyName: 1, empId: 1 });

const EmployeeBankingInfo = mongoose.model("EmployeeBankingInfo", employeeBankingInfoSchema);

module.exports = EmployeeBankingInfo;
