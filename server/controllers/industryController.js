const IndustryType = require("../models/IndustryType");

const getIndustry = async (req, res) => {
	try {
		const industry = await IndustryType.find({}).sort({ date: -1 });
		res.json(industry);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const createIndustry = async (req, res) => {
	const { name } = req.body;

	try {
		const existingRecord = await IndustryType.findOne({ name });
		if (existingRecord) {
			return res.status(409).json({ message: "Industry Type already exists" });
		}
		const newIndustryType = await IndustryType.create({
			name,
			date: Date.now(),
		});
		return res.status(201).json(newIndustryType);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

module.exports = { createIndustry, getIndustry };
