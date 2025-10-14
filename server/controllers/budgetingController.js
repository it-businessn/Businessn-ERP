const AccountLedger = require("../models/AccountLedger");
const BudgetAccount = require("../models/BudgetAccount");
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

const updateBudgetAccount = async (req, res) => {
	const { id } = req.params;
	try {
		const existingInfo = await BudgetAccount.findById(id);
		if (existingInfo) {
			if (req.body?._id) delete req.body._id;
			const updatedInfo = await BudgetAccount.findByIdAndUpdate(
				id,
				{ $set: req.body },
				{
					new: true,
				},
			);
			return res.status(201).json(updatedInfo);
		}
		return res.status(404).json({ message: "Record not found." });
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const addBudgetAccount = async (req, res) => {
	try {
		const { accCode, accountName, crew, companyName } = req.body;
		const existingRecord = await BudgetAccount.findOne(req.body);
		if (existingRecord) {
			return res.status(409).json({ message: "Record already exists" });
		}

		const department = crew.includes("No department") ? "" : crew;
		await AccountLedger.create({ accCode, accountName, department, companyName });
		const newAcc = await BudgetAccount.create(req.body);
		return res.status(201).json(newAcc);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getDeptAccounts = async (req, res) => {
	const { companyName, crew } = req.params;
	try {
		const accounts = await BudgetAccount.find({ companyName, crew }).sort({
			accCode: 1,
		});

		return res.status(200).json(accounts);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getBudgetAccounts = async (req, res) => {
	const { companyName } = req.params;
	try {
		const accounts = await BudgetAccount.find({ companyName }).sort({
			accCode: -1,
		});
		return res.status(200).json(accounts);
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
	addBudgetAccount,
	getBudgetAccounts,
	getDeptAccounts,
	updateBudgetAccount,
};
