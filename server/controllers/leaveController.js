const moment = require("moment");
const EmployeeLeave = require("../models/EmployeeLeave");
const Timesheet = require("../models/Timesheet");
const { setTime } = require("./timesheetController");
const { isScalar } = require("../helpers/requestFields");

// NEW-13: leave-hour fields of models/Timesheet.js that the client can send, plus
// "Unpaid" (no timesheet rows) and "Other" (rows without an hours field, as before).
const LEAVE_HOURS_FIELDS = [
	"sickPayHours",
	"vacationPayHours",
	"bereavementPayHours",
	"personalPayHours",
];
const UNPAID = "Unpaid";
const OTHER = "Other";
const LEAVE_PARAM_HOURS = new Set([...LEAVE_HOURS_FIELDS, UNPAID, OTHER]);
const MAX_LEAVE_DAYS = 366;

const calculateLeaveDays = (clockIn, clockOut) => {
	const inDate = moment(clockIn).startOf("day");
	const outDate = moment(clockOut).startOf("day");
	if (!outDate.isSameOrAfter(inDate)) return { leaveDays: 0, leaveHrs: 0 };

	const inclusiveDays = outDate.diff(inDate, "days") + 1;

	return { leaveDays: inclusiveDays, leaveHrs: inclusiveDays * 8 };
};

const getAllEmployeeLeaveRequests = async (req, res) => {
	const { companyName } = req.params;
	try {
		// GET /api/leaves?status=pending&startDate=2025-07-01&endDate=2025-07-31&page=1&size=20
		const leaveRequests = await EmployeeLeave.find({
			companyName,
		}).populate({
			path: "employeeId",
			model: "Employee",
			select: ["fullName", "email"],
		});
		return res.status(200).json(leaveRequests);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getEmployeeLeaveRequest = async (req, res) => {
	const { companyName, employeeId } = req.params;
	try {
		const leaveRequests = await EmployeeLeave.find({
			companyName,
			employeeId,
		}).sort({ startDate: -1 });
		return res.status(200).json(leaveRequests);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const updateLeaveRequest = async (req, res) => {
	const { id } = req.params;

	try {
		const { _id, ...updateData } = req.body;
		const { status } = updateData;
		const updatedRequest = await EmployeeLeave.findByIdAndUpdate(
			id,
			{ $set: { status } },
			{
				new: true,
			},
		);
		return res.status(201).json(updatedRequest);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const createLeaveRequest = async (req, res) => {
	let { company, type, leaveType, startDate, endDate, employeeId, param_hours, source } = req.body;

	// NEW-13: param_hours named the timesheet field to write and the day loop had
	// no bound. Only the leave-hour fields the client sends (AddLeave.jsx via
	// PAY_TYPES) plus the "Unpaid"/"Other" markers are accepted, and the range is capped.
	const scalars = { type, leaveType, startDate, endDate, employeeId, source };
	if (Object.values(scalars).some((v) => !isScalar(v))) {
		return res.status(400).json({ message: "Invalid leave request" });
	}
	if (typeof param_hours !== "string" || !LEAVE_PARAM_HOURS.has(param_hours)) {
		return res.status(400).json({ message: "Invalid leave type" });
	}
	if (calculateLeaveDays(startDate, endDate).leaveDays > MAX_LEAVE_DAYS) {
		return res
			.status(400)
			.json({ message: `A leave request cannot exceed ${MAX_LEAVE_DAYS} days` });
	}

	try {
		const newRequest = {
			employeeId,
			startDate,
			endDate,
			companyName: company,
			type: leaveType,
		};
		const existingRecord = await EmployeeLeave.findOne(newRequest);
		if (existingRecord) {
			return res.status(409).json({ message: "Request already exists" });
		}
		const { leaveHrs, leaveDays } = calculateLeaveDays(startDate, endDate);
		newRequest.totalLeaveHrs = leaveHrs;
		newRequest.totalLeaveDays = leaveDays;
		const result = await EmployeeLeave.create(newRequest);

		if (param_hours !== UNPAID) {
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
					// NEW-13: "Other" has no hours field (the old `Other: 8` was dropped by the schema).
					...(param_hours === OTHER ? {} : { [param_hours]: 8 }),
				});
			}
			await Timesheet.insertMany(timesheetEntries);
		}
		return res.status(201).json(result);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

module.exports = {
	createLeaveRequest,
	updateLeaveRequest,
	getAllEmployeeLeaveRequests,
	getEmployeeLeaveRequest,
};
