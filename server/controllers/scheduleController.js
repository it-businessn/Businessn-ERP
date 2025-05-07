const { startOfDay, addDays, format } = require("date-fns");
const moment = require("moment");

const EmployeeShift = require("../models/EmployeeShifts");
const WorkShift = require("../models/WorkShift");
const Crew = require("../models/Crew");

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

const getWorkWeekEmpShifts = async (req, res) => {
	const { name, date, companyName } = req.params;

	const inputDate = new Date(date);
	const start = startOfDay(inputDate);
	const end = addDays(start, 6);

	try {
		const crew = await Crew.findOne({ name });
		const locationIds = crew?.config?.department?.map((_) => _.name) || [];
		const shifts = await WorkShift.aggregate([
			{
				$match: {
					shiftDate: {
						$gte: start,
						$lte: end,
					},
					companyName,
					location: { $in: locationIds },
				},
			},
			{
				$addFields: {
					dayOfWeek: { $subtract: [{ $dayOfWeek: "$shiftDate" }, 1] }, // 0 = Sunday
				},
			},
			{
				$project: {
					_id: 1,
					empName: 1,
					role: 1,
					location: 1,
					shift: {
						$concat: ["$shiftStart", "-", "$shiftEnd"],
					},
					dayOfWeek: 1,
				},
			},
			{
				$group: {
					_id: {
						name: "$empName",
						role: "$role",
						location: "$location",
					},
					shifts: {
						$push: {
							k: { $toString: "$dayOfWeek" },
							v: "$shift",
						},
					},
				},
			},
			{
				$project: {
					name: "$_id.name",
					role: "$_id.role",
					location: "$_id.location",
					_id: 0,
					shiftsObj: { $arrayToObject: "$shifts" },
				},
			},
			{
				$addFields: {
					shifts: {
						$map: {
							input: [0, 1, 2, 3, 4, 5, 6],
							as: "day",
							in: {
								$ifNull: [
									{ $getField: { field: { $toString: "$$day" }, input: "$shiftsObj" } },
									"Off",
								],
							},
						},
					},
				},
			},
			{
				$project: {
					name: 1,
					role: 1,
					location: 1,
					shifts: 1,
				},
			},
		]);
		res.status(200).json(shifts);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getWorkShiftByWeek = async (req, res) => {
	const { date, location, name } = req.params;
	const startOfWeek = moment(date).startOf("week");
	const endOfWeek = moment(date).endOf("week");

	try {
		const shifts = await WorkShift.find({
			companyName: name,
			location,
			shiftDate: {
				$gte: startOfWeek,
				$lte: endOfWeek,
			},
		});
		res.status(200).json(shifts);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getWorkShiftByDate = async (req, res) => {
	const { date, location, name, empName } = req.params;

	try {
		const shifts =
			empName === "null"
				? await WorkShift.find({
						companyName: name,
						location,
						shiftDate: {
							$gte: moment.utc(date).startOf("day").toDate(),
							$lte: moment.utc(date).endOf("day").toDate(),
						},
				  })
				: await WorkShift.find({
						companyName: name,
						location,
						shiftDate: {
							$gte: moment.utc(date).startOf("day").toDate(),
							$lte: moment.utc(date).endOf("day").toDate(),
						},
						empName,
				  });
		res.status(200).json(shifts);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getEmpWorkShiftByDate = async (req, res) => {
	const { date, location, name, empName } = req.params;

	try {
		const shifts = await WorkShift.find({
			companyName: name,
			location,
			// shiftDate: {
			// 	$gte: moment.utc(date).startOf("day").toDate(),
			// 	$lte: moment.utc(date).endOf("day").toDate(),
			// },
			empName,
		});
		res.status(200).json(shifts);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const splitShiftEveryFiveHours = (shiftDate, start, end) => {
	const startDate = moment(`${shiftDate}T${start}`);
	const endDate = moment(`${shiftDate}T${end}`);
	const totalMinutes = endDate.diff(startDate, "minutes");
	const workBlockMinutes = 5 * 60; // 5 hours
	const breakMinutes = 30;

	// Full work+break cycles
	const fullBlocks = Math.floor(totalMinutes / (workBlockMinutes + breakMinutes));
	const remainingMinutes = totalMinutes - fullBlocks * (workBlockMinutes + breakMinutes);

	let workSegments = [];
	let current = moment(startDate);

	[...Array(fullBlocks)].map(() => {
		// Work segment
		let workEnd = current.clone().add(workBlockMinutes, "minutes");
		workSegments.push({
			type: "work",
			start: current.format("HH:mm"),
			end: workEnd.format("HH:mm"),
		});
		current = workEnd;

		// Break segment
		let breakEnd = current.clone().add(breakMinutes, "minutes");
		workSegments.push({
			type: "break",
			start: current.format("HH:mm"),
			end: breakEnd.format("HH:mm"),
		});
		current = breakEnd;
	});

	// Any leftover time as the final work segment
	if (remainingMinutes > 0) {
		let finalEnd = current.clone().add(remainingMinutes, "minutes");
		workSegments.push({
			type: "work",
			start: current.format("HH:mm"),
			end: finalEnd.format("HH:mm"),
		});
	}
	return workSegments?.filter((_) => _.type === "work");
};

const addWorkShifts = async (req, res) => {
	const {
		employeeName,
		role,
		location,
		notes,
		shiftDate,
		shiftStart,
		shiftEnd,
		repeatSchedule,
		hours,
		companyName,
	} = req.body;

	try {
		const repeatCount = repeatSchedule ? 7 : 1;
		const shiftsToSave = [];
		for (let i = 0; i < repeatCount; i++) {
			const currentShiftDate = moment(shiftDate).add(i, "days").format("YYYY-MM-DD");
			if (hours > 5) {
				const aggregatedShifts = splitShiftEveryFiveHours(shiftDate, shiftStart, shiftEnd);
				aggregatedShifts?.forEach((shift) => {
					shiftsToSave.push({
						empName: employeeName,
						role,
						location,
						notes,
						shiftDate: currentShiftDate,
						shiftStart: shift.start,
						shiftEnd: shift.end,
						repeatSchedule,
						repeatDuration: "1 week",
						breakDuration: 0.5,
						companyName,
					});
				});
			} else {
				shiftsToSave.push({
					empName: employeeName,
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
		const {
			employeeName,
			role,
			location,
			notes,
			shiftDate,
			shiftStart,
			shiftEnd,
			repeatSchedule,
			hours,
			companyName,
		} = req.body;

		if (hours < 5) {
			const updatedShift = await saveOrUpdateShift(
				id,
				{},
				{
					employeeName,
					role,
					location,
					notes,
					shiftDate,
					shiftStart,
					shiftEnd,
					repeatSchedule,
					hours,
					companyName,
				},
			);
			return res.status(201).json(updatedShift);
		} else {
			const shift = await WorkShift.findById(id);
			const repeatCount = shift?.repeatSchedule === repeatSchedule ? 1 : repeatSchedule ? 7 : 1;
			for (let i = 0; i < repeatCount; i++) {
				const currentShiftDate = moment(shiftDate).add(i, "days").format("YYYY-MM-DD");

				if (hours > 5) {
					const splitShifts = splitShiftEveryFiveHours(currentShiftDate, shiftStart, shiftEnd);

					for (const shift of splitShifts) {
						await saveOrUpdateShift(
							null,
							{
								empName: employeeName,
								shiftDate: currentShiftDate,
								shiftStart: shift.start,
								shiftEnd: shift.end,
								companyName,
							},
							{
								empName: employeeName,
								role,
								location,
								notes,
								shiftDate: currentShiftDate,
								shiftStart: shift.start,
								shiftEnd: shift.end,
								repeatSchedule,
								repeatDuration: "1 week",
								breakDuration: 0.5,
								companyName,
							},
						);
					}
				} else {
					await saveOrUpdateShift(
						null,
						{
							empName: employeeName,
							shiftDate: currentShiftDate,
							shiftStart,
							shiftEnd,
							companyName,
						},
						{
							empName: employeeName,
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
						},
					);
				}
			}

			return res.status(201).json({ message: "Shifts upserted or updated successfully" });
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

async function saveOrUpdateShift(shiftId, filter, data) {
	if (shiftId) {
		return await WorkShift.findByIdAndUpdate(shiftId, data, {
			new: true,
			upsert: true,
		});
	} else {
		return await WorkShift.findOneAndUpdate(filter, data, {
			new: true,
			upsert: true,
		});
	}
}

module.exports = {
	addShifts,
	getShifts,
	updateShift,
	getShiftByDate,
	addWorkShifts,
	getWorkShiftByDate,
	getWorkShiftByWeek,
	getEmpWorkShiftByDate,
	getWorkWeekEmpShifts,
};
