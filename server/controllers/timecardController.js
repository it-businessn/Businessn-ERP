const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const Timecard = require("../models/Timecard");
const TimecardRaw = require("../models/TimecardRaw");
const Timesheet = require("../models/Timesheet");

const {
	getUTCTime,
	startOfDay,
	endOfDay,
	getPayType,
	calcTotalHours,
	PAY_TYPES_TITLE,
} = require("../services/data");
const moment = require("moment");

const getTimecard = async (req, res) => {
	const { companyName } = req.params;
	try {
		let { page, limit } = req.query;
		page = parseInt(page) || 1;
		limit = parseInt(limit) || 10;

		const skip = (page - 1) * limit;
		const result = await Timecard.find({ companyName })
			.sort({
				clockIn: -1,
			})
			.skip(skip)
			.limit(limit);

		const total = await Timecard.find({ companyName });

		result.map((_) => {
			_.totalBreakHours = calcTotalHours(_)?.totalBreakHours;
			_.totalWorkedHours = calcTotalHours(_)?.totalWorkedHours;
			return _;
		});

		res.status(200).json({
			page,
			limit,
			total: total?.length,
			totalPages: Math.ceil(total / limit),
			items: result,
		});
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

		// const y = await TimecardRaw.deleteMany({
		// 	timestamp: { $lt: moment("2024-10-20").toDate() },
		// });
		// console.log("del", y);

		data?.map(async (entry) => {
			if (entry?.isNotDevice && entry?.empId) {
				const { isNotDevice, companyName, empId } = entry;
				entry.timestamp = moment();
				entry.notDevice = isNotDevice;

				const emp_user_id = await EmployeeEmploymentInfo.findOne({
					empId,
					companyName,
				}).select("timeManagementBadgeID employeeNo");

				entry.user_id = emp_user_id?.timeManagementBadgeID
					? emp_user_id?.timeManagementBadgeID
					: emp_user_id?.employeeNo;
			}
			entry.timestamp = getUTCTime(entry.timestamp, entry?.isNotDevice);

			const { user_id, timestamp, punch } = entry;

			const dateThreshold = moment("2024-10-20");

			if (user_id) {
				const punchRecordExists = await findPunchEntry({
					user_id,
					timestamp,
					punch,
				});
				if (!punchRecordExists && moment(entry.timestamp).isAfter(dateThreshold)) {
					await addPunchEntry(entry);
				}
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
		entries?.forEach(async (record) => {
			const { user_id, timestamp, punch } = record;
			const targetDate = moment(timestamp).format("YYYY-MM-DD");

			const sameClockInTimeEntryExists = await findTimecardEntry({
				badge_id: user_id,
				clockIn: {
					$ne: null,
				},
				$expr: {
					$eq: [{ $dateToString: { format: "%Y-%m-%d", date: "$clockIn" } }, targetDate],
				},
			});

			if (punch == "0" && !sameClockInTimeEntryExists) {
				addTimecardEntry({
					badge_id: user_id,
					clockIn: timestamp,
					startBreaks: [],
					endBreaks: [],
					clockOut: null,
					notDevice: record?.notDevice,
				});
			}
			if (punch === "2" && sameClockInTimeEntryExists) {
				await updateTimecardData(sameClockInTimeEntryExists._id, {
					startBreaks: sameClockInTimeEntryExists.startBreaks.push(timestamp),
					notDevice: record?.notDevice,
				});
				const updatedEntry = {
					badge_id: user_id,
					clockIn: sameClockInTimeEntryExists.clockIn,
					startBreaks: sameClockInTimeEntryExists.startBreaks.push(timestamp),
					endBreaks: sameClockInTimeEntryExists.endBreaks,
					clockOut: sameClockInTimeEntryExists.clockOut,
					notDevice: record?.notDevice,
				};
				updateTimecardEntry(updatedEntry);
			}
			if (punch === "3" && sameClockInTimeEntryExists) {
				await updateTimecardData(sameClockInTimeEntryExists._id, {
					endBreaks: sameClockInTimeEntryExists.endBreaks.push(timestamp),
					notDevice: record?.notDevice,
				});
				const updatedEntry = {
					badge_id: user_id,
					clockIn: sameClockInTimeEntryExists.clockIn,
					startBreaks: sameClockInTimeEntryExists.startBreaks,
					endBreaks: sameClockInTimeEntryExists.endBreaks.push(timestamp),
					clockOut: sameClockInTimeEntryExists.clockOut,
					notDevice: record?.notDevice,
				};
				updateTimecardEntry(updatedEntry);
			}
			if (punch === "1" && sameClockInTimeEntryExists) {
				await updateTimecardData(sameClockInTimeEntryExists._id, {
					clockOut: timestamp,
					notDevice: record?.notDevice,
				});
				const updatedEntry = {
					badge_id: user_id,
					clockIn: sameClockInTimeEntryExists.clockIn,
					startBreaks: sameClockInTimeEntryExists.startBreaks,
					endBreaks: sameClockInTimeEntryExists.endBreaks,
					clockOut: timestamp,
					notDevice: record?.notDevice,
				};
				updateTimecardEntry(updatedEntry);
			}
		});
	} catch (error) {}
};

const updateTimecardData = async (id, data) =>
	await Timecard.findByIdAndUpdate(id, data, {
		new: true,
	});

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
	// const updatedTimecard = await Timecard.updateMany({}, { $set: { processedForTimesheet: true } });
	const { badge_id, clockIn, notDevice } = entry;
	const empRec = await findEmployee({
		$or: [{ timeManagementBadgeID: badge_id }, { employeeNo: badge_id }],
	});

	entry.notDevice = notDevice;
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
			notDevice,
		};
		const timesheetRecord = await findTimesheet(newTimesheetRecord);

		if (!timesheetRecord) {
			await Timesheet.create(newTimesheetRecord);
			await updateTimecardData(newTimecard._id, {
				processedForTimesheet: true,
			});
		}
	}
};

const findTimesheet = async (record) => Timesheet.findOne(record);

const updateTimecardEntry = async (entry) => {
	const empRec = await findEmployee({
		$or: [{ timeManagementBadgeID: entry.badge_id }, { employeeNo: entry.badge_id }],
	});

	const timesheetRecord = await findTimesheet({
		deleted: false,
		employeeId: empRec?.empId?._id,
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
		if (entry?.clockOut) {
			const durationHrs = moment
				.duration(moment(entry.clockOut).diff(moment(entry.clockIn)))
				.asHours()
				.toFixed(2);

			if (timesheetRecord.payType.includes("Regular")) {
				timesheetRecord.regHoursWorked = durationHrs;
			}
			if (timesheetRecord.payType === PAY_TYPES_TITLE.STAT_WORK_PAY) {
				timesheetRecord.statDayHoursWorked = durationHrs;
			}
		}
	}

	await timesheetRecord.save();
};

const findEmployee = async (timeManagementBadgeID) =>
	await EmployeeEmploymentInfo.findOne(timeManagementBadgeID)
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
