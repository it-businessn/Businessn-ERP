const AccountLedger = require("../models/AccountLedger");
const GeneralJournal = require("../models/GeneralJournal");

const addAccountsJournalEntry = async (req, res) => {
	// const { companyName } = req.body;
	// const recentJournalEntryNum = await AccountLedger.findOne({ companyName })
	// 	.sort({
	// 		createdOn: -1,
	// 	})
	// 	.select("journalEntryNum");

	// req.body.journalEntryNum = recentJournalEntryNum ? recentJournalEntryNum?.journalEntryNum + 1 : 1;

	try {
		const existingRecord = await GeneralJournal.findOne(req.body);
		if (existingRecord) {
			return res.status(409).json({ message: "Entry already exists" });
		}
		const newEntry = await GeneralJournal.create(req.body);
		return res.status(201).json(newEntry);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
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

		return res.status(200).json(allEntries);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const addAccountLedger = async (req, res) => {
	try {
		const existingRecord = await AccountLedger.findOne(req.body);
		if (existingRecord) {
			return res.status(409).json({ message: "Record already exists" });
		}
		const newAcc = await AccountLedger.create(req.body);
		return res.status(201).json(newAcc);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getDeptAccounts = async (req, res) => {
	const { companyName, crew } = req.params;
	try {
		const accounts = await AccountLedger.find({ companyName, crew }).sort({
			accCode: 1,
		});

		return res.status(200).json(accounts);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getAccountLedgers = async (req, res) => {
	const { companyName } = req.params;
	try {
		const accounts = await AccountLedger.find({ companyName }).sort({
			accCode: -1,
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

		return res.status(200).json(updatedAccounts);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

// const updateTask = async (req, res) => {
// 	const { id } = req.params;
// 	const { checked } = req.body;
// 	try {
// 		const updatedData = { status: checked ? "Closed" : "Open" };
// 		const task = await LogTask.findByIdAndUpdate(id, { $set: updatedData }, { new: true });
// 		return res.status(201).json(task);
// 	} catch (error) {
// return res.status(500).json({ message: "Internal Server Error", error });
// 	}
// };

module.exports = {
	addAccountsJournalEntry,
	getAccountJournalEntries,
	addAccountLedger,
	getAccountLedgers,
	getDeptAccounts,
};
