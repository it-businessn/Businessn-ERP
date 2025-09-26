const moment = require("moment");

const { getPayrollActiveEmployees } = require("../helpers/userHelper");
const { addTimesheetEntry } = require("../helpers/timecardHelper");

const Holiday = require("../models/Holiday");
const Timesheet = require("../models/Timesheet");
const EmployeePayInfo = require("../models/EmployeePayInfo");
const { PARAM_HOURS, TIMESHEET_SOURCE, PAY_TYPES_TITLE } = require("../services/data");

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
		source: TIMESHEET_SOURCE.SYSTEM,
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
				item?.vacationPayHours * empPayInfoResult?.roles?.[0]?.vacationPay +
				item?.bereavementPayHours * empPayInfoResult?.roles?.[0]?.bereavementPay +
				item?.personalPayHours * empPayInfoResult?.roles?.[0]?.personalDayPay)
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
		res.status(200).json(holidays);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const addStatHoliday = async (req, res) => {
	const { name, date, company } = req.body;

	try {
		const newHoliday = await Holiday.create({
			name,
			date,
			companyName: company,
			year: moment(date).format("YYYY"),
		});
		res.status(201).json(newHoliday);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const deleteStatHoliday = async (req, res) => {
	const { id } = req.params;
	try {
		const resource = await Holiday.findByIdAndDelete(id);
		if (resource) {
			res.status(200).json(`Holiday with id ${id} deleted successfully.`);
		} else {
			res.status(200).json("Holiday Details not found.");
		}
	} catch (error) {
		res.status(404).json({ error: "Error deleting Holiday:", error });
	}
};

module.exports = {
	addStatHoliday,
	addStatHolidayTimesheet,
	getHolidays,
	getStatHoliday,
	deleteStatHoliday,
};
