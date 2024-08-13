export const PAY_TYPES = [
	{
		type: "Regular Pay",
		value: "Regular Pay",
		param_key: "regPay",
		param_hours: "regHoursWorked",
	},
	{
		type: "Overtime Pay",
		value: "Overtime Pay",
		param_key: "overTimePay",
		param_hours: "overtimeHoursWorked",
	},
	{
		type: "Double Overtime Pay",
		value: "Double Overtime Pay",
		param_key: "dblOverTimePay",
		param_hours: "dblOvertimeHoursWorked",
	},
	{
		type: "Statutory Worked Pay",
		value: "Statutory Worked Pay",
		param_key: "statWorkPay",
		param_hours: "statDayHoursWorked",
	},
	{
		type: "Statutory Pay",
		value: "Statutory Pay",
		param_key: "statPay",
		param_hours: "statDayHours",
	},
	{
		type: "Sick Pay",
		value: "Sick Pay",
		param_key: "sickPay",
		param_hours: "sickPayHours",
	},
	{
		type: "Vacation Pay",
		value: "Vacation Pay",
		param_key: "vacationPay",
		param_hours: "vacationPayHours",
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

export const getParamKey = (type) => PAY_TYPES.find((_) => _.type === type);

export const getStatusStyle = (approvedStatusName) =>
	TIMESHEET_STATUS.find((_) => _.value === approvedStatusName);

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
