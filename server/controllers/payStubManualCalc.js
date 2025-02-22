const { getSumTotal } = require("../services/payrollService");
const { findAdditionalManualAmountAllocatedInfo } = require("./payrunEEContrCalc");
const {
	findAdditionalManualHoursAllocatedInfo,
	findEEManualContribution,
} = require("./payrunExtraAllocationInfoController");

const addSeparateManualCheque = async (
	empId,
	companyName,
	payPeriodStartDate,
	payPeriodEndDate,
	payPeriodPayDate,
	payPeriodProcessingDate,
	payPeriod,
	isExtraRun,
	prevPayPayInfo,
) => {
	const empAdditionalManualDataAllocated = await findAdditionalManualAmountAllocatedInfo({
		empId,
		companyName,
		payPeriodPayDate,
	});

	const additionalHoursAllocatedInfo = await findAdditionalManualHoursAllocatedInfo({
		empId,
		companyName,
		payPeriodPayDate,
	});

	const empEEManualContribution = await findEEManualContribution({
		empId,
		payPeriodPayDate,
	});

	const {
		totalManualHoursWorked,
		additionalManualRegHoursWorked,
		additionalManualOvertimeHoursWorked,
		additionalManualDblOvertimeHoursWorked,
		additionalManualStatDayHoursWorked,
		additionalManualVacationHoursWorked,
		additionalManualStatHoursWorked,
		additionalManualSickHoursWorked,
	} = additionalHoursAllocatedInfo;

	const {
		regPayAmtManual,
		OTPayAmtManual,
		dblOTPayAmtManual,
		statPayAmtManual,
		statWorkPayAmtManual,
		vacationPayAmtManual,
		sickPayAmtManual,
		totalManualAmountAllocated,
		commissionManual,
		bonusManual,
		retroactiveManual,
		reimbursementManual,
		terminationPayoutManual,
		vacationPayoutManual,
		vacationBalAdjustManual,
		vacationAccrualManual,
		vacationUsedManual,
		federalTaxManual,
		provTaxManual,
		incomeTaxManual,
	} = empAdditionalManualDataAllocated;

	const {
		unionDuesManual,
		EE_EHPManual,
		EE_EPPManual,
		EE_EIManual,
		EE_CPPManual,
		ER_EHPManual,
		ER_EPPManual,
		ER_EIManual,
		ER_CPPManual,
	} = empEEManualContribution;

	const grossSum =
		regPayAmtManual +
		OTPayAmtManual +
		dblOTPayAmtManual +
		statWorkPayAmtManual +
		statPayAmtManual +
		sickPayAmtManual +
		vacationPayAmtManual +
		commissionManual +
		retroactiveManual +
		vacationPayoutManual +
		bonusManual +
		terminationPayoutManual;

	const deductionSum =
		federalTaxManual +
		provTaxManual +
		EE_CPPManual +
		EE_EIManual +
		unionDuesManual +
		EE_EHPManual +
		0 +
		EE_EPPManual +
		0;

	const netPay = grossSum - deductionSum;
	const vacBalance = vacationBalAdjustManual + (vacationAccrualManual - vacationUsedManual);
	const empContr = ER_EPPManual + ER_EHPManual;

	const manualPayStub = {
		empId,
		companyName,
		payPeriodStartDate,
		payPeriodEndDate,
		payPeriodPayDate,
		payPeriodProcessingDate,
		payPeriodNum: payPeriod,
		isProcessed: true,
		isExtraRun,
		regPay: 0,
		overTimePay: 0,
		dblOverTimePay: 0,
		statPay: 0,
		statWorkPay: 0,
		sickPay: 0,
		vacationPay: 0,
		sprayPay: 0,
		firstAidPay: 0,
		payInLieuPay: 0,
		pILBenefitPay: 0,
		bankedTimePay: 0,
		regularByAmount: 0,

		commission: commissionManual,
		retroactive: retroactiveManual,
		vacationPayout: vacationPayoutManual,
		bonus: bonusManual,
		terminationPayout: terminationPayoutManual,
		reimbursement: reimbursementManual,
		vacationBalAdjust: vacationBalAdjustManual,
		vacationAccrual: vacationAccrualManual,
		vacationUsed: vacationUsedManual,
		federalTax: federalTaxManual,
		provTax: provTaxManual,
		incomeTax: incomeTaxManual,
		totalAmountAllocated: totalManualAmountAllocated,

		YTDCommission: getSumTotal(prevPayPayInfo?.YTDCommission, commissionManual),
		YTDRetroactive: getSumTotal(prevPayPayInfo?.YTDRetroactive, retroactiveManual),
		YTDVacationPayout: getSumTotal(prevPayPayInfo?.YTDVacationPayout, vacationPayoutManual),
		YTDBonus: getSumTotal(prevPayPayInfo?.YTDBonus, bonusManual),
		YTDTerminationPayout: getSumTotal(
			prevPayPayInfo?.YTDTerminationPayout,
			terminationPayoutManual,
		),

		totalRegHoursWorked: additionalManualRegHoursWorked,
		totalOvertimeHoursWorked: additionalManualOvertimeHoursWorked,
		totalDblOvertimeHoursWorked: additionalManualDblOvertimeHoursWorked,
		totalStatDayHoursWorked: additionalManualStatDayHoursWorked,
		totalStatHours: additionalManualStatHoursWorked,
		totalSickHoursWorked: additionalManualSickHoursWorked,
		totalVacationHoursWorked: additionalManualVacationHoursWorked,
		totalSprayHoursWorked: 0,
		totalFirstAidHoursWorked: 0,
		totalHoursWorked: totalManualHoursWorked,

		YTDRegHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDRegHoursWorked,
			additionalManualRegHoursWorked,
		),
		YTDOvertimeHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDOvertimeHoursWorked,
			additionalManualOvertimeHoursWorked,
		),
		YTDDblOvertimeHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDDblOvertimeHoursWorked,
			additionalManualDblOvertimeHoursWorked,
		),
		YTDStatDayHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDStatDayHoursWorked,
			additionalManualStatDayHoursWorked,
		),
		YTDStatHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDStatHoursWorked,
			additionalManualStatHoursWorked,
		),
		YTDSickHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDSickHoursWorked,
			additionalManualSickHoursWorked,
		),
		YTDVacationHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDVacationHoursWorked,
			additionalManualVacationHoursWorked,
		),
		YTDSprayHoursWorked: getSumTotal(prevPayPayInfo?.YTDSprayHoursWorked, 0),
		YTDFirstAidHoursWorked: getSumTotal(prevPayPayInfo?.YTDFirstAidHoursWorked, 0),

		currentEmployerCPPDeductions: ER_CPPManual,
		currentRegPayTotal: regPayAmtManual,
		currentOverTimePayTotal: OTPayAmtManual,
		currentDblOverTimePayTotal: dblOTPayAmtManual,
		currentStatWorkPayTotal: statWorkPayAmtManual,
		currentStatPayTotal: statPayAmtManual,
		currentSickPayTotal: sickPayAmtManual,
		currentVacationPayTotal: vacationPayAmtManual,
		currentSprayPayTotal: 0,
		currentFirstAidPayTotal: 0,
		currentGrossPay: grossSum,

		YTDRegPayTotal: getSumTotal(prevPayPayInfo?.YTDRegPayTotal, regPayAmtManual),
		YTDOverTimePayTotal: getSumTotal(prevPayPayInfo?.YTDOverTimePayTotal, OTPayAmtManual),
		YTDDblOverTimePayTotal: getSumTotal(prevPayPayInfo?.YTDDblOverTimePayTotal, dblOTPayAmtManual),
		YTDStatWorkPayTotal: getSumTotal(prevPayPayInfo?.YTDStatWorkPayTotal, statWorkPayAmtManual),
		YTDStatPayTotal: getSumTotal(prevPayPayInfo?.YTDStatPayTotal, statPayAmtManual),
		YTDSickPayTotal: getSumTotal(prevPayPayInfo?.YTDSickPayTotal, sickPayAmtManual),
		YTDVacationPayTotal: getSumTotal(prevPayPayInfo?.YTDVacationPayTotal, vacationPayAmtManual),

		currentFDTaxDeductions: federalTaxManual,
		currentStateTaxDeductions: provTaxManual,
		currentIncomeTaxDeductions: incomeTaxManual,

		YTD_FDTaxDeductions: getSumTotal(prevPayPayInfo?.YTD_FDTaxDeductions, federalTaxManual),
		YTDStateTaxDeductions: getSumTotal(prevPayPayInfo?.YTDStateTaxDeductions, provTaxManual),
		YTD_IncomeTaxDeductions: getSumTotal(prevPayPayInfo?.YTD_IncomeTaxDeductions, incomeTaxManual),

		currentCPPDeductions: EE_CPPManual,
		currentUnionDuesDeductions: unionDuesManual,
		currentEmployeeEIDeductions: EE_EIManual,
		currentEmployerEIDeductions: ER_EIManual,
		currentEmployeeHealthContributions: EE_EHPManual,
		currentPrimaryDeposit: 0,
		currentEmployeePensionContributions: EE_EPPManual,
		currentOtherDeductions: 0,
		currentDeductionsTotal: deductionSum,
		currentNetPay: netPay,
		currentEmployerPensionContributions: ER_EPPManual,
		currentEmployerHealthContributions: ER_EHPManual,
		currentEmployerContributions: empContr,

		YTD_EmployeeEIDeductions: getSumTotal(prevPayPayInfo?.YTD_EmployeeEIDeductions, EE_EIManual),
		YTD_EmployerEIDeductions: getSumTotal(prevPayPayInfo?.YTD_EmployerEIDeductions, ER_EIManual),
		YTD_EmployerCPPDeductions: getSumTotal(prevPayPayInfo?.YTD_CPPDeductions, ER_CPPManual),
		YTD_CPPDeductions: getSumTotal(prevPayPayInfo?.YTD_CPPDeductions, EE_CPPManual),
		YTDUnionDuesDeductions: getSumTotal(prevPayPayInfo?.YTDUnionDuesDeductions, unionDuesManual),
		YTDEmployeeHealthContributions: getSumTotal(
			prevPayPayInfo?.YTDEmployeeHealthContributions,
			EE_EHPManual,
		),
		YTDEmployeePensionContributions: getSumTotal(
			prevPayPayInfo?.YTDEmployeePensionContributions,
			EE_EPPManual,
		),
		YTDEmployerPensionContributions: getSumTotal(
			prevPayPayInfo?.YTDEmployerPensionContributions,
			ER_EPPManual,
		),
		YTDEmployerHealthContributions: getSumTotal(
			prevPayPayInfo?.YTDEmployerHealthContributions,
			ER_EHPManual,
		),
		YTDEmployerContributions: getSumTotal(prevPayPayInfo?.YTDEmployerContributions, empContr),

		currentVacationAccrued: vacationAccrualManual,
		currentVacationBalanceFwd: vacationBalAdjustManual,
		currentVacationUsed: vacationUsedManual,
		vacationBalance: vacBalance,
		currentSickAccrued: 0,
		currentSickUsed: 0,
		sickBalance: 0,

		YTDVacationAccrued: getSumTotal(prevPayPayInfo?.YTDVacationAccrued, vacationAccrualManual),
		YTDVacationUsed: getSumTotal(prevPayPayInfo?.YTDVacationUsed, vacationUsedManual),
		YTDVacationBalanceFwd: getSumTotal(
			prevPayPayInfo?.YTDVacationBalanceFwd,
			vacationBalAdjustManual,
		),
		YTDVacationBalance: getSumTotal(prevPayPayInfo?.YTDVacationBalance, vacBalance),

		YTDSprayPayTotal: getSumTotal(prevPayPayInfo?.YTDSprayPayTotal, 0),
		YTDFirstAidPayTotal: getSumTotal(prevPayPayInfo?.YTDFirstAidPayTotal, 0),
		YTDPayInLieuPay: getSumTotal(prevPayPayInfo?.YTDPayInLieuPay, 0),
		YTDBenefitPay: getSumTotal(prevPayPayInfo?.YTDBenefitPay, 0),
		YTDBankedTimePay: getSumTotal(prevPayPayInfo?.YTDBankedTimePay, 0),
		YTDRegularByAmount: getSumTotal(prevPayPayInfo?.YTDRegularByAmount, 0),

		YTDPrimaryDeposit: getSumTotal(prevPayPayInfo?.YTDPrimaryDeposit, 0),
		YTDOtherDeductions: getSumTotal(prevPayPayInfo?.YTDOtherDeductions, 0),
		YTDGrossPay: getSumTotal(prevPayPayInfo?.YTDGrossPay, grossSum),
		YTDDeductionsTotal: getSumTotal(prevPayPayInfo?.YTDDeductionsTotal, deductionSum),
		YTDNetPay: getSumTotal(prevPayPayInfo?.YTDNetPay, netPay),
		YTDSickAccrued: getSumTotal(prevPayPayInfo?.YTDSickAccrued, 0),
		YTDSickUsed: getSumTotal(prevPayPayInfo?.YTDSickUsed, 0),
		YTDSickBalance: getSumTotal(prevPayPayInfo?.YTDSickBalance, 0),
	};
	return manualPayStub;
};

module.exports = { addSeparateManualCheque };
