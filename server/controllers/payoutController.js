const Payout = require("../models/Payout");

const getAllPayouts = async (req, res) => {
	const { id } = req.params;
	try {
		const payouts = await Payout.find({
			companyName: id,
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
		const payout = new Payout({
			amount,
			fullName,
			saleId,
			companyName,
		});

		const newPayout = await payout.save();
		res.status(201).json(newPayout);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updatePayout = async (req, res) => {
	const { id } = req.params;
	try {
		const assessment = await Assessment.findByIdAndUpdate(id, req.body, {
			new: true,
		});

		res.status(201).json(assessment);
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
