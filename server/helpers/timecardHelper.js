const moment = require("moment");
const Timesheet = require("../models/Timesheet");

const calcTotalWorkedHours = (clockIn, clockOut) => {
	// const hoursWorked = moment.duration(moment(clockOut).diff(moment(clockIn))).asHours();
	// const totalTime = Math.round(hoursWorked * 100) / 100;
	// const roundedTime = totalTime.toFixed(2).includes(".99") ? Math.round(totalTime) : totalTime;
	// return roundedTime;

	const startDate = new Date(clockIn);
	const endDate = new Date(clockOut);

	const sameHourAndMinute =
		startDate.getUTCHours() === endDate.getUTCHours() &&
		startDate.getUTCMinutes() === endDate.getUTCMinutes();

	if (sameHourAndMinute) return 8;

	const totalTime = (endDate - startDate) / (1000 * 60 * 60); // convert ms to hours
	const fixedTime = totalTime.toFixed(2);

	if (fixedTime.endsWith(".99")) return Math.round(totalTime);
	if (fixedTime.endsWith(".01")) return Math.floor(totalTime);

	return fixedTime;
};

const addTimesheetEntry = async (record) => await Timesheet.create(record);

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

module.exports = { addOvertimeRecord, addTimesheetEntry, calcTotalWorkedHours };
