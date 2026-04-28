const { isPercentType } = require("./percent");
const { getTaxDetails } = require("../services/taxService");
const { convertHrsToFloat, safeNum } = require("../utils/time.util");
const { EARNING_TYPE } = require("../constants/earning.constants");
const { PAY_TYPES_TITLE } = require("../constants/pay.constants");
const { TIMESHEET_STATUS } = require("../constants/timesheet.constants");
const { momentTime, momentDuration } = require("../utils/date.util");
const { findEmployeePayStub } = require("../services/payrollService");

// const calcSalary = (hrs, rate) => (hrs / 60).toFixed(2) * rate;
const calcSalary = (hrs, rate) => hrs * rate;

const getSumTotal = (data1, data2) => safeNum(data1) + safeNum(data2);

const checkExtraRun = (isExtraRun) => {
	return isExtraRun === true || isExtraRun === "true";
};

const calcRegHrsWorked = (earningType, FTHrs, PTHrs, regHrs, isExtraRun) =>
	!isExtraRun && earningType === EARNING_TYPE.FT
		? convertHrsToFloat(FTHrs) || 0
		: !isExtraRun && earningType === EARNING_TYPE.PT
			? convertHrsToFloat(PTHrs) || 0
			: regHrs;

const calcPayRates = (newEmpDataPay) => {
	const { regPay } = newEmpDataPay;
	newEmpDataPay.overTimePay = 1.5 * regPay;
	newEmpDataPay.dblOverTimePay = 2 * regPay;
	newEmpDataPay.statPay = regPay;
	newEmpDataPay.statWorkPay = 1.5 * regPay;
	newEmpDataPay.sickPay = regPay;
	newEmpDataPay.vacationPay = regPay;
	newEmpDataPay.bereavementPay = regPay;
	newEmpDataPay.personalDayPay = regPay;
	newEmpDataPay.sprayPay = 1;
	newEmpDataPay.firstAidPay = 0.5;
	return newEmpDataPay;
};

const calcHoursWorkedTotals = (
	newEmpData,
	empPayInfoResult,
	empTimesheetData,
	amtAllocated,
	isExtraRun,
) => {
	newEmpData.totalRegHoursWorked = calcRegHrsWorked(
		empPayInfoResult?.roles[0]?.typeOfEarning,
		empPayInfoResult?.roles[0]?.fullTimeStandardHours,
		empPayInfoResult?.roles[0]?.partTimeStandardHours,
		convertHrsToFloat(empTimesheetData?.totalRegHoursWorked) +
			convertHrsToFloat(amtAllocated?.additionalRegHoursWorked),
		isExtraRun,
	);

	newEmpData.totalRegHoursWorked2 = calcRegHrsWorked(
		empPayInfoResult?.roles[1]?.typeOfEarning,
		empPayInfoResult?.roles[1]?.fullTimeStandardHours,
		empPayInfoResult?.roles[1]?.partTimeStandardHours,
		convertHrsToFloat(empTimesheetData?.totalRegHoursWorked2) +
			convertHrsToFloat(amtAllocated?.additionalRegHoursWorked2),
		isExtraRun,
	);

	newEmpData.totalOvertimeHoursWorked =
		convertHrsToFloat(empTimesheetData?.totalOvertimeHoursWorked) +
		convertHrsToFloat(amtAllocated?.additionalOvertimeHoursWorked);

	newEmpData.totalDblOvertimeHoursWorked =
		convertHrsToFloat(empTimesheetData?.totalDblOvertimeHoursWorked) +
		convertHrsToFloat(amtAllocated?.additionalDblOvertimeHoursWorked);

	newEmpData.totalStatHours =
		convertHrsToFloat(empTimesheetData?.totalStatHours) +
		convertHrsToFloat(amtAllocated?.additionalStatHoursWorked);

	newEmpData.totalStatDayHoursWorked =
		convertHrsToFloat(empTimesheetData?.totalStatDayHoursWorked) +
		convertHrsToFloat(amtAllocated?.additionalStatDayHoursWorked);

	newEmpData.totalSickHoursWorked =
		convertHrsToFloat(empTimesheetData?.totalSickHoursWorked) +
		convertHrsToFloat(amtAllocated?.additionalSickHoursWorked);

	newEmpData.totalVacationHoursWorked =
		convertHrsToFloat(empTimesheetData?.totalVacationHoursWorked) +
		convertHrsToFloat(amtAllocated?.additionalVacationHoursWorked);

	newEmpData.totalBereavementHoursWorked =
		convertHrsToFloat(empTimesheetData?.totalBereavementHoursWorked) +
		convertHrsToFloat(amtAllocated?.additionalBereavementHoursWorked);

	newEmpData.totalPersonalDayHoursWorked =
		convertHrsToFloat(empTimesheetData?.totalPersonalDayHoursWorked) +
		convertHrsToFloat(amtAllocated?.additionalPersonalDayHoursWorked);

	newEmpData.totalSprayHoursWorked = convertHrsToFloat(empTimesheetData?.totalSprayHoursWorked);

	newEmpData.totalFirstAidHoursWorked = convertHrsToFloat(
		empTimesheetData?.totalFirstAidHoursWorked,
	);

	newEmpData.totalHoursWorked =
		newEmpData.totalRegHoursWorked +
		newEmpData.totalRegHoursWorked2 +
		newEmpData.totalOvertimeHoursWorked +
		newEmpData.totalDblOvertimeHoursWorked +
		newEmpData.totalStatHours +
		newEmpData.totalStatDayHoursWorked +
		newEmpData.totalSickHoursWorked +
		newEmpData.totalVacationHoursWorked +
		newEmpData.totalBereavementHoursWorked +
		newEmpData.totalPersonalDayHoursWorked;
	return newEmpData;
};

const calcSalaryByEarningType = (newEmpData, amtAllocated) => {
	newEmpData.currentRegPayTotal =
		calcSalary(newEmpData?.totalRegHoursWorked || 0, newEmpData.regPay || 0) +
		convertHrsToFloat(amtAllocated?.regPayAmt);

	newEmpData.currentRegPayTotal2 =
		calcSalary(newEmpData?.totalRegHoursWorked2 || 0, newEmpData?.regPay2 || 0) +
		convertHrsToFloat(amtAllocated?.regPayAmt2);

	newEmpData.currentOverTimePayTotal =
		calcSalary(newEmpData?.totalOvertimeHoursWorked || 0, newEmpData.overTimePay || 0) +
		convertHrsToFloat(amtAllocated?.OTPayAmt);

	newEmpData.currentDblOverTimePayTotal =
		calcSalary(newEmpData?.totalDblOvertimeHoursWorked || 0, newEmpData.dblOverTimePay || 0) +
		convertHrsToFloat(amtAllocated?.dblOTPayAmt);

	newEmpData.currentStatWorkPayTotal =
		calcSalary(newEmpData?.totalStatDayHoursWorked || 0, newEmpData.statWorkPay || 0) +
		convertHrsToFloat(amtAllocated?.statWorkPayAmt);

	newEmpData.currentStatPayTotal =
		calcSalary(newEmpData?.totalStatHours || 0, newEmpData.statPay || 0) +
		convertHrsToFloat(amtAllocated?.statPayAmt);

	newEmpData.currentSickPayTotal =
		calcSalary(newEmpData?.totalSickHoursWorked || 0, newEmpData.sickPay || 0) +
		convertHrsToFloat(amtAllocated?.sickPayAmt);

	newEmpData.currentVacationPayTotal =
		calcSalary(newEmpData?.totalVacationHoursWorked || 0, newEmpData.vacationPay || 0) +
		convertHrsToFloat(amtAllocated?.vacationPayAmt);

	newEmpData.currentBereavementPayTotal =
		calcSalary(newEmpData?.totalBereavementHoursWorked || 0, newEmpData.bereavementPay || 0) +
		convertHrsToFloat(amtAllocated?.bereavementPayAmt);

	newEmpData.currentPersonalDayPayTotal =
		calcSalary(newEmpData?.totalPersonalDayHoursWorked || 0, newEmpData.personalDayPay || 0) +
		convertHrsToFloat(amtAllocated?.personalDayPayAmt);

	newEmpData.currentSprayPayTotal = calcSalary(
		newEmpData?.totalSprayHoursWorked || 0,
		newEmpData.sprayPay || 0,
	);
	newEmpData.currentFirstAidPayTotal = calcSalary(
		newEmpData?.totalFirstAidHoursWorked || 0,
		newEmpData.firstAidPay || 0,
	);
	return newEmpData;
};

const calcEmpBenefits = (newEmpData, empBenefitInfoResult) => {
	// const empPayStubResult = await findEmployeePayStub(empId, payPeriodPayDate, payPeriod);
	// newEmpData.payInLieuPay = empPayStubResult?.payInLieuPay ?? 0;
	// newEmpData.pILBenefitPay = empPayStubResult?.pILBenefitPay ?? 0;
	// newEmpData.bankedTimePay = empPayStubResult?.bankedTimePay ?? 0;
	// newEmpData.regularByAmount = empPayStubResult?.regularByAmount ?? 0;
	newEmpData.vacationPayPercent = convertHrsToFloat(empBenefitInfoResult?.vacationPayPercent);
	newEmpData.typeOfUnionDuesTreatment = empBenefitInfoResult?.typeOfUnionDuesTreatment;
	newEmpData.unionDuesContribution = convertHrsToFloat(empBenefitInfoResult?.unionDuesContribution);
	newEmpData.typeOfPensionEETreatment = empBenefitInfoResult?.typeOfPensionEETreatment;
	newEmpData.pensionEEContribution = convertHrsToFloat(empBenefitInfoResult?.pensionEEContribution);
	newEmpData.typeOfExtendedHealthEETreatment =
		empBenefitInfoResult?.typeOfExtendedHealthEETreatment;
	newEmpData.extendedHealthEEContribution = convertHrsToFloat(
		empBenefitInfoResult?.extendedHealthEEContribution,
	);
	newEmpData.typeOfPensionERTreatment = empBenefitInfoResult?.typeOfPensionERTreatment;
	newEmpData.pensionERContribution = convertHrsToFloat(empBenefitInfoResult?.pensionERContribution);
	newEmpData.typeOfExtendedHealthERTreatment =
		empBenefitInfoResult?.typeOfExtendedHealthERTreatment;
	newEmpData.extendedHealthERContribution = convertHrsToFloat(
		empBenefitInfoResult?.extendedHealthERContribution,
	);
	return newEmpData;
};

const calcEmpAmtAllocation = (newEmpData, amtAllocated) => {
	newEmpData.payInLieuPay = 0;
	newEmpData.bankedTimePay = 0;
	newEmpData.regularByAmount = 0;
	newEmpData.pILBenefitPay = convertHrsToFloat(amtAllocated?.pILBenefitPay);
	newEmpData.commission = convertHrsToFloat(amtAllocated?.commission);
	newEmpData.retroactive = convertHrsToFloat(amtAllocated?.retroactive);
	newEmpData.vacationPayout = convertHrsToFloat(amtAllocated?.vacationPayout);
	newEmpData.terminationPayout = convertHrsToFloat(amtAllocated?.terminationPayout);
	newEmpData.bonus = convertHrsToFloat(amtAllocated?.bonus);
	newEmpData.reimbursement = convertHrsToFloat(amtAllocated?.reimbursement);

	newEmpData.vacationBalAdjust = convertHrsToFloat(amtAllocated?.vacationBalAdjust);
	newEmpData.vacationAccrual = convertHrsToFloat(amtAllocated?.vacationAccrual);
	newEmpData.vacationUsed = convertHrsToFloat(amtAllocated?.vacationUsed);
	newEmpData.federalTax = convertHrsToFloat(amtAllocated?.federalTax);
	newEmpData.provTax = convertHrsToFloat(amtAllocated?.provTax);
	newEmpData.incomeTax = convertHrsToFloat(amtAllocated?.incomeTax);
	return newEmpData;
};

const calcCurrentGrossPay = (newEmpData) => {
	newEmpData.currentGrossPay =
		newEmpData.currentRegPayTotal +
		newEmpData?.currentRegPayTotal2 +
		newEmpData.currentOverTimePayTotal +
		newEmpData.currentDblOverTimePayTotal +
		newEmpData.currentStatWorkPayTotal +
		newEmpData.currentStatPayTotal +
		newEmpData.currentSickPayTotal +
		newEmpData.currentVacationPayTotal +
		newEmpData.currentBereavementPayTotal +
		newEmpData.currentPersonalDayPayTotal +
		newEmpData.currentSprayPayTotal +
		newEmpData.currentFirstAidPayTotal +
		newEmpData.payInLieuPay +
		newEmpData.pILBenefitPay +
		newEmpData.bankedTimePay +
		newEmpData.regularByAmount +
		newEmpData.commission +
		newEmpData.retroactive +
		newEmpData.vacationPayout +
		newEmpData.bonus +
		newEmpData.terminationPayout;
	return newEmpData;
};

const buildNewEmpPayStubInfo = (
	empTimesheetData,
	empPayInfoResult,
	empAdditionalDataAllocated,
	empBenefitInfoResult,
	empTaxCreditResult,
	isExtraRun,
	frequency,
) => {
	const newEmpData = empTimesheetData ? empTimesheetData : {};
	newEmpData.regPay = empPayInfoResult?.roles[0]?.payRate || 0;
	newEmpData.regPay2 = empPayInfoResult?.roles[1]?.payRate || 0;
	calcPayRates(newEmpData);

	calcHoursWorkedTotals(
		newEmpData,
		empPayInfoResult,
		empTimesheetData,
		empAdditionalDataAllocated,
		isExtraRun,
	);

	calcSalaryByEarningType(newEmpData, empAdditionalDataAllocated);
	calcEmpBenefits(newEmpData, empBenefitInfoResult);
	calcEmpAmtAllocation(newEmpData, empAdditionalDataAllocated);
	calcCurrentGrossPay(newEmpData);

	if (empTaxCreditResult) {
		calcEmpContributions(newEmpData, empTaxCreditResult, empAdditionalDataAllocated, frequency);
	}
	calcContrDeductions(newEmpData);
	calcVacBalance(newEmpData, empBenefitInfoResult, empAdditionalDataAllocated);

	calcCurrentDeductionsTotal(newEmpData);

	const netPay = newEmpData.currentGrossPay - newEmpData.currentDeductionsTotal;
	// newEmpData.currentNetPay = netPay < 0 ? 0 : netPay;

	newEmpData.currentNetPay = netPay || 0;
	newEmpData.totalAmountAllocated = empAdditionalDataAllocated?.totalAmountAllocated;
	return newEmpData;
};

const calcContrDeductions = (newEmpData) => {
	const { unionDues, EE_EPP, EE_EHP, ER_EPP, ER_EHP } = getContributionsDeductions(newEmpData);
	newEmpData.currentUnionDuesDeductions = unionDues; //only added superficial;
	newEmpData.currentEmployeeHealthContributions = EE_EHP; //only added superficial;
	newEmpData.currentPrimaryDeposit = 0;
	newEmpData.currentEmployeePensionContributions = EE_EPP; //only added superficial;
	newEmpData.currentOtherDeductions = 0;
	newEmpData.currentEmployerPensionContributions = ER_EPP; //only added superficial;
	newEmpData.currentEmployerHealthContributions = ER_EHP; //only added superficial;
	newEmpData.currentEmployerContributions =
		ER_EPP + ER_EHP + newEmpData?.currentCPPDeductions + newEmpData?.currentEmployerEIDeductions ||
		0; //only added superficial;
	return newEmpData;
};

const calcVacBalance = (newEmpData, empBenefitInfoResult, amtAllocated) => {
	const vacationPayPercent = convertHrsToFloat(empBenefitInfoResult?.vacationPayPercent) || 0;
	newEmpData.currentVacationBalanceFwd = convertHrsToFloat(amtAllocated?.vacationBalAdjust);

	newEmpData.currentVacationAccrued =
		vacationPayPercent * newEmpData.currentGrossPay +
		convertHrsToFloat(amtAllocated?.vacationAccrual);
	const vacTreatmentData =
		empBenefitInfoResult?.typeOfVacationTreatment === "Payout"
			? newEmpData.currentVacationAccrued
			: newEmpData.currentVacationPayTotal;
	newEmpData.currentVacationUsed = vacTreatmentData + convertHrsToFloat(amtAllocated?.vacationUsed);

	newEmpData.vacationBalance =
		newEmpData.currentVacationBalanceFwd +
		(newEmpData.currentVacationAccrued - newEmpData.currentVacationUsed);
	newEmpData.currentSickAccrued = 0;
	newEmpData.currentSickUsed = 0;
	newEmpData.sickBalance = 0;
	return newEmpData;
};

const calcCurrentDeductionsTotal = (newEmpData) => {
	const deductions =
		newEmpData.currentFDTaxDeductions +
		newEmpData.currentStateTaxDeductions +
		newEmpData.currentCPPDeductions +
		newEmpData.currentEmployeeEIDeductions +
		newEmpData.currentUnionDuesDeductions +
		newEmpData.currentEmployeeHealthContributions +
		newEmpData.currentPrimaryDeposit +
		newEmpData.currentEmployeePensionContributions +
		newEmpData.currentOtherDeductions;
	newEmpData.currentDeductionsTotal = !deductions || deductions < 0 ? 0 : deductions;
	return newEmpData;
};

const calcEmpContributions = (newEmpData, empTaxCreditResult, amtAllocated, frequency) => {
	const {
		CPPContribution,
		totalProvincialTaxDeduction,
		federalTaxDeductionByPayPeriod,
		EmployeeEIContribution,
		EmployerEIContribution,
	} = getTaxDetails(newEmpData?.regPay, newEmpData?.currentGrossPay, empTaxCreditResult, frequency);

	// const employeeContribution = calcEmployeeContribution(
	// 	newEmpData.currentGrossPay,
	// 	newEmpData,
	// );

	// const pensionContribution = 0.4 * employeeContribution;
	// const employerContribution =
	// 	pensionContribution + 2.05 * newEmpData.totalRegHoursWorked;

	newEmpData.currentFDTaxDeductions =
		federalTaxDeductionByPayPeriod + convertHrsToFloat(amtAllocated?.federalTax) || 0;
	newEmpData.currentStateTaxDeductions =
		totalProvincialTaxDeduction + convertHrsToFloat(amtAllocated?.provTax);

	newEmpData.currentIncomeTaxDeductions =
		newEmpData.currentFDTaxDeductions +
		newEmpData.currentStateTaxDeductions +
		convertHrsToFloat(amtAllocated?.incomeTax);
	newEmpData.currentCPPDeductions = CPPContribution; //only added superficial
	newEmpData.currentEmployeeEIDeductions = EmployeeEIContribution; //only added superficial;
	newEmpData.currentEmployerEIDeductions = EmployerEIContribution; //only added superficial;

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
		totalOvertimeHoursWorked +
		totalRegHoursWorked +
		totalSickHoursWorked +
		totalStatDayHoursWorked +
		totalStatHours;

	const sumTotalHoursWithoutVacation =
		totalSickHoursWorked + totalStatHours + totalStatDayHoursWorked + totalRegHoursWorked;

	const sumTotalOvertimeHours = totalOvertimeHoursWorked + totalDblOvertimeHoursWorked;

	const sumTotalWithoutVacation =
		calcSalary(totalSickHoursWorked, sickPay) +
		calcSalary(totalStatHours, statPay) +
		calcSalary(totalStatDayHoursWorked, statWorkPay) +
		calcSalary(totalRegHoursWorked, regPay);

	const sumTotalOvertime =
		calcSalary(totalOvertimeHoursWorked, overTimePay) +
		calcSalary(totalDblOvertimeHoursWorked, dblOverTimePay);

	// const sumTotalWithVacation =
	// 	calcSalary(totalSickHoursWorked, sickPay) +
	// 	calcSalary(totalStatHours, statPay) +
	// 	calcSalary(totalStatDayHoursWorked, statWorkPay) +
	// 	calcSalary(totalRegHoursWorked, regPay) +
	// 	calcSalary(totalVacationHoursWorked, vacationPay);

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
		: isPercentType(treatmentType)
			? accumulatedHrs * contributionAmt
			: treatmentType?.includes("per Hour")
				? contributionAmt * totalAllocatedHours
				: contributionAmt;
	return newAmount;
};

const getPayType = (isBreak = false) =>
	isBreak ? PAY_TYPES_TITLE.REG_PAY_BRK : PAY_TYPES_TITLE.REG_PAY;

const calcTotalHours = (data) => {
	if (!(data?.clockIn && data?.clockOut)) {
		return;
	}
	const clockIn = momentTime(data?.clockIn);
	const clockOut = momentTime(data?.clockOut);
	const hasStartBreak = data?.startBreaks?.length;
	const hasEndBreak = data?.endBreaks?.length;

	const break1Start = hasStartBreak && momentTime(data?.startBreaks[0]);
	const break1End = hasEndBreak && momentTime(data?.endBreaks[0]);

	const break2Start = hasStartBreak > 1 && momentTime(data?.startBreaks[1]);
	const break2End = hasEndBreak > 1 && momentTime(data?.startBreaks[1]);

	const break3Start = hasStartBreak > 2 && momentTime(data?.startBreaks[2]);
	const break3End = hasEndBreak > 2 && momentTime(data?.startBreaks[2]);

	const break1Duration = momentDuration(break1Start, break1End);
	const break2Duration = momentDuration(break2Start, break2End);
	const break3Duration = momentDuration(break3Start, break3End);

	const totalBreakHours =
		hasStartBreak && hasEndBreak ? break1Duration.add(break2Duration).add(break3Duration) : 0;

	const totalClockInToOut = momentDuration(clockIn, clockOut);
	const totalWorkingTime = totalClockInToOut.subtract(totalBreakHours);
	const hours = Math.floor(totalWorkingTime.asHours());
	const minutes = Math.floor(totalWorkingTime.minutes());

	return {
		totalBreakHours: totalBreakHours ? Math.floor(totalBreakHours.asHours()) : 0,
		totalWorkedHours: `${hours < 10 ? `0${hours < 0 ? 0 : hours}` : hours}:${
			minutes < 10 ? `0${minutes < 0 ? 0 : minutes}` : minutes
		}`,
	};
};

const appendPrevPayInfoBalance = (prevPayPayInfo, newPayStub) => {
	const {
		YTDCommission,
		YTDRetroactive,
		YTDVacationPayout,
		YTDBonus,
		YTDTerminationPayout,
		YTDRegHoursWorked,
		YTDOvertimeHoursWorked,
		YTDDblOvertimeHoursWorked,
		YTDStatDayHoursWorked,
		YTDStatHoursWorked,
		YTDSickHoursWorked,
		YTDVacationHoursWorked,
		YTDBereavementHoursWorked,
		YTDPersonalDayHoursWorked,
		YTDSprayHoursWorked,
		YTDFirstAidHoursWorked,
		YTDRegPayTotal,
		YTDRegPayTotal2,
		YTDOverTimePayTotal,
		YTDDblOverTimePayTotal,
		YTDStatWorkPayTotal,
		YTDStatPayTotal,
		YTDSickPayTotal,
		YTDVacationPayTotal,
		YTDBereavementPayTotal,
		YTDPersonalDayPayTotal,
		YTD_FDTaxDeductions,
		YTDStateTaxDeductions,
		YTD_IncomeTaxDeductions,
		YTD_EmployeeEIDeductions,
		YTD_EmployerEIDeductions,
		YTD_EmployerCPPDeductions,
		YTD_CPPDeductions,
		YTDUnionDuesDeductions,
		YTDEmployeeHealthContributions,
		YTDEmployeePensionContributions,
		YTDEmployerPensionContributions,
		YTDEmployerHealthContributions,
		YTDEmployerContributions,
		YTDVacationAccrued,
		YTDVacationUsed,
		YTDVacationBalanceFwd,
		YTDVacationBalance,
		YTDSprayPayTotal,
		YTDFirstAidPayTotal,
		YTDPayInLieuPay,
		YTDBenefitPay,
		YTDBankedTimePay,
		YTDRegularByAmount,
		YTDPrimaryDeposit,
		YTDOtherDeductions,
		YTDGrossPay,
		YTDDeductionsTotal,
		YTDNetPay,
		YTDSickAccrued,
		YTDSickUsed,
		YTDSickBalance,
	} = newPayStub;
	if (!prevPayPayInfo) {
		prevPayPayInfo = {};
	}
	prevPayPayInfo.YTDCommission = getSumTotal(prevPayPayInfo.YTDCommission, YTDCommission);
	prevPayPayInfo.YTDRetroactive = getSumTotal(prevPayPayInfo.YTDRetroactive, YTDRetroactive);
	prevPayPayInfo.YTDVacationPayout = getSumTotal(
		prevPayPayInfo.YTDVacationPayout,
		YTDVacationPayout,
	);
	prevPayPayInfo.YTDBonus = getSumTotal(prevPayPayInfo.YTDBonus, YTDBonus);
	prevPayPayInfo.YTDTerminationPayout = getSumTotal(
		prevPayPayInfo.YTDTerminationPayout,
		YTDTerminationPayout,
	);
	prevPayPayInfo.YTDRegHoursWorked = getSumTotal(
		prevPayPayInfo.YTDRegHoursWorked,
		YTDRegHoursWorked,
	);
	prevPayPayInfo.YTDOvertimeHoursWorked = getSumTotal(
		prevPayPayInfo.YTDOvertimeHoursWorked,
		YTDOvertimeHoursWorked,
	);
	prevPayPayInfo.YTDDblOvertimeHoursWorked = getSumTotal(
		prevPayPayInfo.YTDDblOvertimeHoursWorked,
		YTDDblOvertimeHoursWorked,
	);
	prevPayPayInfo.YTDStatDayHoursWorked = getSumTotal(
		prevPayPayInfo.YTDStatDayHoursWorked,
		YTDStatDayHoursWorked,
	);
	prevPayPayInfo.YTDStatHoursWorked = getSumTotal(
		prevPayPayInfo.YTDStatHoursWorked,
		YTDStatHoursWorked,
	);
	prevPayPayInfo.YTDSickHoursWorked = getSumTotal(
		prevPayPayInfo.YTDSickHoursWorked,
		YTDSickHoursWorked,
	);
	prevPayPayInfo.YTDVacationHoursWorked = getSumTotal(
		prevPayPayInfo.YTDVacationHoursWorked,
		YTDVacationHoursWorked,
	);
	prevPayPayInfo.YTDBereavementHoursWorked = getSumTotal(
		prevPayPayInfo.YTDBereavementHoursWorked,
		YTDBereavementHoursWorked,
	);
	prevPayPayInfo.YTDPersonalDayHoursWorked = getSumTotal(
		prevPayPayInfo.YTDPersonalDayHoursWorked,
		YTDPersonalDayHoursWorked,
	);
	prevPayPayInfo.YTDSprayHoursWorked = getSumTotal(
		prevPayPayInfo.YTDSprayHoursWorked,
		YTDSprayHoursWorked,
	);
	prevPayPayInfo.YTDFirstAidHoursWorked = getSumTotal(
		prevPayPayInfo.YTDFirstAidHoursWorked,
		YTDFirstAidHoursWorked,
	);

	prevPayPayInfo.YTDRegPayTotal = getSumTotal(prevPayPayInfo.YTDRegPayTotal, YTDRegPayTotal);
	prevPayPayInfo.YTDRegPayTotal2 = getSumTotal(prevPayPayInfo.YTDRegPayTotal, YTDRegPayTotal2);
	prevPayPayInfo.YTDOverTimePayTotal = getSumTotal(
		prevPayPayInfo.YTDOverTimePayTotal,
		YTDOverTimePayTotal,
	);
	prevPayPayInfo.YTDDblOverTimePayTotal = getSumTotal(
		prevPayPayInfo.YTDDblOverTimePayTotal,
		YTDDblOverTimePayTotal,
	);
	prevPayPayInfo.YTDStatWorkPayTotal = getSumTotal(
		prevPayPayInfo.YTDStatWorkPayTotal,
		YTDStatWorkPayTotal,
	);
	prevPayPayInfo.YTDStatPayTotal = getSumTotal(prevPayPayInfo.YTDStatPayTotal, YTDStatPayTotal);
	prevPayPayInfo.YTDSickPayTotal = getSumTotal(prevPayPayInfo.YTDSickPayTotal, YTDSickPayTotal);
	prevPayPayInfo.YTDVacationPayTotal = getSumTotal(
		prevPayPayInfo.YTDVacationPayTotal,
		YTDVacationPayTotal,
	);
	prevPayPayInfo.YTDBereavementPayTotal = getSumTotal(
		prevPayPayInfo.YTDBereavementPayTotal,
		YTDBereavementPayTotal,
	);
	prevPayPayInfo.YTDPersonalDayPayTotal = getSumTotal(
		prevPayPayInfo.YTDPersonalDayPayTotal,
		YTDPersonalDayPayTotal,
	);

	prevPayPayInfo.YTD_FDTaxDeductions = getSumTotal(
		prevPayPayInfo.YTD_FDTaxDeductions,
		YTD_FDTaxDeductions,
	);
	prevPayPayInfo.YTDStateTaxDeductions = getSumTotal(
		prevPayPayInfo.YTDStateTaxDeductions,
		YTDStateTaxDeductions,
	);
	prevPayPayInfo.YTD_IncomeTaxDeductions = getSumTotal(
		prevPayPayInfo.YTD_IncomeTaxDeductions,
		YTD_IncomeTaxDeductions,
	);
	prevPayPayInfo.YTD_EmployeeEIDeductions = getSumTotal(
		prevPayPayInfo.YTD_EmployeeEIDeductions,
		YTD_EmployeeEIDeductions,
	);
	prevPayPayInfo.YTD_EmployerEIDeductions = getSumTotal(
		prevPayPayInfo.YTD_EmployerEIDeductions,
		YTD_EmployerEIDeductions,
	);
	prevPayPayInfo.YTD_EmployerCPPDeductions = getSumTotal(
		prevPayPayInfo.YTD_EmployerCPPDeductions,
		YTD_EmployerCPPDeductions,
	);
	prevPayPayInfo.YTD_CPPDeductions = getSumTotal(
		prevPayPayInfo.YTD_CPPDeductions,
		YTD_CPPDeductions,
	);
	prevPayPayInfo.YTDUnionDuesDeductions = getSumTotal(
		prevPayPayInfo.YTDUnionDuesDeductions,
		YTDUnionDuesDeductions,
	);
	prevPayPayInfo.YTDEmployeeHealthContributions = getSumTotal(
		prevPayPayInfo.YTDEmployeeHealthContributions,
		YTDEmployeeHealthContributions,
	);
	prevPayPayInfo.YTDEmployeePensionContributions = getSumTotal(
		prevPayPayInfo.YTDEmployeePensionContributions,
		YTDEmployeePensionContributions,
	);
	prevPayPayInfo.YTDEmployerPensionContributions = getSumTotal(
		prevPayPayInfo.YTDEmployerPensionContributions,
		YTDEmployerPensionContributions,
	);
	prevPayPayInfo.YTDEmployerHealthContributions = getSumTotal(
		prevPayPayInfo.YTDEmployerHealthContributions,
		YTDEmployerHealthContributions,
	);
	prevPayPayInfo.YTDEmployerContributions = getSumTotal(
		prevPayPayInfo.YTDEmployerContributions,
		YTDEmployerContributions,
	);
	// prevPayPayInfo.YTDVacationAccrued = getSumTotal(
	// 	prevPayPayInfo.YTDVacationAccrued,
	// 	YTDVacationAccrued,
	// );
	prevPayPayInfo.YTDVacationAccrued = YTDVacationAccrued;
	prevPayPayInfo.YTDVacationUsed = getSumTotal(prevPayPayInfo.YTDVacationUsed, YTDVacationUsed);
	prevPayPayInfo.YTDVacationBalanceFwd = getSumTotal(
		prevPayPayInfo.YTDVacationBalanceFwd,
		YTDVacationBalanceFwd,
	);
	prevPayPayInfo.YTDVacationBalance = getSumTotal(
		prevPayPayInfo.YTDVacationBalance,
		YTDVacationBalance,
	);
	prevPayPayInfo.YTDSprayPayTotal = getSumTotal(prevPayPayInfo.YTDSprayPayTotal, YTDSprayPayTotal);
	prevPayPayInfo.YTDFirstAidPayTotal = getSumTotal(
		prevPayPayInfo.YTDFirstAidPayTotal,
		YTDFirstAidPayTotal,
	);
	prevPayPayInfo.YTDPayInLieuPay = getSumTotal(prevPayPayInfo.YTDPayInLieuPay, YTDPayInLieuPay);
	prevPayPayInfo.YTDBenefitPay = getSumTotal(prevPayPayInfo.YTDBenefitPay, YTDBenefitPay);
	prevPayPayInfo.YTDBankedTimePay = getSumTotal(prevPayPayInfo.YTDBankedTimePay, YTDBankedTimePay);
	prevPayPayInfo.YTDRegularByAmount = getSumTotal(
		prevPayPayInfo.YTDRegularByAmount,
		YTDRegularByAmount,
	);
	prevPayPayInfo.YTDPrimaryDeposit = getSumTotal(
		prevPayPayInfo.YTDPrimaryDeposit,
		YTDPrimaryDeposit,
	);
	prevPayPayInfo.YTDOtherDeductions = getSumTotal(
		prevPayPayInfo.YTDOtherDeductions,
		YTDOtherDeductions,
	);
	prevPayPayInfo.YTDGrossPay = getSumTotal(prevPayPayInfo.YTDGrossPay, YTDGrossPay);
	prevPayPayInfo.YTDDeductionsTotal = getSumTotal(
		prevPayPayInfo.YTDDeductionsTotal,
		YTDDeductionsTotal,
	);
	prevPayPayInfo.YTDNetPay = getSumTotal(prevPayPayInfo.YTDNetPay, YTDNetPay);
	prevPayPayInfo.YTDSickAccrued = getSumTotal(prevPayPayInfo.YTDSickAccrued, YTDSickAccrued);
	prevPayPayInfo.YTDSickUsed = getSumTotal(prevPayPayInfo.YTDSickUsed, YTDSickUsed);
	prevPayPayInfo.YTDSickBalance = getSumTotal(prevPayPayInfo.YTDSickBalance, YTDSickBalance);
	return prevPayPayInfo;
};

module.exports = {
	buildNewEmpPayStubInfo,
	getContributionsDeductions,
	calcHoursWorkedTotals,
	calcEmpBenefits,
	calcPayRates,
	checkExtraRun,
	getSumTotal,
	getPayType,
	calcTotalHours,
	appendPrevPayInfoBalance,
};
