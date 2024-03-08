const IndustryType = require("../models/IndustryType");

const getIndustryType = () => async (req, res) => {
	try {
		const industry = await IndustryType.find({}).sort({ date: -1 });
		res.json(industry);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const createIndustryType = () => async (req, res) => {
	const { name } = req.body;

	const industryType = new IndustryType({
		name,
		date: Date.now(),
	});

	try {
		const newIndustryType = await industryType.save();
		res.status(201).json(newIndustryType);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = { createIndustryType, getIndustryType };
