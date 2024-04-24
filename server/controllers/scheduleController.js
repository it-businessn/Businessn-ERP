const EmployeeShift = require("../models/EmployeeShifts");

const getShifts = () => async (req, res) => {
	try {
		const shifts = (await EmployeeShift.find()).sort(
			(a, b) => b.createdOn - a.createdOn,
		);
		res.status(200).json(shifts);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getTaskById = () => async (req, res) => {
	const { id } = req.params;
	try {
		const tasks = await EmployeeShift.find({ selectedAssignees: id });
		res.status(200).json(tasks);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const addShifts = () => async (req, res) => {
	const { color, duration, end_time, start_time, id, title, group, startDate } =
		req.body;

	const newShift = new EmployeeShift({
		color,
		duration,
		end_time,
		id,
		start_time,
		title,
		group,
	});
	try {
		const shift = await newShift.save();
		res.status(201).json(shift);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = {
	addShifts,
	getShifts,
};
