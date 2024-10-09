const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");
const Timecard = require("../models/Timecard");
const TimecardRaw = require("../models/TimecardRaw");
const Timesheet = require("../models/Timesheet");

const {
	getUTCTime,
	startOfDay,
	endOfDay,
	momentTime,
	momentDuration,
	isSameDate,
	getPayType,
} = require("../services/data");

const getTimecard = async (req, res) => {
	try {
		const result = await Timecard.find({}).sort({ clockIn: -1 });

		result.map((_) => {
			_.totalBreakHours = calcTotalBreakHours(_)?.totalBreakHours;
			_.totalWorkedHours = calcTotalBreakHours(_)?.totalWorkedHours;
			return _;
		});

		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const createTimecard = async (req, res) => {
	try {
		const data = req.body;
		// const data = [
		// 	{
		// 		user_id: "7746",
		// 		timestamp: "2024-10-08 17:44:56",
		// 		status: "4",
		// 		punch: "0",
		// 	},
		// 	{
		// 		user_id: "7746",
		// 		timestamp: "2024-10-08 17:46:40",
		// 		status: "4",
		// 		punch: "2",
		// 	},
		// 	{
		// 		user_id: "7746",
		// 		timestamp: "2024-10-08 17:48:28",
		// 		status: "4",
		// 		punch: "3",
		// 	},
		// 	{
		// 		user_id: "7746",
		// 		timestamp: "2024-10-08 17:59:24",
		// 		status: "4",
		// 		punch: "0",
		// 	},
		// 	{
		// 		user_id: "7746",
		// 		timestamp: "2024-10-08 18:00:38",
		// 		status: "4",
		// 		punch: "2",
		// 	},
		// 	{
		// 		user_id: "7746",
		// 		timestamp: "2024-10-08 18:02:29",
		// 		status: "4",
		// 		punch: "3",
		// 	},
		// 	{
		// 		user_id: "7746",
		// 		timestamp: "2024-10-08 18:04:09",
		// 		status: "4",
		// 		punch: "1",
		// 	},
		// 	{
		// 		user_id: "7746",
		// 		timestamp: "2024-10-08 18:06:35",
		// 		status: "4",
		// 		punch: "0",
		// 	},
		// 	{
		// 		user_id: "7746",
		// 		timestamp: "2024-10-08 18:08:09",
		// 		status: "4",
		// 		punch: "2",
		// 	},
		// 	{
		// 		user_id: "7746",
		// 		timestamp: "2024-10-08 18:11:01",
		// 		status: "4",
		// 		punch: "3",
		// 	},
		// 	{
		// 		user_id: "7746",
		// 		timestamp: "2024-10-08 18:12:56",
		// 		status: "4",
		// 		punch: "1",
		// 	},
		// 	{
		// 		user_id: "7746",
		// 		timestamp: "2024-10-09 12:12:56",
		// 		status: "4",
		// 		punch: "0",
		// 	},
		// 	{
		// 		user_id: "7746",
		// 		timestamp: "2024-10-09 13:00:56",
		// 		status: "4",
		// 		punch: "1",
		// 	},
		// ];

		data?.map(async (entry) => {
			// if (entry?.isNotDevice && entry?.empId) {
			// 	entry.timestamp = moment();
			// 	entry.notDevice = entry?.isNotDevice;

			// 	const emp_user_id = await EmployeeProfileInfo.findOne({
			// 		empId: entry?.empId,
			// 	}).select("timeManagementBadgeID");

			// 	entry.user_id = emp_user_id?.timeManagementBadgeID;
			// }

			entry.timestamp = getUTCTime(entry.timestamp);

			const { user_id, timestamp, punch } = entry;

			const punchRecordExists = await findPunchEntry({
				user_id,
				timestamp,
				punch,
			});
			if (!punchRecordExists) {
				await addPunchEntry(entry);
			}
		});

		await mapTimecardRawToTimecard();
		res.status(201).json("Timecard entries added successfully");
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const mapTimecardRawToTimecard = async () => {
	try {
		const punches = await TimecardRaw.find({}).sort({ timestamp: 1 });

		let groupedPunches = groupPunches(punches);

		groupedPunches.map(async (entry) => {
			const clockInTimeEntryExists = await findTimecardEntry({
				badge_id: entry.badge_id,
				clockIn: entry.clockIn,
			});
			if (!clockInTimeEntryExists) {
				addTimecardEntry(entry);
			}
		});
	} catch (error) {}
};

const groupPunches = (punches) => {
	let clockIns = [];

	let lastClockIn = null;

	punches.forEach((punch) => {
		if (punch.punch === "0") {
			lastClockIn = {
				badge_id: punch.user_id,
				clockIn: punch.timestamp,
				startBreaks: [],
				endBreaks: [],
				clockOut: null,
			};
			clockIns.push(lastClockIn);
		} else if (punch.punch === "2" && lastClockIn) {
			lastClockIn.startBreaks.push(punch.timestamp);
		} else if (punch.punch === "3" && lastClockIn) {
			lastClockIn.endBreaks.push(punch.timestamp);
		} else if (punch.punch === "1" && lastClockIn) {
			lastClockIn.clockOut = punch.timestamp;
		}
	});
	return clockIns;
};
const findTimecardEntry = async (entry) => await Timecard.findOne(entry);

const findRecentClockInRecord = async (badge_id, timestamp) => {
	const recentClockInEntry = await Timecard.findOne({
		badge_id,
		clockOut: null,
		clockIn: { $gte: startOfDay(timestamp), $lte: endOfDay(timestamp) },
	}).sort({
		clockIn: -1,
	});
	return recentClockInEntry;
};

const addTimecardEntry = async (entry) => {
	const { badge_id, clockIn, notDevice } = entry;
	const empRec = await findEmployee({
		timeManagementBadgeID: badge_id,
	});
	// entry.notDevice= notDevice,

	entry.companyName = empRec?.companyName;
	entry.employeeName = empRec?.empId?.fullName;
	entry.employeeId = empRec?.empId?._id;
	const newTimecard = await Timecard.create(entry);
	if (newTimecard) {
		const newTimesheetRecord = {
			employeeId: entry.employeeId,
			companyName: entry.companyName,
			payType: getPayType(clockIn),
			clockIn,
		};
		const timesheetRecord = await findTimesheet(newTimesheetRecord);

		if (!timesheetRecord) {
			await Timesheet.create(newTimesheetRecord);
		}
	}
};

const findTimesheet = async (record) => Timesheet.findOne(record);

const updateTimecardEntry = async (id, updatedData) => {
	const updatedTimecard = await Timecard.findByIdAndUpdate(id, updatedData);
	if (updatedTimecard) {
		const empRec = await findEmployee({
			timeManagementBadgeID: updatedTimecard.badge_id,
		});
		const timesheetRecord = await findTimesheet({
			employeeId: empRec.empId._id,
			companyName: empRec?.companyName,
			clockIn: updatedTimecard.clockIn,
		});
		if (timesheetRecord) {
			await Timesheet.findByIdAndUpdate(timesheetRecord._id, updatedData);
		}
	}
};

const findEmployee = async (timeManagementBadgeID) =>
	await EmployeeProfileInfo.findOne(timeManagementBadgeID)
		.populate({
			path: "empId",
			model: "Employee",
			select: "fullName",
		})
		.select("empId companyName");

const findPunchEntry = async (entry) => await TimecardRaw.findOne(entry);

const addPunchEntry = async (entry) => await TimecardRaw.create(entry);

const calcTotalBreakHours = (data) => {
	if (!(data?.clockIn && data?.clockOut)) {
		return;
	}
	const clockIn = momentTime(data?.clockIn);
	const clockOut = momentTime(data?.clockOut);

	const break1Start =
		data?.startBreaks.length && momentTime(data?.startBreaks[0]);
	const break1End = data?.endBreaks.length && momentTime(data?.endBreaks[0]);

	const break2Start =
		data?.startBreaks.length > 1 && momentTime(data?.startBreaks[1]);
	const break2End =
		data?.endBreaks.length > 1 && momentTime(data?.startBreaks[1]);

	const break3Start =
		data?.startBreaks.length > 2 && momentTime(data?.startBreaks[2]);
	const break3End =
		data?.endBreaks.length > 2 && momentTime(data?.startBreaks[2]);

	const break1Duration = momentDuration(break1Start, break1End);
	const break2Duration = momentDuration(break2Start, break2End);
	const break3Duration = momentDuration(break3Start, break3End);

	const totalBreakHours =
		data?.startBreaks.length && data?.endBreaks.length
			? break1Duration.add(break2Duration).add(break3Duration)
			: 0;

	const totalClockInToOut = momentDuration(clockIn, clockOut);
	const totalWorkingTime = totalClockInToOut.subtract(totalBreakHours);
	const hours = Math.floor(totalWorkingTime.asHours());
	const minutes = totalWorkingTime.minutes();
	return {
		totalBreakHours: totalBreakHours
			? Math.floor(totalBreakHours.asHours())
			: 0,
		totalWorkedHours: `${hours}:${minutes}`,
	};
};

module.exports = {
	getTimecard,
	createTimecard,
	calcTotalBreakHours,
};
