const mongoose = require("mongoose");

const budgetAccountSchema = new mongoose.Schema(
	{
		accCode: { type: String, ref: "AccountLedger" },
		accountName: String,
		crew: { type: String, ref: "Crew" },
		description: String,
		monthlyBudget: {
			January: { type: Number, default: 0 },
			February: { type: Number, default: 0 },
			March: { type: Number, default: 0 },
			April: { type: Number, default: 0 },
			May: { type: Number, default: 0 },
			June: { type: Number, default: 0 },
			July: { type: Number, default: 0 },
			August: { type: Number, default: 0 },
			September: { type: Number, default: 0 },
			October: { type: Number, default: 0 },
			November: { type: Number, default: 0 },
			December: { type: Number, default: 0 },
		},
		companyName: { type: String, ref: "Company" },
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const BudgetAccount = mongoose.model("BudgetAccount", budgetAccountSchema);

module.exports = BudgetAccount;
