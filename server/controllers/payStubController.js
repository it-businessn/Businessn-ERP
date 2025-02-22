const EmployeePayStub = require("../models/EmployeePayStub");
const { getSumTotal } = require("../services/payrollService");
const { findAllAdditionalHoursAllocatedInfo } = require("./payrunExtraAllocationInfoController");
const { getEmployeeId, getPayrollActiveEmployees } = require("./userController");
// const { generateT4Slip } = require("./t4SlipController");
const {
	buildNewEmpPayStubInfo,
	findEmployeeBenefitInfo,
	calculateTimesheetApprovedHours,
} = require("./payrollHelper");
const { findEmployeePayInfoDetails } = require("./payInfoController");
const { findEmployeeGovernmentInfoDetails } = require("./governmentInfoController");
const { PAYRUN_TYPE } = require("../services/data");
const { addSeparateSuperficialCheque } = require("./payStubSuperficialCalc");
const { addSeparateManualCheque } = require("./payStubManualCalc");
const { addSeparatePayoutCheque } = require("./payStubPayoutCalc");

const buildPayStub = (
	empId,
	companyName,
	payPeriodStartDate,
	payPeriodEndDate,
	payPeriodPayDate,
	payPeriodProcessingDate,
	payPeriod,
	isExtraRun,
	newEmpData,
	prevPayPayInfo,
) => {
	const {
		regPay,
		overTimePay,
		dblOverTimePay,
		statPay,
		statWorkPay,
		sickPay,
		vacationPay,
		sprayPay,
		firstAidPay,

		payInLieuPay,
		pILBenefitPay,
		bankedTimePay,
		regularByAmount,
		commission,
		retroactive,
		vacationPayout,
		bonus,
		reimbursement,
		terminationPayout,
		vacationBalAdjust,
		vacationAccrual,
		vacationUsed,
		federalTax,
		provTax,
		incomeTax,
		totalAmountAllocated,

		totalRegHoursWorked,
		totalOvertimeHoursWorked,
		totalDblOvertimeHoursWorked,
		totalStatDayHoursWorked,
		totalStatHours,
		totalSickHoursWorked,
		totalVacationHoursWorked,
		totalSprayHoursWorked,
		totalFirstAidHoursWorked,
		totalHoursWorked,
		currentRegPayTotal,
		currentOverTimePayTotal,
		currentDblOverTimePayTotal,
		currentStatWorkPayTotal,
		currentStatPayTotal,
		currentSickPayTotal,
		currentVacationPayTotal,
		currentSprayPayTotal,
		currentFirstAidPayTotal,
		currentGrossPay,
		currentFDTaxDeductions,
		currentStateTaxDeductions,
		currentIncomeTaxDeductions,
		currentCPPDeductions,
		currentUnionDuesDeductions,
		currentEmployeeEIDeductions,
		currentEmployerEIDeductions,
		currentEmployeeHealthContributions,
		currentPrimaryDeposit,
		currentEmployeePensionContributions,
		currentOtherDeductions,
		currentDeductionsTotal,
		currentNetPay,
		currentEmployerPensionContributions,
		currentEmployerHealthContributions,
		currentEmployerContributions,
		currentVacationAccrued,
		currentVacationUsed,
		vacationBalance,
		currentVacationBalanceFwd,
		currentSickAccrued,
		currentSickUsed,
		sickBalance,
	} = newEmpData;

	const newPayStub = {
		empId,
		companyName,
		payPeriodStartDate,
		payPeriodEndDate,
		payPeriodPayDate,
		payPeriodProcessingDate,
		payPeriodNum: payPeriod,
		isProcessed: true,
		isExtraRun,
		regPay,
		overTimePay,
		dblOverTimePay,
		statPay,
		statWorkPay,
		sickPay,
		vacationPay,
		sprayPay,
		firstAidPay,

		payInLieuPay,
		pILBenefitPay,
		bankedTimePay,
		regularByAmount,
		commission,
		retroactive,
		vacationPayout,
		bonus,
		terminationPayout,
		reimbursement,
		vacationBalAdjust,
		vacationAccrual,
		vacationUsed,
		federalTax,
		provTax,
		incomeTax,
		totalAmountAllocated,

		totalRegHoursWorked,
		totalOvertimeHoursWorked,
		totalDblOvertimeHoursWorked,
		totalStatDayHoursWorked,
		totalStatHours,
		totalSickHoursWorked,
		totalVacationHoursWorked,
		totalSprayHoursWorked,
		totalFirstAidHoursWorked,
		totalHoursWorked,

		YTDRegHoursWorked: getSumTotal(prevPayPayInfo?.YTDRegHoursWorked, totalRegHoursWorked),
		YTDOvertimeHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDOvertimeHoursWorked,
			totalOvertimeHoursWorked,
		),
		YTDDblOvertimeHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDDblOvertimeHoursWorked,
			totalDblOvertimeHoursWorked,
		),
		YTDStatDayHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDStatDayHoursWorked,
			totalStatDayHoursWorked,
		),
		YTDStatHoursWorked: getSumTotal(prevPayPayInfo?.YTDStatHoursWorked, totalStatHours),
		YTDSickHoursWorked: getSumTotal(prevPayPayInfo?.YTDSickHoursWorked, totalSickHoursWorked),
		YTDVacationHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDVacationHoursWorked,
			totalVacationHoursWorked,
		),
		YTDSprayHoursWorked: getSumTotal(prevPayPayInfo?.YTDSprayHoursWorked, totalSprayHoursWorked),
		YTDFirstAidHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDFirstAidHoursWorked,
			totalFirstAidHoursWorked,
		),

		currentRegPayTotal,
		currentOverTimePayTotal,
		currentDblOverTimePayTotal,
		currentStatWorkPayTotal,
		currentStatPayTotal,
		currentSickPayTotal,
		currentVacationPayTotal,
		currentSprayPayTotal,
		currentFirstAidPayTotal,
		currentGrossPay,
		currentFDTaxDeductions,
		currentStateTaxDeductions,
		currentIncomeTaxDeductions,
		currentCPPDeductions,
		currentUnionDuesDeductions,
		currentEmployeeEIDeductions,
		currentEmployerEIDeductions,
		currentEmployeeHealthContributions,
		currentPrimaryDeposit,
		currentEmployeePensionContributions,
		currentOtherDeductions,
		currentDeductionsTotal,
		currentNetPay,
		currentEmployerPensionContributions,
		currentEmployerHealthContributions,
		currentEmployerContributions,
		currentVacationAccrued,
		currentVacationBalanceFwd,
		currentVacationUsed,
		vacationBalance,
		currentSickAccrued,
		currentSickUsed,
		sickBalance,

		YTDRegPayTotal: getSumTotal(prevPayPayInfo?.YTDRegPayTotal, currentRegPayTotal),
		YTDOverTimePayTotal: getSumTotal(prevPayPayInfo?.YTDOverTimePayTotal, currentOverTimePayTotal),
		YTDDblOverTimePayTotal: getSumTotal(
			prevPayPayInfo?.YTDDblOverTimePayTotal,
			currentDblOverTimePayTotal,
		),
		YTDStatWorkPayTotal: getSumTotal(prevPayPayInfo?.YTDStatWorkPayTotal, currentStatWorkPayTotal),
		YTDStatPayTotal: getSumTotal(prevPayPayInfo?.YTDStatPayTotal, currentStatPayTotal),
		YTDSickPayTotal: getSumTotal(prevPayPayInfo?.YTDSickPayTotal, currentSickPayTotal),
		YTDVacationPayTotal: getSumTotal(prevPayPayInfo?.YTDVacationPayTotal, currentVacationPayTotal),
		YTDSprayPayTotal: getSumTotal(prevPayPayInfo?.YTDSprayPayTotal, currentSprayPayTotal),
		YTDFirstAidPayTotal: getSumTotal(prevPayPayInfo?.YTDFirstAidPayTotal, currentFirstAidPayTotal),
		YTDPayInLieuPay: getSumTotal(prevPayPayInfo?.YTDPayInLieuPay, payInLieuPay),
		YTDBenefitPay: getSumTotal(prevPayPayInfo?.YTDBenefitPay, pILBenefitPay),
		YTDBankedTimePay: getSumTotal(prevPayPayInfo?.YTDBankedTimePay, bankedTimePay),
		YTDRegularByAmount: getSumTotal(prevPayPayInfo?.YTDRegularByAmount, regularByAmount),
		YTDCommission: getSumTotal(prevPayPayInfo?.YTDCommission, commission),
		YTDRetroactive: getSumTotal(prevPayPayInfo?.YTDRetroactive, retroactive),
		YTDVacationPayout: getSumTotal(prevPayPayInfo?.YTDVacationPayout, vacationPayout),
		YTDBonus: getSumTotal(prevPayPayInfo?.YTDBonus, bonus),
		YTDTerminationPayout: getSumTotal(prevPayPayInfo?.YTDTerminationPayout, terminationPayout),
		YTD_FDTaxDeductions: getSumTotal(prevPayPayInfo?.YTD_FDTaxDeductions, currentFDTaxDeductions),
		YTDStateTaxDeductions: getSumTotal(
			prevPayPayInfo?.YTDStateTaxDeductions,
			currentStateTaxDeductions,
		),
		YTD_IncomeTaxDeductions: getSumTotal(
			prevPayPayInfo?.YTD_IncomeTaxDeductions,
			currentIncomeTaxDeductions,
		),
		YTD_EmployeeEIDeductions: getSumTotal(
			prevPayPayInfo?.YTD_EmployeeEIDeductions,
			currentEmployeeEIDeductions,
		),
		YTD_EmployerEIDeductions: getSumTotal(
			prevPayPayInfo?.YTD_EmployerEIDeductions,
			currentEmployerEIDeductions,
		),
		YTD_CPPDeductions: getSumTotal(prevPayPayInfo?.YTD_CPPDeductions, currentCPPDeductions),
		YTDUnionDuesDeductions: getSumTotal(
			prevPayPayInfo?.YTDUnionDuesDeductions,
			currentUnionDuesDeductions,
		),
		YTDEmployeeHealthContributions: getSumTotal(
			prevPayPayInfo?.YTDEmployeeHealthContributions,
			currentEmployeeHealthContributions,
		),
		YTDPrimaryDeposit: getSumTotal(prevPayPayInfo?.YTDPrimaryDeposit, currentPrimaryDeposit),
		YTDEmployeePensionContributions: getSumTotal(
			prevPayPayInfo?.YTDEmployeePensionContributions,
			currentEmployeePensionContributions,
		),
		YTDOtherDeductions: getSumTotal(prevPayPayInfo?.YTDOtherDeductions, currentOtherDeductions),

		YTDGrossPay: getSumTotal(prevPayPayInfo?.YTDGrossPay, currentGrossPay),

		YTDDeductionsTotal: getSumTotal(prevPayPayInfo?.YTDDeductionsTotal, currentDeductionsTotal),

		YTDNetPay: getSumTotal(prevPayPayInfo?.YTDNetPay, currentNetPay),

		YTDEmployerPensionContributions: getSumTotal(
			prevPayPayInfo?.YTDEmployerPensionContributions,
			currentEmployerPensionContributions,
		),
		YTDEmployerHealthContributions: getSumTotal(
			prevPayPayInfo?.YTDEmployerHealthContributions,
			currentEmployerHealthContributions,
		),
		YTDEmployerContributions: getSumTotal(
			prevPayPayInfo?.YTDEmployerContributions,
			currentEmployerContributions,
		),
		YTDVacationAccrued: getSumTotal(prevPayPayInfo?.YTDVacationAccrued, currentVacationAccrued),
		YTDVacationUsed: getSumTotal(prevPayPayInfo?.YTDVacationUsed, currentVacationUsed),
		YTDVacationBalanceFwd: currentVacationBalanceFwd,
		YTDVacationBalance: getSumTotal(prevPayPayInfo?.YTDVacationBalance, vacationBalance),
		YTDSickAccrued: getSumTotal(prevPayPayInfo?.YTDSickAccrued, currentSickAccrued),
		YTDSickUsed: getSumTotal(prevPayPayInfo?.YTDSickUsed, currentSickUsed),
		YTDSickBalance: getSumTotal(prevPayPayInfo?.YTDSickBalance, sickBalance),
	};
	return newPayStub;
};

const buildPayStubDetails = async (currentPayPeriod, companyName, empTimesheetData, empId) => {
	const {
		payPeriodStartDate,
		payPeriodEndDate,
		payPeriodPayDate,
		payPeriodProcessingDate,
		payPeriod,
		isExtraRun,
	} = currentPayPeriod;

	const empPayInfoResult = await findEmployeePayInfoDetails(empId, companyName);
	const empBenefitInfoResult = await findEmployeeBenefitInfo(empId, companyName);
	const empAdditionalDataAllocated = await findAllAdditionalHoursAllocatedInfo({
		empId,
		payPeriodPayDate,
	});
	const empTaxCreditResult = await findEmployeeGovernmentInfoDetails(empId, companyName);

	const payStubInfoData = buildNewEmpPayStubInfo(
		empTimesheetData,
		empPayInfoResult,
		empAdditionalDataAllocated,
		empBenefitInfoResult,
		empTaxCreditResult,
	);

	const prevPayPeriodNum = isExtraRun ? payPeriod : payPeriod - 1;
	let prevPayPayInfo = await findPayStub(prevPayPeriodNum, companyName, empId, false);
	const currentPayInfo = await findPayStub(
		payPeriod,
		companyName,
		empId,
		isExtraRun ? isExtraRun : false,
	);

	const currentPayStub = buildPayStub(
		empId,
		companyName,
		payPeriodStartDate,
		payPeriodEndDate,
		payPeriodPayDate,
		payPeriodProcessingDate,
		payPeriod,
		isExtraRun,
		payStubInfoData,
		prevPayPayInfo,
	);

	if (currentPayInfo) {
		await updatePayStub(currentPayInfo._id, currentPayStub);
	} else {
		empAdditionalDataAllocated.chequesType?.forEach(async (_, index) => {
			if (_ === PAYRUN_TYPE.SUPERFICIAL) {
				const newPayStub = await addSeparateSuperficialCheque(
					empId,
					companyName,
					payPeriodStartDate,
					payPeriodEndDate,
					payPeriodPayDate,
					payPeriodProcessingDate,
					payPeriod,
					isExtraRun,
					prevPayPayInfo,
				);
				await addPayStub(newPayStub);
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
					YTDSprayHoursWorked,
					YTDFirstAidHoursWorked,
					YTDRegPayTotal,
					YTDDblOverTimePayTotal,
					YTDStatWorkPayTotal,
					YTDStatPayTotal,
					YTDSickPayTotal,
					YTDVacationPayTotal,
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
				prevPayPayInfo.YTDSprayHoursWorked = getSumTotal(
					prevPayPayInfo.YTDSprayHoursWorked,
					YTDSprayHoursWorked,
				);
				prevPayPayInfo.YTDFirstAidHoursWorked = getSumTotal(
					prevPayPayInfo.YTDFirstAidHoursWorked,
					YTDFirstAidHoursWorked,
				);

				prevPayPayInfo.YTDRegPayTotal = getSumTotal(prevPayPayInfo.YTDRegPayTotal, YTDRegPayTotal);
				prevPayPayInfo.YTDDblOverTimePayTotal = getSumTotal(
					prevPayPayInfo.YTDDblOverTimePayTotal,
					YTDDblOverTimePayTotal,
				);
				prevPayPayInfo.YTDStatWorkPayTotal = getSumTotal(
					prevPayPayInfo.YTDStatWorkPayTotal,
					YTDStatWorkPayTotal,
				);
				prevPayPayInfo.YTDStatPayTotal = getSumTotal(
					prevPayPayInfo.YTDStatPayTotal,
					YTDStatPayTotal,
				);
				prevPayPayInfo.YTDSickPayTotal = getSumTotal(
					prevPayPayInfo.YTDSickPayTotal,
					YTDSickPayTotal,
				);
				prevPayPayInfo.YTDVacationPayTotal = getSumTotal(
					prevPayPayInfo.YTDVacationPayTotal,
					YTDVacationPayTotal,
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
				prevPayPayInfo.YTDVacationAccrued = getSumTotal(
					prevPayPayInfo.YTDVacationAccrued,
					YTDVacationAccrued,
				);
				prevPayPayInfo.YTDVacationUsed = getSumTotal(
					prevPayPayInfo.YTDVacationUsed,
					YTDVacationUsed,
				);
				prevPayPayInfo.YTDVacationBalanceFwd = getSumTotal(
					prevPayPayInfo.YTDVacationBalanceFwd,
					YTDVacationBalanceFwd,
				);
				prevPayPayInfo.YTDVacationBalance = getSumTotal(
					prevPayPayInfo.YTDVacationBalance,
					YTDVacationBalance,
				);
				prevPayPayInfo.YTDSprayPayTotal = getSumTotal(
					prevPayPayInfo.YTDSprayPayTotal,
					YTDSprayPayTotal,
				);
				prevPayPayInfo.YTDFirstAidPayTotal = getSumTotal(
					prevPayPayInfo.YTDFirstAidPayTotal,
					YTDFirstAidPayTotal,
				);
				prevPayPayInfo.YTDPayInLieuPay = getSumTotal(
					prevPayPayInfo.YTDPayInLieuPay,
					YTDPayInLieuPay,
				);
				prevPayPayInfo.YTDBenefitPay = getSumTotal(prevPayPayInfo.YTDBenefitPay, YTDBenefitPay);
				prevPayPayInfo.YTDBankedTimePay = getSumTotal(
					prevPayPayInfo.YTDBankedTimePay,
					YTDBankedTimePay,
				);
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
			}

			if (_ === PAYRUN_TYPE.MANUAL) {
				console.log("MANUAL");
				// const newPayStub = await addSeparateManualCheque(
				// 	empId,
				// 	companyName,
				// 	payPeriodStartDate,
				// 	payPeriodEndDate,
				// 	payPeriodPayDate,
				// 	payPeriodProcessingDate,
				// 	payPeriod,
				// 	isExtraRun,
				// 	prevPayPayInfo,
				// );
				// await addPayStub(newPayStub);
			}
			if (_ === PAYRUN_TYPE.PAYOUT) {
				console.log("PAYOUT");
				// const newPayStub = await addSeparatePayoutCheque(
				// 	empId,
				// 	companyName,
				// 	payPeriodStartDate,
				// 	payPeriodEndDate,
				// 	payPeriodPayDate,
				// 	payPeriodProcessingDate,
				// 	payPeriod,
				// 	isExtraRun,
				// 	prevPayPayInfo,
				// );
				// await addPayStub(newPayStub);
			}
			if (index === empAdditionalDataAllocated.chequesType?.length - 1) {
				const updatedPayStub = buildPayStub(
					empId,
					companyName,
					payPeriodStartDate,
					payPeriodEndDate,
					payPeriodPayDate,
					payPeriodProcessingDate,
					payPeriod,
					isExtraRun,
					payStubInfoData,
					prevPayPayInfo,
				);
				await addPayStub(updatedPayStub);
			}
		});
	}
};

const findPayStub = async (payPeriodNum, companyName, empId, isExtra) => {
	const searchObj = isExtra
		? {
				payPeriodNum,
				companyName,
				empId,
				isProcessed: true,
				isExtraRun: isExtra,
		  }
		: {
				payPeriodNum,
				companyName,
				empId,
				isProcessed: true,
		  };
	return await EmployeePayStub.findOne(searchObj).sort({ createdOn: -1 });
};

const findEmployeePayStub = async (empId, payPeriodNum) =>
	await EmployeePayStub.findOne({
		empId,
		payPeriodNum,
	}).select("empId commission retroactive vacationPayout bonus terminationPayout");

const addPayStub = async (data) => await EmployeePayStub.create(data);

const updatePayStub = async (id, data) =>
	await EmployeePayStub.findByIdAndUpdate(id, data, {
		new: true,
	});

const addEmployeePayStubInfo = async (req, res) => {
	const { companyName, currentPayPeriod } = req.body;
	try {
		const { payPeriodStartDate, payPeriodEndDate, isExtraRun, selectedEmp, payPeriod } =
			currentPayPeriod;

		const activeEmployees = isExtraRun
			? await getEmployeeId(selectedEmp)
			: await getPayrollActiveEmployees(companyName);

		const result = isExtraRun
			? null
			: await calculateTimesheetApprovedHours(payPeriodStartDate, payPeriodEndDate, companyName);

		for (const employee of activeEmployees) {
			const empTimesheetData = result?.find(
				(el) => el.empId._id.toString() === employee._id.toString(),
			);

			const payStubResult = await buildPayStubDetails(
				currentPayPeriod,
				companyName,
				empTimesheetData ?? null,
				employee._id,
			);
		}
		// generateT4Slip(companyName, payPeriod);
		//if payroll processed successful
		//alerts violation generate independently based on emp data, on process payroll will run again to check alerts or violations.
		res.status(200).json({ message: "Paystub created successfully" });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const EMP_INFO = {
	path: "empId",
	model: "Employee",
	select: ["companyId", "employeeId", "fullName", "primaryAddress", "employeeNo"],
};

const getPayDetailsReportInfo = async (req, res) => {
	const { companyName, payPeriodNum, isExtraRun } = req.params;

	try {
		const isExtraPayRun = isExtraRun === "true";
		const payStubs = await EmployeePayStub.find({
			companyName,
			payPeriodNum,
			isExtraRun: isExtraPayRun,
		}).populate(EMP_INFO);

		payStubs.sort((a, b) => {
			const nameA = a.empId?.fullName?.toLowerCase();
			const nameB = b.empId?.fullName?.toLowerCase();
			return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
		});
		res.status(200).json(payStubs);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getEmployeePayDetailsReportInfo = async (req, res) => {
	const { companyName, empId } = req.params;

	try {
		const payStubs = await EmployeePayStub.find({
			companyName,
			empId,
			isProcessed: true,
		})
			.populate(EMP_INFO)
			.sort({
				payPeriodPayDate: -1,
			});
		res.status(200).json(payStubs);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getRecordId = async (empPayStubResult, empId, companyName, payPeriodPayDate) => {
	if (empPayStubResult) {
		return empPayStubResult._id;
	}
	const payStub = {
		empId,
		companyName,
		payPeriodPayDate,
		commission: 0,
		retroactive: 0,
		vacationPayout: 0,
		bonus: 0,
		terminationPayout: 0,
		reimbursement: 0,
	};
	const newPayStub = await addPayStub(payStub);
	return newPayStub._id;
};

module.exports = {
	getPayDetailsReportInfo,
	getEmployeePayDetailsReportInfo,
	addEmployeePayStubInfo,
	getRecordId,
	calculateTimesheetApprovedHours,
};
