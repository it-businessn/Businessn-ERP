const mongoose = require("mongoose");

const payoutSchema = new mongoose.Schema({
	amount: Number,
	approvalStatus: { type: String, default: "Pending" },
	fullName: { type: String, ref: "Employee" },
	saleId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
	companyName: { type: String, ref: "Company" },
});

const Payout = mongoose.model("Payout", payoutSchema);

module.exports = Payout;
