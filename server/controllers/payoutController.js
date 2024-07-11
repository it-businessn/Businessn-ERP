const Payout = require("../models/Payout");

const getAllPayouts = async (req, res) => {
	const { companyName } = req.params;
	try {
		const payouts = await Payout.find({
			companyName,
		}).sort({
			createdOn: -1,
		});

		res.status(200).json(payouts);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const addPayout = async (req, res) => {
	const { amount, fullName, saleId, companyName } = req.body;

	try {
		const newPayout = await Payout.create({
			amount,
			fullName,
			saleId,
			companyName,
		});
		res.status(201).json(newPayout);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updatePayout = async (req, res) => {
	const { id } = req.params;
	try {
		const payout = await Payout.findByIdAndUpdate(id, req.body, {
			new: true,
		});

		res.status(201).json(payout);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
// const deleteQuestion = async (req, res) => {
// 	const { id } = req.params;
// 	try {
// 		const updatedContact = await Payout.findByIdAndDelete(id, req.body, {
// 			new: true,
// 		});

// 		res.status(201).json(updatedContact);
// 	} catch (error) {
// 		res.status(400).json({ message: error.message });
// 	}
// };

module.exports = { getAllPayouts, addPayout, updatePayout };
