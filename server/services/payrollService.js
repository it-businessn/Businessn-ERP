const moment = require("moment");
const Timesheet = require("../models/Timesheet");
const EmployeeBalanceInfo = require("../models/EmployeeBalanceInfo");
const EmployeePayStub = require("../models/EmployeePayStub");
const { TIMESHEET_STATUS } = require("../constants/timesheet.constants");
const { PAY_TYPES_TITLE } = require("../constants/pay.constants");
const { getSumRegHrs } = require("../utils/time.util");

const getApprovedTimesheets = async (record) =>
	await Timesheet.find(record)
		.sort({ clockIn: -1 })
		.populate({
			path: "employeeId",
			model: "Employee",
			select: ["companyId", "employeeId", "fullName", "payrollStatus"],
		});

const findEmployeeBenefitInfo = async (empId, companyName) =>
	await EmployeeBalanceInfo.findOne({
		empId,
		companyName,
	});

const calculateTimesheetApprovedHours = async (startDate, endDate, companyName) => {
	const timesheets = await getApprovedTimesheets({
		deleted: false,
		companyName,
		clockIn: {
			$gte: moment(startDate).utc().startOf("day").toDate(),
			$lte: moment(endDate).utc().endOf("day").toDate(),
		},
		approveStatus: TIMESHEET_STATUS.APPROVED,
	});

	const timesheetApprovedHoursSum = timesheets?.reduce((acc, timesheet) => {
		if (!acc[timesheet.employeeId]) {
			acc[timesheet.employeeId] = {
				_id: timesheet._id,
				empId: timesheet.employeeId,
				totalRegHoursWorked: 0,
				totalRegHoursWorked2: 0,
				totalOvertimeHoursWorked: 0,
				totalDblOvertimeHoursWorked: 0,
				totalStatDayHoursWorked: 0,
				totalStatHours: 0,
				totalSickHoursWorked: 0,
				totalVacationHoursWorked: 0,
				totalBereavementHoursWorked: 0,
				totalPersonalDayHoursWorked: 0,
			};
		}

		if (timesheet.payType === PAY_TYPES_TITLE.REG_PAY)
			acc[timesheet.employeeId].totalRegHoursWorked +=
				getSumRegHrs(timesheet.regHoursWorked, timesheet.regHoursWorked2) || 0;

		// if (timesheet.payType === PAY_TYPES_TITLE.REG_PAY)
		// acc[timesheet.employeeId].totalRegHoursWorked2 += timesheet.regHoursWorked2 || 0;

		if (timesheet.payType === PAY_TYPES_TITLE.OVERTIME_PAY)
			acc[timesheet.employeeId].totalOvertimeHoursWorked += timesheet.overtimeHoursWorked || 0;

		if (timesheet.payType === PAY_TYPES_TITLE.DBL_OVERTIME_PAY)
			acc[timesheet.employeeId].totalDblOvertimeHoursWorked +=
				timesheet.dblOvertimeHoursWorked || 0;
		if (timesheet.payType === PAY_TYPES_TITLE.STAT_PAY)
			acc[timesheet.employeeId].totalStatHours += timesheet.statDayHours || 0;

		if (timesheet.payType === PAY_TYPES_TITLE.STAT_WORK_PAY)
			acc[timesheet.employeeId].totalStatDayHoursWorked += timesheet.statDayHoursWorked || 0;

		if (timesheet.payType === PAY_TYPES_TITLE.SICK_PAY)
			acc[timesheet.employeeId].totalSickHoursWorked += timesheet.sickPayHours || 0;

		if (timesheet.payType === PAY_TYPES_TITLE.VACATION_PAY)
			acc[timesheet.employeeId].totalVacationHoursWorked += timesheet.vacationPayHours || 0;

		if (timesheet.payType === PAY_TYPES_TITLE.BEREAVEMENT_PAY)
			acc[timesheet.employeeId].totalBereavementHoursWorked += timesheet.bereavementPayHours || 0;

		if (timesheet.payType === PAY_TYPES_TITLE.PERSONAL_DAY_PAY)
			acc[timesheet.employeeId].totalPersonalDayHoursWorked += timesheet.personalPayHours || 0;
		return acc;
	}, {});

	const result = Object.values(timesheetApprovedHoursSum);
	return result;
};

const findEmployeePayStub = async (empId, payPeriodPayDate, companyName) =>
	await EmployeePayStub.findOne({
		empId,
		payPeriodPayDate,
		companyName,
	}).sort({
		payPeriodProcessingDate: -1,
	});

const findEmpPayStubDetail = async (empId, payPeriodPayDate, companyName) =>
	await EmployeePayStub.findOne({
		empId,
		payPeriodPayDate,
		companyName,
	})
		.populate({
			path: "empId",
			model: "Employee",
			select: "fullName",
		})
		.select("commission retroactive reimbursement vacationPayout bonus terminationPayout");

module.exports = {
	findEmployeeBenefitInfo,
	calculateTimesheetApprovedHours,
	findEmployeePayStub,
	findEmpPayStubDetail,
};
