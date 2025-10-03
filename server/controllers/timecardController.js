const moment = require("moment");

const EmployeeTADProfileInfo = require("../models/EmployeeTADProfile");
const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const Timecard = require("../models/Timecard");
const TimecardRaw = require("../models/TimecardRaw");
const Timesheet = require("../models/Timesheet");
const {
	addOvertimeRecord,
	addTimesheetEntry,
	calcTotalWorkedHours,
} = require("../helpers/timecardHelper");

const {
	getUTCTime,
	startOfDay,
	endOfDay,
	getPayType,
	calcTotalHours,
	PAY_TYPES_TITLE,
	PUNCH_CODE,
	PARAM_HOURS,
	TIMESHEET_SOURCE,
	COMPANIES,
	ROLES,
} = require("../services/data");
const { getHolidays } = require("./statHolidayController");

const getTADUsers = async (req, res) => {
	try {
		const result = await EmployeeTADProfileInfo.find({
			companyName: COMPANIES.NW,
		}).select(
			"companyName firstName middleName lastName cardNum timeManagementBadgeID createdOn isNewUser",
		);
		return res.status(200).json(result);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getFilteredTADUsers = async (req, res) => {
	try {
		const timecardBadges = await Timecard.find({
			companyName: COMPANIES.NW,
		}).distinct("badge_id");
		await EmployeeTADProfileInfo.updateMany(
			{
				companyName: COMPANIES.NW,
				timeManagementBadgeID: { $in: timecardBadges },
			},
			{
				$set: { isNewUser: false },
			},
		);
		const result = await EmployeeTADProfileInfo.find({
			companyName: COMPANIES.NW,
			timeManagementBadgeID: { $nin: timecardBadges },
		}).select(
			"companyName firstName middleName lastName cardNum timeManagementBadgeID createdOn isNewUser",
		);
		return res.status(200).json(result);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getTimecard = async (req, res) => {
	const { companyName, filter } = req.params;
	try {
		const filteredData = JSON.parse(filter.split("=")[1]);
		const { startDate, endDate } = filteredData;

		let { page, limit } = req.query;
		page = parseInt(page) || 1;
		limit = parseInt(limit) || 10;

		const skip = (page - 1) * limit;
		const filterCriteria = {
			companyName,
			clockIn: {
				$gte: moment.utc(startDate).startOf("day").toDate(),
				$lte: moment().endOf("day").toDate(),
			},
		};
		const result = await Timecard.find(filterCriteria).sort({ clockIn: -1 }).skip(skip);
		// .limit(limit);

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
		uniqueEntries?.map((_) => {
			_.totalBreakHours = calcTotalHours(_)?.totalBreakHours;
			_.totalWorkedHours = calcTotalHours(_)?.totalWorkedHours;
			return _;
		});

		return res.status(200).json({
			page,
			limit,
			total: uniqueEntries?.length,
			totalPages: Math.ceil(uniqueEntries?.length / limit),
			items: uniqueEntries,
		});
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
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

		const dateThreshold = moment("2024-10-20");
		await Promise.all(
			(data || [])?.map(async (entry) => {
				entry.timestamp = getUTCTime(entry.timestamp, entry?.isNotDevice);

				const { user_id, timestamp, punch } = entry;

				if (user_id) {
					const isAfterThreshold = moment(entry.timestamp).isAfter(dateThreshold);
					if (isAfterThreshold) {
						const punchRecordExists = await findPunchEntry({ user_id, timestamp, punch });
						if (!punchRecordExists) {
							await addPunchEntry(entry);
						}
					}
				}
			}),
		);
		await mapTimecardRawToTimecard();
		return res.status(201).json("Timecard entries added successfully");
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const mapTimecardRawToTimecard = async () => {
	try {
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(today.getDate() - 1);

		// const entries = await TimecardRaw.find({
		// 	user_id: "5597",
		// 	timestamp: {
		// 		$gte: new Date("2025-01-01T00:00:00Z"),
		// 		$lt: new Date("2026-01-01T00:00:00Z"),
		// 	},
		// }).sort({ timestamp: 1 });

		const entries = await TimecardRaw.find({
			timestamp: {
				$gte: moment(yesterday).startOf("day").toDate(),
				$lte: moment(today).endOf("day").toDate(),
			},
		}).sort({ timestamp: 1 });

		for (const record of entries || []) {
			const { user_id, timestamp, punch } = record;
			const date = new Date(timestamp);
			const targetDate = date.toISOString().split("T")[0];

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
				await addTimecardEntry({
					badge_id: user_id,
					clockIn: timestamp,
					startBreaks: [],
					endBreaks: [],
					clockOut: null,
					notDevice: record?.notDevice,
				});
			} else if (punch === PUNCH_CODE.CLOCK_OUT && sameClockInTimeEntryExists) {
				await updateTimecardData(sameClockInTimeEntryExists._id, {
					clockOut: timestamp,
					notDevice: record?.notDevice,
				});
				await updateTimecardEntry({
					badge_id: user_id,
					clockIn: sameClockInTimeEntryExists.clockIn,
					startBreaks: sameClockInTimeEntryExists.startBreaks,
					endBreaks: sameClockInTimeEntryExists.endBreaks,
					clockOut: timestamp,
					notDevice: record?.notDevice,
				});
			}
		}
	} catch (error) {}
};

const updateTimecardData = async (id, data) =>
	await Timecard.findByIdAndUpdate(
		id,
		{ $set: data },
		{
			new: true,
		},
	);

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
	const empRec = await findEmployeeTAD(badge_id);
	if (empRec) {
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
				({ date }) =>
					moment.utc(date).format("YYYY-MM-DD") === moment(clockIn).format("YYYY-MM-DD"),
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
				source: TIMESHEET_SOURCE.TAD,
			};
			const timesheetRecord = await findTimesheet(newTimesheetRecord);

			if (!timesheetRecord) {
				await addTimesheetEntry(newTimesheetRecord);
				await updateTimecardData(newTimecard._id, {
					processedForTimesheet: true,
				});
			}
		}
	}
};

const findTimesheet = async (record) => Timesheet.findOne(record);

const updateTimecardEntry = async (entry, isBreakType) => {
	const empRec = await findEmployeeTAD(entry.badge_id);

	const timesheetRecord = await findTimesheet({
		deleted: false,
		employeeId: empRec?.empId?._id,
		companyName: empRec?.companyName,
		clockIn: entry.clockIn,
	});
	if (timesheetRecord) {
		if (isBreakType && entry?.clockOut && timesheetRecord.payType === PAY_TYPES_TITLE.REG_PAY_BRK) {
			const durationHrs = calcTotalWorkedHours(entry.clockIn, entry.clockOut);
			timesheetRecord.regBreakHoursWorked = durationHrs;
			await timesheetRecord.save();
		} else if (!isBreakType && !timesheetRecord?.clockOut && entry?.clockOut) {
			const totalWorkedHours = calcTotalWorkedHours(entry.clockIn, entry.clockOut);
			if (timesheetRecord.payType === PAY_TYPES_TITLE.REG_PAY) {
				if (Math.round(totalWorkedHours) > 8) {
					const adjustedClockOut = await addOvertimeRecord(
						entry.clockIn,
						entry.clockOut,
						timesheetRecord?.employeeId,
						timesheetRecord?.companyName,
						timesheetRecord?.source,
					);
					timesheetRecord.clockOut = adjustedClockOut;
					timesheetRecord[PARAM_HOURS.REGULAR] = 8;
				} else {
					timesheetRecord.clockOut = entry.clockOut;
					timesheetRecord[PARAM_HOURS.REGULAR] = totalWorkedHours;
				}
				await timesheetRecord.save();
			} else if (timesheetRecord.payType === PAY_TYPES_TITLE.STAT_WORK_PAY) {
				timesheetRecord[PARAM_HOURS.STAT] = totalWorkedHours;
				timesheetRecord.clockOut = entry.clockOut;
				await timesheetRecord.save();
			}
		}
	}
};

const findEmployeeTAD = async (timeManagementBadgeID) =>
	await EmployeeEmploymentInfo.findOne({
		payrollStatus: "Payroll Active",
		employmentRole: { $ne: ROLES.SHADOW_ADMIN },
		$or: [
			{ "positions.timeManagementBadgeID": timeManagementBadgeID },
			{ timeManagementBadgeID },
			{ employeeNo: timeManagementBadgeID },
		],
	})
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
		await Promise.all(
			(data || [])?.map(async (entry) => {
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
				return res.status(201).json("Timecard entries added manually");
			}),
		);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const updateTADEmployee = async (empId, companyName, positionData) => {
	const empProfileInfo = await EmployeeProfileInfo.findOne({
		empId,
		companyName,
	}).select("firstName middleName lastName");

	const { firstName, middleName, lastName } = empProfileInfo;

	const tadUserExists = await EmployeeTADProfileInfo.findOne({ empId, companyName });
	if (tadUserExists) {
		tadUserExists.cardNum = positionData?.employeeCardNumber;
		tadUserExists.timeManagementBadgeID = positionData?.timeManagementBadgeID;
		return await tadUserExists.save();
	}
	if (!tadUserExists && positionData?.timeManagementBadgeID) {
		return await EmployeeTADProfileInfo.create({
			empId,
			companyName,
			firstName,
			middleName,
			lastName,
			cardNum: positionData?.employeeCardNumber,
			timeManagementBadgeID: positionData?.timeManagementBadgeID,
		});
	}
};

module.exports = {
	getTimecard,
	createTimecard,
	createTimecardManual,
	getTADUsers,
	getFilteredTADUsers,
	updateTADEmployee,
};
