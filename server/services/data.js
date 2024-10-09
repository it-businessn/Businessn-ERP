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

const getUTCTime = (time) => moment.utc(time).toISOString();

const startOfDay = (timestamp) => moment(timestamp).startOf("day").toDate();
const endOfDay = (timestamp) => moment(timestamp).endOf("day").toDate();

const momentTime = (time) => moment(time, "YYYY-MM-DD hh:mm A");

const momentDuration = (time1, time2) =>
	time1 && time2 ? moment.duration(time2.diff(time1)) : 0;

const isSameDate = (date1, date2) => moment(date1).isSame(date2);

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
};
