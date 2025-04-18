const { addDays, format } = require("date-fns");
const moment = require("moment");

const EmployeeShift = require("../models/EmployeeShifts");
const WorkShift = require("../models/WorkShift");

const getShifts = async (req, res) => {
	try {
		const shifts = (await EmployeeShift.find({})).sort({ createdOn: -1 });
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

const getWorkShiftByDate = async (req, res) => {
	const { date, name } = req.params;

	try {
		const shifts = await WorkShift.find({
			companyName: name,
			shiftDate: {
				$gte: moment.utc(date).startOf("day").toDate(),
				$lte: moment.utc(date).endOf("day").toDate(),
			},
		});
		res.status(200).json(shifts);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const calculateBreak = (shiftDate, start, end) => {
	const startDate = moment(`${shiftDate}T${start}`);
	const endDate = moment(`${shiftDate}T${end}`);
	const diff = endDate.diff(startDate, "hours", true);
	return diff > 5 ? 30 : 0; // 30 min break if over 5 hours
};

const addWorkShifts = async (req, res) => {
	const {
		empName,
		role,
		location,
		notes,
		shiftDate,
		shiftStart,
		shiftEnd,
		repeatSchedule,
		duration,
		companyName,
	} = req.body;

	try {
		const shiftStartDate = moment(`${shiftDate}T${shiftStart}`);
		const shiftEndDate = moment(`${shiftDate}T${shiftEnd}`);
		const repeatCount = repeatSchedule ? 7 : 1;
		const shiftsToSave = [];

		for (let i = 0; i < repeatCount; i++) {
			const currentShiftDate = moment(shiftDate).add(i, "days").format("YYYY-MM-DD");

			const breakDuration = calculateBreak(currentShiftDate, shiftStart, shiftEnd);
			if (breakDuration) {
				const totalMs = shiftEndDate.diff(shiftStartDate);
				const halfMs = Math.floor((totalMs - breakDuration * 60000) / 2);

				const firstEnd = moment(shiftStartDate).add(halfMs, "milliseconds");
				const secondStart = moment(firstEnd).add(breakDuration, "minutes");

				shiftsToSave.push({
					empName,
					role,
					location,
					notes,
					shiftDate: currentShiftDate,
					shiftStart,
					shiftEnd: firstEnd.format("HH:mm"),
					repeatSchedule,
					repeatDuration: "1 week",
					breakDuration: 0,
					companyName,
				});

				shiftsToSave.push({
					empName,
					role,
					location,
					notes,
					shiftDate: currentShiftDate,
					shiftStart: secondStart.format("HH:mm"),
					shiftEnd,
					repeatSchedule,
					repeatDuration: "1 week",
					breakDuration: 0,
					companyName,
				});
			} else {
				shiftsToSave.push({
					empName,
					role,
					location,
					notes,
					shiftDate: currentShiftDate,
					shiftStart,
					shiftEnd,
					repeatSchedule,
					repeatDuration: "1 week",
					breakDuration: 0,
					companyName,
				});
			}
		}

		await WorkShift.insertMany(shiftsToSave);

		res.status(201).json(shiftsToSave);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const addShifts = async (req, res) => {
	const { color, duration, end_time, start_time, id, title, group, startDate, company } = req.body;

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
	addWorkShifts,
	getWorkShiftByDate,
};
