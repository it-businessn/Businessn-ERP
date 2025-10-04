const { startOfDay, addDays, format } = require("date-fns");
const moment = require("moment");

const EmployeeShift = require("../models/EmployeeShifts");
const WorkShift = require("../models/WorkShift");
const Crew = require("../models/Crew");
const DailyTotals = require("../models/DailyTotals");

const getShifts = async (req, res) => {
	try {
		const shifts = await EmployeeShift.find({}).sort({ createdOn: -1 });
		return res.status(200).json(shifts);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getLocationMonthlyTotals = async (req, res) => {
	const { companyName } = req.params;

	try {
		const totals = await DailyTotals.aggregate([
			{ $match: { companyName } },
			{
				$group: {
					_id: "$crew",
					totalRunning: { $sum: "$runningTotal" },
				},
			},
			{
				$sort: { _id: 1 },
			},
		]);
		return res.status(200).json(totals);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};
const getDailyTotals = async (req, res) => {
	const { companyName } = req.params;

	try {
		const totals = await DailyTotals.aggregate([
			{ $match: { companyName } },
			{
				$group: {
					_id: "$month", // group by month (1-12)
					totalRunning: { $sum: "$runningTotal" },
				},
			},
			{
				$sort: { _id: 1 }, // sort by month ascending
			},
		]);
		return res.status(200).json(totals);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
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
		return res.status(200).json(shifts);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getWorkWeekEmpShifts = async (req, res) => {
	const { name, date, companyName } = req.params;

	const inputDate = new Date(date);
	const start = startOfDay(inputDate);
	const end = addDays(start, 6);

	try {
		const crew = await Crew.findOne({ name });
		const crewEmps =
			crew?.config?.employee?.map((_) => {
				return {
					name: _?.fullName,
					role: _?.positions[0]?.title,
					payRate: parseFloat(_?.positions[0]?.payRate ?? 0),
				};
			}) || [];

		// const locationIds = crew?.config?.department?.map((_) => _.name) || [];
		const shifts = await WorkShift.aggregate([
			{
				$match: {
					shiftDate: {
						$gte: start,
						$lte: end,
					},
					companyName,
					crew: name,
					// location: { $in: locationIds },
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
					notes: 1,
					payRate: 1,
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
						payRate: "$payRate",
					},
					notes: { $addToSet: "$notes" },
					shifts: {
						$push: {
							k: { $toString: "$dayOfWeek" },
							v: {
								shift: "$shift",
								shiftId: "$_id",
								notes: "$notes",
							},
						},
					},
				},
			},
			{
				$project: {
					name: "$_id.name",
					role: "$_id.role",
					location: "$_id.location",
					payRate: "$_id.payRate",
					notes: { $arrayElemAt: ["$notes", 0] },
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
									{ shift: "Off", shiftId: null, notes: null },
								],
							},
						},
					},
				},
			},
			{
				$project: {
					name: "$name",
					role: "$role",
					location: "$location",
					payRate: "$payRate",
					shifts: 1,
				},
			},
		]);
		for (const emp of crewEmps) {
			const { name, role, payRate } = emp;
			const empShiftExists = shifts?.find((_) => _.name === name);
			if (!empShiftExists) {
				shifts.push({
					name,
					role,
					payRate,
					shifts: [
						{ shift: "Off" },
						{ shift: "Off" },
						{ shift: "Off" },
						{ shift: "Off" },
						{ shift: "Off" },
						{ shift: "Off" },
						{ shift: "Off" },
					],
				});
			}
		}

		return res.status(200).json(shifts.sort((a, b) => a.name.localeCompare(b.name)));
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
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
		return res.status(200).json(shifts);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
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
		return res.status(200).json(shifts);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
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
		return res.status(200).json(shifts);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
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
		crew,
		payRate,
	} = req.body;

	try {
		const repeatCount = repeatSchedule ? 7 : 1;
		const shiftsToSave = [];
		for (let i = 0; i < repeatCount; i++) {
			const currentShiftDate = moment(shiftDate).add(i, "days").format("YYYY-MM-DD");
			// 	if (hours > 5) {
			// 		const aggregatedShifts = splitShiftEveryFiveHours(shiftDate, shiftStart, shiftEnd);
			// 		aggregatedShifts?.forEach((shift) => {
			// 			shiftsToSave.push({
			// 				empName: employeeName,
			// 				role,
			// 				location,
			// 				notes,
			// 				shiftDate: currentShiftDate,
			// 				shiftStart: shift.start,
			// 				shiftEnd: shift.end,
			// 				repeatSchedule,
			// 				repeatDuration: "1 week",
			// 				breakDuration: 0.5,
			// 				companyName,
			// 				crew,
			// 			});
			// 		});
			// 	} else {
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
				crew,
				payRate,
			});
		}
		// }
		await WorkShift.insertMany(shiftsToSave);
		return res.status(201).json(shiftsToSave);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const updateDailyTotals = async (req, res) => {
	const { selectedCrew, company, dailyDataWithRunning } = req.body;

	try {
		dailyDataWithRunning.sort((a, b) => new Date(a.date) - new Date(b.date));

		let currentMonth = null;
		let runningTotal = 0;

		for (const daily of dailyDataWithRunning) {
			const dayDate = new Date(daily.date);
			const dayMonth = dayDate.getMonth() + 1;

			if (currentMonth !== dayMonth) {
				currentMonth = dayMonth;
				runningTotal = 0; // reset monthly running total
			}

			runningTotal += daily.dayWages;

			const existingRecord = await DailyTotals.findOne({
				date: dayDate,
				crew: selectedCrew,
				companyName: company,
			});
			const updatedData = {
				date: dayDate,
				crew: selectedCrew,
				companyName: company,
				dayHours: daily.dayHours,
				dayWages: daily.dayWages,
				runningTotal,
				month: dayMonth,
				year: dayDate.getFullYear(),
			};
			if (existingRecord) {
				await DailyTotals.findByIdAndUpdate(
					existingRecord._id,
					{ $set: updatedData },
					{ new: true },
				);
			} else {
				await DailyTotals.create(updatedData);
			}
		}
		return res.status(201).json({ message: "DailyTotals updated successfully!" });
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const addShifts = async (req, res) => {
	const { color, duration, end_time, start_time, id, title, group, startDate, payRate, company } =
		req.body;

	const newShift = new EmployeeShift({
		color,
		duration,
		end_time,
		id,
		start_time,
		title,
		group,
		payRate,
		companyName: company,
	});
	try {
		const shift = await newShift.save();
		return res.status(201).json(shift);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
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
			payRate,
		} = req.body;

		// if (hours <= 5) {
		const updatedShift = await WorkShift.findByIdAndUpdate(
			id,
			{
				$set: {
					employeeName,
					role,
					location,
					notes,
					shiftStart,
					shiftEnd,
					hours,
					payRate,
				},
			},
			{ new: true },
		);
		return res.status(201).json(updatedShift);
		// const updatedShift = await saveOrUpdateShift(
		// 	id,
		// 	{},
		// 	{
		// 		employeeName,
		// 		role,
		// 		location,
		// 		notes,
		// 		shiftDate,
		// 		shiftStart,
		// 		shiftEnd,
		// 		repeatSchedule,
		// 		hours,
		// 		companyName,
		// 	},
		// );
		// return res.status(201).json(updatedShift);

		// }

		// const shift = await WorkShift.findById(id);
		// const currentShiftDate = moment(shift.shiftDate).format("YYYY-MM-DD");
		// console.log("updateShiftss", shift, hours);

		// if (hours > 5) {
		// 	const splitShifts = splitShiftEveryFiveHours(currentShiftDate, shiftStart, shiftEnd);
		// 	for (const shift of splitShifts) {
		// 		await saveOrUpdateShift(
		// 			null,
		// 			{
		// 				empName: employeeName,
		// 				shiftDate: currentShiftDate,
		// 				shiftStart: shift.start,
		// 				shiftEnd: shift.end,
		// 				companyName,
		// 			},
		// 			{
		// 				empName: employeeName,
		// 				role,
		// 				location,
		// 				notes,
		// 				shiftDate: currentShiftDate,
		// 				shiftStart: shift.start,
		// 				shiftEnd: shift.end,
		// 				repeatSchedule,
		// 				repeatDuration: "1 week",
		// 				breakDuration: 0.5,
		// 				companyName,
		// 			},
		// 		);
		// 	}
		// }

		// return res.status(201).json({ message: "Shifts upserted or updated successfully" });
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

async function saveOrUpdateShift(shiftId, filter, data) {
	if (shiftId) {
		return await WorkShift.findByIdAndUpdate(
			shiftId,
			{ $set: data },
			{
				new: true,
				upsert: true,
			},
		);
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
	updateDailyTotals,
	getDailyTotals,
	getLocationMonthlyTotals,
};
