const IndustryType = require("../models/IndustryType");

const getIndustry = async (req, res) => {
	try {
		const industry = await IndustryType.find({}).sort({ date: -1 });
		res.json(industry);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const createIndustry = async (req, res) => {
	const { name } = req.body;

	try {
		const newIndustryType = await IndustryType.create({
			name,
			date: Date.now(),
		});
		res.status(201).json(newIndustryType);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = { createIndustry, getIndustry };
