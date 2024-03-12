const Setup = require("../models/Setup");

const getIdleLeadReAssignment = () => async (req, res) => {
	try {
		const idleAssignmentRule = await Setup.find();
		res.status(200).json(idleAssignmentRule);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const updateSetUp = () => async (req, res) => {
	const { id } = req.params;
	try {
		const updatedData = req.body;
		const setup = await Setup.findByIdAndUpdate(
			id,
			{ $set: updatedData },
			{ new: true },
		);
		res.status(200).json(setup);
	} catch (error) {
		console.log(error, "Error in updating");
	}
};

const setUpIdleLeadReAssignment = () => async (req, res) => {
	const {
		isIdleLeadReassignment,
		idleTimeHours,
		idleTimeMinutes,
		AssignLeadTo,
	} = req.body;

	const setUpIdleLeadReAssignment = new Setup({
		isIdleLeadReassignment,
		idleTimeHours,
		idleTimeMinutes,
		AssignLeadTo,
	});

	try {
		const newSetUpIdleLeadReAssignment = await setUpIdleLeadReAssignment.save();
		res.status(201).json(newSetUpIdleLeadReAssignment);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = {
	setUpIdleLeadReAssignment,
	getIdleLeadReAssignment,
	updateSetUp,
};
