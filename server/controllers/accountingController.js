const AccountLedger = require("../models/AccountLedger");
const BudgetAccount = require("../models/BudgetAccount");
const GeneralJournal = require("../models/GeneralJournal");

const addAccountsJournalEntry = async (req, res) => {
	try {
		// const { companyName } = req.body;
		// const recentJournalEntryNum = await AccountLedger.findOne({ companyName })
		// 	.sort({
		// 		createdOn: -1,
		// 	})
		// 	.select("journalEntryNum");

		// req.body.journalEntryNum = recentJournalEntryNum ? recentJournalEntryNum?.journalEntryNum + 1 : 1;

		const existingRecord = await GeneralJournal.findOne(req.body);

		if (existingRecord) {
			return res.status(409).json({ message: "Entry already exists" });
		}

		const newEntry = await GeneralJournal.create(req.body);

		return res.status(201).json(newEntry);
	} catch (error) {
		console.error("Error creating journal entry:", error);

		return res.status(500).json({
			message: "Something went wrong",
			error: error.message,
		});
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
		console.error("Error fetching journal entries:", error);

		return res.status(500).json({
			message: "Failed to fetch journal entries",
			error: error.message,
		});
	}
};

const addAccount = async (req, res) => {
	try {
		const existingRecord = await AccountLedger.findOne(req.body);

		if (existingRecord) {
			return res.status(409).json({ message: "Account already exists" });
		}

		const newAcc = await AccountLedger.create(req.body);
		await BudgetAccount.create(req.body);
		return res.status(201).json(newAcc);
	} catch (error) {
		console.error("Error fetching journal entries:", error);

		return res.status(500).json({
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

const updateAccount = async (req, res) => {
	const { id } = req.params;

	try {
		const existingInfo = await AccountLedger.findById(id);

		if (!existingInfo) {
			return res.status(404).json({ message: "Account not found." });
		}

		const { _id, ...updateData } = req.body;

		const updatedInfo = await AccountLedger.findByIdAndUpdate(
			id,
			{ $set: updateData },
			{ new: true },
		);

		const budgetRecord = await BudgetAccount.findOne({
			accCode: updateData.accCode,
		});

		if (budgetRecord) {
			await BudgetAccount.findByIdAndUpdate(budgetRecord._id, { $set: updateData }, { new: true });
		}

		return res.status(200).json(updatedInfo);
	} catch (error) {
		console.error("Error fetching journal entries:", error);

		return res.status(500).json({
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

const getAccounts = async (req, res) => {
	const { companyName } = req.params;
	try {
		const accounts = await AccountLedger.find({ companyName }).sort({
			accCode: -1,
		});

		return res.status(200).json(accounts);
	} catch (error) {
		console.error("Error getAccounts:", error);
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getAccountLedgers = async (req, res) => {
	const { companyName } = req.params;

	try {
		const accounts = await AccountLedger.find({ companyName }).sort({ accCode: -1 }).lean();

		const journals = await GeneralJournal.find({ companyName }).select("entries").lean();

		const allEntries = journals.flatMap((doc) => doc.entries || []);

		const grouped = allEntries.reduce((acc, entry) => {
			if (!entry.accountName) return acc;

			if (!acc[entry.accountName]) {
				acc[entry.accountName] = [];
			}

			acc[entry.accountName].push(entry);
			return acc;
		}, {});

		const updatedAccounts = accounts.map((account) => {
			const entries = grouped[account.accountName] || [];

			const totalDebit = entries.reduce((sum, e) => sum + (parseFloat(e.debit) || 0), 0);

			const totalCredit = entries.reduce((sum, e) => sum + (parseFloat(e.credit) || 0), 0);

			return {
				...account,
				entries,
				totalDebit,
				totalCredit,
				totalJournalEntries: entries.length,
			};
		});

		return res.status(200).json(updatedAccounts);
	} catch (error) {
		console.error("Error fetching account ledgers:", error);

		return res.status(500).json({
			message: "Internal Server Error",
			error: error.message,
		});
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
// console.error("Error updateTask:", error);
// return res.status(500).json({ message: "Internal Server Error", error });
// 	}
// };

module.exports = {
	addAccountsJournalEntry,
	getAccountJournalEntries,
	addAccount,
	getAccountLedgers,
	getAccounts,
	updateAccount,
};
