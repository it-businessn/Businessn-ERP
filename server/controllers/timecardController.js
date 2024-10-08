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
} = require("../services/data");
const { addTimesheetEntry } = require("./timesheetContoller");

const getTimecard = async (req, res) => {
	try {
		const result = await Timecard.find({}).sort({
			clockIn: -1,
		});
		result.map((_) => (_.totalBreakHours = calcTotalBreakHours(_)));
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
		// 		timestamp: "2024-09-29 13:21:25",
		// 		status: "4",
		// 		punch: "0",
		// 	},
		// 	{
		// 		user_id: "7746",
		// 		timestamp: "2024-09-29 15:00:00",
		// 		status: "4",
		// 		punch: "2",
		// 	},
		// 	{
		// 		user_id: "7746",
		// 		timestamp: "2024-09-29 15:21:25",
		// 		status: "4",
		// 		punch: "3",
		// 	},
		// 	{
		// 		user_id: "7746",
		// 		timestamp: "2024-09-29 23:00:12",
		// 		status: "4",
		// 		punch: "1",
		// 	},
		// 	{
		// 		user_id: "7746",
		// 		timestamp: "2024-09-30 13:00:00",
		// 		status: "4",
		// 		punch: "0",
		// 	},
		// 	{
		// 		user_id: "7746",
		// 		timestamp: "2024-09-30 14:00:00",
		// 		status: "4",
		// 		punch: "2",
		// 	},
		// 	{
		// 		user_id: "7746",
		// 		timestamp: "2024-09-30 15:00:00",
		// 		status: "4",
		// 		punch: "3",
		// 	},
		// 	{
		// 		user_id: "7746",
		// 		timestamp: "2024-09-30 21:00:00",
		// 		status: "4",
		// 		punch: "1",
		// 	},
		// 	{
		// 		user_id: "7746",
		// 		timestamp: "2024-10-01 09:00:00",
		// 		status: "4",
		// 		punch: "0",
		// 	},
		// 	{
		// 		user_id: "7746",
		// 		timestamp: "2024-10-02 09:00:00",
		// 		status: "4",
		// 		punch: "0",
		// 	},
		// 	{
		// 		user_id: "7746",
		// 		timestamp: "2024-10-01 15:23:00",
		// 		status: "4",
		// 		punch: "2",
		// 	},
		// 	{
		// 		user_id: "7746",
		// 		timestamp: "2024-10-02 13:13:00",
		// 		status: "4",
		// 		punch: "2",
		// 	},
		// 	{
		// 		user_id: "7746",
		// 		timestamp: "2024-10-02 15:00:00",
		// 		status: "4",
		// 		punch: "1",
		// 	},
		// 	{
		// 		user_id: "7746",
		// 		timestamp: "2024-10-02 14:00:00",
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

			//breakout
			if (punch === "2") {
				const recentClockInEntry = await findRecentClockInRecord(
					user_id,
					timestamp,
				);
				if (recentClockInEntry) {
					await updateTimecardEntry(recentClockInEntry._id, {
						breakOut: timestamp,
					});
				} else {
					const record = {
						badge_id: user_id,
						breakOut: timestamp,
					};
					// await addTimecardEntry(record);
				}
			}

			//breakin
			if (punch === "3") {
				const recentClockInEntry = await findRecentClockInRecord(
					user_id,
					timestamp,
				);
				if (recentClockInEntry) {
					await updateTimecardEntry(recentClockInEntry._id, {
						breakIn: timestamp,
					});
				} else {
					const record = {
						badge_id: user_id,
						breakIn: timestamp,
					};
					// await addTimecardEntry(record);
				}
			}

			//clockout
			if (punch === "1") {
				const recentClockInEntry = await findRecentClockInRecord(
					user_id,
					timestamp,
				);

				if (recentClockInEntry) {
					await updateTimecardEntry(recentClockInEntry._id, {
						clockOut: timestamp,
					});
				} else {
					const record = {
						badge_id: user_id,
						clockOut: timestamp,
					};
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
			payType: "Regular Pay", //findpaytype
			clockIn,
		};
		await addTimesheetEntry(newTimesheetRecord);
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
	const break1Start = data?.breakOut && momentTime(data?.breakOut);
	const break1End = data?.breakIn && momentTime(data?.breakIn);
	const break1Duration = momentDuration(break1Start, break1End);
	const totalBreakTime = break1Duration;
	// const break1Start =
	// 	data?.startBreaks[0] && moment(data?.startBreaks[0], "YYYY-MM-DD hh:mm A");
	// const break1End = moment(data?.endBreaks[0], "YYYY-MM-DD hh:mm A");
	// const break2Start = moment(data?.startBreaks[1], "YYYY-MM-DD hh:mm A");
	// const break2End = moment(data?.startBreaks[1], "YYYY-MM-DD hh:mm A");
	// const break1Duration = moment.duration(break1End.diff(break1Start));
	// const break2Duration = moment.duration(break2End.diff(break2Start));
	// const totalBreakTime = break1Duration.add(break2Duration);
	const totalClockInToOut = momentDuration(clockIn, clockOut);
	const totalWorkingTime = totalClockInToOut.subtract(totalBreakTime);
	const hours = Math.floor(totalWorkingTime.asHours());
	const minutes = totalWorkingTime.minutes();
	return `${hours}:${minutes}`;
};

module.exports = {
	getTimecard,
	createTimecard,
	calcTotalBreakHours,
};
