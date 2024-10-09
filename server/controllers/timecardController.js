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
		const result = await Timecard.find({}).sort({
			clockIn: -1,
		});
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
		// 		timestamp: "2024-09-29 07:00:25",
		// 		status: "4",
		// 		punch: "0",
		// 	},
		// 	{
		// 		user_id: "7746",
		// 		timestamp: "2024-09-29 09:00:25",
		// 		status: "4",
		// 		punch: "2",
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
		const punches = await TimecardRaw.find({});
		punches?.map(async (entry) => {
			const { user_id, timestamp, punch } = entry;

			// clockin
			if (punch === "0") {
				const clockInTimeEntryExists = await findTimecardEntry({
					badge_id: user_id,
					clockIn: timestamp,
				});
				if (!clockInTimeEntryExists) {
					const record = {
						badge_id: user_id,
						clockIn: timestamp,
					};
					await addTimecardEntry(record);
				}
			}

			const recentClockInEntry = await findRecentClockInRecord(
				user_id,
				timestamp,
			);

			//breakout
			if (punch === "2") {
				let startBreakEntries = [];
				if (recentClockInEntry) {
					startBreakEntries = recentClockInEntry.startBreaks;
					if (
						!startBreakEntries.length ||
						!startBreakEntries.find((_) => isSameDate(_, timestamp))
					) {
						startBreakEntries.push(timestamp);
					}
					await updateTimecardEntry(recentClockInEntry._id, {
						startBreaks: startBreakEntries,
					});
				} else {
					// const record = {
					// 	badge_id: user_id,
					// 	breakOut: timestamp,
					// };
					// await addTimecardEntry(record);
				}
			}

			//breakin
			if (punch === "3") {
				let endBreakEntries = [];
				if (recentClockInEntry) {
					endBreakEntries = recentClockInEntry.endBreaks;
					if (
						!endBreakEntries.length ||
						!endBreakEntries.find((_) => isSameDate(_, timestamp))
					) {
						endBreakEntries.push(timestamp);
					}
					await updateTimecardEntry(recentClockInEntry._id, {
						endBreaks: endBreakEntries,
					});
				} else {
					// const record = {
					// 	badge_id: user_id,
					// 	breakIn: timestamp,
					// };
					// await addTimecardEntry(record);
				}
			}

			//clockout
			if (punch === "1") {
				if (recentClockInEntry) {
					await updateTimecardEntry(recentClockInEntry._id, {
						clockOut: timestamp,
					});
				} else {
					// const record = {
					// 	badge_id: user_id,
					// 	clockOut: timestamp,
					// };
					// await addTimecardEntry(record);
				}
			}
		});
	} catch (error) {}
};

const findTimecardEntry = async (entry) => await Timecard.findOne(entry);

const findRecentClockInRecord = async (badge_id, timestamp) => {
	const recentClockInEntry = await Timecard.findOne({
		badge_id,
		clockOut: null,
		clockIn: { $gte: startOfDay(timestamp), $lte: endOfDay(timestamp) },
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
		await Timesheet.create(newTimesheetRecord);
	}
};

const updateTimecardEntry = async (id, updatedData) => {
	const updatedTimecard = await Timecard.findByIdAndUpdate(id, updatedData);
	if (updatedTimecard) {
		const empRec = await findEmployee({
			timeManagementBadgeID: updatedTimecard.badge_id,
		});
		const timesheetRecord = await Timesheet.findOne({
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
