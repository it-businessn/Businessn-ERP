const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");
const TimecardRaw = require("../models/TimecardRaw");
const Timecard = require("../models/Timecard");
const moment = require("moment");

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

const calcTotalBreakHours = (data) => {
	if (!(data?.clockIn && data?.clockOut)) {
		return;
	}
	const clockIn = moment(data?.clockIn, "YYYY-MM-DD hh:mm A");
	const clockOut =
		data?.clockOut && moment(data?.clockOut, "YYYY-MM-DD hh:mm A");
	const break1Start =
		data?.startBreaks[0] && moment(data?.startBreaks[0], "YYYY-MM-DD hh:mm A");
	const break1End = moment(data?.endBreaks[0], "YYYY-MM-DD hh:mm A");
	const break2Start = moment(data?.startBreaks[1], "YYYY-MM-DD hh:mm A");
	const break2End = moment(data?.startBreaks[1], "YYYY-MM-DD hh:mm A");
	const break1Duration = moment.duration(break1End.diff(break1Start));
	const break2Duration = moment.duration(break2End.diff(break2Start));
	const totalBreakTime = break1Duration.add(break2Duration);
	const totalClockInToOut = moment.duration(clockOut.diff(clockIn));
	const totalWorkingTime = totalClockInToOut.subtract(totalBreakTime);
	const hours = Math.floor(totalWorkingTime.asHours());
	const minutes = totalWorkingTime.minutes();
	return `${hours}:${minutes}`;
};

const findEmployee = async (timeManagementBadgeID) =>
	await EmployeeProfileInfo.findOne(timeManagementBadgeID)
		.populate({
			path: "empId",
			model: "Employee",
			select: "fullName",
		})
		.select("empId companyName");

const findTimecard = async (record) => await Timecard.findOne(record);

const addTimecardFromDevice = async (req, res) => {
	try {
		const data = req.body;
		// const data = [
		// 	{
		// 		user_id: "7745",
		// 		timestamp: "2024-09-30 14:21:25",
		// 		status: "4",
		// 		punch: "3",
		// 	},
		// 	{
		// 		user_id: "7745",
		// 		timestamp: "2024-09-30 15:00:00",
		// 		status: "4",
		// 		punch: "2",
		// 	},
		// 	{
		// 		user_id: "7745",
		// 		timestamp: "2024-09-30 23:00:12",
		// 		status: "4",
		// 		punch: "1",
		// 	},
		// ];

		data?.map(async (entry) => {
			entry.timestamp = entry?.isNotDevice
				? moment()
				: moment.utc(entry.timestamp).toISOString();

			const emp_user_id =
				entry?.empId &&
				(await EmployeeProfileInfo.findOne({ empId: entry?.empId }).select(
					"timeManagementBadgeID",
				));

			entry.user_id = emp_user_id?.timeManagementBadgeID ?? entry?.user_id;

			const { user_id, timestamp, punch } = entry;
			entry.notDevice = entry?.isNotDevice;

			const entryExists = await TimecardRaw.findOne({
				user_id,
				timestamp,
				punch,
			});
			if (!entryExists) {
				await TimecardRaw.create(entry);
			}
		});
		await buildTimeCardDB();
		res.status(201).json("Timecard entries added successfully");
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const buildTimeCardDB = async () => {
	try {
		const result = await TimecardRaw.find({});
		result?.forEach(async (entry) => {
			const { user_id, timestamp, punch } = entry;

			const record = await Timecard.find({ badge_id: user_id });
			// const sameDateClockIn = record?.find((_) =>
			// 	moment(timestamp).isSame(new Date(_.clockIn), "day"),
			// );

			// clockin
			if (punch === "0") {
				const clockInTimeEntryExists = await findTimecard({
					badge_id: user_id,
					clockIn: timestamp,
				});
				if (!clockInTimeEntryExists) {
					await addTimecard(entry);
				}
			}

			//breakout
			else if (punch === "2") {
				const notBreakOut = record?.find(
					(_) =>
						moment(timestamp).isSame(new Date(_.clockIn), "day") &&
						!_.startBreaks.length,
				);
				if (notBreakOut) {
					const breaks = notBreakOut?.startBreaks;
					const breakEntryExists = breaks?.find((_) =>
						moment(timestamp).isSame(_),
					);

					if (!breakEntryExists) {
						breaks.push(timestamp);
						await updateTimecard(notBreakOut, {
							startBreaks: breaks,
						});
					}
				}
			}

			//breakin
			else if (punch === "3") {
				const notBreakIn = record?.find(
					(_) =>
						moment(timestamp).isSame(new Date(_.clockIn), "day") &&
						!_.endBreaks.length,
				);

				if (notBreakIn) {
					const breaks = notBreakIn?.endBreaks;
					const breakEntryExists = breaks?.find((_) =>
						moment(timestamp).isSame(_),
					);
					if (!breakEntryExists) {
						breaks.push(timestamp);
						await updateTimecard(notBreakIn, {
							endBreaks: breaks,
						});
					}
				}
			}

			//clockout
			else if (punch === "1") {
				const notClockout = record?.find(
					(_) =>
						moment(timestamp).isSame(new Date(_.clockIn), "day") && !_.clockOut,
				);
				if (notClockout) {
					await updateTimecard(notClockout, {
						clockOut: timestamp,
					});
				}
			}
		});
	} catch (error) {}
};

const addTimecard = async (entry) => {
	const { user_id, timestamp } = entry;
	const empRec = await findEmployee({
		timeManagementBadgeID: user_id,
	});

	const newTimecard = await Timecard.create({
		badge_id: user_id,
		companyName: empRec?.companyName,
		employeeName: empRec?.empId?.fullName,
		clockIn: timestamp,
		notDevice: entry?.notDevice,
	});
	return newTimecard;
};

const updateTimecard = async (record, updatedData) => {
	if (record) {
		const updatedTimecard = await Timecard.findByIdAndUpdate(
			record._id,
			updatedData,
		);
		return updatedTimecard;
	}
};

module.exports = {
	getTimecard,
	addTimecardFromDevice,
};
