const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
	{
		companyName: { type: String, ref: "Company" },
		orderNumber: String,
		fundingTotalsId: { type: String, ref: "FundingTotalsPay" },
		totalRecipients: Number,
		customer: String,
		fundsReceivedStatus: { type: String, default: "Unsettled" },
		empEFTSentStatus: { type: String, default: "Unsettled" },
		empEFTDepositedStatus: { type: String, default: "Unsettled" },
		craSentStatus: { type: String, default: "Unsettled" },
		craDepositedStatus: { type: String, default: "Unsettled" },
		fulfillmentStatus: { type: String, default: "Unsettled" },
		// ORDERS-01: the VoPay employee transfer of this payroll run
		vopayTransactionId: String,
		vopayStatus: String,
		vopayStatusAt: Date,
		vopayFailureReason: String,
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);
orderSchema.index({ fundingTotalsId: 1 });
orderSchema.index({ vopayTransactionId: 1 }, { sparse: true });

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
