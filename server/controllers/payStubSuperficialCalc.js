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

	const grossSum =
		regPayAmtSuperficial +
		OTPayAmtSuperficial +
		dblOTPayAmtSuperficial +
		statWorkPayAmtSuperficial +
		statPayAmtSuperficial +
		sickPayAmtSuperficial +
		vacationPayAmtSuperficial +
		commissionSuperficial +
		retroactiveSuperficial +
		vacationPayoutSuperficial +
		bonusSuperficial +
		terminationPayoutSuperficial;

	const deductionSum =
		federalTaxSuperficial +
		provTaxSuperficial +
		EE_CPPSuperficial +
		EE_EISuperficial +
		unionDuesSuperficial +
		EE_EHPSuperficial +
		0 +
		EE_EPPSuperficial +
		0;

	const netPay = grossSum - deductionSum;
	const vacBalance =
		vacationBalAdjustSuperficial + (vacationAccrualSuperficial - vacationUsedSuperficial);
	const empContr = ER_EPPSuperficial + ER_EHPSuperficial;

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
		bereavementPay: 0,
		personalDayPay: 0,
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

		YTDCommission: commissionSuperficial,
		YTDRetroactive: retroactiveSuperficial,
		YTDVacationPayout: vacationPayoutSuperficial,
		YTDBonus: bonusSuperficial,
		YTDTerminationPayout: terminationPayoutSuperficial,

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

		YTDRegHoursWorked: additionalSuperficialRegHoursWorked,
		YTDOvertimeHoursWorked: additionalSuperficialOvertimeHoursWorked,
		YTDDblOvertimeHoursWorked: additionalSuperficialDblOvertimeHoursWorked,
		YTDStatDayHoursWorked: additionalSuperficialStatDayHoursWorked,
		YTDStatHoursWorked: additionalSuperficialStatHoursWorked,
		YTDSickHoursWorked: additionalSuperficialSickHoursWorked,
		YTDVacationHoursWorked: additionalSuperficialVacationHoursWorked,
		YTDSprayHoursWorked: 0,
		YTDFirstAidHoursWorked: 0,

		currentEmployerCPPDeductions: ER_CPPSuperficial,
		currentRegPayTotal: regPayAmtSuperficial,
		currentOverTimePayTotal: OTPayAmtSuperficial,
		currentDblOverTimePayTotal: dblOTPayAmtSuperficial,
		currentStatWorkPayTotal: statWorkPayAmtSuperficial,
		currentStatPayTotal: statPayAmtSuperficial,
		currentSickPayTotal: sickPayAmtSuperficial,
		currentVacationPayTotal: vacationPayAmtSuperficial,
		// currentBereavementPayTotal: bereavementPayAmtSuperficial,
		// currentPersonalDayPayTotal: personalPayAmtSuperficial,
		currentSprayPayTotal: 0,
		currentFirstAidPayTotal: 0,
		currentGrossPay: grossSum,

		YTDRegPayTotal: regPayAmtSuperficial,
		YTDOverTimePayTotal: OTPayAmtSuperficial,
		YTDDblOverTimePayTotal: dblOTPayAmtSuperficial,
		YTDStatWorkPayTotal: statWorkPayAmtSuperficial,
		YTDStatPayTotal: statPayAmtSuperficial,
		YTDSickPayTotal: sickPayAmtSuperficial,
		YTDVacationPayTotal: vacationPayAmtSuperficial,

		currentFDTaxDeductions: federalTaxSuperficial,
		currentStateTaxDeductions: provTaxSuperficial,
		currentIncomeTaxDeductions: incomeTaxSuperficial,

		YTD_FDTaxDeductions: federalTaxSuperficial,
		YTDStateTaxDeductions: provTaxSuperficial,
		YTD_IncomeTaxDeductions: incomeTaxSuperficial,

		currentCPPDeductions: EE_CPPSuperficial,
		currentUnionDuesDeductions: unionDuesSuperficial,
		currentEmployeeEIDeductions: EE_EISuperficial,
		currentEmployerEIDeductions: ER_EISuperficial,
		currentEmployeeHealthContributions: EE_EHPSuperficial,
		currentPrimaryDeposit: 0,
		currentEmployeePensionContributions: EE_EPPSuperficial,
		currentOtherDeductions: 0,
		currentDeductionsTotal: deductionSum,
		currentNetPay: netPay,
		currentEmployerPensionContributions: ER_EPPSuperficial,
		currentEmployerHealthContributions: ER_EHPSuperficial,
		currentEmployerContributions: empContr,

		YTD_EmployeeEIDeductions: EE_EISuperficial,
		YTD_EmployerEIDeductions: ER_EISuperficial,
		YTD_EmployerCPPDeductions: ER_CPPSuperficial,
		YTD_CPPDeductions: EE_CPPSuperficial,
		YTDUnionDuesDeductions: unionDuesSuperficial,
		YTDEmployeeHealthContributions: EE_EHPSuperficial,
		YTDEmployeePensionContributions: EE_EPPSuperficial,
		YTDEmployerPensionContributions: ER_EPPSuperficial,
		YTDEmployerHealthContributions: ER_EHPSuperficial,
		YTDEmployerContributions: empContr,

		currentVacationAccrued: vacationAccrualSuperficial,
		currentVacationBalanceFwd: vacationBalAdjustSuperficial,
		currentVacationUsed: vacationUsedSuperficial,
		vacationBalance: vacBalance,
		currentSickAccrued: 0,
		currentSickUsed: 0,
		sickBalance: 0,

		YTDVacationAccrued: vacationAccrualSuperficial,
		YTDVacationUsed: vacationUsedSuperficial,
		YTDVacationBalanceFwd: vacationBalAdjustSuperficial,
		YTDVacationBalance: vacBalance,

		YTDSprayPayTotal: 0,
		YTDFirstAidPayTotal: 0,
		YTDPayInLieuPay: 0,
		YTDBenefitPay: 0,
		YTDBankedTimePay: 0,
		YTDRegularByAmount: 0,

		YTDPrimaryDeposit: 0,
		YTDOtherDeductions: 0,
		YTDGrossPay: grossSum,
		YTDDeductionsTotal: deductionSum,
		YTDNetPay: netPay,
		YTDSickAccrued: 0,
		YTDSickUsed: 0,
		YTDSickBalance: 0,
	};
	return superficialPayStub;
};

module.exports = { addSeparateSuperficialCheque };
