const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");
const TimecardRaw = require("../models/TimecardRaw");
const Timecard = require("../models/Timecard");
const moment = require("moment");

const getTimecard = async (req, res) => {
	try {
		const result = await Timecard.find({}).sort({
			clockIn: -1,
		});
		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error: error.message });
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

const findTimecard = async (record) => await Timecard.findOne(record);

const addTimecardFromDevice = async (req, res) => {
	try {
		const data = req.body;
		data?.map(async (entry) => {
			entry.timestamp = moment.utc(entry.timestamp).toISOString();
			const { user_id, timestamp, punch } = entry;
			const entryExists = await TimecardRaw.findOne({
				user_id,
				timestamp,
				punch,
			});
			if (!entryExists) {
				await TimecardRaw.create(entry);
			}

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

			//breakin
			if (punch === "3") {
				const record = await findTimecard({
					badge_id: user_id,
					clockIn: { $ne: null },
				});
				if (record) {
					const breaks = record.startBreaks;
					const sameBreak = breaks.find((_) => moment(timestamp).isSame(_));
					if (!sameBreak) {
						breaks.push(timestamp);
						await updateTimecard(record, {
							startBreaks: breaks,
						});
					}
				}
			}

			//breakout
			if (punch === "2") {
				const record = await findTimecard({
					badge_id: user_id,
					clockIn: { $ne: null },
				});
				if (record) {
					const breaks = record.endBreaks;
					const sameBreak = breaks.find((_) => moment(timestamp).isSame(_));
					if (!sameBreak) {
						breaks.push(timestamp);
						await updateTimecard(record, {
							endBreaks: breaks,
						});
					}
				}
			}

			//clockout
			if (punch === "1") {
				const record = await findTimecard({
					badge_id: user_id,
					clockIn: { $ne: null },
				});
				if (record) {
					await updateTimecard(record, {
						clockOut: timestamp,
					});
				}
			}
			// const del = await Timecard.deleteMany({
			// 	_id: { $in: finds.map((id) => id) },
			// });
			// console.log("deleted", del, finds);
		});
		res.status(201).json("Timecard entries added successfully");
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const addTimecard = async (entry) => {
	const { user_id, timestamp } = entry;
	const empRec = await findEmployee({
		timeManagementBadgeID: user_id,
	});
	const newTimecard = await Timecard.create({
		badge_id: user_id,
		companyName: empRec.companyName,
		employeeName: empRec.empId.fullName,
		clockIn: timestamp,
	});
	return newTimecard;
};

const updateTimecard = async (record, updatedData) => {
	const updatedTimecard = await Timecard.findByIdAndUpdate(
		record._id,
		updatedData,
	);
	return updatedTimecard;
};

module.exports = {
	getTimecard,
	addTimecardFromDevice,
};
