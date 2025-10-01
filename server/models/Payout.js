const mongoose = require("mongoose");

const payoutSchema = new mongoose.Schema(
	{
		amount: Number,
		status: { type: String, default: "Pending" },
		affiliate: { type: String, ref: "Employee" },
		saleId: String,
		customerName: String,
		customerCode: String,
		companyName: { type: String, ref: "Company" },
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const Payout = mongoose.model("Payout", payoutSchema);

module.exports = Payout;
