const mongoose = require("mongoose");

const accountLedgerSchema = new mongoose.Schema({
	accCode: String,
	accountName: String,
	description: String,
	transactionDate: Date,
	debit: String,
	credit: String,
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
	companyName: { type: String, ref: "Company" },
	journalEntryNum: { type: Number },
});

const AccountLedger = mongoose.model("AccountLedger", accountLedgerSchema);

module.exports = AccountLedger;
