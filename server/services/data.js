const moment = require("moment");
// const momentTz = require("moment-timezone");

const BUSINESSN_ORG = "BusinessN Corporate";
const BUSINESSN_SHADOW_ADMIN_EMAILS = [
	"julik@businessn.com",
	"davidd@businessn.com",
	"daniel.heyns@businessn.com",
	"andrew.dehkurdi@businessn.com",
	"si.degouveia@businessn.com",
	"jesse.christiaens@businessn.com",
	"shanna.hayes@businessn.com",

	// "stefan.esterhuysen@businessn.com",
	// "erwan.dantier@businessn.com",
	// "azra.demirovic@fractionaldepartments.com",
	// "jesse.christiaens@fractionaldepartments.com",
	// "it@businessn.com",
	// "andrew.dehkurdi@fractionaldepartments.com",
	"testuserstaging@test.com testuser",
	// enroller - enroller@mail.com enroller1
	// emp - emp@mail.com emp1
	// shadow admin - shadowadmin@mail.com shadowadmin1
	// manager - manager@mail.com manager1
	// admin admin@mail.com admin1
	// auth admin authadmin@mail.com  authadmin
];

const COMPANIES = {
	FD: "Fractional Departments Inc.",
	NW: "The Owners Of Strata Plan NW1378",
	BUSINESSN_ORG: "BusinessN Corporate",
	CORNERSTONE: "Cornerstone Maintenance Group Ltd.",
};

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
	{ name: "Project Management Tickets" },
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

const CLIENT_ORG_ADMIN_PERMISSION = [
	{ name: "Payroll" },
	{ name: "Payroll Dashboard" },
	{ name: "Payroll Workview" },
	{ name: "Payroll Process Payroll" },
	// { name: "Payroll Approvals" },
	{ name: "Payroll Timesheets" },
	{ name: "Payroll Employees" },
	{ name: "Payroll Reports" },
	// { name: "Payroll Settings" },
	{ name: "Payroll Employee Dashboard" },
	// { name: "Payroll Employee Records" },
	// { name: "Payroll Setup" },
];

const CLIENT_ORG_EMP_PERMISSION = [{ name: "Payroll" }, { name: "Payroll Employee Dashboard" }];

const ROLES = {
	SUPER_SHADOW_ADMIN: "Super Shadow Admin",
	SHADOW_ADMIN: "Shadow Admin",
	AUTH_ADMINISTRATOR: "Authorizing Admin",
	ADMINISTRATOR: "Administrator",
	MANAGER: "Manager",
	EMPLOYEE: "Employee",
	ENROLLER: "Enroller",
};

const PARAM_HOURS = {
	REGULAR: "regHoursWorked",
	REGULAR2: "regHoursWorked2",
	STAT: "statDayHoursWorked",
	BREAK: "regBreakHoursWorked",
};

const TIMESHEET_STATUS = {
	APPROVED: "Approved",
	REJECTED: "Rejected",
	PENDING: "Pending",
	DELETE: "Delete",
};

const TICKET_STATUS = {
	OPEN: "Open",
	CLOSED: "Close",
	PROGRESS: "In Progress",
	ON_HOLD: "On Hold",
};

const isRoleManager = (role) =>
	role === ROLES.SHADOW_ADMIN ||
	role === ROLES.AUTH_ADMINISTRATOR ||
	role === ROLES.ADMINISTRATOR ||
	role === ROLES.MANAGER;

const NEXT_DAY = moment().add(1, "days");
const CURRENT_TIME_HHMM = NEXT_DAY.format("HH:mm");
// const currentTime = NEXT_DAY.format("HH:mm:ss");
// let LOCAL_TIME = moment().tz("America/Vancouver").toDate();

const CURRENT_YEAR = moment().year();
const getUTCTime = (time, notDevice) => (notDevice ? moment() : moment.utc(time).toISOString());

const calculateAge = (dob) => moment().diff(moment(dob, "YYYY-MM-DD"), "years");

const startOfDay = (timestamp) => moment(timestamp).startOf("day").toDate();
const endOfDay = (timestamp) => moment(timestamp).endOf("day").toDate();

const momentTime = (time) => moment(time, "YYYY-MM-DD hh:mm A");

const momentDuration = (time1, time2) => (time1 && time2 ? moment.duration(time2.diff(time1)) : 0);

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

const PUNCH_CODE = {
	CLOCK_IN: "0",
	BREAK_IN: "3",
	BREAK_OUT: "2",
	CLOCK_OUT: "1",
};

const ALERTS_TYPE = { BANK: "bank", SIN: "SIN", WAGE: "wage" };

const EARNING_TYPE = { FT: "Full Time Salaried", PT: "Part Time Salaried", HOURLY: "Hourly" };

const PAY_TYPES_TITLE = {
	REG_PAY: "Regular Pay",
	REG_PAY_BRK: "Regular Pay Break",
	OVERTIME_PAY: "Overtime Pay",
	DBL_OVERTIME_PAY: "Double Overtime Pay",
	STAT_WORK_PAY: "Statutory Worked Pay",
	STAT_PAY: "Statutory Pay",
	SICK_PAY: "Sick Pay",
	VACATION_PAY: "Vacation Pay",
};

const TIMESHEET_ORIGIN = {
	MANAGER: "Manager",
	EMP: "Employee",
	TAD: "TAD",
	APP: "APP",
};

const PAYRUN_TYPE = { REGULAR: "1", PAYOUT: "2", MANUAL: "3", SUPERFICIAL: "4" };

const getPayType = (isBreak = false) =>
	isBreak ? PAY_TYPES_TITLE.REG_PAY_BRK : PAY_TYPES_TITLE.REG_PAY;

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
		hasStartBreak && hasEndBreak ? break1Duration.add(break2Duration).add(break3Duration) : 0;

	const totalClockInToOut = momentDuration(clockIn, clockOut);
	const totalWorkingTime = totalClockInToOut.subtract(totalBreakHours);
	const hours = Math.floor(totalWorkingTime.asHours());
	const minutes = Math.floor(totalWorkingTime.minutes());

	return {
		totalBreakHours: totalBreakHours ? Math.floor(totalBreakHours.asHours()) : 0,
		totalWorkedHours: `${hours < 10 ? `0${hours < 0 ? 0 : hours}` : hours}:${
			minutes < 10 ? `0${minutes < 0 ? 0 : minutes}` : minutes
		}`,
	};
};

module.exports = {
	EARNING_TYPE,
	ALERTS_TYPE,
	PAY_TYPES_TITLE,
	CURRENT_TIME_HHMM,
	NEXT_DAY,
	ADMIN_PERMISSION,
	CLIENT_ORG_ADMIN_PERMISSION,
	CLIENT_ORG_EMP_PERMISSION,
	EMPLOYEE_PERMISSION,
	isRoleManager,
	CURRENT_YEAR,
	getUTCTime,
	startOfDay,
	endOfDay,
	momentTime,
	momentDuration,
	isSameDate,
	STAT_HOLIDAYS,
	getPayType,
	calcTotalHours,
	isSameDay,
	calculateAge,
	BUSINESSN_ORG,
	PUNCH_CODE,
	TIMESHEET_STATUS,
	PARAM_HOURS,
	// LOCAL_TIME,
	PAYRUN_TYPE,
	TIMESHEET_ORIGIN,
	ROLES,
	TICKET_STATUS,
	COMPANIES,
};
