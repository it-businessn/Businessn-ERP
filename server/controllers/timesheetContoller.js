const EmployeePayInfo = require("../models/EmployeePayInfo");
const Timesheet = require("../models/Timesheet");
const moment = require("moment");
const momentTz = require("moment-timezone");
const { getPayrollActiveEmployees } = require("./userController");
const { findEmployeePayInfo } = require("./payInfoController");
const {
	PAY_TYPES_TITLE,
	TIMESHEET_STATUS,
	PARAM_HOURS,
	NEXT_DAY,
	PUNCH_CODE,
	getPayType,
	EARNING_TYPE,
} = require("../services/data");

const findByRecordTimesheets = async (record) => {
	// const y = await Timesheet.deleteMany({
	// 	clockIn: {
	// 		$lte: moment("2024-10-22"),
	// 	},
	// });
	// console.log("del", y);
	const result = await Timesheet.find(record)
		// .limit(50)
		.populate({
			path: "employeeId",
			model: "Employee",
			select: ["department", "fullName", "role"],
		});
	const empData = result?.sort((a, b) => {
		if (a.employeeId?.fullName < b.employeeId?.fullName) return -1;
		if (a.employeeId?.fullName > b.employeeId?.fullName) return 1;
		return a.clockIn - b.clockIn;
	});
	return empData;
};

const getTimesheetResult = async (companyName) => {
	const payInfoResult = await EmployeePayInfo.find({
		companyName,
	}).select(
		"empId regPay overTimePay dblOverTimePay statWorkPay statPay sickPay vacationPay typeOfEarning",
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
				typeOfEarning: payInfo.typeOfEarning,
			},
		]),
	);
	return payInfoMap;
};

const mapTimesheet = (payInfos, timesheets) => {
	timesheets.forEach((timesheet) => {
		const empIdStr = timesheet?.employeeId?._id.toString();
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

		timesheet.typeOfEarning = payInfo.typeOfEarning;
	});
	return timesheets?.filter(({ typeOfEarning }) => typeOfEarning === EARNING_TYPE.HOURLY);
};

const getTimeFormat = (timestamp) => {
	let time = moment(timestamp);

	// const date = notDevice ? moment(timestamp) : moment.utc(timestamp);
	// return date.format("HH:mm");

	if (time.format("HH") <= "12") {
		return time.utc().format("HH:mm");
	} else {
		return time.format("HH:mm");
	}
};
const getClockInTimeFormat = (timestamp) => {
	// const date = notDevice ? moment(timestamp) : moment.utc(timestamp);
	// return timeSheet ? date.format("YYYY-MM-DD") : date.format("YYYY-MM-DD  hh:mm A");

	let time = moment(timestamp);
	if (time.format("HH:mm") < "05:00" || time.format("HH:mm") > "17:00") {
		return time.utc().format("HH:mm");
	} else {
		return time.format("HH:mm");
	}

	// const utcHours = new Date(timestamp).getUTCHours();
	// const utcMinutes = new Date(timestamp).getUTCMinutes();
	// const formattedUTC = `${(utcHours % 24).toString().padStart(2, "0") || 12}:${utcMinutes
	// 	.toString()
	// 	.padStart(2, "0")}`;

	// return formattedUTC;
};

const convertMomentTzDate = (timestamp) =>
	momentTz(timestamp).utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

const getTimesheets = async (req, res) => {
	const { companyName } = req.params;
	try {
		const timesheets = await findByRecordTimesheets({
			deleted: false,
			companyName,
			clockIn: { $lte: NEXT_DAY },
		});
		const payInfo = await getTimesheetResult(companyName);

		const result = mapTimesheet(payInfo, timesheets);

		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getFilteredTimesheetsByStatus = async (req, res) => {
	const { companyName, filter } = req.params;
	try {
		const filteredData = JSON.parse(filter.split("=")[1]);
		const { startDate, endDate } = filteredData;

		const timesheets = await Timesheet.find({
			deleted: false,
			companyName,
			clockIn: {
				$gte: moment(startDate).utc().startOf("day").toDate(),
				$lte: moment(endDate).utc().endOf("day").toDate(),
			},
		}).select("approveStatus");

		res.status(200).json(timesheets);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getFilteredTimesheets = async (req, res) => {
	const { companyName, filter } = req.params;

	try {
		const filteredData = JSON.parse(filter.split("=")[1]);
		const { startDate, endDate } = filteredData;

		let { page, limit } = req.query;
		page = parseInt(page) || 1;
		limit = parseInt(limit) || 10;
		const skip = (page - 1) * limit;

		const filterRecordCriteria = {
			deleted: false,
			companyName,
			clockIn: {
				$gte: moment.utc(startDate).startOf("day").toDate(),
				$lte: moment.utc(endDate).endOf("day").toDate(),
			},
			// payType: { $ne: PAY_TYPES_TITLE.REG_PAY },
			// regHoursWorked: { $ne: 0 },
		};

		let timesheets = await Timesheet.aggregate([
			{
				$match: filterRecordCriteria,
			},
			{
				$lookup: {
					from: "employees", // collection name for Employee model
					localField: "employeeId", // field in Timesheet that references Employee
					foreignField: "_id", // field in Employee collection
					as: "employee", // this will be the result of the join
				},
			},
			{
				$unwind: "$employee", // Flatten the array of employee data
			},
			{
				$sort: {
					"employee.fullName": 1, // Sort by employee full name
					clockIn: 1, // Then by clockIn time
				},
			},
			{
				$skip: skip, // Skip previous pages
			},
			{
				$limit: limit, // Limit the number of results
			},
		]);

		const total = await findByRecordTimesheets(filterRecordCriteria);

		const payInfo = await getTimesheetResult(companyName);
		if (filteredData?.filteredEmployees?.length) {
			timesheets = timesheets.filter((item) =>
				filteredData?.filteredEmployees?.includes(item?.employee?.fullName),
			);
		}
		if (filteredData?.filteredDept?.length) {
			timesheets = timesheets.filter((item) =>
				filteredData?.filteredDept?.includes(item?.employee?.department[0]),
			);
		}
		if (filteredData?.filteredCC?.length) {
			timesheets = timesheets.filter((item) =>
				filteredData?.filteredCC?.includes(item?.employee?.role),
			);
		}

		const result = mapTimesheet(payInfo, timesheets);
		res.status(200).json({
			page,
			limit,
			total: total?.length,
			totalPages: Math.ceil(total?.length / limit),
			items: result,
		});
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getEmployeeTimesheet = async (req, res) => {
	const { companyName, employeeId, filter } = req.params;

	try {
		const filteredData = JSON.parse(filter.split("=")[1]);
		const { startDate, endDate } = filteredData;

		const timesheets = await Timesheet.find({
			deleted: false,
			companyName,
			employeeId,
			clockIn: {
				$gte: moment(startDate).startOf("day").toDate(),
				$lte: moment(endDate).endOf("day").toDate(),
			},
		}).sort({ createdOn: -1 });
		res.status(200).json(timesheets);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const addTimesheetEntry = async (record) => await Timesheet.create(record);

const calcTotalWorkedHours = (clockIn, clockOut) => {
	if (clockOut) {
		const hoursWorked = moment.duration(moment(clockOut).diff(moment(clockIn))).asHours();
		const totalTime = Math.round(hoursWorked * 100) / 100;
		const roundedTime = totalTime.toFixed(2).includes(".99") ? Math.round(totalTime) : totalTime;
		return roundedTime;
	}
	return null;
};

const addOvertimeRecord = async (clockIn, clockOut, employeeId, company) => {
	const adjustedClockOut = moment(clockIn).add(8, "hours");
	const overtimeClockIn = moment(adjustedClockOut);
	const overtimeClockOut = moment(clockOut);
	const overtimeHoursWorked = moment
		.duration(overtimeClockOut.diff(overtimeClockIn))
		.asHours()
		.toFixed(2);

	const newEntry = {
		employeeId,
		companyName: company,
		clockIn: overtimeClockIn.toISOString(),
		clockOut: overtimeClockOut.toISOString(),
		payType: PAY_TYPES_TITLE.OVERTIME_PAY,
		overtimeHoursWorked,
		manualAdded: true,
	};

	await addTimesheetEntry(newEntry);
	return adjustedClockOut.toISOString();
};

const createManualTimesheet = async (req, res) => {
	const { company, punch, employeeId } = req.body;

	const param_hours =
		punch === PUNCH_CODE.CLOCK_IN || punch === PUNCH_CODE.CLOCK_OUT
			? PARAM_HOURS.REGULAR
			: PARAM_HOURS.BREAK;
	const payType = getPayType(param_hours === PARAM_HOURS.BREAK);

	try {
		const newEntry = {
			employeeId,
			clockIn: moment().tz("America/Vancouver").toDate(),
			[param_hours]: 0,
			companyName: company,
			payType,
			manualAdded: true,
		};

		if (punch === PUNCH_CODE.CLOCK_IN || punch === PUNCH_CODE.BREAK_IN) {
			const newTimesheet = await addTimesheetEntry(newEntry);
			return res.status(201).json(newTimesheet);
		}

		const findEmployeeTimesheetExists = await Timesheet.find({
			employeeId,
			clockIn: { $ne: null },
			[param_hours]: 0,
			companyName: company,
			payType,
		}).sort({ clockIn: -1 });

		if (findEmployeeTimesheetExists.length) {
			findEmployeeTimesheetExists[0].clockOut = moment();
			const totalWorkedHours = calcTotalWorkedHours(
				findEmployeeTimesheetExists[0].clockIn,
				findEmployeeTimesheetExists[0].clockOut,
			);
			findEmployeeTimesheetExists[0][param_hours] = totalWorkedHours;
			await findEmployeeTimesheetExists[0].save();
		}
		return res.status(201).json(findEmployeeTimesheetExists[0]);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const createTimesheet = async (req, res) => {
	let { company, type, clockIn, clockOut, employeeId, param_hours, startTime, endTime } = req.body;
	try {
		if (startTime) clockIn = setTime(clockIn, startTime);
		if (endTime) clockOut = setTime(clockIn, endTime);
		const totalWorkedHours = calcTotalWorkedHours(clockIn, clockOut);

		if (type === PAY_TYPES_TITLE.REG_PAY && totalWorkedHours > 8) {
			const adjustedClockOut = await addOvertimeRecord(clockIn, clockOut, employeeId, company);
			const newEntry = {
				employeeId,
				clockIn,
				clockOut: adjustedClockOut,
				[param_hours]: 8,
				companyName: company,
				payType: type,
				manualAdded: true,
			};
			const newTimesheetWithOvertime = await addTimesheetEntry(newEntry);
			return res.status(201).json(newTimesheetWithOvertime);
		}

		const newEntry = {
			employeeId,
			clockIn,
			clockOut,
			[param_hours]: totalWorkedHours,
			companyName: company,
			payType: type,
			manualAdded: true,
		};

		const newTimesheet = await addTimesheetEntry(newEntry);
		res.status(201).json(newTimesheet);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const setTime = (date, time) => {
	// const utcDate = date ? (notDevice ? moment(date) : moment.utc(date)) : moment.utc();
	const utcDate = moment.utc(date);

	let [hours, minutes] = time.split(":");
	utcDate.set({
		hour: parseInt(hours),
		minute: parseInt(minutes),
		second: 0,
	});
	return utcDate.toISOString();
};

const updateTimesheet = async (req, res) => {
	const { id } = req.params;
	let { clockIn, clockOut, empId, approve, param_hours, company, startTime, endTime } = req.body;

	try {
		const existingTimesheetInfo = await Timesheet.findById(id);

		if (startTime) clockIn = setTime(clockIn, startTime);
		if (endTime) clockOut = setTime(clockIn, endTime);
		const totalWorkedHours = calcTotalWorkedHours(clockIn, clockOut);

		if (param_hours === PARAM_HOURS.REGULAR && totalWorkedHours > 8) {
			const adjustedClockOut = await addOvertimeRecord(clockIn, clockOut, empId, company);
			const updatedData = {
				clockIn,
				clockOut: adjustedClockOut,
				[param_hours]: 8,
				approveStatus:
					existingTimesheetInfo?.approveStatus === TIMESHEET_STATUS.APPROVED || approve
						? TIMESHEET_STATUS.APPROVED
						: approve === false
						? TIMESHEET_STATUS.REJECTED
						: TIMESHEET_STATUS.PENDING,
			};
			const timesheet = await updateTimesheetData(id, updatedData);
			return res.status(201).json(timesheet);
		}

		const updatedData = {
			clockIn,
			clockOut,
			[param_hours]: totalWorkedHours,
			approveStatus:
				existingTimesheetInfo?.approveStatus === TIMESHEET_STATUS.APPROVED || approve
					? TIMESHEET_STATUS.APPROVED
					: approve === false
					? TIMESHEET_STATUS.REJECTED
					: TIMESHEET_STATUS.PENDING,
		};

		const timesheet = await updateTimesheetData(id, updatedData);
		return res.status(201).json(timesheet);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateTimesheetData = async (id, data) =>
	await Timesheet.findByIdAndUpdate(id, data, {
		new: true,
	});

const deleteTimesheet = async (req, res) => {
	const { id } = req.params;
	try {
		const timesheet = await updateTimesheetData(id, req.body);

		// const resource = await Timesheet.findByIdAndDelete({
		// 	_id: id,
		// });
		if (timesheet) {
			res.status(200).json(`Timesheet with id ${id} deleted successfully.`);
		} else {
			res.status(200).json("Timesheet Details not found.");
		}
	} catch (error) {
		res.status(404).json({ error: "Error deleting Timesheet:", error });
	}
};

const addStatHolidayDefaultTimesheet = async (employeeId, companyName) => {
	const startOfToday = moment().startOf("day");
	const endOfToday = moment().endOf("day");

	const existingStatTimesheetInfo = await Timesheet.findOne({
		deleted: false,
		employeeId,
		companyName,
		payType: PAY_TYPES_TITLE.STAT_PAY,
		clockIn: {
			$gte: startOfToday.toDate(),
			$lt: endOfToday.toDate(),
		},
	});

	if (existingStatTimesheetInfo) {
		return existingStatTimesheetInfo;
	}
	const { employeeEarnings, numberOfDaysWorked, statPayRate } = await findStatPayMonthlyEarning(
		employeeId,
		companyName,
	);
	const statPayAmount = numberOfDaysWorked ? employeeEarnings / numberOfDaysWorked : 0;
	const statHours = statPayAmount / statPayRate;

	const startTime = moment().set({
		hour: 13,
		minute: 0,
		second: 0,
		millisecond: 0,
	});
	const endTime = startTime.clone().add(statHours, "hours");
	const newStatTimeSheetRecord = {
		employeeId,
		companyName,
		payType: PAY_TYPES_TITLE.STAT_PAY,
		clockIn: startTime,
		clockOut: endTime,
		statDayHours: statHours.toFixed(2),
	};
	const newRecord = await addTimesheetEntry(newStatTimeSheetRecord);
	return newRecord;
};

const addStatHolidayTimesheet = async (companyName) => {
	try {
		const payrollActiveEmployees = await getPayrollActiveEmployees(companyName);
		payrollActiveEmployees.map(async (emp) => {
			await addStatHolidayDefaultTimesheet(emp._id, companyName);
		});
		console.log("StatHolidayDefaultTimesheet added");
	} catch (error) {
		console.error("Error adding record:", error);
	}
};

const findStatPayMonthlyEarning = async (employeeId, companyName) => {
	const currentDate = moment.utc();
	const past30Days = moment.utc().subtract(30, "days");
	const timesheets = await Timesheet.find({
		deleted: false,
		employeeId,
		companyName,
		clockIn: {
			$gte: past30Days.toDate(), // 30 days ago
			$lte: currentDate.toDate(), // Up to the current date
		},
	});

	const empPayInfoResult = await findEmployeePayInfo(employeeId, companyName);
	const statPayRate = empPayInfoResult?.sickPay || 0;
	const employeeEarnings = timesheets?.reduce((acc, item) => {
		return (
			acc +
			(item?.[PARAM_HOURS.REGULAR] * empPayInfoResult?.regPay +
				item?.overtimeHoursWorked * empPayInfoResult?.overTimePay +
				item?.dblOvertimeHoursWorked * empPayInfoResult?.dblOverTimePay +
				item?.statDayHoursWorked * empPayInfoResult?.statWorkPay +
				item?.statDayHours * empPayInfoResult?.statPay +
				item?.sickPayHours * empPayInfoResult?.sickPay +
				item?.vacationPayHours * empPayInfoResult?.vacationPay)
		);
	}, 0);

	return {
		employeeEarnings,
		numberOfDaysWorked: timesheets?.length || 0,
		statPayRate,
	};
};

module.exports = {
	getTimesheets,
	getEmployeeTimesheet,
	getFilteredTimesheets,
	getFilteredTimesheetsByStatus,
	createTimesheet,
	updateTimesheet,
	addStatHolidayTimesheet,
	deleteTimesheet,
	createManualTimesheet,
};
