const mongoose = require("mongoose");

const fundingTotalsPaySchema = new mongoose.Schema({
	companyName: { type: String, ref: "Company" },
	payPeriodStartDate: Date,
	payPeriodEndDate: Date,
	payPeriodPayDate: Date,
	payPeriodProcessingDate: Date,
	payPeriodNum: String,
	isProcessed: { type: Boolean, default: false },
	isExtraRun: { type: Boolean, default: false },
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
	totalIncomeTaxContr: { type: Number, default: 0 },
	totalCPP_EE_Contr: { type: Number, default: 0 },
	totalCPP_ER_Contr: { type: Number, default: 0 },
	totalCPP_Contr: { type: Number, default: 0 },
	totalEI_EE_Contr: { type: Number, default: 0 },
	totalEI_ER_Contr: { type: Number, default: 0 },
	totalEI_Contr: { type: Number, default: 0 },
	totalGovtContr: { type: Number, default: 0 },
	totalNetPay: { type: Number, default: 0 },
	totalBatchCharges: { type: Number, default: 0 },
	totalEmpPayrollCost: { type: Number, default: 0 },
	timeClockMaintenanceCost: { type: Number, default: 0 },
	totalTimeManagementEmpCost: { type: Number, default: 0 },
	totalCorePayrollCost: { type: Number, default: 0 },
	totalTimeManagementPayrollCost: { type: Number, default: 0 },
	totalServiceCharges: { type: Number, default: 0 },
	totalFundingWithDrawals: { type: Number, default: 0 },
	totalEmpPaymentRemitCost: { type: Number, default: 0 },
});

const FundingTotalsPay = mongoose.model("FundingTotalsPay", fundingTotalsPaySchema);

module.exports = FundingTotalsPay;
