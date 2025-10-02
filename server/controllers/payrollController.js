const moment = require("moment");

const Group = require("../models/Group");
const Timesheet = require("../models/Timesheet");

const { PAYRUN_TYPE, TIMESHEET_STATUS, PAY_TYPES_TITLE } = require("../services/data");
const { fetchActiveEmployees } = require("./userController");
const { getHourlyAggregatedResult } = require("./payrunHourlyAllocatedCalc");
const { getPayrunEEContributionResult } = require("./payrunEEContrCalc");
const { getPayrunERContributionResult } = require("./payrunERContrCalc");
const { getSumRegHrs } = require("../services/payrollService");
const { checkExtraRun } = require("../services/util");

//update roles-

// const groups1 = await Employee.find({}).select("role");

// console.log(groups1);
// const updatedData = { name: "Employee" };
// const updatedRoles = await EmployeeRole.updateMany(
// 	{
// 		name: {
// 			$in: ["Sales Associate"],
// 		},
// 	},
// 	{ $set: updatedData },
// );
// console.log(updatedRoles);

const getAllPayGroups = async (req, res) => {
	const { companyName } = req.params;
	try {
		const groups = await Group.find({
			companyName,
			payrollActivated: true,
		}).select("scheduleSettings yearSchedules name scheduleFrequency");
		return res.status(200).json(groups);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getGroupedTimesheet = async (req, res) => {
	const {
		companyName,
		startDate,
		endDate,
		payDate,
		isExtraRun,
		groupId,
		payrunType,
		deptName,
		selectedPayGroupOption,
	} = req.body;

	try {
		const isExtraPayRun = checkExtraRun(isExtraRun);

		const activeEmployees = await fetchActiveEmployees(
			isExtraPayRun,
			groupId,
			payDate,
			companyName,
			deptName,
			selectedPayGroupOption,
		);

		const currentPeriodEmployees = isExtraPayRun
			? null
			: await calculateTimesheetApprovedHours(startDate, endDate, companyName);

		const isSuperficial = payrunType === PAYRUN_TYPE.SUPERFICIAL;
		const isManual = payrunType === PAYRUN_TYPE.MANUAL;
		const isPayout = payrunType === PAYRUN_TYPE.PAYOUT;

		const aggregatedResult = await getHourlyAggregatedResult(
			activeEmployees,
			currentPeriodEmployees,
			companyName,
			payDate,
			isSuperficial,
			isManual,
			isPayout,
			isExtraPayRun,
		);
		return res.status(200).json(aggregatedResult);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const calculateTimesheetApprovedHours = async (startDate, endDate, companyName) => {
	const timesheets = await Timesheet.find({
		deleted: false,
		companyName,
		clockIn: {
			$gte: moment(startDate).utc().startOf("day").toDate(),
			$lte: moment(endDate).utc().endOf("day").toDate(),
		},
		approveStatus: TIMESHEET_STATUS.APPROVED,
	}).populate({
		path: "employeeId",
		model: "Employee",
		select: ["companyId", "employeeId", "fullName", "payrollStatus"],
	});
	const aggregatedHours = timesheets
		.sort((a, b) => a.clockIn - b.clockIn)
		.reduce((acc, timesheet) => {
			if (!acc[timesheet.employeeId]) {
				acc[timesheet.employeeId] = {
					_id: timesheet._id,
					empId: timesheet.employeeId,
					totalRegHoursWorked: 0,
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
			// timesheet.regHoursWorked = timesheet.regHoursWorked.toFixed(2);
			if (timesheet.payType === PAY_TYPES_TITLE.REG_PAY)
				acc[timesheet.employeeId].totalRegHoursWorked +=
					getSumRegHrs(timesheet.regHoursWorked, timesheet.regHoursWorked2) || 0;

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

	const result = Object.values(aggregatedHours);
	return result;
};

const getEEContribution = async (req, res) => {
	const {
		companyName,
		startDate,
		endDate,
		payDate,
		isExtraRun,
		groupId,
		payrunType,
		deptName,
		selectedPayGroupOption,
	} = req.body;

	try {
		const isExtraPayRun = checkExtraRun(isExtraRun);

		const activeEmployees = await fetchActiveEmployees(
			isExtraPayRun,
			groupId,
			payDate,
			companyName,
			deptName,
			selectedPayGroupOption,
		);

		const currentPeriodEmployees = isExtraPayRun
			? null
			: await calculateTimesheetApprovedHours(startDate, endDate, companyName);

		const isSuperficial = payrunType === PAYRUN_TYPE.SUPERFICIAL;
		const isManual = payrunType === PAYRUN_TYPE.MANUAL;
		const isPayout = payrunType === PAYRUN_TYPE.PAYOUT;

		const aggregatedResult = await getPayrunEEContributionResult(
			activeEmployees,
			currentPeriodEmployees,
			companyName,
			payDate,
			isSuperficial,
			isManual,
			isPayout,
		);

		return res.status(200).json(aggregatedResult);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getERContribution = async (req, res) => {
	const {
		companyName,
		startDate,
		endDate,
		payDate,
		isExtraRun,
		groupId,
		payrunType,
		deptName,
		selectedPayGroupOption,
	} = req.body;

	try {
		const isExtraPayRun = checkExtraRun(isExtraRun);

		const activeEmployees = await fetchActiveEmployees(
			isExtraPayRun,
			groupId,
			payDate,
			companyName,
			deptName,
			selectedPayGroupOption,
		);

		const currentPeriodEmployees = isExtraPayRun
			? null
			: await calculateTimesheetApprovedHours(startDate, endDate, companyName);

		const isSuperficial = payrunType === PAYRUN_TYPE.SUPERFICIAL;
		const isManual = payrunType === PAYRUN_TYPE.MANUAL;
		const isPayout = payrunType === PAYRUN_TYPE.PAYOUT;

		const aggregatedResult = await getPayrunERContributionResult(
			activeEmployees,
			currentPeriodEmployees,
			companyName,
			payDate,
			isSuperficial,
			isManual,
			isPayout,
		);

		return res.status(200).json(aggregatedResult);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

// const findEmployeePayInfo = async (empId, companyName) =>
// 	await EmployeePayInfo.findOne({
// 		empId,
// 		companyName,
// 	});

// const updatePayInfo = async (id, data) =>
// 	await EmployeePayInfo.findByIdAndUpdate(id,  $set:{data}, {
// 		new: true,
// 	});
// const addPayGroup = async (req, res) => {
// 	const {
// 		empId,
// 		companyName,
// 		regPay,
// 		overTimePay,
// 		dblOverTimePay,
// 		statWorkPay,
// 		statPay,
// 		sickPay,
// 		salaryRate,
// 		dailyHours,
// 		longTermDisabilityEE,
// 		longTermDisabilityER,
// 		dentalEE,
// 		dentalER,
// 		extendedHealthEE,
// 		extendedHealthER,
// 		unionDues,
// 		vacationPay,
// 	} = req.body;
// 	try {
// 		const existingPayInfo = await findEmployeePayInfoDetails(empId, companyName);
// 		if (existingPayInfo) {
// 		if (req.body?._id) delete req.body._id;
// 			const updatedPayInfo = await updatePayInfo(existingPayInfo._id, req.body);
// 			return res.status(201).json(updatedPayInfo);
// 		}
// 		const newPayInfo = await EmployeePayInfo.create({
// 			empId,
// 			companyName,
// 			regPay,
// 			overTimePay,
// 			dblOverTimePay,
// 			statWorkPay,
// 			statPay,
// 			sickPay,
// 			salaryRate,
// 			dailyHours,
// 			longTermDisabilityEE,
// 			longTermDisabilityER,
// 			dentalEE,
// 			dentalER,
// 			extendedHealthEE,
// 			extendedHealthER,
// 			unionDues,
// 			vacationPay,
// 		});
// 		return res.status(201).json(newPayInfo);
// 	} catch (error) {
// 		return res.status(500).json({ message: "Internal Server Error", error });
// 	}
// };
const getPayGroup = () => {};
const addPayGroup = () => {};
const updatePayGroup = () => {};

module.exports = {
	getAllPayGroups,
	getPayGroup,
	addPayGroup,
	updatePayGroup,
	getGroupedTimesheet,
	getEEContribution,
	getERContribution,
	getSumRegHrs,
};
