const moment = require("moment");
const momentTz = require("moment-timezone");

const Timesheet = require("../models/Timesheet");
const { PAY_TYPES_TITLE } = require("../constants/pay.constants");

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

const calcTotalWorkedHours = (start, end) => {
	const startTime = new Date(start).getTime();
	const endTime = new Date(end).getTime();

	if (!startTime || !endTime || endTime <= startTime) return 0;

	const diffHours = (endTime - startTime) / (1000 * 60 * 60);
	return Math.round(diffHours * 100) / 100;
};

const addTimesheetEntry = async (record) => await Timesheet.create(record);

const addOvertimeRecord = async (clockIn, clockOut, employeeId, company, source) => {
	try {
		if (!clockIn || !clockOut) {
			throw new Error("Missing clockIn or clockOut");
		}

		const start = moment(clockIn);
		const end = moment(clockOut);

		if (!start.isValid() || !end.isValid()) {
			throw new Error("Invalid date format");
		}

		// Regular shift = 8 hours
		const regularShiftEnd = start.clone().add(8, "hours");

		// No overtime → exit early
		if (end.isSameOrBefore(regularShiftEnd)) {
			return regularShiftEnd.toISOString();
		}

		const overtimeClockIn = regularShiftEnd;
		const overtimeClockOut = end;

		const overtimeHoursWorked = calcTotalWorkedHours(
			overtimeClockIn.toISOString(),
			overtimeClockOut.toISOString(),
		);

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

		return regularShiftEnd.toISOString();
	} catch (err) {
		console.error("Error adding overtime record:", err);
		throw err;
	}
};

module.exports = { addOvertimeRecord, addTimesheetEntry, calcTotalWorkedHours };
