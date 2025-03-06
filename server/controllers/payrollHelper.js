const moment = require("moment");
const Timesheet = require("../models/Timesheet");
const { TIMESHEET_STATUS, PAY_TYPES_TITLE, EARNING_TYPE } = require("../services/data");
const EmployeeBalanceInfo = require("../models/EmployeeBalanceInfo");
const { calcSalary, convertHrsToFloat, getTaxDetails } = require("../services/payrollService");

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

	const timesheetApprovedHoursSum = timesheets.reduce((acc, timesheet) => {
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

	const result = Object.values(timesheetApprovedHoursSum);
	return result;
};

const calcRegHrsWorked = (earningType, FTHrs, PTHrs, regHrs) => {
	if (earningType === EARNING_TYPE.FT) {
		return convertHrsToFloat(FTHrs);
	} else {
		return earningType === EARNING_TYPE.PT ? convertHrsToFloat(PTHrs) : regHrs;
	}
};

const calcPayRates = (newEmpDataPay) => {
	const { regPay } = newEmpDataPay;
	newEmpDataPay.overTimePay = 1.5 * regPay;
	newEmpDataPay.dblOverTimePay = 2 * regPay;
	newEmpDataPay.statPay = regPay;
	newEmpDataPay.statWorkPay = 1.5 * regPay;
	newEmpDataPay.sickPay = regPay;
	newEmpDataPay.vacationPay = regPay;
	newEmpDataPay.sprayPay = 1;
	newEmpDataPay.firstAidPay = 0.5;
	return newEmpDataPay;
};

const calcHoursWorkedTotals = (newEmpData, empPayInfoResult, empTimesheetData, amtAllocated) => {
	newEmpData.totalRegHoursWorked = calcRegHrsWorked(
		empPayInfoResult?.typeOfEarning,
		empPayInfoResult?.fullTimeStandardHours,
		empPayInfoResult?.partTimeStandardHours,
		convertHrsToFloat(empTimesheetData?.totalRegHoursWorked) +
			convertHrsToFloat(amtAllocated?.additionalRegHoursWorked),
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

	newEmpData.totalSprayHoursWorked = convertHrsToFloat(empTimesheetData?.totalSprayHoursWorked);

	newEmpData.totalFirstAidHoursWorked = convertHrsToFloat(
		empTimesheetData?.totalFirstAidHoursWorked,
	);

	newEmpData.totalHoursWorked =
		newEmpData.totalRegHoursWorked +
		newEmpData.totalOvertimeHoursWorked +
		newEmpData.totalDblOvertimeHoursWorked +
		newEmpData.totalStatHours +
		newEmpData.totalStatDayHoursWorked +
		newEmpData.totalSickHoursWorked +
		newEmpData.totalVacationHoursWorked;
	return newEmpData;
};

const calcSalaryByEarningType = (newEmpData, amtAllocated) => {
	newEmpData.currentRegPayTotal =
		calcSalary(newEmpData?.totalRegHoursWorked || 0, newEmpData.regPay || 0) +
		convertHrsToFloat(amtAllocated?.regPayAmt);

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
	// const empPayStubResult = await findEmployeePayStub(empId, payPeriod);
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
	newEmpData.pILBenefitPay = 0;
	newEmpData.bankedTimePay = 0;
	newEmpData.regularByAmount = 0;
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
		newEmpData.currentOverTimePayTotal +
		newEmpData.currentDblOverTimePayTotal +
		newEmpData.currentStatWorkPayTotal +
		newEmpData.currentStatPayTotal +
		newEmpData.currentSickPayTotal +
		newEmpData.currentVacationPayTotal +
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
) => {
	const newEmpData = empTimesheetData ? empTimesheetData : {};
	newEmpData.regPay = empPayInfoResult?.regPay || 0;
	calcPayRates(newEmpData);

	calcHoursWorkedTotals(newEmpData, empPayInfoResult, empTimesheetData, empAdditionalDataAllocated);

	calcSalaryByEarningType(newEmpData, empAdditionalDataAllocated);
	calcEmpBenefits(newEmpData, empBenefitInfoResult);
	calcEmpAmtAllocation(newEmpData, empAdditionalDataAllocated);
	calcCurrentGrossPay(newEmpData);

	if (empTaxCreditResult) {
		calcEmpContributions(newEmpData, empTaxCreditResult, empAdditionalDataAllocated);
	}
	calcContrDeductions(newEmpData);
	calcVacBalance(newEmpData, empBenefitInfoResult, empAdditionalDataAllocated);

	calcCurrentDeductionsTotal(newEmpData);

	const netPay = newEmpData.currentGrossPay - newEmpData.currentDeductionsTotal;
	// newEmpData.currentNetPay = netPay < 0 ? 0 : netPay;
	newEmpData.currentNetPay = netPay;
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
	newEmpData.currentEmployerContributions = ER_EPP + ER_EHP; //only added superficial;
	return newEmpData;
};

const calcVacBalance = (newEmpData, empBenefitInfoResult, amtAllocated) => {
	const vacationPayPercent = convertHrsToFloat(empBenefitInfoResult?.vacationPayPercent);
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

	newEmpData.currentDeductionsTotal = deductions < 0 ? 0 : deductions;
	return newEmpData;
};

const calcEmpContributions = (newEmpData, empTaxCreditResult, amtAllocated) => {
	const {
		CPPContribution,
		totalProvincialTaxDeduction,
		federalTaxDeductionByPayPeriod,
		EmployeeEIContribution,
		EmployerEIContribution,
	} = getTaxDetails(newEmpData?.regPay, newEmpData?.currentGrossPay, empTaxCreditResult);

	// const employeeContribution = calcEmployeeContribution(
	// 	newEmpData.currentGrossPay,
	// 	newEmpData,
	// );

	// const pensionContribution = 0.4 * employeeContribution;
	// const employerContribution =
	// 	pensionContribution + 2.05 * newEmpData.totalRegHoursWorked;

	newEmpData.currentFDTaxDeductions =
		federalTaxDeductionByPayPeriod + convertHrsToFloat(amtAllocated?.federalTax);
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
		data.totalOvertimeHoursWorked +
		data.totalRegHoursWorked +
		data.totalSickHoursWorked +
		data.totalStatDayHoursWorked +
		data.totalStatHours;

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
		: treatmentType?.includes("%")
		? accumulatedHrs * contributionAmt
		: treatmentType?.includes("per Hour")
		? contributionAmt * totalAllocatedHours
		: contributionAmt;
	return newAmount;
};

module.exports = {
	findEmployeeBenefitInfo,
	buildNewEmpPayStubInfo,
	getContributionsDeductions,
	calculateTimesheetApprovedHours,
	calcHoursWorkedTotals,
	calcEmpBenefits,
	calcPayRates,
};
