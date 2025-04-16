const mongoose = require("mongoose");

const accountLedgerSchema = new mongoose.Schema({
	accCode: String,
	accountName: String,
	description: String,
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
	companyName: { type: String, ref: "Company" },
	totalJournalEntries: Number,
	totalCredit: Number,
	totalDebit: Number,
});

const AccountLedger = mongoose.model("AccountLedger", accountLedgerSchema);

module.exports = AccountLedger;
