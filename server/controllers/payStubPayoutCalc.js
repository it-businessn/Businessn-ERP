const { getSumTotal } = require("../services/payrollService");
const { findAdditionalPayoutAmountAllocatedInfo } = require("./payrunEEContrCalc");
const { findAdditionalPayoutHoursAllocatedInfo } = require("./payrunExtraAllocationInfoController");

const addSeparatePayoutCheque = async (
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
	const empAdditionalPayoutDataAllocated = await findAdditionalPayoutAmountAllocatedInfo({
		empId,
		companyName,
		payPeriodPayDate,
	});

	const additionalHoursAllocatedInfo = await findAdditionalPayoutHoursAllocatedInfo({
		empId,
		companyName,
		payPeriodPayDate,
	});

	const {
		totalPayoutHoursWorked,
		additionalPayoutRegHoursWorked,
		additionalPayoutOvertimeHoursWorked,
		additionalPayoutDblOvertimeHoursWorked,
		additionalPayoutStatDayHoursWorked,
		additionalPayoutVacationHoursWorked,
		additionalPayoutStatHoursWorked,
		additionalPayoutSickHoursWorked,
	} = additionalHoursAllocatedInfo;

	const {
		regPayAmtPayout,
		OTPayAmtPayout,
		dblOTPayAmtPayout,
		statPayAmtPayout,
		statWorkPayAmtPayout,
		vacationPayAmtPayout,
		sickPayAmtPayout,
		totalPayoutAmountAllocated,
		commissionPayout,
		bonusPayout,
		retroactivePayout,
		reimbursementPayout,
		terminationPayoutPayout,
		vacationPayoutPayout,
		vacationBalAdjustPayout,
		vacationAccrualPayout,
		vacationUsedPayout,
		federalTaxPayout,
		provTaxPayout,
		incomeTaxPayout,
	} = empAdditionalPayoutDataAllocated;

	const grossSum =
		regPayAmtPayout +
		OTPayAmtPayout +
		dblOTPayAmtPayout +
		statWorkPayAmtPayout +
		statPayAmtPayout +
		sickPayAmtPayout +
		vacationPayAmtPayout +
		commissionPayout +
		retroactivePayout +
		vacationPayoutPayout +
		bonusPayout +
		terminationPayoutPayout;

	const deductionSum = federalTaxPayout + provTaxPayout + 0 + 0 + 0 + 0 + 0 + 0 + 0;

	const netPay = grossSum - deductionSum;
	const vacBalance = vacationBalAdjustPayout + (vacationAccrualPayout - vacationUsedPayout);
	const empContr = 0 + 0;

	const payoutPayStub = {
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

		commission: commissionPayout,
		retroactive: retroactivePayout,
		vacationPayout: vacationPayoutPayout,
		bonus: bonusPayout,
		terminationPayout: terminationPayoutPayout,
		reimbursement: reimbursementPayout,
		vacationBalAdjust: vacationBalAdjustPayout,
		vacationAccrual: vacationAccrualPayout,
		vacationUsed: vacationUsedPayout,
		federalTax: federalTaxPayout,
		provTax: provTaxPayout,
		incomeTax: incomeTaxPayout,
		totalAmountAllocated: totalPayoutAmountAllocated,

		YTDCommission: getSumTotal(prevPayPayInfo?.YTDCommission, commissionPayout),
		YTDRetroactive: getSumTotal(prevPayPayInfo?.YTDRetroactive, retroactivePayout),
		YTDVacationPayout: getSumTotal(prevPayPayInfo?.YTDVacationPayout, vacationPayoutPayout),
		YTDBonus: getSumTotal(prevPayPayInfo?.YTDBonus, bonusPayout),
		YTDTerminationPayout: getSumTotal(
			prevPayPayInfo?.YTDTerminationPayout,
			terminationPayoutPayout,
		),

		totalRegHoursWorked: additionalPayoutRegHoursWorked,
		totalOvertimeHoursWorked: additionalPayoutOvertimeHoursWorked,
		totalDblOvertimeHoursWorked: additionalPayoutDblOvertimeHoursWorked,
		totalStatDayHoursWorked: additionalPayoutStatDayHoursWorked,
		totalStatHours: additionalPayoutStatHoursWorked,
		totalSickHoursWorked: additionalPayoutSickHoursWorked,
		totalVacationHoursWorked: additionalPayoutVacationHoursWorked,
		totalSprayHoursWorked: 0,
		totalFirstAidHoursWorked: 0,
		totalHoursWorked: totalPayoutHoursWorked,

		YTDRegHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDRegHoursWorked,
			additionalPayoutRegHoursWorked,
		),
		YTDOvertimeHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDOvertimeHoursWorked,
			additionalPayoutOvertimeHoursWorked,
		),
		YTDDblOvertimeHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDDblOvertimeHoursWorked,
			additionalPayoutDblOvertimeHoursWorked,
		),
		YTDStatDayHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDStatDayHoursWorked,
			additionalPayoutStatDayHoursWorked,
		),
		YTDStatHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDStatHoursWorked,
			additionalPayoutStatHoursWorked,
		),
		YTDSickHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDSickHoursWorked,
			additionalPayoutSickHoursWorked,
		),
		YTDVacationHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDVacationHoursWorked,
			additionalPayoutVacationHoursWorked,
		),
		YTDSprayHoursWorked: getSumTotal(prevPayPayInfo?.YTDSprayHoursWorked, 0),
		YTDFirstAidHoursWorked: getSumTotal(prevPayPayInfo?.YTDFirstAidHoursWorked, 0),

		currentEmployerCPPDeductions: 0,
		currentRegPayTotal: regPayAmtPayout,
		currentOverTimePayTotal: OTPayAmtPayout,
		currentDblOverTimePayTotal: dblOTPayAmtPayout,
		currentStatWorkPayTotal: statWorkPayAmtPayout,
		currentStatPayTotal: statPayAmtPayout,
		currentSickPayTotal: sickPayAmtPayout,
		currentVacationPayTotal: vacationPayAmtPayout,
		// currentBereavementPayTotal: bereavementPayAmPayout,
		// currentPersonalDayPayTotal: personalPayAmtPayout,
		currentSprayPayTotal: 0,
		currentFirstAidPayTotal: 0,
		currentGrossPay: grossSum,

		YTDRegPayTotal: getSumTotal(prevPayPayInfo?.YTDRegPayTotal, regPayAmtPayout),
		YTDOverTimePayTotal: getSumTotal(prevPayPayInfo?.YTDOverTimePayTotal, OTPayAmtPayout),
		YTDDblOverTimePayTotal: getSumTotal(prevPayPayInfo?.YTDDblOverTimePayTotal, dblOTPayAmtPayout),
		YTDStatWorkPayTotal: getSumTotal(prevPayPayInfo?.YTDStatWorkPayTotal, statWorkPayAmtPayout),
		YTDStatPayTotal: getSumTotal(prevPayPayInfo?.YTDStatPayTotal, statPayAmtPayout),
		YTDSickPayTotal: getSumTotal(prevPayPayInfo?.YTDSickPayTotal, sickPayAmtPayout),
		YTDVacationPayTotal: getSumTotal(prevPayPayInfo?.YTDVacationPayTotal, vacationPayAmtPayout),

		currentFDTaxDeductions: federalTaxPayout,
		currentStateTaxDeductions: provTaxPayout,
		currentIncomeTaxDeductions: incomeTaxPayout,

		YTD_FDTaxDeductions: getSumTotal(prevPayPayInfo?.YTD_FDTaxDeductions, federalTaxPayout),
		YTDStateTaxDeductions: getSumTotal(prevPayPayInfo?.YTDStateTaxDeductions, provTaxPayout),
		YTD_IncomeTaxDeductions: getSumTotal(prevPayPayInfo?.YTD_IncomeTaxDeductions, incomeTaxPayout),

		currentCPPDeductions: 0,
		currentUnionDuesDeductions: 0,
		currentEmployeeEIDeductions: 0,
		currentEmployerEIDeductions: 0,
		currentEmployeeHealthContributions: 0,
		currentPrimaryDeposit: 0,
		currentEmployeePensionContributions: 0,
		currentOtherDeductions: 0,
		currentDeductionsTotal: deductionSum,
		currentNetPay: netPay,
		currentEmployerPensionContributions: 0,
		currentEmployerHealthContributions: 0,
		currentEmployerContributions: empContr,

		YTD_EmployeeEIDeductions: getSumTotal(prevPayPayInfo?.YTD_EmployeeEIDeductions, 0),
		YTD_EmployerEIDeductions: getSumTotal(prevPayPayInfo?.YTD_EmployerEIDeductions, 0),
		YTD_EmployerCPPDeductions: getSumTotal(prevPayPayInfo?.YTD_CPPDeductions, 0),
		YTD_CPPDeductions: getSumTotal(prevPayPayInfo?.YTD_CPPDeductions, 0),
		YTDUnionDuesDeductions: getSumTotal(prevPayPayInfo?.YTDUnionDuesDeductions, 0),
		YTDEmployeeHealthContributions: getSumTotal(prevPayPayInfo?.YTDEmployeeHealthContributions, 0),
		YTDEmployeePensionContributions: getSumTotal(
			prevPayPayInfo?.YTDEmployeePensionContributions,
			0,
		),
		YTDEmployerPensionContributions: getSumTotal(
			prevPayPayInfo?.YTDEmployerPensionContributions,
			0,
		),
		YTDEmployerHealthContributions: getSumTotal(prevPayPayInfo?.YTDEmployerHealthContributions, 0),
		YTDEmployerContributions: getSumTotal(prevPayPayInfo?.YTDEmployerContributions, empContr),

		currentVacationAccrued: vacationAccrualPayout,
		currentVacationBalanceFwd: vacationBalAdjustPayout,
		currentVacationUsed: vacationUsedPayout,
		vacationBalance: vacBalance,
		currentSickAccrued: 0,
		currentSickUsed: 0,
		sickBalance: 0,

		YTDVacationBalanceFwd: getSumTotal(
			prevPayPayInfo?.YTDVacationBalanceFwd,
			vacationBalAdjustPayout,
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
		YTDSickAccrued: getSumTotal(prevPayPayInfo?.YTDSickAccrued, 0),
		YTDSickUsed: getSumTotal(prevPayPayInfo?.YTDSickUsed, 0),
		YTDSickBalance: getSumTotal(prevPayPayInfo?.YTDSickBalance, 0),
	};
	const {
		YTDEmployeePensionContributions,
		YTDPrimaryDeposit,
		YTDEmployeeHealthContributions,
		YTDUnionDuesDeductions,
		YTD_CPPDeductions,
		YTD_EmployeeEIDeductions,
		YTD_IncomeTaxDeductions,
		YTDGrossPay,
		YTDVacationBalance,
		YTDVacationPayTotal,
		YTDVacationPayout,
	} = payoutPayStub;

	// YTDVacationAccrued: getSumTotal(prevPayPayInfo?.YTDVacationAccrued, vacationAccrualPayout),
	// YTDVacationUsed: getSumTotal(prevPayPayInfo?.YTDVacationUsed, vacationUsedPayout),
	payoutPayStub.YTDVacationUsed = YTDVacationPayout + YTDVacationPayTotal;
	payoutPayStub.YTDVacationAccrued = YTDVacationBalance - payoutPayStub.YTDVacationUsed;

	payoutPayStub.YTDDeductionsTotal =
		YTDEmployeePensionContributions +
		YTDPrimaryDeposit +
		YTDEmployeeHealthContributions +
		YTDUnionDuesDeductions +
		YTD_CPPDeductions +
		YTD_EmployeeEIDeductions +
		YTD_IncomeTaxDeductions;
	payoutPayStub.YTDNetPay = YTDGrossPay - manualPayStub.YTDDeductionsTotal;

	return payoutPayStub;
};

module.exports = { addSeparatePayoutCheque };
