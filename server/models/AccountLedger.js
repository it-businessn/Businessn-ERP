const mongoose = require("mongoose");

const accountLedgerSchema = new mongoose.Schema(
	{
		accCode: String,
		accountName: String,
		description: String,
		companyName: { type: String, ref: "Company" },
		totalJournalEntries: Number,
		totalCredit: Number,
		totalDebit: Number,
		crew: { type: String, ref: "Crew" },
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const AccountLedger = mongoose.model("AccountLedger", accountLedgerSchema);

module.exports = AccountLedger;
