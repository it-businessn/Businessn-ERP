const EmployeePayInfo = require("../models/EmployeePayInfo");
const Timesheet = require("../models/Timesheet");
const moment = require("moment");
const momentTz = require("moment-timezone");
const { getPayrollActiveEmployees } = require("./userController");
const { findEmployeePayInfo } = require("./payInfoController");
const { PAY_TYPES_TITLE } = require("../services/data");

// const currentTime = currentDate.format("HH:mm:ss");
// const currentDate = momentTz.utc().tz(momentTz.tz.guess());
const currentDate = moment().add(1, "days");
const currentTime = currentDate.format("HH:mm");

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
	}).select("empId regPay overTimePay dblOverTimePay statWorkPay statPay sickPay vacationPay");

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
	});
	return timesheets;
};

const getTimesheets = async (req, res) => {
	const { companyName } = req.params;
	try {
		const timesheets = await findByRecordTimesheets({
			deleted: false,
			companyName,
			clockIn: { $lte: currentDate },
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
	const filteredData = JSON.parse(filter.split("=")[1]);
	try {
		const timesheets = await Timesheet.find({
			deleted: false,
			companyName,
			clockIn: {
				$gte: filteredData?.startDate
					? moment(filteredData?.startDate).utc().startOf("day").toDate()
					: currentDate,
				$lte: filteredData?.endDate
					? moment(filteredData?.endDate).utc().endOf("day").toDate()
					: currentDate,
			},
		}).select("approveStatus");

		res.status(200).json(timesheets);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getFilteredTimesheets = async (req, res) => {
	const { companyName, filter } = req.params;
	const filteredData = JSON.parse(filter.split("=")[1]);

	try {
		let { page, limit } = req.query;
		page = parseInt(page) || 1;
		limit = parseInt(limit) || 10;
		const skip = (page - 1) * limit;
		let timesheets = await Timesheet.aggregate([
			{
				$match: {
					deleted: false,
					companyName,
					clockIn: {
						$gte: filteredData?.startDate
							? moment(filteredData?.startDate).utc().startOf("day").toDate()
							: currentDate,
						$lte: filteredData?.endDate
							? moment(filteredData?.endDate).utc().endOf("day").toDate()
							: currentDate,
					},
				},
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

		const total = await findByRecordTimesheets({
			deleted: false,
			companyName,
			clockIn: {
				$gte: filteredData?.startDate
					? moment(filteredData?.startDate).utc().startOf("day").toDate()
					: currentDate,
				$lte: filteredData?.endDate
					? moment(filteredData?.endDate).utc().endOf("day").toDate()
					: currentDate,
			},
			// payType: { $ne: PAY_TYPES_TITLE.REG_PAY },
			// regHoursWorked: { $ne: 0 },
		});

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

const getTimesheet = async (req, res) => {
	const { companyName, employeeId } = req.params;

	try {
		const timesheets = await findByRecordTimesheets({
			deleted: false,
			companyName,
			employeeId,
			clockIn: { $lte: currentDate },
		});
		res.status(200).json(timesheets);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const findEmployeeTimesheetExists = async (record) => await Timesheet.findOne(record);

const findMonthlyEarning = async (employeeId, companyName) => {
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
			(item?.regHoursWorked * empPayInfoResult?.regPay +
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

const addStatHolidayDefaultTimesheet = async (employeeId, companyName) => {
	// const y = await Timesheet.deleteMany({
	// 	payType: "Statutory Pay",
	// 	companyName,
	// });
	// console.log("del", y);

	const startOfToday = moment().startOf("day");
	const endOfToday = moment().endOf("day");

	const existingStatTimesheetInfo = await findEmployeeTimesheetExists({
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
	const { employeeEarnings, numberOfDaysWorked, statPayRate } = await findMonthlyEarning(
		employeeId,
		companyName,
	);

	const statPayAmount = numberOfDaysWorked ? employeeEarnings / numberOfDaysWorked : 0;
	const statHours = statPayAmount / statPayRate;

	const startTime = moment().set({
		hour: 9,
		minute: 0,
		second: 0,
		millisecond: 0,
	});

	const endTime = startTime.clone().add(statHours, "hours");

	// const newStatTimeSheetRecord = {
	// 	employeeId,
	// 	companyName,
	// 	payType: "Statutory Pay",
	// 	createdOn: moment(),
	// 	clockIn: startTime,
	// 	clockOut: endTime,
	// 	regHoursWorked: 0,
	// 	overtimeHoursWorked: 0,
	// 	dblOvertimeHoursWorked: 0,
	// 	statDayHoursWorked: 0,
	// 	sickHoursWorked: 0,
	// 	vacationPayHours: 0,
	// 	statDayHours: statHours.toFixed(2),
	// };
	const newStatTimeSheetRecord = {
		employeeId,
		companyName,
		payType: PAY_TYPES_TITLE.STAT_PAY,
		createdOn: moment(),
		clockIn: startTime,
		clockOut: endTime,
		statDayHours: statHours.toFixed(2),
	};

	const newRecord = await addTimesheetEntry(newStatTimeSheetRecord);

	return newRecord;
};

const addTimesheetEntry = async (record) => await Timesheet.create(record);

const calcTotalWorkedHours = (clockIn, clockOut) => {
	if (clockOut) {
		const hoursWorked = moment.duration(moment(clockOut).diff(moment(clockIn))).asHours();

		const totalTime = Math.round(hoursWorked * 100) / 100;

		const finalTime = totalTime.toFixed(2).includes(".99") ? Math.round(totalTime) : totalTime;

		return finalTime;
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

	// await addOvertimeTimesheet({
	// 	employeeId,
	// 	clockIn: overtimeClockIn,
	// 	clockOut: overtimeClockOut,
	// 	regHoursWorked: 0,
	// 	overtimeHoursWorked,
	// 	dblOvertimeHoursWorked: 0,
	// 	statDayHoursWorked: 0,
	// 	statDayHours: 0,
	// 	sickHoursWorked: 0,
	// 	vacationPayHours: 0,

	// 	companyName: company,
	// });
	// return adjustedClockOut;
	await addOvertimeTimesheet({
		employeeId,
		clockIn: overtimeClockIn,
		clockOut: overtimeClockOut,
		overtimeHoursWorked,
		companyName: company,
	});
	return adjustedClockOut;
};

const createTimesheet = async (req, res) => {
	const { company, type, clockIn, clockOut, employeeId, param_hours } = req.body;

	try {
		const totalWorkedHours = calcTotalWorkedHours(clockIn, clockOut);

		// if (type === PAY_TYPES_TITLE.REG_PAY && totalWorkedHours > 8) {
		// 	const adjustedClockOut = await addOvertimeRecord(clockIn, clockOut, employeeId, company);
		// 	const newEntry = {
		// 		employeeId,
		// 		clockIn,
		// 		clockOut: adjustedClockOut,
		// 		regHoursWorked: 8,
		// 		companyName: company,
		// 		payType: type,
		// 	};
		// 	const newTimesheet = await addTimesheetEntry(newEntry);
		// 	return res.status(201).json(newTimesheet);
		// }

		// const newEntry = {
		// 	employeeId,
		// 	clockIn,
		// 	clockOut,
		// 	regHoursWorked: 0,
		// 	overtimeHoursWorked: 0,
		// 	dblOvertimeHoursWorked: 0,
		// 	statDayHoursWorked: payType === PAY_TYPES_TITLE.STAT_WORK_PAY ? totalWorkedHours : 0,
		// 	statDayHours: payType === "Statutory Pay" ? totalWorkedHours : 0,
		// 	sickHoursWorked: payType === "Sick Pay" ? totalWorkedHours : 0,
		// 	vacationPayHours: payType === "Vacation Pay" ? totalWorkedHours : 0,
		// 	companyName: company,
		// 	payType: type,
		// };
		if (type === PAY_TYPES_TITLE.REG_PAY && totalWorkedHours > 8) {
			const adjustedClockOut = await addOvertimeRecord(clockIn, clockOut, employeeId, company);
			const newEntry = {
				employeeId,
				clockIn,
				clockOut: adjustedClockOut,
				[param_hours]: 8,
				companyName: company,
				payType: type,
			};
			const newTimesheet = await addTimesheetEntry(newEntry);
			return res.status(201).json(newTimesheet);
		}

		const newEntry = {
			employeeId,
			clockIn,
			clockOut,
			[param_hours]: totalWorkedHours,
			companyName: company,
			payType: type,
		};

		const newTimesheet = await addTimesheetEntry(newEntry);
		res.status(201).json(newTimesheet);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
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
const addOvertimeTimesheet = async (record) => {
	const { employeeId, companyName, clockIn, clockOut, overtimeHoursWorked } = record;

	const newEntry = {
		employeeId,
		companyName,
		clockIn,
		clockOut,
		payType: PAY_TYPES_TITLE.OVERTIME_PAY,
		overtimeHoursWorked,
	};
	await addTimesheetEntry(newEntry);
};

const updateTimesheet = async (req, res) => {
	// const { id } = req.params;
	// let { clockIn, clockOut, empId, approve, param_hours, company, payType } = req.body;
	const { id } = req.params;
	let { clockIn, clockOut, empId, approve, param_hours, company } = req.body;

	try {
		const totalWorkedHours = calcTotalWorkedHours(clockIn, clockOut);

		// 	if (param_hours === "regHoursWorked" && totalWorkedHours > 8) {
		// 		const adjustedClockOut = await addOvertimeRecord(clockIn, clockOut, empId, company);
		// 		const updatedData = {
		// 			clockIn,
		// 			clockOut: adjustedClockOut,
		// 			regHoursWorked: 8,
		// 			approveStatus: approve ? "Approved" : approve === false ? "Rejected" : "Pending",
		// 		};
		// 		const timesheet = await updateTimesheetData(id, updatedData);
		// 		return res.status(201).json(timesheet);
		// 	}

		// 	const timesheet = await Timesheet.findById(id);
		// 	timesheet.clockIn = clockIn;
		// 	timesheet.clockOut = clockOut;
		// 	timesheet.regHoursWorked = 0;
		// 	timesheet.overtimeHoursWorked = 0;
		// 	timesheet.dblOvertimeHoursWorked = 0;
		// 	timesheet.statDayHoursWorked = payType === PAY_TYPES_TITLE.STAT_WORK_PAY ? totalWorkedHours : 0;
		// 	timesheet.statDayHours = payType === "Statutory Pay" ? totalWorkedHours : 0;
		// 	timesheet.sickHoursWorked = payType === "Sick Pay" ? totalWorkedHours : 0;
		// 	timesheet.vacationPayHours = payType === "Vacation Pay" ? totalWorkedHours : 0;
		// 	timesheet.approveStatus = approve ? "Approved" : approve === false ? "Rejected" : "Pending";

		// 	await timesheet.save();
		// 	return res.status(201).json(timesheet);
		// } catch (error) {
		// 	res.status(400).json({ message: error.message });
		// }
		if (param_hours === "regHoursWorked" && totalWorkedHours > 8) {
			const adjustedClockOut = await addOvertimeRecord(clockIn, clockOut, empId, company);
			const updatedData = {
				clockIn,
				clockOut: adjustedClockOut,
				[param_hours]: 8,
				approveStatus: approve ? "Approved" : approve === false ? "Rejected" : "Pending",
			};
			const timesheet = await updateTimesheetData(id, updatedData);
			return res.status(201).json(timesheet);
		}
		const updatedData = {
			clockIn,
			clockOut,
			[param_hours]: totalWorkedHours,
			approveStatus: approve ? "Approved" : approve === false ? "Rejected" : "Pending",
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

module.exports = {
	createTimesheet,
	getTimesheets,
	getTimesheet,
	updateTimesheet,
	addStatHolidayDefaultTimesheet,
	getFilteredTimesheets,
	addTimesheetEntry,
	findEmployeeTimesheetExists,
	deleteTimesheet,
	addStatHolidayTimesheet,
	getFilteredTimesheetsByStatus,
};
