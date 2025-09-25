const moment = require("moment");
const momentTz = require("moment-timezone");

const Timesheet = require("../models/Timesheet");
const { PAY_TYPES_TITLE } = require("../services/data");

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
