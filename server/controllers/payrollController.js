const Group = require("../models/Group");

const getAllPaygroups = () => async (req, res) => {
	const { id } = req.params;
	try {
		const searchString = "Paygroup";
		const groups = await Group.find({
			companyName: id,
			name: { $regex: searchString, $options: "i" },
		});
		res.status(200).json(groups);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

module.exports = {
	getAllPaygroups,
};
