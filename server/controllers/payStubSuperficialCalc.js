const { getSumTotal } = require("../services/payrollService");
const { findAdditionalSuperficialAmountAllocatedInfo } = require("./payrunEEContrCalc");
const {
	findAdditionalSuperficialHoursAllocatedInfo,
	findEESuperficialContribution,
} = require("./payrunExtraAllocationInfoController");

const addSeparateSuperficialCheque = async (
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
	const empAdditionalSuperficialDataAllocated = await findAdditionalSuperficialAmountAllocatedInfo({
		empId,
		companyName,
		payPeriodPayDate,
	});

	const additionalHoursAllocatedInfo = await findAdditionalSuperficialHoursAllocatedInfo({
		empId,
		companyName,
		payPeriodPayDate,
	});

	const empEESuperficialContribution = await findEESuperficialContribution({
		empId,
		payPeriodPayDate,
	});

	const {
		totalSuperficialHoursWorked,
		additionalSuperficialRegHoursWorked,
		additionalSuperficialOvertimeHoursWorked,
		additionalSuperficialDblOvertimeHoursWorked,
		additionalSuperficialStatDayHoursWorked,
		additionalSuperficialVacationHoursWorked,
		additionalSuperficialStatHoursWorked,
		additionalSuperficialSickHoursWorked,
	} = additionalHoursAllocatedInfo;

	const {
		regPayAmtSuperficial,
		OTPayAmtSuperficial,
		dblOTPayAmtSuperficial,
		statPayAmtSuperficial,
		statWorkPayAmtSuperficial,
		vacationPayAmtSuperficial,
		sickPayAmtSuperficial,
		totalSuperficialAmountAllocated,
		commissionSuperficial,
		bonusSuperficial,
		retroactiveSuperficial,
		reimbursementSuperficial,
		terminationPayoutSuperficial,
		vacationPayoutSuperficial,
		vacationBalAdjustSuperficial,
		vacationAccrualSuperficial,
		vacationUsedSuperficial,
		federalTaxSuperficial,
		provTaxSuperficial,
		incomeTaxSuperficial,
	} = empAdditionalSuperficialDataAllocated;

	const {
		unionDuesSuperficial,
		EE_EHPSuperficial,
		EE_EPPSuperficial,
		EE_EISuperficial,
		EE_CPPSuperficial,
		ER_EHPSuperficial,
		ER_EPPSuperficial,
		ER_EISuperficial,
		ER_CPPSuperficial,
	} = empEESuperficialContribution;

	const superficialPayStub = {
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

		commission: commissionSuperficial,
		retroactive: retroactiveSuperficial,
		vacationPayout: vacationPayoutSuperficial,
		bonus: bonusSuperficial,
		terminationPayout: terminationPayoutSuperficial,
		reimbursement: reimbursementSuperficial,
		vacationBalAdjust: vacationBalAdjustSuperficial,
		vacationAccrual: vacationAccrualSuperficial,
		vacationUsed: vacationUsedSuperficial,
		federalTax: federalTaxSuperficial,
		provTax: provTaxSuperficial,
		incomeTax: incomeTaxSuperficial,
		totalAmountAllocated: totalSuperficialAmountAllocated,

		YTDCommission: getSumTotal(prevPayPayInfo?.YTDCommission, commissionSuperficial),
		YTDRetroactive: getSumTotal(prevPayPayInfo?.YTDRetroactive, retroactiveSuperficial),
		YTDVacationPayout: getSumTotal(prevPayPayInfo?.YTDVacationPayout, vacationPayoutSuperficial),
		YTDBonus: getSumTotal(prevPayPayInfo?.YTDBonus, bonusSuperficial),
		YTDTerminationPayout: getSumTotal(
			prevPayPayInfo?.YTDTerminationPayout,
			terminationPayoutSuperficial,
		),

		totalRegHoursWorked: additionalSuperficialRegHoursWorked,
		totalOvertimeHoursWorked: additionalSuperficialOvertimeHoursWorked,
		totalDblOvertimeHoursWorked: additionalSuperficialDblOvertimeHoursWorked,
		totalStatDayHoursWorked: additionalSuperficialStatDayHoursWorked,
		totalStatHours: additionalSuperficialStatHoursWorked,
		totalSickHoursWorked: additionalSuperficialSickHoursWorked,
		totalVacationHoursWorked: additionalSuperficialVacationHoursWorked,
		totalSprayHoursWorked: 0,
		totalFirstAidHoursWorked: 0,
		totalHoursWorked: totalSuperficialHoursWorked,

		YTDRegHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDRegHoursWorked,
			additionalSuperficialRegHoursWorked,
		),
		YTDOvertimeHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDOvertimeHoursWorked,
			additionalSuperficialOvertimeHoursWorked,
		),
		YTDDblOvertimeHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDDblOvertimeHoursWorked,
			additionalSuperficialDblOvertimeHoursWorked,
		),
		YTDStatDayHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDStatDayHoursWorked,
			additionalSuperficialStatDayHoursWorked,
		),
		YTDStatHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDStatHoursWorked,
			additionalSuperficialStatHoursWorked,
		),
		YTDSickHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDSickHoursWorked,
			additionalSuperficialSickHoursWorked,
		),
		YTDVacationHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDVacationHoursWorked,
			additionalSuperficialVacationHoursWorked,
		),
		YTDSprayHoursWorked: getSumTotal(prevPayPayInfo?.YTDSprayHoursWorked, 0),
		YTDFirstAidHoursWorked: getSumTotal(prevPayPayInfo?.YTDFirstAidHoursWorked, 0),

		currentEmployerCPPDeductions: ER_CPPSuperficial,
		currentRegPayTotal: regPayAmtSuperficial,
		currentOverTimePayTotal: OTPayAmtSuperficial,
		currentDblOverTimePayTotal: dblOTPayAmtSuperficial,
		currentStatWorkPayTotal: statWorkPayAmtSuperficial,
		currentStatPayTotal: statPayAmtSuperficial,
		currentSickPayTotal: sickPayAmtSuperficial,
		currentVacationPayTotal: vacationPayAmtSuperficial,
		currentSprayPayTotal: 0,
		currentFirstAidPayTotal: 0,
		currentGrossPay: 0,

		YTDRegPayTotal: getSumTotal(prevPayPayInfo?.YTDRegPayTotal, regPayAmtSuperficial),
		YTDOverTimePayTotal: getSumTotal(prevPayPayInfo?.YTDOverTimePayTotal, OTPayAmtSuperficial),
		YTDDblOverTimePayTotal: getSumTotal(
			prevPayPayInfo?.YTDDblOverTimePayTotal,
			dblOTPayAmtSuperficial,
		),
		YTDStatWorkPayTotal: getSumTotal(
			prevPayPayInfo?.YTDStatWorkPayTotal,
			statWorkPayAmtSuperficial,
		),
		YTDStatPayTotal: getSumTotal(prevPayPayInfo?.YTDStatPayTotal, statPayAmtSuperficial),
		YTDSickPayTotal: getSumTotal(prevPayPayInfo?.YTDSickPayTotal, sickPayAmtSuperficial),
		YTDVacationPayTotal: getSumTotal(
			prevPayPayInfo?.YTDVacationPayTotal,
			vacationPayAmtSuperficial,
		),

		currentFDTaxDeductions: federalTaxSuperficial,
		currentStateTaxDeductions: provTaxSuperficial,
		currentIncomeTaxDeductions: incomeTaxSuperficial,

		YTD_FDTaxDeductions: getSumTotal(prevPayPayInfo?.YTD_FDTaxDeductions, federalTaxSuperficial),
		YTDStateTaxDeductions: getSumTotal(prevPayPayInfo?.YTDStateTaxDeductions, provTaxSuperficial),
		YTD_IncomeTaxDeductions: getSumTotal(
			prevPayPayInfo?.YTD_IncomeTaxDeductions,
			incomeTaxSuperficial,
		),

		currentCPPDeductions: EE_CPPSuperficial,
		currentUnionDuesDeductions: unionDuesSuperficial,
		currentEmployeeEIDeductions: EE_EISuperficial,
		currentEmployerEIDeductions: ER_EISuperficial,
		currentEmployeeHealthContributions: EE_EHPSuperficial,
		currentPrimaryDeposit: 0,
		currentEmployeePensionContributions: EE_EPPSuperficial,
		currentOtherDeductions: 0,
		currentDeductionsTotal: 0,
		currentNetPay: 0,
		currentEmployerPensionContributions: ER_EPPSuperficial,
		currentEmployerHealthContributions: ER_EHPSuperficial,
		currentEmployerContributions: 0,

		YTD_EmployeeEIDeductions: getSumTotal(
			prevPayPayInfo?.YTD_EmployeeEIDeductions,
			EE_EISuperficial,
		),
		YTD_EmployerEIDeductions: getSumTotal(
			prevPayPayInfo?.YTD_EmployerEIDeductions,
			ER_EISuperficial,
		),
		YTD_EmployerCPPDeductions: getSumTotal(prevPayPayInfo?.YTD_CPPDeductions, ER_CPPSuperficial),
		YTD_CPPDeductions: getSumTotal(prevPayPayInfo?.YTD_CPPDeductions, EE_CPPSuperficial),
		YTDUnionDuesDeductions: getSumTotal(
			prevPayPayInfo?.YTDUnionDuesDeductions,
			unionDuesSuperficial,
		),
		YTDEmployeeHealthContributions: getSumTotal(
			prevPayPayInfo?.YTDEmployeeHealthContributions,
			EE_EHPSuperficial,
		),
		YTDEmployeePensionContributions: getSumTotal(
			prevPayPayInfo?.YTDEmployeePensionContributions,
			EE_EPPSuperficial,
		),
		YTDEmployerPensionContributions: getSumTotal(
			prevPayPayInfo?.YTDEmployerPensionContributions,
			ER_EPPSuperficial,
		),
		YTDEmployerHealthContributions: getSumTotal(
			prevPayPayInfo?.YTDEmployerHealthContributions,
			ER_EHPSuperficial,
		),
		YTDEmployerContributions: getSumTotal(prevPayPayInfo?.YTDEmployerContributions, 0),

		currentVacationAccrued: vacationAccrualSuperficial,
		currentVacationBalanceFwd: vacationBalAdjustSuperficial,
		currentVacationUsed: vacationUsedSuperficial,
		vacationBalance: 0,
		currentSickAccrued: 0,
		currentSickUsed: 0,
		sickBalance: 0,

		YTDVacationAccrued: getSumTotal(prevPayPayInfo?.YTDVacationAccrued, vacationAccrualSuperficial),
		YTDVacationUsed: getSumTotal(prevPayPayInfo?.YTDVacationUsed, vacationUsedSuperficial),
		YTDVacationBalanceFwd: vacationBalAdjustSuperficial,
		YTDVacationBalance: getSumTotal(prevPayPayInfo?.YTDVacationBalance, 0),

		YTDSprayPayTotal: getSumTotal(prevPayPayInfo?.YTDSprayPayTotal, 0),
		YTDFirstAidPayTotal: getSumTotal(prevPayPayInfo?.YTDFirstAidPayTotal, 0),
		YTDPayInLieuPay: getSumTotal(prevPayPayInfo?.YTDPayInLieuPay, 0),
		YTDBenefitPay: getSumTotal(prevPayPayInfo?.YTDBenefitPay, 0),
		YTDBankedTimePay: getSumTotal(prevPayPayInfo?.YTDBankedTimePay, 0),
		YTDRegularByAmount: getSumTotal(prevPayPayInfo?.YTDRegularByAmount, 0),

		YTDPrimaryDeposit: getSumTotal(prevPayPayInfo?.YTDPrimaryDeposit, 0),
		YTDOtherDeductions: getSumTotal(prevPayPayInfo?.YTDOtherDeductions, 0),
		YTDGrossPay: getSumTotal(prevPayPayInfo?.YTDGrossPay, 0),
		YTDDeductionsTotal: getSumTotal(prevPayPayInfo?.YTDDeductionsTotal, 0),
		YTDNetPay: getSumTotal(prevPayPayInfo?.YTDNetPay, 0),
		YTDSickAccrued: getSumTotal(prevPayPayInfo?.YTDSickAccrued, 0),
		YTDSickUsed: getSumTotal(prevPayPayInfo?.YTDSickUsed, 0),
		YTDSickBalance: getSumTotal(prevPayPayInfo?.YTDSickBalance, 0),
	};
	return superficialPayStub;
};

module.exports = { addSeparateSuperficialCheque };
