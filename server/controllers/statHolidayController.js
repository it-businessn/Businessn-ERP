const moment = require("moment");

const { addTimesheetEntry } = require("../services/timecardService");

const Holiday = require("../models/Holiday");
const Timesheet = require("../models/Timesheet");
const EmployeePayInfo = require("../models/EmployeePayInfo");
const { PAY_TYPES_TITLE } = require("../constants/pay.constants");
const { TIMESHEET_SOURCE, PARAM_HOURS } = require("../constants/timesheet.constants");
const { getPayrollActiveEmployees } = require("../services/userService");

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
		return;
	}
	const { employeeEarnings, numberOfDaysWorked, statPayRate } = await findStatPayMonthlyEarning(
		employeeId,
		companyName,
	);
	const statPayAmount = numberOfDaysWorked ? employeeEarnings / numberOfDaysWorked : 0;
	const statHours = statPayAmount / statPayRate || 0;

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
		source: TIMESHEET_SOURCE.SYSTEM,
	};
	await addTimesheetEntry(newStatTimeSheetRecord);
};

const addStatHolidayTimesheet = async (companyName) => {
	try {
		const result = await getPayrollActiveEmployees(companyName);
		await Promise.all(
			result.map(async (emp) => {
				try {
					if (!emp?.empId?._id) return;

					await addStatHolidayDefaultTimesheet(emp.empId._id, companyName);
				} catch (err) {
					console.error("[StatHoliday] Failed:", {
						empId: emp?.empId?._id,
						error: err.message,
					});
				}
			}),
		);

		console.log("StatHolidayDefaultTimesheet added");
	} catch (error) {
		console.error("Error adding stat holiday records:", {
			message: error.message,
			stack: error.stack,
		});
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

	const empPayInfoResult = await EmployeePayInfo.findOne({ empId: employeeId, companyName });
	const record = empPayInfoResult?.roles?.[0];
	const statPayRate = record?.payRate || 0;
	const employeeEarnings = timesheets?.reduce((acc, item) => {
		return (
			acc +
			(item?.[PARAM_HOURS.REGULAR] * (record?.payRate || 0) +
				item?.overtimeHoursWorked * (record?.overTimePay || 0) +
				item?.dblOvertimeHoursWorked * (record?.dblOverTimePay || 0) +
				item?.statDayHoursWorked * (record?.statWorkPay || 0) +
				item?.statDayHours * (record?.statPay || 0) +
				item?.sickPayHours * (record?.sickPay || 0) +
				item?.vacationPayHours * (record?.vacationPay || 0) +
				item?.bereavementPayHours * (record?.bereavementPay || 0) +
				item?.personalPayHours * (record?.personalDayPay || 0))
		);
	}, 0);

	return {
		employeeEarnings,
		numberOfDaysWorked: timesheets?.length || 0,
		statPayRate,
	};
};

const getHolidays = async (record) =>
	await Holiday.find(record).sort({
		date: 1,
	});

const getStatHoliday = async (req, res) => {
	const { companyName, year } = req.params;
	try {
		const holidays = await getHolidays({ companyName, year });
		return res.status(200).json(holidays);
	} catch (error) {
		console.error("[getStatHoliday Error]:", {
			message: error.message,
			stack: error.stack,
			params: req.params,
		});

		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

const addStatHoliday = async (req, res) => {
	const { name, date, company } = req.body;

	try {
		const data = {
			name,
			companyName: company,
			year: moment().format("YYYY"),
		};

		const existingRecord = await Holiday.findOne(data);
		if (existingRecord) {
			return res.status(409).json({ message: "Record already exists" });
		}

		const newHoliday = await Holiday.create({
			...data,
			date,
			year: moment(date).format("YYYY"),
		});

		return res.status(201).json(newHoliday);
	} catch (error) {
		console.error("[addStatHoliday Error]:", {
			message: error.message,
			stack: error.stack,
		});
		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

const updateStatHoliday = async (req, res) => {
	const { id } = req.params;
	try {
		const existingInfo = await Holiday.findById(id);
		if (!existingInfo) {
			return res.status(404).json({
				message: "Record not found.",
			});
		}

		const { _id, ...updateData } = req.body;

		const updatedInfo = await updateHolidayRecord(id, updateData);
		return res.status(200).json(updatedInfo);
	} catch (error) {
		console.error("[updateStatHoliday Error]:", {
			message: error.message,
			stack: error.stack,
		});
		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

const deleteStatHoliday = async (req, res) => {
	const { id } = req.params;

	try {
		const resource = await Holiday.findByIdAndDelete(id);

		if (!resource) {
			return res.status(404).json({
				message: "Holiday Details not found.",
			});
		}

		return res.status(200).json({
			message: `Holiday ${id} deleted successfully`,
		});
	} catch (error) {
		console.error("[deleteStatHoliday Error]:", {
			message: error.message,
			stack: error.stack,
		});
		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

const updateHolidayRecord = async (id, data) =>
	await Holiday.findByIdAndUpdate(
		id,
		{ $set: data },
		{
			new: true,
		},
	);

module.exports = {
	addStatHoliday,
	updateStatHoliday,
	addStatHolidayTimesheet,
	getHolidays,
	getStatHoliday,
	deleteStatHoliday,
};
