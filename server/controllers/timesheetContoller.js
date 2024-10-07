const EmployeePayInfo = require("../models/EmployeePayInfo");
const Timesheet = require("../models/Timesheet");
const moment = require("moment");

// const currentTime = currentDate.format("HH:mm:ss");
const currentDate = moment().add(1, "days");
const currentTime = currentDate.format("HH:mm");

const findByRecordTimesheets = async (record) => {
	const result = await Timesheet.find(record)
		.populate({
			path: "employeeId",
			model: "Employee",
			select: ["department", "fullName", "role"],
		})
		.sort({
			createdOn: -1,
			"employeeId.fullName": 1,
		});
	return result;
};

const getTimesheetResult = async (companyName) => {
	const payInfoResult = await EmployeePayInfo.find({
		companyName,
	}).select(
		"empId regPay overTimePay dblOverTimePay statWorkPay statPay sickPay vacationPay",
	);

	const payInfoMap = new Map(
		payInfoResult.map((payInfo) => [
			payInfo.empId.toString(),
			{
				regPay: payInfo.regPay,
				overTimePay: payInfo.overTimePay,
				dblOverTimePay: payInfo.dblOverTimePay,
				statWorkPay: payInfo.statWorkPay,
				statPay: payInfo.statPay,
				sickPay: payInfo.sickPay,
				vacationPay: payInfo.vacationPay,
			},
		]),
	);
	return payInfoMap;
};

const mapTimesheet = (payInfos, timesheets) => {
	timesheets.forEach((timesheet) => {
		const { clockIns, clockOuts } = timesheet;
		const empIdStr = timesheet.employeeId._id.toString();
		if (!payInfos.has(empIdStr)) {
			return;
		}
		const payInfo = payInfos.get(empIdStr);
		timesheet.regPay = payInfo.regPay;
		timesheet.overTimePay = payInfo.overTimePay;
		timesheet.dblOverTimePay = payInfo.dblOverTimePay;
		timesheet.statWorkPay = payInfo.statWorkPay;
		timesheet.statPay = payInfo.statPay;
		timesheet.sickPay = payInfo.sickPay;
		timesheet.vacationPay = payInfo.vacationPay;
		if (clockIns.length) {
			timesheet.startTime = clockIns[0];
		}
		if (clockOuts.length) {
			timesheet.endTime = clockOuts[clockOuts.length - 1];
		}
	});
	return timesheets;
};

const getTimesheets = async (req, res) => {
	const { companyName } = req.params;
	try {
		const timesheets = await findByRecordTimesheets({
			companyName,
			createdOn: { $lte: currentDate },
		});
		const payInfo = await getTimesheetResult(companyName);
		const result = mapTimesheet(payInfo, timesheets);
		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getFilteredTimesheets = async (req, res) => {
	const { companyName, filter } = req.params;
	const filteredData = JSON.parse(filter.split("=")[1]);
	try {
		let timesheets = await findByRecordTimesheets({
			companyName,
			createdOn: { $lte: filteredData?.endDate, $gte: filteredData?.startDate },
		});
		const payInfo = await getTimesheetResult(companyName);
		if (filteredData?.filteredEmployees?.length) {
			timesheets = timesheets.filter((item) =>
				filteredData?.filteredEmployees?.includes(item.employeeId.fullName),
			);
		}
		if (filteredData?.filteredDept?.length) {
			timesheets = timesheets.filter((item) =>
				filteredData?.filteredDept?.includes(item.employeeId.department[0]),
			);
		}
		if (filteredData?.filteredCC?.length) {
			timesheets = timesheets.filter((item) =>
				filteredData?.filteredCC?.includes(item.employeeId.role),
			);
		}
		const result = mapTimesheet(payInfo, timesheets);
		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getTimesheet = async (req, res) => {
	const { companyName, employeeId } = req.params;

	try {
		const timesheets = await findByRecordTimesheets({
			companyName,
			employeeId,
			createdOn: { $lte: currentDate },
		});
		res.status(200).json(timesheets);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const findEmployeeStatTimesheetExists = async (record) =>
	await Timesheet.findOne(record);

const addStatHolidayDefaultTimesheet = async (employeeId, companyName) => {
	const STAT_HOLIDAYS = [
		{ name: "New Year's Day", date: "2024-01-01" },
		{ name: "Family Day", date: "2024-02-19" },
		{ name: "Good Friday", date: "2024-03-29" },
		{ name: "Victoria Day", date: "2024-05-20" },
		{ name: "Canada Day", date: "2024-07-01" },
		{ name: "B.C. Day", date: "2024-08-05" },
		{ name: "Labour Day", date: "2024-09-02" },
		{ name: "National Day for Truth and Reconciliation", date: "2024-09-30" },
		{ name: "Thanksgiving Day", date: "2024-10-14" },
		{ name: "Remembrance Day", date: "2024-11-11" },
		{ name: "Christmas Day", date: "2024-12-25" },
	];
	const existingStatTimesheetInfo = await findEmployeeStatTimesheetExists({
		employeeId,
		companyName,
		payType: "Statutory Pay",
		// createdOn: moment(createdOn),
	});
	if (existingStatTimesheetInfo) {
		return existingStatTimesheetInfo;
	}
	STAT_HOLIDAYS.forEach(async ({ date }) => {
		const startTime = moment(date).set({
			hour: 9,
			minute: 0,
			second: 0,
			millisecond: 0,
		});
		const endTime = moment(date).set({
			hour: 17,
			minute: 0,
			second: 0,
			millisecond: 0,
		});
		const newStatTimeSheetRecord = {
			employeeId,
			companyName,
			payType: "Statutory Pay",
			createdOn: moment(date),
			clockIn: startTime,
			clockOut: endTime,
			statDayHours: getDateDiffHours(startTime, endTime, "0"),
		};

		await Timesheet.create(newStatTimeSheetRecord);
	});
	return "New record";
};

const createTimesheet = async (req, res) => {
	const { company, type, createdOn, employeeId } = req.body;
	const isStatPay = type === "Statutory Pay";

	try {
		if (isStatPay) {
			// const statEntryExists = await addStatHolidayDefaultTimesheet(
			// 	employeeId,
			// 	company,
			// 	createdOn,
			// );
			// if (statEntryExists !== "New record") {
			// 	return res.status(201).json("Stat Holiday Default Timesheet exists.");
			// } else if (statEntryExists === "New record") {
			// 	return res.status(201).json("Stat Holiday Default Timesheet added.");
			// }
			return res.status(201).json("Stat Holiday Default Timesheet exists.");
		}
		const newTimesheet = await Timesheet.create({
			employeeId,
			companyName: company,
			payType: type,
			createdOn,
			clockIns: [currentTime],
			startTime: currentTime,
		});
		res.status(201).json(newTimesheet);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// const calculateEndTime = (startTime, durationMinutes) => {
// 	let [hours, minutes] = startTime.split(":").map(Number);

// 	minutes += durationMinutes;

// 	hours += Math.floor(minutes / 60);
// 	minutes = minutes % 60;

// 	hours = hours % 24;
// 	let endTime = `${hours.toString().padStart(2, "0")}:${minutes
// 		.toString()
// 		.padStart(2, "0")}`;
// 	return endTime;
// };

const getDateDiffHours = (date1, date2, totalBreaks) => {
	const startTime = moment(date1 === "00:00" ? "09:00" : date1, "HH:mm");
	const endTime = moment(date2 === "00:00" ? date1 : date2, "HH:mm");
	const breakTime =
		totalBreaks === "" ? 0 : (parseFloat(totalBreaks) * 60).toFixed(0);
	const totalMinutes = moment.duration(endTime.diff(startTime)).asMinutes();
	const netMinutes = totalMinutes - breakTime;
	// const hoursDiff = Math.floor(netMinutes / 60);
	// const minutesDiff = Math.floor(netMinutes % 60);

	// const formattedHours = String(hoursDiff);
	// const formattedMinutes = String(minutesDiff);
	// return `${formattedHours}:${formattedMinutes}`;
	return netMinutes;
};

const addHours = (time, hoursToAdd) => {
	let [hour, minute] = time.split(":").map(Number);
	hour += hoursToAdd;
	if (hour >= 24) hour -= 24;
	return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

const addOvertimeTimesheet = async (
	employeeId,
	companyName,
	overtimeHrs,
	newStartTime,
	newEndTime,
	createdOn,
) => {
	const newStatTimeSheetRecord = {
		employeeId,
		companyName,
		payType: "Overtime Pay",
		startTime: newStartTime,
		endTime: newEndTime,
		// clockIns: [newStartTime],
		// clockOuts: [newEndTime],
		overtimeHoursWorked: overtimeHrs,
		createdOn,
	};
	const newTimesheet = await Timesheet.create(newStatTimeSheetRecord);
	return newTimesheet;
};

const updateTimesheet = async (req, res) => {
	const { id } = req.params;
	let { startTime, endTime, totalBreaks, approve, param_hours, company } =
		req.body;

	try {
		const timesheet = await Timesheet.findById(id);
		const totalWorkedHours = getDateDiffHours(startTime, endTime, totalBreaks);
		if (totalWorkedHours > 480) {
			const hoursToAdd = 8;
			const newStartTime = addHours(startTime, hoursToAdd);
			const overtimeMinutes = totalWorkedHours - 480;
			const remainingHours = Math.floor(overtimeMinutes / 60);
			const newEndTime = addHours(newStartTime, remainingHours);

			await addOvertimeTimesheet(
				timesheet.employeeId,
				company,
				overtimeMinutes,
				newStartTime,
				newEndTime,
				timesheet.createdOn,
			);
			timesheet[param_hours] = 480;
			// timesheet.clockOuts.push(newStartTime);
			timesheet.endTime = newStartTime;
		} else {
			timesheet[param_hours] = totalWorkedHours;
			if (endTime !== "00:00") {
				// timesheet.clockOuts.push(endTime);
				timesheet.endTime = endTime;
			}
		}

		timesheet.startTime = startTime;
		// timesheet.clockIns[0] = startTime;
		timesheet.totalBreaks = totalBreaks;
		timesheet.approveStatus = approve
			? "Approved"
			: approve === false
			? "Rejected"
			: "Pending";
		await timesheet.save();
		res.status(201).json(timesheet);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = {
	createTimesheet,
	getTimesheets,
	getTimesheet,
	updateTimesheet,
	addStatHolidayDefaultTimesheet,
	getFilteredTimesheets,
};
