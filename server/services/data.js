const moment = require("moment");

const ADMIN_PERMISSION = [
	{ name: "Sales" },
	{ name: "Sales Dashboard" },
	{ name: "Sales Activities" },
	{ name: "Sales Calendar" },
	{ name: "Sales Payouts" },
	{ name: "Sales Customers" },
	{ name: "Sales Opportunities" },
	{ name: "Sales Lead Docket" },
	{ name: "Sales Lead Disbursement" },
	{ name: "Sales Fresh Leads" },
	{ name: "Sales Target Leads Pipeline" },
	{ name: "Sales Products" },
	{ name: "Sales Orders" },
	{ name: "Sales Resources" },
	{ name: "Sales Sales Reports" },
	{ name: "Sales Setup" },
	{ name: "Project Management" },
	{ name: "Project Management Dashboard" },
	{ name: "Project Management Workview" },
	{ name: "Project Management Communication" },
	{ name: "Project Management Taskboard" },
	{ name: "Project Management Agenda" },
	{ name: "Project Management Gantt" },
	{ name: "Project Management PM Reports" },
	{ name: "Project Management Setup" },
	{ name: "Payroll" },
	{ name: "Payroll Dashboard" },
	{ name: "Payroll Workview" },
	{ name: "Payroll Process Payroll" },
	{ name: "Payroll Approvals" },
	{ name: "Payroll Timesheets" },
	{ name: "Payroll Employees" },
	{ name: "Payroll Reports" },
	{ name: "Payroll Settings" },
	{ name: "Payroll Employee Dashboard" },
	{ name: "Payroll Employee Records" },
	{ name: "Payroll Setup" },
	{ name: "Scheduling" },
	{ name: "Scheduling Dashboard" },
	{ name: "Scheduling Workview" },
	{ name: "Scheduling Scheduling Reports" },
	{ name: "Scheduling Setup" },
	{ name: "Scheduling Shift Assignment" },
];

const EMPLOYEE_PERMISSION = [
	{ name: "Sales" },
	{ name: "Sales Dashboard" },
	{ name: "Sales Activities" },
	{ name: "Sales Calendar" },
	{ name: "Sales Payouts" },
	{ name: "Sales Customers" },
	{ name: "Sales Opportunities" },
	{ name: "Sales Fresh Leads" },
	{ name: "Sales Target Leads Pipeline" },
	{ name: "Sales Resources" },
	{ name: "Project Management" },
	{ name: "Project Management Dashboard" },
	{ name: "Project Management Work view" },
	{ name: "Project Management Communication" },
];

const ROLES = {
	EMPLOYEE: "Employee",
	ADMINISTRATOR: "Administrator",
	MANAGER: "Manager",
	ENROLLER: "Enroller",
};

const isRoleManager = (role) =>
	role?.includes(ROLES.ADMINISTRATOR) || role?.includes(ROLES.MANAGER);

const getUTCTime = (time, notDevice) =>
	notDevice ? moment() : moment.utc(time).toISOString();

const startOfDay = (timestamp) => moment(timestamp).startOf("day").toDate();
const endOfDay = (timestamp) => moment(timestamp).endOf("day").toDate();

const momentTime = (time) => moment(time, "YYYY-MM-DD hh:mm A");

const momentDuration = (time1, time2) =>
	time1 && time2 ? moment.duration(time2.diff(time1)) : 0;

const isSameDate = (date1, date2) => moment(date1).isSame(date2, "second");

const isSameDay = (date1, date2) => moment(date1).isSame(date2, "day");

const STAT_HOLIDAYS = [
	{ name: "New Year's Day", date: "2024-01-01" },
	{ name: "Family Day", date: "2024-02-19" },
	{ name: "Good Friday", date: "2024-03-29" },
	{ name: "Victoria Day", date: "2024-05-20" },
	{ name: "Canada Day", date: "2024-07-01" },
	{ name: "B.C. Day", date: "2024-08-05" },
	{ name: "Labour Day", date: "2024-09-02" },
	{ name: "National Day for Truth and Reconciliation", date: "2024-09-30" },
	{ name: "Thanksgiving Day", date: "2024-10-14" },
	{ name: "Remembrance Day", date: "2024-11-11" },
	{ name: "Christmas Day", date: "2024-12-25" },
];

const getPayType = (workedDate) => {
	const isStatHoliday = STAT_HOLIDAYS.find(({ date }) =>
		isSameDay(date, workedDate),
	);
	if (isStatHoliday) {
		return "Statutory Worked Pay";
	}
	return "Regular Pay";
};

const calcTotalHours = (data) => {
	if (!(data?.clockIn && data?.clockOut)) {
		return;
	}
	const clockIn = momentTime(data?.clockIn);
	const clockOut = momentTime(data?.clockOut);
	const hasStartBreak = data?.startBreaks?.length;
	const hasEndBreak = data?.endBreaks?.length;

	const break1Start = hasStartBreak && momentTime(data?.startBreaks[0]);
	const break1End = hasEndBreak && momentTime(data?.endBreaks[0]);

	const break2Start = hasStartBreak > 1 && momentTime(data?.startBreaks[1]);
	const break2End = hasEndBreak > 1 && momentTime(data?.startBreaks[1]);

	const break3Start = hasStartBreak > 2 && momentTime(data?.startBreaks[2]);
	const break3End = hasEndBreak > 2 && momentTime(data?.startBreaks[2]);

	const break1Duration = momentDuration(break1Start, break1End);
	const break2Duration = momentDuration(break2Start, break2End);
	const break3Duration = momentDuration(break3Start, break3End);

	const totalBreakHours =
		hasStartBreak && hasEndBreak
			? break1Duration.add(break2Duration).add(break3Duration)
			: 0;

	const totalClockInToOut = momentDuration(clockIn, clockOut);
	const totalWorkingTime = totalClockInToOut.subtract(totalBreakHours);
	const hours = Math.floor(totalWorkingTime.asHours());
	const minutes = Math.floor(totalWorkingTime.minutes());

	return {
		totalBreakHours: totalBreakHours
			? Math.floor(totalBreakHours.asHours())
			: 0,
		totalWorkedHours: `${hours}:${minutes}`,
	};
};

module.exports = {
	ADMIN_PERMISSION,
	EMPLOYEE_PERMISSION,
	isRoleManager,
	getUTCTime,
	startOfDay,
	endOfDay,
	momentTime,
	momentDuration,
	isSameDate,
	STAT_HOLIDAYS,
	getPayType,
	calcTotalHours,
};
