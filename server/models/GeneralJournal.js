const mongoose = require("mongoose");

const generalJournalSchema = new mongoose.Schema({
	description: String,
	transactionDate: Date,
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
	companyName: { type: String, ref: "Company" },
	entries: Object,
});

const GeneralJournal = mongoose.model("GeneralJournal", generalJournalSchema);

module.exports = GeneralJournal;
