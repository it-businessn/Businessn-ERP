const moment = require("moment");
const EmployeeAlertsViolationInfo = require("../models/EmployeeAlertsViolationInfo");
const EmployeeBankingInfo = require("../models/EmployeeBankingInfo");
const EmployeePayInfo = require("../models/EmployeePayInfo");
const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");
const Group = require("../models/Group");
const {
	findAdditionalHoursAllocatedInfo,
	findAdditionalSuperficialHoursAllocatedInfo,
	findAdditionalManualHoursAllocatedInfo,
	findAdditionalPayoutHoursAllocatedInfo,
} = require("./additionalAllocationInfoController");

const { PAYRUN_TYPE, TIMESHEET_STATUS, PAY_TYPES_TITLE } = require("../services/data");
const { fetchActiveEmployees } = require("./userController");
const Timesheet = require("../models/Timesheet");
const {
	getCurrentTotals,
	findEmployeeBenefitInfo,
	findEmployeePayInfoDetails,
	getContributionsDeductions,
} = require("./payrollCalc");

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
		}).select("scheduleSettings yearSchedules name");
		res.status(200).json(groups);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getGroupedTimesheet = async (req, res) => {
	const { companyName, startDate, endDate, payDate, isExtraRun, groupId, payrunType } = req.params;

	try {
		const isExtraPayRun = isExtraRun === "true";

		const activeEmployees = await fetchActiveEmployees(
			isExtraPayRun,
			groupId,
			payDate,
			companyName,
		);

		const currentPeriodEmployees = isExtraPayRun
			? null
			: await calculateTotalAggregatedHours(startDate, endDate, companyName);

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
		);
		res.status(200).json(aggregatedResult);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getHourlyAggregatedResult = async (
	activeEmployees,
	currentPeriodEmployees,
	companyName,
	payDate,
	isSuperficial,
	isManual,
	isPayout,
) => {
	const aggregatedResult = [];
	for (const employee of activeEmployees) {
		const empTimesheetData = currentPeriodEmployees?.find(
			(el) => el.empId._id.toString() === employee._id.toString(),
		);
		const result = await buildEmpHourlyDetails(empTimesheetData ?? null, employee, companyName);
		if (isSuperficial) {
			const additionalHoursAllocatedInfo = await findAdditionalSuperficialHoursAllocatedInfo({
				empId: employee._id,
				companyName,
				payPeriodPayDate: payDate,
			});

			result.additionalSuperficialRegHoursWorked =
				additionalHoursAllocatedInfo?.additionalSuperficialRegHoursWorked ?? 0;
			result.additionalSuperficialOvertimeHoursWorked =
				additionalHoursAllocatedInfo?.additionalSuperficialOvertimeHoursWorked || 0;
			result.additionalSuperficialDblOvertimeHoursWorked =
				additionalHoursAllocatedInfo?.additionalSuperficialDblOvertimeHoursWorked || 0;
			result.additionalSuperficialStatHoursWorked =
				additionalHoursAllocatedInfo?.additionalSuperficialStatHoursWorked || 0;
			result.additionalSuperficialStatDayHoursWorked =
				additionalHoursAllocatedInfo?.additionalSuperficialStatDayHoursWorked || 0;
			result.additionalSuperficialSickHoursWorked =
				additionalHoursAllocatedInfo?.additionalSuperficialSickHoursWorked || 0;
			result.additionalSuperficialVacationHoursWorked =
				additionalHoursAllocatedInfo?.additionalSuperficialVacationHoursWorked || 0;

			const {
				totalDblOvertimeHoursWorked,
				totalOvertimeHoursWorked,
				totalRegHoursWorked,
				totalSickHoursWorked,
				totalStatDayHoursWorked,
				totalStatHours,
				totalVacationHoursWorked,
				additionalSuperficialRegHoursWorked,
				additionalSuperficialOvertimeHoursWorked,
				additionalSuperficialDblOvertimeHoursWorked,
				additionalSuperficialStatHoursWorked,
				additionalSuperficialStatDayHoursWorked,
				additionalSuperficialSickHoursWorked,
				additionalSuperficialVacationHoursWorked,
			} = result;

			result.totalSuperficialHoursWorked =
				totalDblOvertimeHoursWorked +
				totalOvertimeHoursWorked +
				totalRegHoursWorked +
				totalSickHoursWorked +
				totalStatDayHoursWorked +
				totalStatHours +
				totalVacationHoursWorked +
				additionalSuperficialRegHoursWorked +
				additionalSuperficialOvertimeHoursWorked +
				additionalSuperficialDblOvertimeHoursWorked +
				additionalSuperficialStatHoursWorked +
				additionalSuperficialStatDayHoursWorked +
				additionalSuperficialSickHoursWorked +
				additionalSuperficialVacationHoursWorked;
			aggregatedResult.push(result);
		} else if (isManual) {
			const additionalHoursAllocatedInfo = await findAdditionalManualHoursAllocatedInfo({
				empId: employee._id,
				companyName,
				payPeriodPayDate: payDate,
			});

			result.additionalManualRegHoursWorked =
				additionalHoursAllocatedInfo?.additionalManualRegHoursWorked ?? 0;
			result.additionalManualOvertimeHoursWorked =
				additionalHoursAllocatedInfo?.additionalManualOvertimeHoursWorked || 0;
			result.additionalManualDblOvertimeHoursWorked =
				additionalHoursAllocatedInfo?.additionalManualDblOvertimeHoursWorked || 0;
			result.additionalManualStatHoursWorked =
				additionalHoursAllocatedInfo?.additionalManualStatHoursWorked || 0;
			result.additionalManualStatDayHoursWorked =
				additionalHoursAllocatedInfo?.additionalManualStatDayHoursWorked || 0;
			result.additionalManualSickHoursWorked =
				additionalHoursAllocatedInfo?.additionalManualSickHoursWorked || 0;
			result.additionalManualVacationHoursWorked =
				additionalHoursAllocatedInfo?.additionalManualVacationHoursWorked || 0;

			const {
				totalDblOvertimeHoursWorked,
				totalOvertimeHoursWorked,
				totalRegHoursWorked,
				totalSickHoursWorked,
				totalStatDayHoursWorked,
				totalStatHours,
				totalVacationHoursWorked,
				additionalManualRegHoursWorked,
				additionalManualOvertimeHoursWorked,
				additionalManualDblOvertimeHoursWorked,
				additionalManualStatHoursWorked,
				additionalManualStatDayHoursWorked,
				additionalManualSickHoursWorked,
				additionalManualVacationHoursWorked,
			} = result;

			result.totalManualHoursWorked =
				totalDblOvertimeHoursWorked +
				totalOvertimeHoursWorked +
				totalRegHoursWorked +
				totalSickHoursWorked +
				totalStatDayHoursWorked +
				totalStatHours +
				totalVacationHoursWorked +
				additionalManualRegHoursWorked +
				additionalManualOvertimeHoursWorked +
				additionalManualDblOvertimeHoursWorked +
				additionalManualStatHoursWorked +
				additionalManualStatDayHoursWorked +
				additionalManualSickHoursWorked +
				additionalManualVacationHoursWorked;
			aggregatedResult.push(result);
		} else if (isPayout) {
			const additionalHoursAllocatedInfo = await findAdditionalPayoutHoursAllocatedInfo({
				empId: employee._id,
				companyName,
				payPeriodPayDate: payDate,
			});

			result.additionalPayoutRegHoursWorked =
				additionalHoursAllocatedInfo?.additionalPayoutRegHoursWorked ?? 0;
			result.additionalPayoutOvertimeHoursWorked =
				additionalHoursAllocatedInfo?.additionalPayoutOvertimeHoursWorked || 0;
			result.additionalPayoutDblOvertimeHoursWorked =
				additionalHoursAllocatedInfo?.additionalPayoutDblOvertimeHoursWorked || 0;
			result.additionalPayoutStatHoursWorked =
				additionalHoursAllocatedInfo?.additionalPayoutStatHoursWorked || 0;
			result.additionalPayoutStatDayHoursWorked =
				additionalHoursAllocatedInfo?.additionalPayoutStatDayHoursWorked || 0;
			result.additionalPayoutSickHoursWorked =
				additionalHoursAllocatedInfo?.additionalPayoutSickHoursWorked || 0;
			result.additionalPayoutVacationHoursWorked =
				additionalHoursAllocatedInfo?.additionalPayoutVacationHoursWorked || 0;

			const {
				totalDblOvertimeHoursWorked,
				totalOvertimeHoursWorked,
				totalRegHoursWorked,
				totalSickHoursWorked,
				totalStatDayHoursWorked,
				totalStatHours,
				totalVacationHoursWorked,
				additionalPayoutRegHoursWorked,
				additionalPayoutOvertimeHoursWorked,
				additionalPayoutDblOvertimeHoursWorked,
				additionalPayoutStatHoursWorked,
				additionalPayoutStatDayHoursWorked,
				additionalPayoutSickHoursWorked,
				additionalPayoutVacationHoursWorked,
			} = result;

			result.totalPayoutHoursWorked =
				totalDblOvertimeHoursWorked +
				totalOvertimeHoursWorked +
				totalRegHoursWorked +
				totalSickHoursWorked +
				totalStatDayHoursWorked +
				totalStatHours +
				totalVacationHoursWorked +
				additionalPayoutRegHoursWorked +
				additionalPayoutOvertimeHoursWorked +
				additionalPayoutDblOvertimeHoursWorked +
				additionalPayoutStatHoursWorked +
				additionalPayoutStatDayHoursWorked +
				additionalPayoutSickHoursWorked +
				additionalPayoutVacationHoursWorked;
			aggregatedResult.push(result);
		} else {
			const additionalHoursAllocatedInfo = await findAdditionalHoursAllocatedInfo({
				empId: employee._id,
				companyName,
				payPeriodPayDate: payDate,
			});

			result.additionalRegHoursWorked = additionalHoursAllocatedInfo?.additionalRegHoursWorked ?? 0;
			result.additionalOvertimeHoursWorked =
				additionalHoursAllocatedInfo?.additionalOvertimeHoursWorked || 0;
			result.additionalDblOvertimeHoursWorked =
				additionalHoursAllocatedInfo?.additionalDblOvertimeHoursWorked || 0;
			result.additionalStatHoursWorked =
				additionalHoursAllocatedInfo?.additionalStatHoursWorked || 0;
			result.additionalStatDayHoursWorked =
				additionalHoursAllocatedInfo?.additionalStatDayHoursWorked || 0;
			result.additionalSickHoursWorked =
				additionalHoursAllocatedInfo?.additionalSickHoursWorked || 0;
			result.additionalVacationHoursWorked =
				additionalHoursAllocatedInfo?.additionalVacationHoursWorked || 0;

			const {
				totalDblOvertimeHoursWorked,
				totalOvertimeHoursWorked,
				totalRegHoursWorked,
				totalSickHoursWorked,
				totalStatDayHoursWorked,
				totalStatHours,
				totalVacationHoursWorked,
				additionalRegHoursWorked,
				additionalOvertimeHoursWorked,
				additionalDblOvertimeHoursWorked,
				additionalStatHoursWorked,
				additionalStatDayHoursWorked,
				additionalSickHoursWorked,
				additionalVacationHoursWorked,
			} = result;

			result.totalHoursWorked =
				totalDblOvertimeHoursWorked +
				totalOvertimeHoursWorked +
				totalRegHoursWorked +
				totalSickHoursWorked +
				totalStatDayHoursWorked +
				totalStatHours +
				totalVacationHoursWorked +
				additionalRegHoursWorked +
				additionalOvertimeHoursWorked +
				additionalDblOvertimeHoursWorked +
				additionalStatHoursWorked +
				additionalStatDayHoursWorked +
				additionalSickHoursWorked +
				additionalVacationHoursWorked;
			aggregatedResult.push(result);
		}
	}
	return aggregatedResult;
};

const basicInfo = async (currentPeriodEmployees, empId, payPeriodPayDate, companyName) => {
	const empAdditionalHoursAllocated = await findAdditionalHoursAllocatedInfo({
		empId,
		payPeriodPayDate,
	});

	const empPayInfoResult = await findEmployeePayInfoDetails(empId, companyName);
	const empTimesheetData = currentPeriodEmployees?.find(
		(el) => el.empId._id.toString() === empId.toString(),
	);
	return { empAdditionalHoursAllocated, empPayInfoResult, empTimesheetData };
};

const getEEContribution = async (req, res) => {
	const { companyName, startDate, endDate, payDate, isExtraRun, groupId } = req.params;

	try {
		const isExtraPayRun = isExtraRun === "true";

		const activeEmployees = await fetchActiveEmployees(
			isExtraPayRun,
			groupId,
			payDate,
			companyName,
		);

		const currentPeriodEmployees = isExtraPayRun
			? null
			: await calculateTotalAggregatedHours(startDate, endDate, companyName);

		const aggregatedResult = [];

		for (const employee of activeEmployees) {
			const { empTimesheetData, empPayInfoResult, empAdditionalHoursAllocated } = await basicInfo(
				currentPeriodEmployees,
				employee._id,
				payDate,
				companyName,
			);
			const empBenefitInfoResult = await findEmployeeBenefitInfo(employee._id, companyName);

			const result = buildEmpEEDetails(
				empTimesheetData ?? null,
				empPayInfoResult,
				empAdditionalHoursAllocated,
				employee,
				empBenefitInfoResult,
			);
			aggregatedResult.push(result);
		}
		res.status(200).json(aggregatedResult);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const calculateTotalAggregatedHours = async (startDate, endDate, companyName) => {
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

			if (timesheet.payType === PAY_TYPES_TITLE.REG_PAY)
				acc[timesheet.employeeId].totalRegHoursWorked += timesheet.regHoursWorked || 0;

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

const getERContribution = async (req, res) => {
	const { companyName, startDate, endDate, payDate, isExtraRun, groupId } = req.params;

	try {
		const isExtraPayRun = isExtraRun === "true";
		const activeEmployees = await fetchActiveEmployees(
			isExtraPayRun,
			groupId,
			payDate,
			companyName,
		);
		const currentPeriodEmployees = isExtraPayRun
			? null
			: await calculateTotalAggregatedHours(startDate, endDate, companyName);

		const aggregatedResult = [];

		for (const employee of activeEmployees) {
			const { empTimesheetData, empPayInfoResult, empAdditionalHoursAllocated } = await basicInfo(
				currentPeriodEmployees,
				employee._id,
				payDate,
				companyName,
			);
			const empBenefitInfoResult = await findEmployeeBenefitInfo(employee._id, companyName);

			const result = buildEmpERDetails(
				empTimesheetData ?? null,
				empPayInfoResult,
				empAdditionalHoursAllocated,
				employee,
				empBenefitInfoResult,
			);
			aggregatedResult.push(result);
		}
		res.status(200).json(aggregatedResult);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const buildEmpEEDetails = (
	empTimesheetData,
	empPayInfoResult,
	empAdditionalHoursAllocated,
	employee,
	empBenefitInfoResult,
) => {
	const data = ERData(empTimesheetData, empPayInfoResult, empAdditionalHoursAllocated);

	data.vacationPayPercent = parseFloat(empBenefitInfoResult?.vacationPayPercent) || 0;
	data.typeOfUnionDuesTreatment = empBenefitInfoResult?.typeOfUnionDuesTreatment;
	data.unionDuesContribution = parseFloat(empBenefitInfoResult?.unionDuesContribution) || 0;
	data.typeOfPensionEETreatment = empBenefitInfoResult?.typeOfPensionEETreatment;
	data.pensionEEContribution = parseFloat(empBenefitInfoResult?.pensionEEContribution) || 0;
	data.typeOfExtendedHealthEETreatment = empBenefitInfoResult?.typeOfExtendedHealthEETreatment;
	data.extendedHealthEEContribution =
		parseFloat(empBenefitInfoResult?.extendedHealthEEContribution) || 0;
	data.typeOfPensionERTreatment = empBenefitInfoResult?.typeOfPensionERTreatment;
	data.pensionERContribution = parseFloat(empBenefitInfoResult?.pensionERContribution) || 0;
	data.typeOfExtendedHealthERTreatment = empBenefitInfoResult?.typeOfExtendedHealthERTreatment;
	data.extendedHealthERContribution =
		parseFloat(empBenefitInfoResult?.extendedHealthERContribution) || 0;

	const { unionDues, EE_EPP, EE_EHP } = getContributionsDeductions(data);
	const { _id, fullName } = employee;
	return {
		_id,
		empId: { fullName, _id },
		unionDues,
		// CPP: CPPContribution,
		// EI: EIContribution,
		EPP: EE_EPP,
		EHP: EE_EHP,
	};
};

const ERData = (empTimesheetData, empPayInfoResult, empAdditionalHoursAllocated) => {
	const newEmpData = getCurrentTotals(
		empTimesheetData,
		empPayInfoResult,
		empAdditionalHoursAllocated,
	);

	const {
		totalRegHoursWorked,
		totalOvertimeHoursWorked,
		totalDblOvertimeHoursWorked,
		totalStatDayHoursWorked,
		totalStatHours,
		totalSickHoursWorked,
		totalVacationHoursWorked,
		regPay,
		overTimePay,
		dblOverTimePay,
		sickPay,
		statPay,
		statWorkPay,
		vacationPay,
	} = newEmpData;

	const data = {
		regPay,
		overTimePay,
		dblOverTimePay,
		statPay,
		statWorkPay,
		sickPay,
		vacationPay,
		totalRegHoursWorked,
		totalOvertimeHoursWorked,
		totalDblOvertimeHoursWorked,
		totalStatDayHoursWorked,
		totalStatHours,
		totalSickHoursWorked,
		totalVacationHoursWorked,
	};
	return data;
};

const buildEmpERDetails = (
	empTimesheetData,
	empPayInfoResult,
	empAdditionalHoursAllocated,
	employee,
	empBenefitInfoResult,
) => {
	const data = ERData(empTimesheetData, empPayInfoResult, empAdditionalHoursAllocated);
	data.vacationPayPercent = parseFloat(empBenefitInfoResult?.vacationPayPercent) || 0;
	data.typeOfUnionDuesTreatment = empBenefitInfoResult?.typeOfUnionDuesTreatment;
	data.unionDuesContribution = parseFloat(empBenefitInfoResult?.unionDuesContribution) || 0;
	data.typeOfPensionEETreatment = empBenefitInfoResult?.typeOfPensionEETreatment;
	data.pensionEEContribution = parseFloat(empBenefitInfoResult?.pensionEEContribution) || 0;
	data.typeOfExtendedHealthEETreatment = empBenefitInfoResult?.typeOfExtendedHealthEETreatment;
	data.extendedHealthEEContribution =
		parseFloat(empBenefitInfoResult?.extendedHealthEEContribution) || 0;
	data.typeOfPensionERTreatment = empBenefitInfoResult?.typeOfPensionERTreatment;
	data.pensionERContribution = parseFloat(empBenefitInfoResult?.pensionERContribution) || 0;
	data.typeOfExtendedHealthERTreatment = empBenefitInfoResult?.typeOfExtendedHealthERTreatment;
	data.extendedHealthERContribution =
		parseFloat(empBenefitInfoResult?.extendedHealthERContribution) || 0;

	const { ER_EPP, ER_EHP } = getContributionsDeductions(data);
	const { _id, fullName } = employee;

	return {
		_id,
		empId: { fullName, _id },
		EPP: ER_EPP,
		EHP: ER_EHP,
	};
};

const getGroupedData = async (empTimesheetData, employee, companyName) => {
	const empPayInfoResult = await EmployeePayInfo.findOne({
		empId: employee._id,
		companyName,
	}).select("empId typeOfEarning fullTimeStandardHours partTimeStandardHours");

	const isFT = empPayInfoResult?.typeOfEarning === "Full Time Salaried";
	const isPT = empPayInfoResult?.typeOfEarning === "Part Time Salaried";

	const employeeId = empTimesheetData ? empTimesheetData.empId.employeeId : employee.employeeId;

	const recordId = empTimesheetData ? empTimesheetData.empId._id : employee._id;
	const fullName = empTimesheetData ? empTimesheetData.empId.fullName : employee.fullName;

	const totalRegHoursWorked = isFT
		? empPayInfoResult?.fullTimeStandardHours
		: isPT
		? empPayInfoResult?.partTimeStandardHours
		: empTimesheetData
		? empTimesheetData.totalRegHoursWorked
		: 0;
	const totalOvertimeHoursWorked = empTimesheetData ? empTimesheetData.totalOvertimeHoursWorked : 0;
	const totalDblOvertimeHoursWorked = empTimesheetData
		? empTimesheetData.totalDblOvertimeHoursWorked
		: 0;
	const totalStatDayHoursWorked = empTimesheetData ? empTimesheetData.totalStatDayHoursWorked : 0;
	const totalStatHours = empTimesheetData ? empTimesheetData.totalStatHours : 0;
	const totalSickHoursWorked = empTimesheetData ? empTimesheetData.totalSickHoursWorked : 0;
	const totalVacationHoursWorked = empTimesheetData ? empTimesheetData.totalVacationHoursWorked : 0;
	return {
		employeeId,
		recordId,
		fullName,
		totalRegHoursWorked: parseFloat(totalRegHoursWorked || 0),
		totalOvertimeHoursWorked: parseFloat(totalOvertimeHoursWorked || 0),
		totalDblOvertimeHoursWorked: parseFloat(totalDblOvertimeHoursWorked || 0),
		totalStatDayHoursWorked: parseFloat(totalStatDayHoursWorked || 0),
		totalStatHours: parseFloat(totalStatHours || 0),
		totalSickHoursWorked: parseFloat(totalSickHoursWorked || 0),
		totalVacationHoursWorked: parseFloat(totalVacationHoursWorked || 0),
	};
};

const buildEmpHourlyDetails = async (empTimesheetData, employee, companyName) => {
	const {
		employeeId,
		recordId,
		fullName,
		totalRegHoursWorked,
		totalOvertimeHoursWorked,
		totalDblOvertimeHoursWorked,
		totalStatDayHoursWorked,
		totalStatHours,
		totalSickHoursWorked,
		totalVacationHoursWorked,
	} = await getGroupedData(empTimesheetData, employee, companyName);
	return {
		_id: employeeId,
		empId: { fullName, _id: recordId },
		totalRegHoursWorked,
		totalOvertimeHoursWorked,
		totalDblOvertimeHoursWorked,
		totalStatDayHoursWorked,
		totalStatHours,
		totalSickHoursWorked,
		totalVacationHoursWorked,
	};
};

const EMP_INFO = {
	path: "empId",
	model: "Employee",
	select: ["companyId", "employeeId", "fullName", "primaryAddress", "employeeNo"],
};

const getTotalAlertsAndViolationsInfo = async (req, res) => {
	const { companyName, payPeriodNum } = req.params;

	try {
		const payStubs = await EmployeeAlertsViolationInfo.countDocuments({
			companyName,
			payPeriodNum,
		});
		res.status(200).json(payStubs);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getAlertsAndViolationsInfo = async (req, res) => {
	const { companyName, payPeriodNum } = req.params;

	try {
		const payStubs = await EmployeeAlertsViolationInfo.find({
			companyName,
			payPeriodNum,
		})
			.populate(EMP_INFO)
			.sort({
				createdOn: -1,
			});
		res.status(200).json(payStubs);
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

const addAlertsAndViolations = async (req, res) => {
	const { companyName, inputsReviewData } = req.body;

	try {
		for (const data of inputsReviewData) {
			const empResult = await EmployeeBankingInfo.findOne({
				empId: data?.empId?._id,
			}).select("empId bankNum transitNum accountNum");

			const empSINResult = await EmployeeProfileInfo.findOne({
				empId: data?.empId?._id,
			}).select("empId SIN");
			if (
				!empResult ||
				empResult.bankNum === "" ||
				empResult.transitNum === "" ||
				empResult.accountNum === ""
			) {
				const alertsExists = await findAlertInfo({
					empId: data?.empId?._id,
					companyName,
					actionRequired: true,
				});
				if (alertsExists) {
				} else {
					await EmployeeAlertsViolationInfo.create({
						empId: data?.empId?._id,
						companyName,
						description: "Banking information missing",
						actionRequired: true,
						payPeriodNum: data.payPeriodNum,
					});
				}
			}
			if (!empSINResult || empSINResult.SIN === "") {
				const alertsExists = await findAlertInfo({
					empId: data?.empId?._id,
					companyName,
					actionRequired: false,
				});
				if (alertsExists) {
				} else {
					await EmployeeAlertsViolationInfo.create({
						empId: data?.empId?._id,
						companyName,
						description: "SIN missing",
						actionRequired: false,
						payPeriodNum: data.payPeriodNum,
					});
				}
			}
		}
		res.status(200).json({ message: "Alerts processed successfully" });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const deleteAlerts = async (empId) => {
	const existingAlert = await EmployeeAlertsViolationInfo.findOne({
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
};
