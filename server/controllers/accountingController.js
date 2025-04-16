const AccountLedger = require("../models/AccountLedger");

const getAccounts = async (req, res) => {
	const { companyName } = req.params;
	try {
		const accounts = await AccountLedger.find({ companyName }).sort({
			createdOn: -1,
		});
		res.status(200).json(accounts);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const createAccount = async (req, res) => {
	const { companyName } = req.body;
	try {
		const recentJournalEntryNum = await AccountLedger.findOne({ companyName })
			.sort({
				createdOn: -1,
			})
			.select("journalEntryNum");

		req.body.journalEntryNum = recentJournalEntryNum
			? recentJournalEntryNum?.journalEntryNum + 1
			: 1;
		const newAcc = await AccountLedger.create(req.body);
		res.status(201).json(newAcc);
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
	// getTasks,
	// updateTask,
};
