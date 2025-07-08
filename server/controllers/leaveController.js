const moment = require("moment");
const EmployeeLeave = require("../models/EmployeeLeave");
const Timesheet = require("../models/Timesheet");
const { setTime } = require("./timesheetController");

const calculateLeaveDays = (clockIn, clockOut) => {
	const inDate = moment(clockIn).startOf("day");
	const outDate = moment(clockOut).startOf("day");
	if (!outDate.isSameOrAfter(inDate)) return { leaveDays: 0, leaveHrs: 0 };

	const inclusiveDays = outDate.diff(inDate, "days") + 1;

	return { leaveDays: inclusiveDays, leaveHrs: inclusiveDays * 8 };
};

const getEmployeeLeaveRequest = async (req, res) => {
	const { companyName, employeeId } = req.params;
	try {
		const leaveRequests = await EmployeeLeave.find({
			companyName,
			employeeId,
		}).sort({ startDate: -1 });
		res.status(200).json(leaveRequests);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const createLeaveRequest = async (req, res) => {
	let { company, type, leaveType, startDate, endDate, employeeId, param_hours, source } = req.body;

	try {
		const { leaveHrs, leaveDays } = calculateLeaveDays(startDate, endDate);

		const newRequest = {
			employeeId,
			startDate,
			endDate,
			companyName: company,
			type: leaveType,
			totalLeaveHrs: leaveHrs,
			totalLeaveDays: leaveDays,
		};
		const result = await EmployeeLeave.create(newRequest);

		if (param_hours !== "Unpaid") {
			const timesheetEntries = [];

			for (let i = 0; i < leaveDays; i++) {
				const date = moment(startDate).clone().add(i, "days");
				const clockIn = setTime(date, "09:00");
				const clockOut = setTime(date, "17:00");
				timesheetEntries.push({
					employeeId,
					companyName: company,
					clockIn,
					clockOut,
					payType: type,
					source,
					[param_hours]: 8,
				});
			}
			await Timesheet.insertMany(timesheetEntries);
		}
		res.status(201).json(result);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = { createLeaveRequest, getEmployeeLeaveRequest };
