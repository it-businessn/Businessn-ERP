const mongoose = require("mongoose");

const journalEntrySchema = new mongoose.Schema({
	companyName: { type: String, ref: "Company" },
	departmentBreakDown: Object,
	totalDebit: { type: Number, default: 0 },
	totalCredit: { type: Number, default: 0 },
	netFundingWithdrawals: { type: Number, default: 0 },
	totalEIPayable: { type: Number, default: 0 },
	totalCPPPayable: { type: Number, default: 0 },
	totalIncomeTaxPayable: { type: Number, default: 0 },
	totalServiceCharges: { type: Number, default: 0 },
	totalFundingWithDrawals: { type: Number, default: 0 },
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
	payPeriodProcessingDate: Date,
	payPeriodNum: String,
	isExtraRun: { type: Boolean, default: false },
	scheduleFrequency: String,
});

const JournalEntry = mongoose.model("JournalEntry", journalEntrySchema);

module.exports = JournalEntry;
