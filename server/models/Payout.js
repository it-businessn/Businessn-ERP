const mongoose = require("mongoose");

const payoutSchema = new mongoose.Schema({
	amount: Number,
	status: { type: String, default: "Pending" },
	affiliate: { type: String, ref: "Employee" },
	saleId: String,
	customerName: String,
	customerCode: String,
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
	companyName: { type: String, ref: "Company" },
});

const Payout = mongoose.model("Payout", payoutSchema);

module.exports = Payout;
