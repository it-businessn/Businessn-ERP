const Timesheet = require("../models/Timesheet");

const currentDate = new Date();

const getTimesheet = () => async (req, res) => {
	try {
		const timesheets = await Timesheet.find().populate({
			path: "employeeId",
			model: "Employee",
			select: ["role", "fullName"],
		});
		res.status(200).json(timesheets);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getTimesheetById = () => async (req, res) => {
	const id = req.params.id;

	try {
		const timesheet = await Timesheet.findById(id);
		res.status(200).json(timesheet);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const createTimesheet = () => async (req, res) => {
	const { employeeId } = req.body;
	try {
		const existingTimesheet = await Timesheet.findOne({
			employeeId,
			createdOn: {
				$gte: new Date(
					currentDate.getFullYear(),
					currentDate.getMonth(),
					currentDate.getDate(),
				),
				$lt: new Date(
					currentDate.getFullYear(),
					currentDate.getMonth(),
					currentDate.getDate() + 1,
				),
			},
		});
		if (existingTimesheet) {
			existingTimesheet.clockIns.push(Date.now());

			try {
				await existingTimesheet.save();
				res.status(201).json(existingTimesheet);
			} catch (error) {
				res.status(400).json({ message: error.message });
			}
		} else {
			const timesheet = new Timesheet({
				clockIns: Date.now(),
				employeeId,
			});

			try {
				const newTimesheet = await timesheet.save();
				res.status(201).json(newTimesheet);
			} catch (error) {
				res.status(400).json({ message: error.message });
			}
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateTimesheet = () => async (req, res) => {
	const { id } = req.params;
	const { key } = req.body;
	try {
		const timesheet = await Timesheet.findOne({ employeeId: id });

		timesheet[key].push(Date.now());
		await timesheet.save();
		res.status(201).json(timesheet);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
module.exports = {
	createTimesheet,
	getTimesheet,
	getTimesheetById,
	updateTimesheet,
};
