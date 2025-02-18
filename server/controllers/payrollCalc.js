const EmployeeBalanceInfo = require("../models/EmployeeBalanceInfo");
const EmployeePayInfo = require("../models/EmployeePayInfo");
const { getCalcAmount, getSumHours } = require("../services/payrollService");

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

module.exports = {
	findEmployeePayInfoDetails,
	findEmployeeBenefitInfo,
	getCurrentTotals,
	getContributionsDeductions,
};
