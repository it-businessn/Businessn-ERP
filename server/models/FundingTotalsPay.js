const mongoose = require("mongoose");
const { logIndexErrors } = require("../utils/db.util");

const fundingTotalsPaySchema = new mongoose.Schema(
	{
		companyName: { type: String, ref: "Company" },
		payPeriodStartDate: Date,
		payPeriodEndDate: Date,
		payPeriodPayDate: Date,
		payPeriodProcessingDate: Date,
		payPeriodNum: String,
		isProcessed: { type: Boolean, default: false },
		isExtraRun: { type: Boolean, default: false },
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
		scheduleFrequency: String,
		// SUBMIT-01: outcome of the VoPay fund transfer for this run, claimed
		// atomically before the transfer so a repeated submit cannot pay twice.
		// "in_progress" | "sent" | "failed" | "skipped" (failed/skipped may retry).
		fundTransferStatus: { type: String, default: null },
		fundTransferAt: Date,
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

// AUD-015: one funding-totals record per pay run (the keys
// reportController.buildFundingTotalsReport upserts on). payPeriodPayDate is
// stored at UTC start of day, the form every reader queries with.
fundingTotalsPaySchema.index(
	{ companyName: 1, payPeriodNum: 1, isExtraRun: 1, payPeriodPayDate: 1, scheduleFrequency: 1 },
	{ unique: true, name: "uniq_funding_totals_run" },
);

const FundingTotalsPay = mongoose.model("FundingTotalsPay", fundingTotalsPaySchema);
// AUD-015: a failed unique-index build (existing duplicates) is logged, not fatal.
logIndexErrors(FundingTotalsPay);

module.exports = FundingTotalsPay;
