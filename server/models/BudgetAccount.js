const mongoose = require("mongoose");

const budgetAccountSchema = new mongoose.Schema(
	{
		accCode: { type: String, ref: "AccountLedger" },
		accountName: String,
		department: { type: String, ref: "Crew" },
		description: String,
		monthlyBudget: {
			Jan: { type: Number, default: 0 },
			Feb: { type: Number, default: 0 },
			Mar: { type: Number, default: 0 },
			Apr: { type: Number, default: 0 },
			May: { type: Number, default: 0 },
			Jun: { type: Number, default: 0 },
			Jul: { type: Number, default: 0 },
			Aug: { type: Number, default: 0 },
			Sep: { type: Number, default: 0 },
			Oct: { type: Number, default: 0 },
			Nov: { type: Number, default: 0 },
			Dec: { type: Number, default: 0 },
		},
		companyName: { type: String, ref: "Company" },
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const BudgetAccount = mongoose.model("BudgetAccount", budgetAccountSchema);

module.exports = BudgetAccount;
