const EmployeePayInfo = require("../models/EmployeePayInfo");
const Timesheet = require("../models/Timesheet");
const moment = require("moment");
const momentTz = require("moment-timezone");
const { getPayrollActiveEmployees } = require("./appController");
const {
	PAY_TYPES_TITLE,
	TIMESHEET_STATUS,
	PARAM_HOURS,
	NEXT_DAY,
	PUNCH_CODE,
	getPayType,
	EARNING_TYPE,
	TIMESHEET_ORIGIN,
} = require("../services/data");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const { findEmpPayInfo } = require("./employmentInfoController");
const { calcPayRates } = require("./payrollHelper");

const findByRecordTimesheets = async (record, skip, limit) => {
	// const y = await Timesheet.deleteMany({
	// 	clockIn: {
	// 		$lte: moment("2024-10-22"),
	// 	},
	// });
	// console.log("del", y);
	const result = await Timesheet.find(record)
		// .skip(skip)
		// .limit(limit)
		// .limit(50)
		.populate({
			path: "employeeId",
			model: "Employee",
			select: ["fullName"],
		});
	const empData = result?.sort((a, b) => {
		if (a.employeeId?.fullName < b.employeeId?.fullName) return -1;
		if (a.employeeId?.fullName > b.employeeId?.fullName) return 1;
		return a.clockIn - b.clockIn;
	});
	return empData;
};

const getTimesheetResult = async (companyName) => {
	const payInfoResult = await findEmpPayInfo(companyName);

	const payInfoMapResult = new Map(payInfoResult.map((payInfo) => [payInfo.empId, payInfo?.roles]));
	return payInfoMapResult;
};

const getEmploymentResult = async (companyName) => {
	const empInfoResult = await EmployeeEmploymentInfo.find({
		companyName,
	}).select("empId positions");
	const empInfoMap = new Map(
		empInfoResult.map((empInfo) => [
			empInfo?.empId?.toString(),
			{
				positions: empInfo.positions,
			},
		]),
	);
	return empInfoMap;
};

const mapTimesheet = (payInfos, timesheets, empInfos) => {
	timesheets.forEach((timesheet) => {
		const empIdStr = timesheet?.employeeId?._id?.toString();
		if (empInfos?.has(empIdStr)) {
			const empInfo = empInfos?.get(empIdStr);
			timesheet.positions = empInfo.positions;
		}

		if (payInfos.has(empIdStr)) {
			timesheet.payInfo = payInfos.get(empIdStr);
			const empRole = timesheet?.role
				? timesheet.payInfo?.find(({ title }) => title === timesheet?.role)
				: timesheet.payInfo[0];
			if (empRole) {
				empRole.regPay = empRole?.payRate || 0;
				const empRoleRates = calcPayRates(empRole);

				timesheet.regPay = empRoleRates?.regPay;
				timesheet.overTimePay = empRoleRates?.overTimePay;
				timesheet.dblOverTimePay = empRoleRates?.dblOverTimePay;
				timesheet.statWorkPay = empRoleRates?.statWorkPay;
				timesheet.statPay = empRoleRates?.statPay;
				timesheet.sickPay = empRoleRates?.sickPay;
				timesheet.vacationPay = empRoleRates?.vacationPay;

				timesheet.typeOfEarning = empRole?.typeOfEarning;
			}
		}
	});
	return timesheets?.filter(({ typeOfEarning }) => typeOfEarning !== EARNING_TYPE.FT);
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

		let timesheets = await findByRecordTimesheets(filterRecordCriteria, skip, limit);
		const payInfo = await getTimesheetResult(companyName);
		const employmentInfo = await getEmploymentResult(companyName);

		let result = mapTimesheet(payInfo, timesheets, employmentInfo);

		// const total = await findByRecordTimesheets(filterRecordCriteria);

		if (filteredData?.filteredEmployees?.length) {
			result = result.filter((item) =>
				filteredData?.filteredEmployees?.includes(item?.employeeId?.fullName),
			);
		}
		if (filteredData?.filteredDept?.length) {
			result = result.filter((item) =>
				filteredData?.filteredDept?.includes(item?.positions?.[0]?.employmentDepartment),
			);
		}
		if (filteredData?.filteredCC?.length) {
			result = result.filter((item) =>
				filteredData?.filteredCC?.includes(item?.positions?.[0]?.employmentCostCenter),
			);
		}
		res.status(200).json({
			page,
			limit,
			total: timesheets?.length,
			totalPages: Math.ceil(timesheets?.length / limit),
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
	// const hoursWorked = moment.duration(moment(clockOut).diff(moment(clockIn))).asHours();
	// const totalTime = Math.round(hoursWorked * 100) / 100;
	// const roundedTime = totalTime.toFixed(2).includes(".99") ? Math.round(totalTime) : totalTime;
	// return roundedTime;

	const startDate = new Date(clockIn);
	const endDate = new Date(clockOut);
	const totalTime = (endDate - startDate) / (1000 * 60 * 60); // convert ms to hours
	const roundedTime = totalTime.toFixed(2).includes(".99")
		? Math.round(totalTime)
		: totalTime.toFixed(2).includes(".01")
		? Math.ceil(totalTime)
		: totalTime.toFixed(2);
	return roundedTime;
};

const addOvertimeRecord = async (clockIn, clockOut, employeeId, company, source) => {
	const adjustedClockOut = moment(clockIn).add(8, "hours");
	const overtimeClockIn = moment(adjustedClockOut);
	const overtimeClockOut = moment(clockOut);
	const overtimeHoursWorked = calcTotalWorkedHours(overtimeClockIn, overtimeClockOut);

	const newEntry = {
		employeeId,
		companyName: company,
		clockIn: overtimeClockIn.toISOString(),
		clockOut: overtimeClockOut.toISOString(),
		payType: PAY_TYPES_TITLE.OVERTIME_PAY,
		overtimeHoursWorked,
		source,
	};

	await addTimesheetEntry(newEntry);
	return adjustedClockOut.toISOString();
};

const createManualTimesheet = async (req, res) => {
	const { company, punch, employeeId, source } = req.body;

	const param_hours =
		punch === PUNCH_CODE.CLOCK_IN || punch === PUNCH_CODE.CLOCK_OUT
			? PARAM_HOURS.REGULAR
			: PARAM_HOURS.BREAK;
	const payType = getPayType(param_hours === PARAM_HOURS.BREAK);

	const date = new Date();
	date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
	try {
		if (punch === PUNCH_CODE.CLOCK_IN || punch === PUNCH_CODE.BREAK_IN) {
			const newEntry = {
				employeeId,
				clockIn: moment.utc(date).toISOString(),
				[param_hours]: 0,
				companyName: company,
				payType,
				manualAdded: true,
				source,
			};
			const newTimesheet = await addTimesheetEntry(newEntry);
			return res.status(201).json(newTimesheet);
		}
		const searchObject = {
			employeeId,
			clockIn: { $ne: null },
			companyName: company,
			payType,
		};
		if (punch === PUNCH_CODE.CLOCK_OUT) {
			searchObject[param_hours] = 0;
		}
		const findEmployeeTimesheetExists = await Timesheet.find(searchObject).sort({ clockIn: -1 });
		if (findEmployeeTimesheetExists.length) {
			findEmployeeTimesheetExists[0].clockOut = moment.utc(date).toISOString();
			if (punch === PUNCH_CODE.CLOCK_OUT) {
				const totalWorkedHours = calcTotalWorkedHours(
					findEmployeeTimesheetExists[0].clockIn,
					findEmployeeTimesheetExists[0].clockOut,
				);
				findEmployeeTimesheetExists[0][param_hours] = totalWorkedHours;
			}
			await findEmployeeTimesheetExists[0].save();
			return res.status(201).json(findEmployeeTimesheetExists[0]);
		} else {
			return res.status(201).json("Record not found");
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const createTimesheet = async (req, res) => {
	let { company, type, clockIn, clockOut, employeeId, param_hours, startTime, endTime, source } =
		req.body;
	try {
		if (startTime) clockIn = setTime(clockIn, startTime);
		if (endTime) clockOut = setTime(clockIn, endTime);
		const totalWorkedHours = calcTotalWorkedHours(clockIn, clockOut);

		if (type === PAY_TYPES_TITLE.REG_PAY && totalWorkedHours > 8) {
			const adjustedClockOut = await addOvertimeRecord(
				clockIn,
				clockOut,
				employeeId,
				company,
				source,
			);
			const newEntry = {
				employeeId,
				clockIn,
				clockOut: adjustedClockOut,
				[param_hours]: 8,
				companyName: company,
				payType: type,
				source,
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
			source,
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

const actionAllTimesheets = async (req, res) => {
	const { timesheetIDs, approveStatus } = req.body;

	try {
		if (approveStatus === TIMESHEET_STATUS.DELETE) {
			const updatedIDs = await Timesheet.deleteMany({ _id: { $in: timesheetIDs } });
			return res.status(201).json(updatedIDs);
		}
		const updatedData = { approveStatus };
		const updatedIDs = await Timesheet.updateMany(
			{ _id: { $in: timesheetIDs } },
			{ $set: updatedData },
		);
		return res.status(201).json(updatedIDs);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateTimesheetRole = async (req, res) => {
	const { id } = req.params;
	const { role, positions } = req.body;
	try {
		const updatedRole = positions?.find(({ title }) => title === role);
		const updatedData = { role, department: updatedRole?.employmentDepartment };

		updatedData.regPay = updatedRole?.payRate || 0;
		updatedData.overTimePay = 1.5 * updatedRole?.payRate || 0;
		updatedData.dblOverTimePay = 2 * updatedRole?.payRate || 0;
		updatedData.statWorkPay = 1.5 * updatedRole?.payRate || 0;
		updatedData.statPay = updatedRole?.payRate || 0;
		updatedData.sickPay = updatedRole?.payRate || 0;
		updatedData.vacationPay = updatedRole?.payRate || 0;

		const timesheet = await updateTimesheetData(id, updatedData);
		return res.status(201).json(timesheet);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateTimesheetPayType = async (req, res) => {
	const { id } = req.params;

	try {
		if (req.body?._id) delete req.body._id;
		const timesheet = await updateTimesheetData(id, req.body);
		return res.status(201).json(timesheet);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateTimesheet = async (req, res) => {
	const { id } = req.params;
	let { clockIn, clockOut, empId, approve, param_hours, company, startTime, endTime, source } =
		req.body;

	try {
		const existingTimesheetInfo = await Timesheet.findById(id);

		const empPayInfoResult = await EmployeePayInfo.findOne({
			empId,
			companyName: existingTimesheetInfo?.companyName,
		});
		if (
			existingTimesheetInfo?.role &&
			existingTimesheetInfo?.role === empPayInfoResult?.roles?.[1]?.title
		) {
			param_hours = PARAM_HOURS.REGULAR2;
		}

		if (startTime) clockIn = setTime(clockIn, startTime);
		if (endTime) clockOut = setTime(clockIn, endTime);
		// const totalWorkedHours = existingTimesheetInfo[param_hours]
		// 	? existingTimesheetInfo[param_hours]
		// 	: calcTotalWorkedHours(clockIn, clockOut);
		const totalWorkedHours = calcTotalWorkedHours(clockIn, clockOut);

		const approveStatus =
			approve === true
				? TIMESHEET_STATUS.APPROVED
				: approve === false
				? TIMESHEET_STATUS.REJECTED
				: TIMESHEET_STATUS.PENDING;

		if (param_hours === PARAM_HOURS.REGULAR && totalWorkedHours > 8) {
			const adjustedClockOut = await addOvertimeRecord(clockIn, clockOut, empId, company, source);
			const updatedData = {
				clockIn,
				clockOut: adjustedClockOut,
				[param_hours]: 8,
				approveStatus,
				source,
			};
			const timesheet = await updateTimesheetData(id, updatedData);
			return res.status(201).json(timesheet);
		}

		const updatedWorkedHrs =
			param_hours === PARAM_HOURS.BREAK ? (approve ? totalWorkedHours : 0) : totalWorkedHours;

		const updatedData = {
			clockIn,
			clockOut,
			[param_hours]: updatedWorkedHrs,
			approveStatus,
			source,
		};

		if (param_hours === PARAM_HOURS.BREAK) {
			const nearestClockInRecord = await Timesheet.find({
				deleted: false,
				employeeId: empId,
				companyName: company,
				payType: PAY_TYPES_TITLE.REG_PAY,
				clockIn: {
					$lte: moment(clockIn).toDate(),
				},
				clockOut: {
					$gte: moment(clockOut).toDate(),
				},
			}).sort({ clockIn: -1 });
			if (nearestClockInRecord?.length > 0) {
				const regRecord = nearestClockInRecord[0];
				const adjustedRegHours =
					calcTotalWorkedHours(regRecord.clockIn, regRecord.clockOut) - updatedWorkedHrs;
				regRecord.regHoursWorked = adjustedRegHours;
				regRecord.source = source;
				await regRecord.save();
			} else {
				return res
					.status(201)
					.json({ message: "Break records should be within the correct timeframe." });
			}
		}
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
		if (req.body?._id) delete req.body._id;
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
		source: TIMESHEET_ORIGIN.APP,
	};
	const newRecord = await addTimesheetEntry(newStatTimeSheetRecord);
	return newRecord;
};

const addStatHolidayTimesheet = async (companyName) => {
	try {
		const payrollActiveEmployees = await getPayrollActiveEmployees(companyName);
		await Promise.all(
			payrollActiveEmployees.map((emp) => addStatHolidayDefaultTimesheet(emp._id, companyName)),
		);
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

	const empPayInfoResult = await EmployeePayInfo.find({ empId: employeeId, companyName });
	const statPayRate = empPayInfoResult?.roles?.[0]?.sickPay || 0;
	const employeeEarnings = timesheets?.reduce((acc, item) => {
		return (
			acc +
			(item?.[PARAM_HOURS.REGULAR] * empPayInfoResult?.roles?.[0]?.payRate +
				item?.overtimeHoursWorked * empPayInfoResult?.roles?.[0]?.overTimePay +
				item?.dblOvertimeHoursWorked * empPayInfoResult?.roles?.[0]?.dblOverTimePay +
				item?.statDayHoursWorked * empPayInfoResult?.roles?.[0]?.statWorkPay +
				item?.statDayHours * empPayInfoResult?.roles?.[0]?.statPay +
				item?.sickPayHours * empPayInfoResult?.roles?.[0]?.sickPay +
				item?.vacationPayHours * empPayInfoResult?.roles?.[0]?.vacationPay)
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
	actionAllTimesheets,
	updateTimesheetPayType,
	calcTotalWorkedHours,
	addOvertimeRecord,
	addTimesheetEntry,
	updateTimesheetRole,
};
