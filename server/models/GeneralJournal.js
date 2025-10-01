const mongoose = require("mongoose");

const generalJournalSchema = new mongoose.Schema(
	{
		description: String,
		transactionDate: Date,
		companyName: { type: String, ref: "Company" },
		entries: Object,
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const GeneralJournal = mongoose.model("GeneralJournal", generalJournalSchema);

module.exports = GeneralJournal;
