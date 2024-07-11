const EmployeeShift = require("../models/EmployeeShifts");

const getShifts = async (req, res) => {
	try {
		const shifts = (await EmployeeShift.find()).sort(
			(a, b) => b.createdOn - a.createdOn,
		);
		res.status(200).json(shifts);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getShiftByDate = async (req, res) => {
	const { id, name } = req.params;
	const today = new Date();
	// today.setHours(0, 0, 0, 0);

	const idDate = new Date(id);
	try {
		const shifts = await EmployeeShift.find({
			companyName: name,
			createdOn: {
				$gte: idDate,
				$lt: today,
			},
		});
		res.status(200).json(shifts);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const addShifts = async (req, res) => {
	const {
		color,
		duration,
		end_time,
		start_time,
		id,
		title,
		group,
		startDate,
		company,
	} = req.body;

	const newShift = new EmployeeShift({
		color,
		duration,
		end_time,
		id,
		start_time,
		title,
		group,
		companyName: company,
	});
	try {
		const shift = await newShift.save();
		res.status(201).json(shift);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateShift = async (req, res) => {
	const { id } = req.params;

	try {
		const updatedShift = await EmployeeShift.findByIdAndUpdate(id, req.body, {
			new: true,
		});

		res.status(201).json(updatedShift);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = {
	addShifts,
	getShifts,
	updateShift,
	getShiftByDate,
};
