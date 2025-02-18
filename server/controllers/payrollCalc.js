const EmployeeBalanceInfo = require("../models/EmployeeBalanceInfo");
const EmployeeExtraAllocation = require("../models/EmployeeExtraAllocation");
const EmployeePayInfo = require("../models/EmployeePayInfo");
const { getCalcAmount, getSumHours } = require("../services/payrollService");
const {
	findAdditionalSuperficialHoursAllocatedInfo,
	findAdditionalManualHoursAllocatedInfo,
	findAdditionalPayoutHoursAllocatedInfo,
} = require("./additionalAllocationInfoController");

const findEmployeePayInfoDetails = async (empId, companyName) =>
	await EmployeePayInfo.findOne({
		empId,
		companyName,
	}).select(
		"empId typeOfEarning fullTimeStandardHours partTimeStandardHours regPay overTimePay dblOverTimePay statWorkPay statPay sickPay vacationPay",
	);

const findEmployeeBenefitInfo = async (empId, companyName) =>
	await EmployeeBalanceInfo.findOne({
		empId,
		companyName,
	});

const getCurrentTotals = (empTimesheetData, empPayInfoResult, empAdditionalHoursAllocated) => {
	const newEmpData = empTimesheetData ? empTimesheetData : {};

	newEmpData.regPay = empPayInfoResult?.regPay;
	newEmpData.overTimePay = 1.5 * empPayInfoResult?.regPay;
	newEmpData.dblOverTimePay = 2 * empPayInfoResult?.regPay;
	newEmpData.statPay = empPayInfoResult?.regPay;
	newEmpData.statWorkPay = 1.5 * empPayInfoResult?.regPay;
	newEmpData.sickPay = empPayInfoResult?.regPay;
	newEmpData.vacationPay = empPayInfoResult?.regPay;
	newEmpData.sprayPay = 1;
	newEmpData.firstAidPay = 0.5;

	const isFT = empPayInfoResult?.typeOfEarning === "Full Time Salaried";
	const isPT = empPayInfoResult?.typeOfEarning === "Part Time Salaried";

	newEmpData.totalRegHoursWorked = isFT
		? getSumHours(empPayInfoResult?.fullTimeStandardHours)
		: isPT
		? getSumHours(empPayInfoResult?.partTimeStandardHours)
		: getSumHours(empTimesheetData?.totalRegHoursWorked) +
		  getSumHours(empAdditionalHoursAllocated?.additionalRegHoursWorked);
	newEmpData.totalOvertimeHoursWorked =
		getSumHours(empTimesheetData?.totalOvertimeHoursWorked) +
		getSumHours(empAdditionalHoursAllocated?.additionalOvertimeHoursWorked);
	newEmpData.totalDblOvertimeHoursWorked =
		getSumHours(empTimesheetData?.totalDblOvertimeHoursWorked) +
		getSumHours(empAdditionalHoursAllocated?.additionalDblOvertimeHoursWorked);
	newEmpData.totalStatHours =
		getSumHours(empTimesheetData?.totalStatHours) +
		getSumHours(empAdditionalHoursAllocated?.additionalStatHoursWorked);
	newEmpData.totalStatDayHoursWorked =
		getSumHours(empTimesheetData?.totalStatDayHoursWorked) +
		getSumHours(empAdditionalHoursAllocated?.additionalStatDayHoursWorked);
	newEmpData.totalSickHoursWorked =
		getSumHours(empTimesheetData?.totalSickHoursWorked) +
		getSumHours(empAdditionalHoursAllocated?.additionalSickHoursWorked);
	newEmpData.totalVacationHoursWorked =
		getSumHours(empTimesheetData?.totalVacationHoursWorked) +
		getSumHours(empAdditionalHoursAllocated?.additionalVacationHoursWorked);

	newEmpData.totalHoursWorked =
		newEmpData.totalRegHoursWorked +
		newEmpData.totalOvertimeHoursWorked +
		newEmpData.totalDblOvertimeHoursWorked +
		newEmpData.totalStatHours +
		newEmpData.totalStatDayHoursWorked +
		newEmpData.totalSickHoursWorked +
		newEmpData.totalVacationHoursWorked;

	newEmpData.totalSprayHoursWorked = getSumHours(empTimesheetData?.totalSprayHoursWorked);
	newEmpData.totalFirstAidHoursWorked = getSumHours(empTimesheetData?.totalFirstAidHoursWorked);
	newEmpData.currentRegPayTotal = getCalcAmount(
		newEmpData?.totalRegHoursWorked || 0,
		newEmpData.regPay || 0,
	);

	newEmpData.currentOverTimePayTotal = getCalcAmount(
		newEmpData?.totalOvertimeHoursWorked || 0,
		newEmpData.overTimePay || 0,
	);
	newEmpData.currentDblOverTimePayTotal = getCalcAmount(
		newEmpData?.totalDblOvertimeHoursWorked || 0,
		newEmpData.dblOverTimePay || 0,
	);
	newEmpData.currentStatWorkPayTotal = getCalcAmount(
		newEmpData?.totalStatDayHoursWorked || 0,
		newEmpData.statWorkPay || 0,
	);
	newEmpData.currentStatPayTotal = getCalcAmount(
		newEmpData?.totalStatHours || 0,
		newEmpData.statPay || 0,
	);
	newEmpData.currentSickPayTotal = getCalcAmount(
		newEmpData?.totalSickHoursWorked || 0,
		newEmpData.sickPay || 0,
	);
	newEmpData.currentVacationPayTotal = getCalcAmount(
		newEmpData?.totalVacationHoursWorked || 0,
		newEmpData.vacationPay || 0,
	);
	newEmpData.currentSprayPayTotal = getCalcAmount(
		newEmpData?.totalSprayHoursWorked || 0,
		newEmpData.sprayPay || 0,
	);
	newEmpData.currentFirstAidPayTotal = getCalcAmount(
		newEmpData?.totalFirstAidHoursWorked || 0,
		newEmpData.firstAidPay || 0,
	);
	return newEmpData;
};

const getContributionsDeductions = (data) => {
	const {
		regPay,
		overTimePay,
		dblOverTimePay,
		statPay,
		statWorkPay,
		sickPay,
		totalRegHoursWorked,
		totalOvertimeHoursWorked,
		totalDblOvertimeHoursWorked,
		totalStatDayHoursWorked,
		totalStatHours,
		totalSickHoursWorked,
		vacationPayPercent,
		typeOfUnionDuesTreatment,
		unionDuesContribution,
		typeOfPensionEETreatment,
		pensionEEContribution,
		typeOfExtendedHealthEETreatment,
		extendedHealthEEContribution,
		typeOfPensionERTreatment,
		pensionERContribution,
		typeOfExtendedHealthERTreatment,
		extendedHealthERContribution,
	} = data;

	const totalAllocatedHours =
		// data.totalDblOvertimeHoursWorked +
		data.totalOvertimeHoursWorked +
		data.totalRegHoursWorked +
		data.totalSickHoursWorked +
		data.totalStatDayHoursWorked +
		data.totalStatHours;

	const sumTotalHoursWithoutVacation =
		totalSickHoursWorked + totalStatHours + totalStatDayHoursWorked + totalRegHoursWorked;

	const sumTotalOvertimeHours = totalOvertimeHoursWorked + totalDblOvertimeHoursWorked;

	const sumTotalWithoutVacation =
		getCalcAmount(totalSickHoursWorked, sickPay) +
		getCalcAmount(totalStatHours, statPay) +
		getCalcAmount(totalStatDayHoursWorked, statWorkPay) +
		getCalcAmount(totalRegHoursWorked, regPay);

	const sumTotalOvertime =
		getCalcAmount(totalOvertimeHoursWorked, overTimePay) +
		getCalcAmount(totalDblOvertimeHoursWorked, dblOverTimePay);

	// const sumTotalWithVacation =
	// 	getCalcAmount(totalSickHoursWorked, sickPay) +
	// 	getCalcAmount(totalStatHours, statPay) +
	// 	getCalcAmount(totalStatDayHoursWorked, statWorkPay) +
	// 	getCalcAmount(totalRegHoursWorked, regPay) +
	// 	getCalcAmount(totalVacationHoursWorked, vacationPay);

	const vacationAccruedAmount = (sumTotalWithoutVacation + sumTotalOvertime) * vacationPayPercent;

	const unionDues = validateContribution(
		typeOfUnionDuesTreatment,
		unionDuesContribution,
		sumTotalWithoutVacation + sumTotalOvertime + vacationAccruedAmount,
		totalAllocatedHours,
	);

	const EE_EPP = validateContribution(
		typeOfPensionEETreatment,
		pensionEEContribution,
		sumTotalWithoutVacation + vacationAccruedAmount,
		data.totalRegHoursWorked +
			data.totalSickHoursWorked +
			data.totalStatDayHoursWorked +
			data.totalStatHours,
	);

	const EE_EHP = validateContribution(
		typeOfExtendedHealthEETreatment,
		extendedHealthEEContribution,
		sumTotalHoursWithoutVacation,
		data.totalRegHoursWorked +
			data.totalSickHoursWorked +
			data.totalStatDayHoursWorked +
			data.totalStatHours,
	);

	const ER_EPP = validateContribution(
		typeOfPensionERTreatment,
		pensionERContribution,
		sumTotalWithoutVacation + vacationAccruedAmount,
		data.totalRegHoursWorked +
			data.totalSickHoursWorked +
			data.totalStatDayHoursWorked +
			data.totalStatHours,
	);

	const ER_EHP = validateContribution(
		typeOfExtendedHealthERTreatment,
		extendedHealthERContribution,
		sumTotalHoursWithoutVacation,
		totalAllocatedHours,
	);

	return {
		unionDues,
		EE_EPP,
		EE_EHP,
		ER_EPP,
		ER_EHP,
	};
};

const calcEmployeeContribution = (grossPay, newEmpData) =>
	grossPay -
	(newEmpData.retroactive +
		newEmpData.currentOverTimePayTotal +
		newEmpData.currentDblOverTimePayTotal);

const validateContribution = (
	treatmentType,
	contributionAmt,
	accumulatedHrs,
	totalAllocatedHours,
) => {
	const newAmount = treatmentType?.includes("No")
		? 0
		: treatmentType?.includes("%")
		? accumulatedHrs * contributionAmt
		: treatmentType?.includes("per Hour")
		? contributionAmt * totalAllocatedHours
		: contributionAmt;
	return newAmount;
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

const findAdditionalHoursAllocatedInfo = async (record) =>
	await EmployeeExtraAllocation.findOne(record).select(
		"empId totalHoursWorked additionalRegHoursWorked additionalOvertimeHoursWorked additionalDblOvertimeHoursWorked additionalStatDayHoursWorked additionalVacationHoursWorked additionalStatHoursWorked additionalSickHoursWorked ",
	);

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

			result.totalHoursWorked = additionalHoursAllocatedInfo?.totalHoursWorked ?? 0;
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
			} = result;

			result.totalHoursWorked +=
				totalDblOvertimeHoursWorked +
				totalOvertimeHoursWorked +
				totalRegHoursWorked +
				totalSickHoursWorked +
				totalStatDayHoursWorked +
				totalStatHours +
				totalVacationHoursWorked;
			aggregatedResult.push(result);
		}
	}
	return aggregatedResult;
};

module.exports = {
	findEmployeePayInfoDetails,
	findEmployeeBenefitInfo,
	getCurrentTotals,
	getContributionsDeductions,
	getHourlyAggregatedResult,
	findAdditionalHoursAllocatedInfo,
};
