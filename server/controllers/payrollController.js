const moment = require("moment");

const Group = require("../models/Group");
const Timesheet = require("../models/Timesheet");

const { fetchActiveEmployees } = require("./userController");
const { getHourlyAggregatedResult } = require("./payrunHourlyAllocatedCalc");
const { getPayrunEEContributionResult } = require("./payrunEEContrCalc");
const { getPayrunERContributionResult } = require("./payrunERContrCalc");

const { getSumRegHrs } = require("../utils/time.util");
const { checkExtraRun } = require("../helpers/payrollHelper");
const { PAY_TYPES_TITLE, PAYRUN_TYPE } = require("../constants/pay.constants");
const { TIMESHEET_STATUS } = require("../constants/timesheet.constants");

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
		console.error("❌ getAllPayGroups ERROR", {
			message: error.message,
			stack: error.stack,
		});

		return res.status(500).json({
			message: "Internal Server Error",
		});
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
		if (!companyName || !payrunType) {
			return res.status(400).json({
				message: "Missing required fields",
			});
		}
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

		// console.log("[GroupedTimesheet Debug]", {
		// 	companyName,
		// 	activeEmployeesCount: activeEmployees?.length,
		// 	payrunType,
		// 	isExtraPayRun,
		// });
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
		console.error("❌ getGroupedTimesheet error:", {
			message: error.message,
			stack: error.stack,
			body: req.body,
		});

		return res.status(500).json({
			message: "Internal server error",
		});
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
			const reg = Number(timesheet.regHoursWorked) || 0;
			const reg2 = Number(timesheet.regHoursWorked2) || 0;
			const empKey = timesheet.employeeId;

			// timesheet.regHoursWorked = timesheet.regHoursWorked.toFixed(2);
			if (timesheet.payType === PAY_TYPES_TITLE.REG_PAY) {
				acc[empKey].totalRegHoursWorked += getSumRegHrs(reg, reg2) || 0;
			}

			if (timesheet.payType === PAY_TYPES_TITLE.OVERTIME_PAY) {
				acc[empKey].totalOvertimeHoursWorked += Number(timesheet.overtimeHoursWorked) || 0;
			}

			if (timesheet.payType === PAY_TYPES_TITLE.DBL_OVERTIME_PAY) {
				acc[empKey].totalDblOvertimeHoursWorked += Number(timesheet.dblOvertimeHoursWorked) || 0;
			}

			if (timesheet.payType === PAY_TYPES_TITLE.STAT_PAY) {
				acc[empKey].totalStatHours += Number(timesheet.statDayHours) || 0;
			}

			if (timesheet.payType === PAY_TYPES_TITLE.STAT_WORK_PAY) {
				acc[empKey].totalStatDayHoursWorked += Number(timesheet.statDayHoursWorked) || 0;
			}

			if (timesheet.payType === PAY_TYPES_TITLE.SICK_PAY) {
				acc[empKey].totalSickHoursWorked += Number(timesheet.sickPayHours) || 0;
			}

			if (timesheet.payType === PAY_TYPES_TITLE.VACATION_PAY) {
				acc[empKey].totalVacationHoursWorked += Number(timesheet.vacationPayHours) || 0;
			}

			if (timesheet.payType === PAY_TYPES_TITLE.BEREAVEMENT_PAY) {
				acc[empKey].totalBereavementHoursWorked += Number(timesheet.bereavementPayHours) || 0;
			}

			if (timesheet.payType === PAY_TYPES_TITLE.PERSONAL_DAY_PAY) {
				acc[empKey].totalPersonalDayHoursWorked += Number(timesheet.personalPayHours) || 0;
			}

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
		if (!companyName || !payrunType) {
			return res.status(400).json({
				message: "Missing required fields",
			});
		}

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

		// console.log("[EE Contribution Debug]", {
		// 	companyName,
		// 	activeEmployees: activeEmployees?.length,
		// 	hasTimesheetData: !!currentPeriodEmployees,
		// 	isExtraPayRun,
		// });

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
		console.error("❌ getEEContribution error:", {
			message: error.message,
			stack: error.stack,
			body: req.body,
		});

		return res.status(500).json({
			message: "Internal server error",
		});
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
		if (!companyName || !payrunType) {
			return res.status(400).json({
				message: "Missing required fields",
			});
		}

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

		// console.log("[ER Contribution Debug]", {
		// 	companyName,
		// 	activeEmployeesCount: activeEmployees?.length,
		// 	hasTimesheets: !!currentPeriodEmployees,
		// 	isExtraPayRun,
		// });

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
		console.error("❌ getERContribution error:", {
			message: error.message,
			stack: error.stack,
			body: req.body,
		});

		return res.status(500).json({
			message: "Internal server error",
		});
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
// try {
// 	const { empId, companyName, _id, ...updateData } = req.body || {};

// 	if (!empId || !companyName) {
// 		return res.status(400).json({
// 			message: "empId and companyName are required",
// 		});
// 	}

// 	const existingPayInfo = await findEmployeePayInfoDetails(empId, companyName);

// 	if (existingPayInfo) {
// 		const updatedPayInfo = await updatePayInfo(existingPayInfo._id, updateData);

// 		return res.status(200).json(updatedPayInfo);
// 	}

// 	const newPayInfo = await EmployeePayInfo.create({
// 		empId,
// 		companyName,
// 		...updateData,
// 	});

// 	return res.status(201).json(newPayInfo);
// } catch (error) {
// 	console.error("❌ addPayGroup error:", {
// 		message: error.message,
// 		stack: error.stack,
// 		body: req.body,
// 	});

// 	return res.status(500).json({
// 		message: "Internal server error",
// 	});
// }
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
