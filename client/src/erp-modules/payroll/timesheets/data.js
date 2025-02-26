export const PAY_TYPES_TITLE = {
	REG_PAY: "Regular Pay",
	OVERTIME_PAY: "Overtime Pay",
	DBL_OVERTIME_PAY: "Double Overtime Pay",
	STAT_WORK_PAY: "Statutory Worked Pay",
	STAT_PAY: "Statutory Pay",
	SICK_PAY: "Sick Pay",
	VACATION_PAY: "Vacation Pay",
};

export const BREAK_TYPES_TITLE = {
	REG_PAY_BRK: "Regular Pay Break",
	OVERTIME_PAY_BRK: "Overtime Pay Break",
	DBL_OVERTIME_PAY_BRK: "Double Overtime Pay Break",
	STAT_WORK_PAY_BRK: "Statutory Worked Pay Break",
	STAT_PAY_BRK: "Statutory Pay Break",
	SICK_PAY_BRK: "Sick Pay Break",
	VACATION_PAY_BRK: "Vacation Pay Break",
};

export const PAY_TYPES = [
	{
		type: PAY_TYPES_TITLE.REG_PAY,
		value: PAY_TYPES_TITLE.REG_PAY,
		param_key: "regPay",
		param_hours: "regHoursWorked",
		color: "var(--main_color_black)",
	},
	{
		type: BREAK_TYPES_TITLE.REG_PAY_BRK,
		value: BREAK_TYPES_TITLE.REG_PAY_BRK,
		param_key: "regPay",
		param_hours: "regBreakHoursWorked",
		color: "var(--stat_item_color)",
		rowBg: "var(--break_row_bg)",
	},
	{
		type: PAY_TYPES_TITLE.OVERTIME_PAY,
		value: PAY_TYPES_TITLE.OVERTIME_PAY,
		param_key: "overTimePay",
		param_hours: "overtimeHoursWorked",
		color: "var(--overtime)",
	},
	{
		type: BREAK_TYPES_TITLE.OVERTIME_PAY_BRK,
		value: BREAK_TYPES_TITLE.OVERTIME_PAY_BRK,
		param_key: "overTimePay",
		param_hours: "OTbreakHoursWorked",
		color: "var(--stat_item_color)",
		rowBg: "var(--break_row_bg)",
	},
	{
		type: PAY_TYPES_TITLE.DBL_OVERTIME_PAY,
		value: PAY_TYPES_TITLE.DBL_OVERTIME_PAY,
		param_key: "dblOverTimePay",
		param_hours: "dblOvertimeHoursWorked",
		color: "var(--dbl_overtime)",
	},
	{
		type: BREAK_TYPES_TITLE.DBL_OVERTIME_PAY_BRK,
		value: BREAK_TYPES_TITLE.DBL_OVERTIME_PAY_BRK,
		param_key: "dblOverTimePay",
		param_hours: "dblOTBreakHoursWorked",
		color: "var(--stat_item_color)",
		rowBg: "var(--break_row_bg)",
	},
	{
		type: PAY_TYPES_TITLE.STAT_WORK_PAY,
		value: PAY_TYPES_TITLE.STAT_WORK_PAY,
		param_key: "statWorkPay",
		param_hours: "statDayHoursWorked",
		color: "var(--stat_worked)",
	},
	{
		type: BREAK_TYPES_TITLE.STAT_WORK_PAY_BRK,
		value: BREAK_TYPES_TITLE.STAT_WORK_PAY_BRK,
		param_key: "statWorkPay",
		param_hours: "statWorkBreakHoursWorked",
		color: "var(--stat_item_color)",
		rowBg: "var(--break_row_bg)",
	},
	{
		type: PAY_TYPES_TITLE.STAT_PAY,
		value: PAY_TYPES_TITLE.STAT_PAY,
		param_key: "statPay",
		param_hours: "statDayHours",
		color: "var(--incorrect_ans)",
	},
	{
		type: BREAK_TYPES_TITLE.STAT_PAY_BRK,
		value: BREAK_TYPES_TITLE.STAT_PAY_BRK,
		param_key: "statPay",
		param_hours: "statBreakHoursWorked",
		color: "var(--stat_item_color)",
		rowBg: "var(--break_row_bg)",
	},
	{
		type: PAY_TYPES_TITLE.SICK_PAY,
		value: PAY_TYPES_TITLE.SICK_PAY,
		param_key: "sickPay",
		param_hours: "sickPayHours",
		color: "var(--correct_ans)",
	},
	{
		type: BREAK_TYPES_TITLE.SICK_PAY_BRK,
		value: BREAK_TYPES_TITLE.SICK_PAY_BRK,
		param_key: "sickPay",
		param_hours: "sickBreakHoursWorked",
		color: "var(--stat_item_color)",
		rowBg: "var(--break_row_bg)",
	},
	{
		type: PAY_TYPES_TITLE.VACATION_PAY,
		value: PAY_TYPES_TITLE.VACATION_PAY,
		param_key: "vacationPay",
		param_hours: "vacationPayHours",
		color: "var(--event_color1)",
	},
	{
		type: BREAK_TYPES_TITLE.VACATION_PAY_BRK,
		value: BREAK_TYPES_TITLE.VACATION_PAY_BRK,
		param_key: "vacationPay",
		param_hours: "vacationBreakHoursWorked",
		color: "var(--stat_item_color)",
		rowBg: "var(--break_row_bg)",
	},
];

export const TIMESHEET_STATUS = [
	{
		value: "Approved",
		color: "var(--primary_bg)",
		bg: "var(--correct_ans)",
	},
	{
		value: "Rejected",
		color: "var(--primary_bg)",
		bg: "var(--incorrect_ans)",
	},
	{
		value: "Pending",
		color: "var(--primary_bg)",
		bg: "var(--pending)",
	},
];

export const getParamKey = (type) => (type ? PAY_TYPES.find((_) => _.type === type) : "");

export const getStatusStyle = (approvedStatusName) =>
	TIMESHEET_STATUS.find((_) => _.value === approvedStatusName);

export const getPayTypeStyle = (payType) =>
	payType ? PAY_TYPES.find((_) => _.value === payType) : "";

export const validateHours = (value) => {
	const hours = parseInt(value, 10);
	return Number.isInteger(hours) && hours >= 1 && hours <= 24;
};

export const validateMinutes = (value) => {
	const minutes = parseInt(value, 10);
	return Number.isInteger(minutes) && minutes >= 0 && minutes <= 60;
};

export const validateTime = (value) => {
	const [hours, minutes] = value.split(":");
	return validateHours(hours) && validateMinutes(minutes);
};
