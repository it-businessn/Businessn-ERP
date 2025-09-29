const Payout = require("../models/Payout");

const getAllPayouts = async (req, res) => {
	const { companyName } = req.params;
	try {
		const payouts = await Payout.find({
			companyName,
		}).sort({
			createdOn: -1,
		});

		return res.status(200).json(payouts);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const addPayout = async (req, res) => {
	const { amount, fullName, saleId, companyName } = req.body;

	try {
		const data = {
			amount,
			fullName,
			saleId,
			companyName,
		};
		const existingRecord = await Payout.findOne(data);
		if (existingRecord) {
			return res.status(409).json({ message: "Payout already exists" });
		}
		const newPayout = await Payout.create(data);
		return res.status(201).json(newPayout);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const updatePayout = async (req, res) => {
	const { id } = req.params;
	try {
		const payout = await Payout.findByIdAndUpdate(id, req.body, {
			new: true,
		});

		return res.status(201).json(payout);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};
// const deleteQuestion = async (req, res) => {
// 	const { id } = req.params;
// 	try {
// 		const updatedContact = await Payout.findByIdAndDelete(id, req.body, {
// 			new: true,
// 		});

// 		return res.status(201).json(updatedContact);
// 	} catch (error) {
// 		return res.status(500).json({ message: "Internal Server Error", error });
// 	}
// };

module.exports = { getAllPayouts, addPayout, updatePayout };
