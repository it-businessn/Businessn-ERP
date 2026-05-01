const moment = require("moment");
const Timesheet = require("../models/Timesheet");
const EmployeeBalanceInfo = require("../models/EmployeeBalanceInfo");
const EmployeePayStub = require("../models/EmployeePayStub");
const { TIMESHEET_STATUS } = require("../constants/timesheet.constants");
const { PAY_TYPES_TITLE } = require("../constants/pay.constants");
const { getSumRegHrs, safeNum } = require("../utils/time.util");

const findEmployeeBenefitInfo = async (empId, companyName) =>
	await EmployeeBalanceInfo.findOne({
		empId,
		companyName,
	});

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

const calculateTimesheetApprovedHours = async (startDate, endDate, companyName) => {
	try {
		const timesheets = await Timesheet.find({
			deleted: false,
			companyName,
			clockIn: {
				$gte: moment(startDate).utc().startOf("day").toDate(),
				$lte: moment(endDate).utc().endOf("day").toDate(),
			},
			approveStatus: TIMESHEET_STATUS.APPROVED,
		})
			.sort({ clockIn: -1 })
			.populate({
				path: "employeeId",
				model: "Employee",
				select: ["companyId", "employeeId", "fullName", "payrollStatus"],
			});

		if (!Array.isArray(timesheets) || timesheets.length === 0) {
			return [];
		}

		const summary = timesheets.reduce((acc, timesheet) => {
			try {
				const empKey = timesheet.employeeId?.toString();
				if (!empKey) return acc;

				if (!acc[empKey]) {
					acc[empKey] = {
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

				switch (timesheet.payType) {
					case PAY_TYPES_TITLE.REG_PAY:
						acc[empKey].totalRegHoursWorked +=
							getSumRegHrs(timesheet.regHoursWorked, timesheet.regHoursWorked2) || 0;
						break;
					// if (timesheet.payType === PAY_TYPES_TITLE.REG_PAY)
					// acc[timesheet.employeeId].totalRegHoursWorked2 += timesheet.regHoursWorked2);

					case PAY_TYPES_TITLE.OVERTIME_PAY:
						acc[empKey].totalOvertimeHoursWorked += safeNum(timesheet.overtimeHoursWorked);
						break;

					case PAY_TYPES_TITLE.DBL_OVERTIME_PAY:
						acc[empKey].totalDblOvertimeHoursWorked += safeNum(timesheet.dblOvertimeHoursWorked);
						break;

					case PAY_TYPES_TITLE.STAT_PAY:
						acc[empKey].totalStatHours += safeNum(timesheet.statDayHours);
						break;

					case PAY_TYPES_TITLE.STAT_WORK_PAY:
						acc[empKey].totalStatDayHoursWorked += safeNum(timesheet.statDayHoursWorked);
						break;

					case PAY_TYPES_TITLE.SICK_PAY:
						acc[empKey].totalSickHoursWorked += safeNum(timesheet.sickPayHours);
						break;

					case PAY_TYPES_TITLE.VACATION_PAY:
						acc[empKey].totalVacationHoursWorked += safeNum(timesheet.vacationPayHours);
						break;

					case PAY_TYPES_TITLE.BEREAVEMENT_PAY:
						acc[empKey].totalBereavementHoursWorked += safeNum(timesheet.bereavementPayHours);
						break;

					case PAY_TYPES_TITLE.PERSONAL_DAY_PAY:
						acc[empKey].totalPersonalDayHoursWorked += safeNum(timesheet.personalPayHours);
						break;
				}
				return acc;
			} catch (innerErr) {
				console.error("Error processing timesheet:", innerErr);
				return acc;
			}
		}, {});

		return Object.values(summary);
	} catch (err) {
		console.error("Error calculating approved hours:", err);
		throw new Error("Failed to calculate timesheet approved hours");
	}
};

module.exports = {
	findEmployeeBenefitInfo,
	calculateTimesheetApprovedHours,
	findEmployeePayStub,
	findEmpPayStubDetail,
};
