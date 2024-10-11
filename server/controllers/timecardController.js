const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");
const Timecard = require("../models/Timecard");
const TimecardRaw = require("../models/TimecardRaw");
const Timesheet = require("../models/Timesheet");

const {
	getUTCTime,
	startOfDay,
	endOfDay,
	getPayType,
	calcTotalHours,
} = require("../services/data");

const getTimecard = async (req, res) => {
	try {
		const result = await Timecard.find({}).sort({ clockIn: -1 });

		result.map((_) => {
			_.totalBreakHours = calcTotalHours(_)?.totalBreakHours;
			_.totalWorkedHours = calcTotalHours(_)?.totalWorkedHours;
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
		const entries = await TimecardRaw.find({}).sort({ timestamp: 1 });

		let groupedPunches = groupPunches(entries);

		groupedPunches.map(async (entry) => {
			const clockInTimeEntryExists = await findTimecardEntry({
				badge_id: entry.badge_id,
				clockIn: entry.clockIn,
			});
			if (clockInTimeEntryExists) {
				await Timecard.findByIdAndUpdate(clockInTimeEntryExists._id, entry);
				updateTimecardEntry(entry);
			} else {
				addTimecardEntry(entry);
			}
		});
	} catch (error) {}
};

const groupPunches = (punches) => {
	let clockIns = [];

	let timeCardRow = null;

	punches.forEach((punch) => {
		if (punch.punch === "0") {
			timeCardRow = {
				badge_id: punch.user_id,
				clockIn: punch.timestamp,
				startBreaks: [],
				endBreaks: [],
				clockOut: null,
			};
			clockIns.push(timeCardRow);
		} else if (punch.punch === "2" && timeCardRow) {
			timeCardRow.startBreaks.push(punch.timestamp);
		} else if (punch.punch === "3" && timeCardRow) {
			timeCardRow.endBreaks.push(punch.timestamp);
		} else if (punch.punch === "1" && timeCardRow) {
			timeCardRow.clockOut = punch.timestamp;
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

const updateTimecardEntry = async (entry) => {
	const empRec = await findEmployee({
		timeManagementBadgeID: entry.badge_id,
	});

	const timesheetRecord = await findTimesheet({
		employeeId: empRec.empId._id,
		companyName: empRec?.companyName,
		clockIn: entry.clockIn,
	});

	if (!timesheetRecord) {
		return;
	}
	if (!timesheetRecord?.startBreaks?.length) {
		timesheetRecord.startBreaks = entry.startBreaks;
	}
	if (!timesheetRecord?.endBreaks?.length) {
		timesheetRecord.endBreaks = entry.endBreaks;
	}
	if (!timesheetRecord?.clockOut) {
		timesheetRecord.clockOut = entry.clockOut;
	}
	await timesheetRecord.save();
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

module.exports = {
	getTimecard,
	createTimecard,
};
