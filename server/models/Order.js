const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
	companyName: { type: String, ref: "Company" },
	orderNumber: String,
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
	fundingTotalsId: { type: String, ref: "FundingTotalsPay" },
	totalRecipients: Number,
	customer: String,
	fundsReceivedStatus: { type: String, default: "Unsettled" },
	empEFTSentStatus: { type: String, default: "Unsettled" },
	empEFTDepositedStatus: { type: String, default: "Unsettled" },
	craSentStatus: { type: String, default: "Unsettled" },
	craDepositedStatus: { type: String, default: "Unsettled" },
	fulfillmentStatus: { type: String, default: "Unsettled" },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
