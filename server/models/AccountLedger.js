const mongoose = require("mongoose");

const accountLedgerSchema = new mongoose.Schema(
	{
		accCode: String,
		accountName: String,
		description: String,
		department: String,
		companyName: { type: String, ref: "Company" },
		totalJournalEntries: Number,
		totalCredit: Number,
		totalDebit: Number,
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const AccountLedger = mongoose.model("AccountLedger", accountLedgerSchema);

module.exports = AccountLedger;
