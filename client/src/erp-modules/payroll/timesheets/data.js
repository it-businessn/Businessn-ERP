import { FaCheckCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { PiDotsThreeCircleFill } from "react-icons/pi";
import { TiDelete } from "react-icons/ti";

export const PAY_TYPES_TITLE = {
	REG_PAY: "Regular Pay",
	OVERTIME_PAY: "Overtime Pay",
	DBL_OVERTIME_PAY: "Double Overtime Pay",
	STAT_WORK_PAY: "Statutory Worked Pay",
	STAT_PAY: "Statutory Pay",
	SICK_PAY: "Sick Pay",
	VACATION_PAY: "Vacation Pay",
	BEREAVEMENT_PAY: "Bereavement Pay",
	PERSONAL_DAY_PAY: "Personal Day Pay",
};

export const convertToMinutes = (time) => {
	if (!time || typeof time !== "string") return null;
	const [h, m] = time.split(":").map(Number);
	return h * 60 + m;
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
	// {
	// 	type: BREAK_TYPES_TITLE.REG_PAY_BRK,
	// 	value: BREAK_TYPES_TITLE.REG_PAY_BRK,
	// 	param_key: "regPay",
	// 	param_hours: "regBreakHoursWorked",
	// 	color: "var(--stat_item_color)",
	// 	rowBg: "var(--break_row_bg)",
	// },
	{
		type: PAY_TYPES_TITLE.OVERTIME_PAY,
		value: PAY_TYPES_TITLE.OVERTIME_PAY,
		param_key: "overTimePay",
		param_hours: "overtimeHoursWorked",
		color: "var(--overtime)",
	},
	// {
	// 	type: BREAK_TYPES_TITLE.OVERTIME_PAY_BRK,
	// 	value: BREAK_TYPES_TITLE.OVERTIME_PAY_BRK,
	// 	param_key: "overTimePay",
	// 	param_hours: "OTBreakHoursWorked",
	// 	color: "var(--stat_item_color)",
	// 	rowBg: "var(--break_row_bg)",
	// },
	{
		type: PAY_TYPES_TITLE.DBL_OVERTIME_PAY,
		value: PAY_TYPES_TITLE.DBL_OVERTIME_PAY,
		param_key: "dblOverTimePay",
		param_hours: "dblOvertimeHoursWorked",
		color: "var(--dbl_overtime)",
	},
	// {
	// 	type: BREAK_TYPES_TITLE.DBL_OVERTIME_PAY_BRK,
	// 	value: BREAK_TYPES_TITLE.DBL_OVERTIME_PAY_BRK,
	// 	param_key: "dblOverTimePay",
	// 	param_hours: "dblOTBreakHoursWorked",
	// 	color: "var(--stat_item_color)",
	// 	rowBg: "var(--break_row_bg)",
	// },
	{
		type: PAY_TYPES_TITLE.STAT_WORK_PAY,
		value: PAY_TYPES_TITLE.STAT_WORK_PAY,
		param_key: "statWorkPay",
		param_hours: "statDayHoursWorked",
		color: "var(--stat_worked)",
	},
	// {
	// 	type: BREAK_TYPES_TITLE.STAT_WORK_PAY_BRK,
	// 	value: BREAK_TYPES_TITLE.STAT_WORK_PAY_BRK,
	// 	param_key: "statWorkPay",
	// 	param_hours: "statWorkBreakHoursWorked",
	// 	color: "var(--stat_item_color)",
	// 	rowBg: "var(--break_row_bg)",
	// },
	{
		type: PAY_TYPES_TITLE.STAT_PAY,
		value: PAY_TYPES_TITLE.STAT_PAY,
		param_key: "statPay",
		param_hours: "statDayHours",
		color: "var(--incorrect_ans)",
	},
	// {
	// 	type: BREAK_TYPES_TITLE.STAT_PAY_BRK,
	// 	value: BREAK_TYPES_TITLE.STAT_PAY_BRK,
	// 	param_key: "statPay",
	// 	param_hours: "statBreakHoursWorked",
	// 	color: "var(--stat_item_color)",
	// 	rowBg: "var(--break_row_bg)",
	// },
	{
		type: PAY_TYPES_TITLE.SICK_PAY,
		value: PAY_TYPES_TITLE.SICK_PAY,
		param_key: "sickPay",
		param_hours: "sickPayHours",
		color: "var(--correct_ans)",
	},
	// {
	// 	type: BREAK_TYPES_TITLE.SICK_PAY_BRK,
	// 	value: BREAK_TYPES_TITLE.SICK_PAY_BRK,
	// 	param_key: "sickPay",
	// 	param_hours: "sickBreakHoursWorked",
	// 	color: "var(--stat_item_color)",
	// 	rowBg: "var(--break_row_bg)",
	// },
	{
		type: PAY_TYPES_TITLE.VACATION_PAY,
		value: PAY_TYPES_TITLE.VACATION_PAY,
		param_key: "vacationPay",
		param_hours: "vacationPayHours",
		color: "var(--event_color1)",
	},
	// {
	// 	type: BREAK_TYPES_TITLE.VACATION_PAY_BRK,
	// 	value: BREAK_TYPES_TITLE.VACATION_PAY_BRK,
	// 	param_key: "vacationPay",
	// 	param_hours: "vacationBreakHoursWorked",
	// 	color: "var(--stat_item_color)",
	// 	rowBg: "var(--break_row_bg)",
	// },
	{
		type: PAY_TYPES_TITLE.BEREAVEMENT_PAY,
		value: PAY_TYPES_TITLE.BEREAVEMENT_PAY,
		param_key: "bereavementPay",
		param_hours: "bereavementPayHours",
		color: "var(--status_button_border)",
	},
	{
		type: PAY_TYPES_TITLE.PERSONAL_DAY_PAY,
		value: PAY_TYPES_TITLE.PERSONAL_DAY_PAY,
		param_key: "personalDayPay",
		param_hours: "personalPayHours",
		color: "var(--event_color1)",
	},
];

export const TIMESHEET_SOURCE = {
	MANAGER: "Manager",
	EMP: "Employee",
	TAD: "TAD",
	APP: "APP",
};

export const TIMESHEET_SOURCES = [
	{
		origin: TIMESHEET_SOURCE.MANAGER,
		color: "var(--primary_bg)",
		bg: "var(--primary_button_bg)",
	},
	{
		origin: TIMESHEET_SOURCE.EMP,
		color: "var(--primary_bg)",
		bg: "var(--stat_worked)",
	},
	{
		origin: TIMESHEET_SOURCE.TAD,
		color: "var(--primary_bg)",
		bg: "var(--event_color)",
	},
	{
		origin: TIMESHEET_SOURCE.APP,
		color: "var(--primary_bg)",
		bg: "var(--gauge_needle)",
	},
];

export const TIMESHEET_STATUS_LABEL = {
	APPROVED: "Approved",
	REJECTED: "Rejected",
	PENDING: "Pending",
	DELETE: "Delete",
};

export const TIMESHEET_STATUS = [
	{
		value: TIMESHEET_STATUS_LABEL.APPROVED,
		color: "var(--primary_bg)",
		bg: "var(--action_status_approve)",
	},
	{
		value: TIMESHEET_STATUS_LABEL.REJECTED,
		color: "var(--primary_bg)",
		bg: "var(--action_status_reject)",
	},
	{
		value: TIMESHEET_STATUS_LABEL.PENDING,
		color: "var(--primary_bg)",
		bg: "var(--pending)",
	},
];

export const TICKET_ACTION = {
	OPEN: "Open",
	CLOSED: "Close",
	PROGRESS: "In Progress",
	ON_HOLD: "On Hold",
};

export const TICKET_ACTION_STATUS = [
	{
		name: TICKET_ACTION.PROGRESS,
		color: "var(--ticket_progress)",
		title: TICKET_ACTION.PROGRESS,
	},
	{
		name: TICKET_ACTION.ON_HOLD,
		color: "var(--ticket_hold)",
		title: TICKET_ACTION.ON_HOLD,
	},
	{
		name: TICKET_ACTION.OPEN,
		color: "var(--open)",
		title: TICKET_ACTION.OPEN,
	},
	{
		name: TICKET_ACTION.CLOSED,
		color: "var(--action_status_approve)",
		title: TICKET_ACTION.CLOSED,
	},
];

export const ACTION_STATUS = [
	{
		name: TIMESHEET_STATUS_LABEL.APPROVED,
		color: "var(--action_status_approve)",
		title: "Approve",
		icon: <FaCheckCircle size={"2em"} />,
	},
	{
		name: TIMESHEET_STATUS_LABEL.PENDING,
		color: "var(--pending)",
		title: "Pend",
		icon: <PiDotsThreeCircleFill size={"2.5em"} />,
	},
	{
		name: TIMESHEET_STATUS_LABEL.REJECTED,
		color: "var(--action_status_reject)",
		title: "Reject",
		icon: <TiDelete size={"2.8em"} />,
	},
	{
		name: TIMESHEET_STATUS_LABEL.DELETE,
		color: "var(--nav_color)",
		title: "Delete",
		icon: <MdDelete size={"2.5em"} />,
	},
];

export const getParamKey = (type) => (type ? PAY_TYPES.find((_) => _.type === type) : "");

export const getSourceStyle = (sourceName) =>
	TIMESHEET_SOURCES.find(({ origin }) => origin === sourceName);

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
