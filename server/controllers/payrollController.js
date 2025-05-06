const moment = require("moment");
const EmployeeAlertsViolationInfo = require("../models/EmployeeAlertsViolationInfo");
const EmployeeBankingInfo = require("../models/EmployeeBankingInfo");
const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");
const Group = require("../models/Group");

const { PAYRUN_TYPE, TIMESHEET_STATUS, PAY_TYPES_TITLE } = require("../services/data");
const { fetchActiveEmployees } = require("./userController");
const Timesheet = require("../models/Timesheet");
const { getHourlyAggregatedResult } = require("./payrunHourlyAllocatedCalc");
const { getPayrunEEContributionResult } = require("./payrunEEContrCalc");
const { getPayrunERContributionResult } = require("./payrunERContrCalc");
const { getSumRegHrs } = require("../services/payrollService");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const EmployeePayInfo = require("../models/EmployeePayInfo");

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
		res.status(200).json(groups);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getGroupedTimesheet = async (req, res) => {
	const { companyName, startDate, endDate, payDate, isExtraRun, groupId, payrunType, deptName } =
		req.params;

	try {
		const isExtraPayRun = isExtraRun === "true";

		const activeEmployees = await fetchActiveEmployees(
			isExtraPayRun,
			groupId,
			payDate,
			companyName,
			deptName,
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
		res.status(200).json(aggregatedResult);
	} catch (error) {
		res.status(404).json({ error: error.message });
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

			return acc;
		}, {});

	const result = Object.values(aggregatedHours);
	return result;
};

const getEEContribution = async (req, res) => {
	const { companyName, startDate, endDate, payDate, isExtraRun, groupId, payrunType, deptName } =
		req.params;

	try {
		const isExtraPayRun = isExtraRun === "true";

		const activeEmployees = await fetchActiveEmployees(
			isExtraPayRun,
			groupId,
			payDate,
			companyName,
			deptName,
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

		res.status(200).json(aggregatedResult);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getERContribution = async (req, res) => {
	const { companyName, startDate, endDate, payDate, isExtraRun, groupId, payrunType, deptName } =
		req.params;

	try {
		const isExtraPayRun = isExtraRun === "true";

		const activeEmployees = await fetchActiveEmployees(
			isExtraPayRun,
			groupId,
			payDate,
			companyName,
			deptName,
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

		res.status(200).json(aggregatedResult);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const EMP_INFO = {
	path: "empId",
	model: "Employee",
	select: ["companyId", "employeeId", "fullName", "primaryAddress", "employeeNo"],
};

const getTotalAlertsAndViolationsInfo = async (req, res) => {
	const { companyName, payPeriodNum } = req.params;

	try {
		const alerts = await EmployeeAlertsViolationInfo.countDocuments({
			companyName,
			// payPeriodNum,
		});
		res.status(200).json(alerts);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getAlertsAndViolationsInfo = async (req, res) => {
	const { companyName, payPeriodNum } = req.params;

	try {
		const payrollActiveEmps = await EmployeeEmploymentInfo.find({
			payrollStatus: "Payroll Active",
			companyName,
		}).select("empId");
		const payrollActiveIds = payrollActiveEmps.map((emp) => emp.empId);

		const alerts = await EmployeeAlertsViolationInfo.find({
			companyName,
			// payPeriodNum,
			empId: { $in: payrollActiveIds },
		})
			.populate(EMP_INFO)
			.sort({
				createdOn: -1,
			});
		res.status(200).json(alerts);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

// const findEmployeePayInfo = async (empId, companyName) =>
// 	await EmployeePayInfo.findOne({
// 		empId,
// 		companyName,
// 	});

// const updatePayInfo = async (id, data) =>
// 	await EmployeePayInfo.findByIdAndUpdate(id, data, {
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
// 		res.status(400).json({ message: error.message });
// 	}
// };
const getPayGroup = () => {};
const addPayGroup = () => {};
const updatePayGroup = () => {};

const findAlertInfo = async (record) => await EmployeeAlertsViolationInfo.findOne(record);

const addAlertInfo = async (record) => await EmployeeAlertsViolationInfo.create(record);

const addAlertsAndViolations = async (req, res) => {
	const { companyName, inputsReviewData } = req.body;

	try {
		for (const data of inputsReviewData) {
			const empBankResult = await EmployeeBankingInfo.findOne({
				companyName,
				empId: data?.empId?._id,
			}).select("empId bankNum transitNum accountNum");

			const empSINResult = await EmployeeProfileInfo.findOne({
				companyName,
				empId: data?.empId?._id,
			}).select("empId SIN");

			const empPayRate = await EmployeePayInfo.findOne({
				companyName,
				empId: data?.empId?._id,
			}).select("empId roles");

			const missingBankInfo =
				!empBankResult ||
				!empBankResult.bankNum ||
				!empBankResult.transitNum ||
				!empBankResult.accountNum ||
				empBankResult.bankNum === "" ||
				empBankResult.transitNum === "" ||
				empBankResult.accountNum === "";
			if (missingBankInfo) {
				const alertInfo = {
					empId: data?.empId?._id,
					companyName,
					description: "Banking information missing",
					actionRequired: true,
				};
				const bankingInfoAlertExists = await findAlertInfo(alertInfo);
				if (!bankingInfoAlertExists) {
					alertInfo.payPeriodNum = data?.payPeriodNum;
					await addAlertInfo(alertInfo);
				}
			}

			const belowMinimumWage =
				!empPayRate?.roles?.length ||
				empPayRate?.roles?.find((_) => parseFloat(_?.payRate) < 17.85);
			if (belowMinimumWage) {
				const alertInfo = {
					empId: data?.empId?._id,
					companyName,
					description: "Minimum wage is below $17.85.",
					actionRequired: true,
				};
				const wageAlertExists = await findAlertInfo(alertInfo);
				if (!wageAlertExists) {
					alertInfo.payPeriodNum = data?.payPeriodNum;
					await addAlertInfo(alertInfo);
				}
			}

			const missingSINInfo = !empSINResult || !empSINResult.SIN || empSINResult.SIN === "";
			if (missingSINInfo) {
				const alertInfo = {
					empId: data?.empId?._id,
					companyName,
					actionRequired: false,
					description: "SIN missing",
				};
				const SINViolationExists = await findAlertInfo(alertInfo);
				if (!SINViolationExists) {
					alertInfo.payPeriodNum = data?.payPeriodNum;
					await addAlertInfo(alertInfo);
				}
			}
		}
		res.status(200).json({ message: "Alerts processed successfully" });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const deleteAlerts = async (empId) => {
	const existingAlert = await findAlertInfo({
		empId,
	});
	if (existingAlert) {
		const deleted = await EmployeeAlertsViolationInfo.findByIdAndDelete({
			_id: existingAlert._id,
		});
		if (deleted) {
			console.log(`Alert  with id ${existingAlert._id} deleted successfully.`);
		} else {
			console.log("Alert Details not found.");
		}
	}
};

module.exports = {
	getAllPayGroups,
	getPayGroup,
	addPayGroup,
	updatePayGroup,
	getGroupedTimesheet,
	addAlertsAndViolations,
	getAlertsAndViolationsInfo,
	deleteAlerts,
	getEEContribution,
	getERContribution,
	getTotalAlertsAndViolationsInfo,
	getSumRegHrs,
};
