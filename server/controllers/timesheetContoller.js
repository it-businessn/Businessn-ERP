const EmployeePayInfo = require("../models/EmployeePayInfo");
const Timesheet = require("../models/Timesheet");
const moment = require("moment");
const { getPayrollActiveEmployees } = require("./userController");
const { findEmployeePayInfo } = require("./payInfoController");

// const currentTime = currentDate.format("HH:mm:ss");
const currentDate = moment().add(1, "days");
const currentTime = currentDate.format("HH:mm");

const findByRecordTimesheets = async (record) => {
	// const y = await Timesheet.deleteMany({
	// 	clockIn: {
	// 		$lte: moment("2024-10-22"),
	// 	},
	// });
	// console.log("del", y);
	const result = await Timesheet.find(record).populate({
		path: "employeeId",
		model: "Employee",
		select: ["department", "fullName", "role"],
	});
	const empData = result?.sort((a, b) => {
		if (a.employeeId.fullName < b.employeeId.fullName) return -1;
		if (a.employeeId.fullName > b.employeeId.fullName) return 1;
		// If names are equal, sort by clockIn asc
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
			companyName,
			clockIn: {
				$lte: filteredData?.endDate ? moment(filteredData?.endDate) : currentDate,
				$gte: filteredData?.startDate ? moment(filteredData?.startDate) : currentDate,
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
		let timesheets = await findByRecordTimesheets({
			companyName,
			clockIn: {
				$lte: filteredData?.endDate ? moment(filteredData?.endDate) : currentDate,
				$gte: filteredData?.startDate ? moment(filteredData?.startDate) : currentDate,
			},
			// payType: { $ne: "Regular Pay" },
			// regHoursWorked: { $ne: 0 },
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
		employeeId,
		companyName,
		payType: "Statutory Pay",
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

	const newStatTimeSheetRecord = {
		employeeId,
		companyName,
		payType: "Statutory Pay",
		createdOn: moment(),
		clockIn: startTime,
		clockOut: endTime,
		statDayHours: statHours.toFixed(2),
	};

	const newRecord = await addTimesheetEntry(newStatTimeSheetRecord);

	return newRecord;
};

const addTimesheetEntry = async (record) => await Timesheet.create(record);

const calcTotalWorkedHours = (clockIn, clockOut) =>
	clockOut
		? moment
				.duration(moment(clockOut).diff(moment(clockIn)))
				.asHours()
				.toFixed(2)
		: null;

const addOvertimeRecord = async (clockIn, clockOut, employeeId, company) => {
	const adjustedClockOut = moment(clockIn).add(8, "hours");
	const overtimeClockIn = moment(adjustedClockOut);
	const overtimeClockOut = moment(clockOut);
	const overtimeHoursWorked = moment
		.duration(overtimeClockOut.diff(overtimeClockIn))
		.asHours()
		.toFixed(2);

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

		if (type === "Regular Pay" && totalWorkedHours > 8) {
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
		payType: "Overtime Pay",
		overtimeHoursWorked,
	};
	await addTimesheetEntry(newEntry);
};

const updateTimesheet = async (req, res) => {
	const { id } = req.params;
	let { clockIn, clockOut, empId, approve, param_hours, company } = req.body;

	try {
		const totalWorkedHours = calcTotalWorkedHours(clockIn, clockOut);

		if (param_hours === "regHoursWorked" && totalWorkedHours > 8) {
			const adjustedClockOut = await addOvertimeRecord(clockIn, clockOut, empId, company);
			const updatedData = {
				clockIn,
				clockOut: adjustedClockOut,
				[param_hours]: 8,
				approveStatus: approve ? "Approved" : approve === false ? "Rejected" : "Pending",
			};
			const timesheet = await Timesheet.findByIdAndUpdate(id, updatedData);
			return res.status(201).json(timesheet);
		}
		const updatedData = {
			clockIn,
			clockOut,
			[param_hours]: totalWorkedHours,
			approveStatus: approve ? "Approved" : approve === false ? "Rejected" : "Pending",
		};

		const timesheet = await Timesheet.findByIdAndUpdate(id, updatedData);
		return res.status(201).json(timesheet);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const deleteTimesheet = async (req, res) => {
	const { id } = req.params;
	try {
		const resource = await Timesheet.findByIdAndDelete({
			_id: id,
		});
		if (resource) {
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
