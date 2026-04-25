const TIMESHEET_STATUS = {
	APPROVED: "Approved",
	REJECTED: "Rejected",
	PENDING: "Pending",
	DELETE: "Delete",
};

const TIMESHEET_SOURCE = {
	MANAGER: "Manager",
	EMPLOYEE: "Employee",
	TAD: "TAD",
	ADMINISTRATOR: "Admin",
	SYSTEM: "SYSTEM",
	APP: "APP",
};

const PUNCH_CODE = {
	CLOCK_IN: "0",
	BREAK_IN: "3",
	BREAK_OUT: "2",
	CLOCK_OUT: "1",
};

const PARAM_HOURS = {
	REGULAR: "regHoursWorked",
	REGULAR2: "regHoursWorked2",
	STAT: "statDayHoursWorked",
	BREAK: "regBreakHoursWorked",
};

module.exports = { TIMESHEET_STATUS, TIMESHEET_SOURCE, PUNCH_CODE, PARAM_HOURS };
