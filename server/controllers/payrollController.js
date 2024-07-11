const Group = require("../models/Group");

const getAllPayGroups = async (req, res) => {
	const { companyName } = req.params;
	try {
		const searchString = "Paygroup";
		const groups = await Group.find({
			companyName,
			name: { $regex: searchString, $options: "i" },
		});
		res.status(200).json(groups);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

module.exports = { getAllPayGroups };
