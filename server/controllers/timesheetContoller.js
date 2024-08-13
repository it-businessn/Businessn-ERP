const EmployeePayInfo = require("../models/EmployeePayInfo");
const Timesheet = require("../models/Timesheet");
const moment = require("moment");

const currentDate = new Date();

const getTimesheets = async (req, res) => {
	const { companyName } = req.params;
	try {
		const timesheets = await Timesheet.find({ companyName }).populate({
			path: "employeeId",
			model: "Employee",
			select: ["department", "fullName"],
		});

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

		timesheets
			.sort((a, b) => b.createdOn - a.createdOn)
			.forEach((timesheet) => {
				const { clockIns, clockOuts } = timesheet;
				const empIdStr = timesheet.employeeId._id.toString();
				if (!payInfoMap.has(empIdStr)) {
					return;
				}
				const payInfo = payInfoMap.get(empIdStr);
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

		res.status(200).json(timesheets);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getTimesheet = async (req, res) => {
	const { companyName, empId } = req.params;

	try {
		const timesheet = await Timesheet.find({ companyName, empId }).populate({
			path: "employeeId",
			model: "Employee",
			select: ["role", "fullName"],
		});
		res.status(200).json(timesheet);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const createTimesheet = async (req, res) => {
	const { company, type, createdOn, employeeId } = req.body;
	const isStatPay = type === "Statutory Pay";

	try {
		// const today = new Date(
		// 	currentDate.getFullYear(),
		// 	currentDate.getMonth(),
		// 	currentDate.getDate(),
		// );
		// const tomorrow = new Date(
		// 	currentDate.getFullYear(),
		// 	currentDate.getMonth(),
		// 	currentDate.getDate() + 1,
		// );
		if (isStatPay) {
			const startTime = "09:00";
			const endTime = "17:00";
			const newStatTimeSheetRecord = {
				employeeId,
				companyName: company,
				payType: type,
				createdOn,
				clockIns: [startTime],
				clockOuts: [endTime],
				statDayHours: getDateDiffHours(startTime, endTime, "0"),
			};
			const newTimesheet = await Timesheet.create(newStatTimeSheetRecord);
			return res.status(201).json(newTimesheet);
		}
		const newTimesheet = await Timesheet.create({
			employeeId,
			companyName: company,
			payType: type,
			createdOn,
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
	const breakTime = totalBreaks === "" ? 0 : parseInt(totalBreaks) / 60;
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
		clockIns: [newStartTime],
		clockOuts: [newEndTime],
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
			timesheet.clockOuts.push(newStartTime);
			timesheet.endTime = newStartTime;
		} else {
			timesheet[param_hours] = totalWorkedHours;
			if (endTime !== "00:00") {
				timesheet.clockOuts.push(endTime);
				timesheet.endTime = endTime;
			}
		}

		timesheet.startTime = startTime;
		timesheet.clockIns[0] = startTime;
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
};
