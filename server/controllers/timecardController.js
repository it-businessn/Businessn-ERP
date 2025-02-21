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
	PUNCH_CODE,
	PARAM_HOURS,
} = require("../services/data");
const moment = require("moment");
const { getHolidays } = require("./setUpController");

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

		const uniqueEntries = [
			...new Map(
				result.map((entry) => {
					const key = entry.clockOut
						? `${entry.clockIn.getTime()}`
						: `${entry.clockIn.getTime()}-null`;
					return [key, entry];
				}),
			).values(),
		];
		uniqueEntries.map((_) => {
			_.totalBreakHours = calcTotalHours(_)?.totalBreakHours;
			_.totalWorkedHours = calcTotalHours(_)?.totalWorkedHours;
			return _;
		});

		res.status(200).json({
			page,
			limit,
			total: total?.length,
			totalPages: Math.ceil(total / limit),
			items: uniqueEntries,
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

			if (punch == PUNCH_CODE.CLOCK_IN && !sameClockInTimeEntryExists) {
				addTimecardEntry({
					badge_id: user_id,
					clockIn: timestamp,
					startBreaks: [],
					endBreaks: [],
					clockOut: null,
					notDevice: record?.notDevice,
				});
			}
			if (punch === PUNCH_CODE.CLOCK_OUT && sameClockInTimeEntryExists) {
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

const addTimecardEntry = async (entry, isBreak) => {
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
		const currentYrSTAT_HOLIDAYS = await getHolidays({
			companyName: empRec?.companyName,
		});
		const isStatHoliday = currentYrSTAT_HOLIDAYS.find(
			({ date }) => moment.utc(date).format("YYYY-MM-DD") === moment(clockIn).format("YYYY-MM-DD"),
		);
		const newTimesheetRecord = {
			employeeId: entry.employeeId,
			companyName: entry.companyName,
			payType: isBreak
				? PAY_TYPES_TITLE.REG_PAY_BRK
				: isStatHoliday
				? PAY_TYPES_TITLE.STAT_WORK_PAY
				: getPayType(),
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

const updateTimecardEntry = async (entry, isBreakType) => {
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
	if (isBreakType && entry?.clockOut && timesheetRecord.payType === PAY_TYPES_TITLE.REG_PAY_BRK) {
		const durationHrs = moment
			.duration(moment(entry.clockOut).diff(moment(entry.clockIn)))
			.asHours()
			.toFixed(2);
		timesheetRecord.breakHoursWorked = durationHrs;
	}
	if (!isBreakType && !timesheetRecord?.clockOut) {
		timesheetRecord.clockOut = entry.clockOut;
		if (entry?.clockOut) {
			const durationHrs = moment
				.duration(moment(entry.clockOut).diff(moment(entry.clockIn)))
				.asHours()
				.toFixed(2);

			if (timesheetRecord.payType === PAY_TYPES_TITLE.REG_PAY) {
				timesheetRecord[PARAM_HOURS.REGULAR] = durationHrs;
			}
			if (timesheetRecord.payType === PAY_TYPES_TITLE.STAT_WORK_PAY) {
				timesheetRecord[PARAM_HOURS.STAT] = durationHrs;
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

const createTimecardManual = async (req, res) => {
	try {
		const data = req.body;
		// console.log("createTimecardManual", data);
		data?.map(async (entry) => {
			if (entry?.isNotDevice && entry?.empId) {
				const { isNotDevice, companyName, empId, punch } = entry;

				entry.notDevice = isNotDevice;

				const emp_user_id = await EmployeeEmploymentInfo.findOne({
					empId,
					companyName,
				}).select("employeeNo");

				entry.user_id = emp_user_id?.employeeNo;

				const targetDate = moment().format("YYYY-MM-DD");

				const sameClockInTimeEntryExists = await Timecard.findOne({
					badge_id: entry.user_id,
					companyName,
					clockIn: {
						$ne: null,
					},
					clockOut: null,
				}).sort({ clockIn: 1 });
				// console.log("sameClockInTimeEntryExists", punch, sameClockInTimeEntryExists);
				if (punch == PUNCH_CODE.CLOCK_IN && !sameClockInTimeEntryExists) {
					console.log("CLOCK_IN");

					// addTimecardEntry({
					// 	badge_id: entry.user_id,
					// 	clockIn: moment(),
					// 	startBreaks: [],
					// 	endBreaks: [],
					// 	clockOut: null,
					// 	notDevice: entry?.notDevice,
					// });
				}
				if (punch === PUNCH_CODE.CLOCK_OUT && sameClockInTimeEntryExists) {
					console.log("CLOCK_OUT");
					// const clockOutRecord = await updateTimecardData(sameClockInTimeEntryExists._id, {
					// 	clockOut: moment(),
					// 	notDevice: entry?.notDevice,
					// });
					// const updatedEntry = {
					// 	badge_id: entry.user_id,
					// 	clockIn: sameClockInTimeEntryExists.clockIn,
					// 	startBreaks: [],
					// 	endBreaks: [],
					// 	clockOut: moment(),
					// 	notDevice: entry?.notDevice,
					// };
					// updateTimecardEntry(updatedEntry);
				}
				if (punch === PUNCH_CODE.BREAK_IN && !sameClockInTimeEntryExists) {
					console.log("BREAK_IN");
					// addTimecardEntry(
					// 	{
					// 		badge_id: entry.user_id,
					// 		clockIn: moment(),
					// 		startBreaks: [],
					// 		endBreaks: [],
					// 		clockOut: null,
					// 		notDevice: record?.notDevice,
					// 	},
					// 	true,
					// );
				}
				if (punch === PUNCH_CODE.BREAK_OUT && sameClockInTimeEntryExists) {
					console.log("BREAK_OUT");
					// await updateTimecardData(sameClockInTimeEntryExists._id, {
					// 	clockOut: moment(),
					// 	notDevice: record?.notDevice,
					// });
					// const updatedEntry = {
					// 	badge_id: entry.user_id,
					// 	clockIn: sameClockInTimeEntryExists.clockIn,
					// 	startBreaks: [],
					// 	endBreaks: [],
					// 	clockOut: moment(),
					// 	notDevice: record?.notDevice,
					// };
					// updateTimecardEntry(updatedEntry, true);
				}
			}
			// const k = await Timecard.deleteMany({
			// 	companyName: "Cornerstone Maintenance Group Ltd.",
			// });
			// const s = await Timesheet.deleteMany({
			// 	companyName: "Cornerstone Maintenance Group Ltd.",
			// });
			// console.log(k, s);
			res.status(201).json("Timecard entries added manually");
		});
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = {
	getTimecard,
	createTimecard,
	createTimecardManual,
};
