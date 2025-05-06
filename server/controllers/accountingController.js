const AccountLedger = require("../models/AccountLedger");
const GeneralJournal = require("../models/GeneralJournal");

const getAccounts = async (req, res) => {
	const { companyName } = req.params;
	try {
		const accounts = await AccountLedger.find({ companyName }).sort({
			createdOn: -1,
		});
		const updatedAccounts = await Promise.all(
			accounts.map(async (account) => {
				const accountDetails = await GeneralJournal.find({
					companyName,
					"entries.accountName": account.accountName,
				}).select("transactionDate entries");

				const allEntries = accountDetails.flatMap((doc) => doc.entries || []);

				const filteredEntries = allEntries.filter(
					(entry) => entry.accountName === account.accountName,
				);

				account.entries = filteredEntries;
				account.totalDebit = filteredEntries.reduce(
					(sum, record) => sum + (parseFloat(record.debit) || 0),
					0,
				);
				account.totalCredit = filteredEntries.reduce(
					(sum, record) => sum + (parseFloat(record.credit) || 0),
					0,
				);
				account.totalJournalEntries = filteredEntries.length;
				return account;
			}),
		);

		res.status(200).json(updatedAccounts);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getAccountJournalEntries = async (req, res) => {
	const { companyName, accountName } = req.params;
	try {
		const accounts = await GeneralJournal.find({
			companyName,
			"entries.accountName": accountName,
		}).select("transactionDate entries");

		const allEntries = accounts.flatMap((doc) =>
			(doc.entries || []).map((entry) => ({
				...(entry.toObject?.() ?? entry),
				transactionDate: doc.transactionDate,
			})),
		);

		res.status(200).json(allEntries);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const createAccount = async (req, res) => {
	try {
		const newAcc = await AccountLedger.create(req.body);
		res.status(201).json(newAcc);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const addGeneralJournalEntry = async (req, res) => {
	// const { companyName } = req.body;
	// const recentJournalEntryNum = await AccountLedger.findOne({ companyName })
	// 	.sort({
	// 		createdOn: -1,
	// 	})
	// 	.select("journalEntryNum");

	// req.body.journalEntryNum = recentJournalEntryNum ? recentJournalEntryNum?.journalEntryNum + 1 : 1;

	try {
		const newEntry = await GeneralJournal.create(req.body);
		res.status(201).json(newEntry);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// const updateTask = async (req, res) => {
// 	const { id } = req.params;
// 	const { checked } = req.body;
// 	try {
// 		const updatedData = { status: checked ? "Closed" : "Open" };
// 		const task = await LogTask.findByIdAndUpdate(id, { $set: updatedData }, { new: true });
// 		res.status(201).json(task);
// 	} catch (error) {
// 		res.status(400).json({ message: error.message });
// 	}
// };

module.exports = {
	createAccount,
	getAccounts,
	addGeneralJournalEntry,
	getAccountJournalEntries,
	// getTasks,
	// updateTask,
};
