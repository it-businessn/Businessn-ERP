const ALERTS_TYPE = { BANK: "bank", SIN: "SIN", WAGE: "wage" };

const PAY_TYPES_TITLE = {
	REG_PAY: "Regular Pay",
	REG_PAY_BRK: "Regular Pay Break",
	OVERTIME_PAY: "Overtime Pay",
	DBL_OVERTIME_PAY: "Double Overtime Pay",
	STAT_WORK_PAY: "Statutory Worked Pay",
	STAT_PAY: "Statutory Pay",
	SICK_PAY: "Sick Pay",
	VACATION_PAY: "Vacation Pay",
	BEREAVEMENT_PAY: "Bereavement Pay",
	PERSONAL_DAY_PAY: "Personal Day Pay",
};

const PAYRUN_TYPE = { REGULAR: "1", PAYOUT: "2", MANUAL: "3", SUPERFICIAL: "4" };

module.exports = { PAY_TYPES_TITLE, ALERTS_TYPE, PAYRUN_TYPE };
