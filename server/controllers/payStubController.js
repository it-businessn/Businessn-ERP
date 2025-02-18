const moment = require("moment");
const EmployeePayStub = require("../models/EmployeePayStub");
const Timesheet = require("../models/Timesheet");
const { TIMESHEET_STATUS, PAY_TYPES_TITLE } = require("../services/data");
const { getCalcAmount, getTaxDetails, getSumTotal } = require("../services/payrollService");
const {
	findAdditionalAmountAllocatedInfo,
	findAllAdditionalHoursAllocatedInfo,
} = require("./additionalAllocationInfoController");
const { findEmployeeGovernmentInfoDetails } = require("./governmentInfoController");
const { getEmployeeId, getPayrollActiveEmployees } = require("./userController");
const {
	findEmployeePayInfoDetails,
	findEmployeeBenefitInfo,
	getCurrentTotals,
} = require("./payrollController");
const { generateT4Slip } = require("./t4SlipController");

const addSeparateCheque = async (
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
	empAdditionalHoursAllocated,
) => {
	const {
		additionalManualRegHoursWorked,
		additionalManualOvertimeHoursWorked,
		additionalManualDblOvertimeHoursWorked,
		additionalManualStatDayHoursWorked,
		additionalManualVacationHoursWorked,
		additionalManualStatHoursWorked,
		additionalManualSickHoursWorked,
		additionalPayoutRegHoursWorked,
		additionalPayoutOvertimeHoursWorked,
		additionalPayoutDblOvertimeHoursWorked,
		additionalPayoutStatDayHoursWorked,
		additionalPayoutVacationHoursWorked,
		additionalPayoutStatHoursWorked,
		additionalPayoutSickHoursWorked,
		additionalSuperficialRegHoursWorked,
		additionalSuperficialOvertimeHoursWorked,
		additionalSuperficialDblOvertimeHoursWorked,
		additionalSuperficialStatDayHoursWorked,
		additionalSuperficialVacationHoursWorked,
		additionalSuperficialStatHoursWorked,
		additionalSuperficialSickHoursWorked,

		commissionManual,
		retroactiveManual,
		vacationPayoutManual,
		bonusManual,
		terminationPayoutManual,
		reimbursementManual,
		vacationBalAdjustManual,
		vacationAccrualManual,
		vacationUsedManual,
		federalTaxManual,
		provTaxManual,
		incomeTaxManual,

		commissionPayout,
		retroactivePayout,
		vacationPayoutPayout,
		bonusPayout,
		terminationPayoutPayout,
		reimbursementPayout,
		vacationBalAdjustPayout,
		vacationAccrualPayout,
		vacationUsedPayout,
		federalTaxPayout,
		provTaxPayout,
		incomeTaxPayout,

		commissionSuperficial,
		retroactiveSuperficial,
		vacationPayoutSuperficial,
		bonusSuperficial,
		terminationPayoutSuperficial,
		reimbursementSuperficial,
		vacationBalAdjustSuperficial,
		vacationAccrualSuperficial,
		vacationUsedSuperficial,
		federalTaxSuperficial,
		provTaxSuperficial,
		incomeTaxSuperficial,
	} = empAdditionalHoursAllocated;
	if (
		additionalManualRegHoursWorked ||
		additionalManualOvertimeHoursWorked ||
		additionalManualDblOvertimeHoursWorked ||
		additionalManualStatDayHoursWorked ||
		additionalManualVacationHoursWorked ||
		additionalManualStatHoursWorked ||
		additionalManualSickHoursWorked ||
		commissionManual ||
		retroactiveManual ||
		vacationPayoutManual ||
		bonusManual ||
		terminationPayoutManual ||
		reimbursementManual ||
		vacationBalAdjustManual ||
		vacationAccrualManual ||
		vacationUsedManual ||
		federalTaxManual ||
		provTaxManual ||
		incomeTaxManual
	) {
		const hrsData = {
			reportType: "Manual",
			totalRegHoursWorked: additionalManualRegHoursWorked,
			totalOvertimeHoursWorked: additionalManualOvertimeHoursWorked,
			totalDblOvertimeHoursWorked: additionalManualDblOvertimeHoursWorked,
			totalStatDayHoursWorked: additionalManualStatDayHoursWorked,
			totalStatHours: additionalManualStatHoursWorked,
			totalSickHoursWorked: additionalManualSickHoursWorked,
			totalVacationHoursWorked: additionalManualVacationHoursWorked,
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
		};
		const currentPayStub = buildPayStub(
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
			true,
			hrsData,
		);
		await addPayStub(currentPayStub);
	}
	if (
		additionalPayoutRegHoursWorked ||
		additionalPayoutOvertimeHoursWorked ||
		additionalPayoutDblOvertimeHoursWorked ||
		additionalPayoutStatDayHoursWorked ||
		additionalPayoutVacationHoursWorked ||
		additionalPayoutStatHoursWorked ||
		additionalPayoutSickHoursWorked ||
		commissionPayout ||
		retroactivePayout ||
		vacationPayoutPayout ||
		bonusPayout ||
		terminationPayoutPayout ||
		reimbursementPayout ||
		vacationBalAdjustPayout ||
		vacationAccrualPayout ||
		vacationUsedPayout ||
		federalTaxPayout ||
		provTaxPayout ||
		incomeTaxPayout
	) {
		const hrsData = {
			reportType: "Paid Out",
			totalRegHoursWorked: additionalPayoutRegHoursWorked,
			totalOvertimeHoursWorked: additionalPayoutOvertimeHoursWorked,
			totalDblOvertimeHoursWorked: additionalPayoutDblOvertimeHoursWorked,
			totalStatDayHoursWorked: additionalPayoutStatDayHoursWorked,
			totalStatHours: additionalPayoutStatHoursWorked,
			totalSickHoursWorked: additionalPayoutSickHoursWorked,
			totalVacationHoursWorked: additionalPayoutVacationHoursWorked,

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
		};
		const currentPayStub = buildPayStub(
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
			true,
			hrsData,
		);
		await addPayStub(currentPayStub);
	}
	if (
		additionalSuperficialRegHoursWorked ||
		additionalSuperficialOvertimeHoursWorked ||
		additionalSuperficialDblOvertimeHoursWorked ||
		additionalSuperficialStatDayHoursWorked ||
		additionalSuperficialVacationHoursWorked ||
		additionalSuperficialStatHoursWorked ||
		additionalSuperficialSickHoursWorked ||
		commissionSuperficial ||
		retroactiveSuperficial ||
		vacationPayoutSuperficial ||
		bonusSuperficial ||
		terminationPayoutSuperficial ||
		reimbursementSuperficial ||
		vacationBalAdjustSuperficial ||
		vacationAccrualSuperficial ||
		vacationUsedSuperficial ||
		federalTaxSuperficial ||
		provTaxSuperficial ||
		incomeTaxSuperficial
	) {
		const hrsData = {
			reportType: "Superficial",
			totalRegHoursWorked: additionalSuperficialRegHoursWorked,
			totalOvertimeHoursWorked: additionalSuperficialOvertimeHoursWorked,
			totalDblOvertimeHoursWorked: additionalSuperficialDblOvertimeHoursWorked,
			totalStatDayHoursWorked: additionalSuperficialStatDayHoursWorked,
			totalStatHours: additionalSuperficialStatHoursWorked,
			totalSickHoursWorked: additionalSuperficialSickHoursWorked,
			totalVacationHoursWorked: additionalSuperficialVacationHoursWorked,

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
		};
		const currentPayStub = buildPayStub(
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
			true,
			hrsData,
		);
		await addPayStub(currentPayStub);
	}
};

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
	isSeparate,
	additionalAllocatedData,
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
		reportType: additionalAllocatedData?.reportType,
		commission: isSeparate ? additionalAllocatedData?.commission : commission,
		retroactive: isSeparate ? additionalAllocatedData?.retroactive : retroactive,
		vacationPayout: isSeparate ? additionalAllocatedData?.vacationPayout : vacationPayout,
		bonus: isSeparate ? additionalAllocatedData?.bonus : bonus,
		terminationPayout: isSeparate ? additionalAllocatedData?.terminationPayout : terminationPayout,
		reimbursement: isSeparate ? additionalAllocatedData?.reimbursement : reimbursement,
		vacationBalAdjust: isSeparate ? additionalAllocatedData?.vacationBalAdjust : vacationBalAdjust,
		vacationAccrual: isSeparate ? additionalAllocatedData?.vacationAccrual : vacationAccrual,
		vacationUsed: isSeparate ? additionalAllocatedData?.vacationUsed : vacationUsed,
		federalTax: isSeparate ? additionalAllocatedData?.federalTax : federalTax,
		provTax: isSeparate ? additionalAllocatedData?.provTax : provTax,
		incomeTax: isSeparate ? additionalAllocatedData?.incomeTax : incomeTax,
		totalAmountAllocated,

		totalRegHoursWorked: isSeparate
			? additionalAllocatedData?.totalRegHoursWorked
			: totalRegHoursWorked,
		totalOvertimeHoursWorked: isSeparate
			? additionalAllocatedData?.totalOvertimeHoursWorked
			: totalOvertimeHoursWorked,
		totalDblOvertimeHoursWorked: isSeparate
			? additionalAllocatedData?.totalDblOvertimeHoursWorked
			: totalDblOvertimeHoursWorked,
		totalStatDayHoursWorked: isSeparate
			? additionalAllocatedData?.totalStatDayHoursWorked
			: totalStatDayHoursWorked,
		totalStatHours: isSeparate ? additionalAllocatedData?.totalStatHours : totalStatHours,
		totalSickHoursWorked: isSeparate
			? additionalAllocatedData?.totalSickHoursWorked
			: totalSickHoursWorked,
		totalVacationHoursWorked: isSeparate
			? additionalAllocatedData?.totalVacationHoursWorked
			: totalVacationHoursWorked,
		totalSprayHoursWorked,
		totalFirstAidHoursWorked,
		totalHoursWorked,

		YTDRegHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDRegHoursWorked,
			(additionalAllocatedData?.totalRegHoursWorked || 0) + totalRegHoursWorked,
		),
		YTDOvertimeHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDOvertimeHoursWorked,
			(additionalAllocatedData?.totalOvertimeHoursWorked || 0) + totalOvertimeHoursWorked,
		),
		YTDDblOvertimeHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDDblOvertimeHoursWorked,
			(additionalAllocatedData?.totalDblOvertimeHoursWorked || 0) + totalDblOvertimeHoursWorked,
		),
		YTDStatDayHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDStatDayHoursWorked,
			(additionalAllocatedData?.totalStatDayHoursWorked || 0) + totalStatDayHoursWorked,
		),
		YTDStatHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDStatHoursWorked,
			(additionalAllocatedData?.totalStatHours || 0) + totalStatHours,
		),
		YTDSickHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDSickHoursWorked,
			(additionalAllocatedData?.totalSickHoursWorked || 0) + totalSickHoursWorked,
		),
		YTDVacationHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDVacationHoursWorked,
			(additionalAllocatedData?.totalVacationHoursWorked || 0) + totalVacationHoursWorked,
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

	const empPayStubResult = await findEmployeePayStub(empId, payPeriod);

	const empAdditionalHoursAllocated = await findAllAdditionalHoursAllocatedInfo({
		empId,
		payPeriodPayDate,
	});

	const empAdditionalAmountAllocated = await findAdditionalAmountAllocatedInfo({
		empId,
		payPeriodPayDate,
	});

	const empPayInfoResult = await findEmployeePayInfoDetails(empId, companyName);
	const empBenefitInfoResult = await findEmployeeBenefitInfo(empId, companyName);
	const empTaxCreditResult = await findEmployeeGovernmentInfoDetails(empId, companyName);

	const newEmpData = getCurrentTotals(
		empTimesheetData,
		empPayInfoResult,
		empAdditionalHoursAllocated,
	);
	newEmpData.vacationPayPercent = parseFloat(empBenefitInfoResult?.vacationPayPercent) || 0;
	newEmpData.typeOfUnionDuesTreatment = empBenefitInfoResult?.typeOfUnionDuesTreatment;
	newEmpData.unionDuesContribution = parseFloat(empBenefitInfoResult?.unionDuesContribution) || 0;
	newEmpData.typeOfPensionEETreatment = empBenefitInfoResult?.typeOfPensionEETreatment;
	newEmpData.pensionEEContribution = parseFloat(empBenefitInfoResult?.pensionEEContribution) || 0;
	newEmpData.typeOfExtendedHealthEETreatment =
		empBenefitInfoResult?.typeOfExtendedHealthEETreatment;
	newEmpData.extendedHealthEEContribution =
		parseFloat(empBenefitInfoResult?.extendedHealthEEContribution) || 0;
	newEmpData.typeOfPensionERTreatment = empBenefitInfoResult?.typeOfPensionERTreatment;
	newEmpData.pensionERContribution = parseFloat(empBenefitInfoResult?.pensionERContribution) || 0;
	newEmpData.typeOfExtendedHealthERTreatment =
		empBenefitInfoResult?.typeOfExtendedHealthERTreatment;
	newEmpData.extendedHealthERContribution =
		parseFloat(empBenefitInfoResult?.extendedHealthERContribution) || 0;

	newEmpData.payInLieuPay = empPayStubResult?.payInLieuPay ?? 0;
	newEmpData.pILBenefitPay = empPayStubResult?.pILBenefitPay ?? 0;
	newEmpData.bankedTimePay = empPayStubResult?.bankedTimePay ?? 0;
	newEmpData.regularByAmount = empPayStubResult?.regularByAmount ?? 0;

	newEmpData.commission = empAdditionalAmountAllocated?.commission ?? 0;
	newEmpData.retroactive = empAdditionalAmountAllocated?.retroactive ?? 0;
	newEmpData.vacationPayout = empAdditionalAmountAllocated?.vacationPayout ?? 0;
	newEmpData.terminationPayout = empAdditionalAmountAllocated?.terminationPayout ?? 0;
	newEmpData.bonus = empAdditionalAmountAllocated?.bonus ?? 0;
	newEmpData.reimbursement = empAdditionalAmountAllocated?.reimbursement ?? 0;

	newEmpData.vacationBalAdjust = empAdditionalAmountAllocated?.vacationBalAdjust ?? 0;
	newEmpData.vacationAccrual = empAdditionalAmountAllocated?.vacationAccrual ?? 0;
	newEmpData.vacationUsed = empAdditionalAmountAllocated?.vacationUsed ?? 0;
	newEmpData.federalTax = empAdditionalAmountAllocated?.federalTax ?? 0;
	newEmpData.provTax = empAdditionalAmountAllocated?.provTax ?? 0;
	newEmpData.incomeTax = empAdditionalAmountAllocated?.incomeTax ?? 0;

	newEmpData.currentVacationBalanceFwd = 0;

	newEmpData.currentGrossPay = calcCurrentGrossPay(newEmpData);

	const {
		CPPContribution,
		totalProvincialTaxDeduction,
		federalTaxDeductionByPayPeriod,
		EmployeeEIContribution,
		EmployerEIContribution,
	} = getTaxDetails(newEmpData?.regPay, newEmpData?.currentGrossPay, empTaxCreditResult);

	const { unionDues, EE_EPP, EE_EHP, ER_EPP, ER_EHP } = getContributionsDeductions(newEmpData);

	// const employeeContribution = calcEmployeeContribution(
	// 	newEmpData.currentGrossPay,
	// 	newEmpData,
	// );

	// const pensionContribution = 0.4 * employeeContribution;
	// const employerContribution =
	// 	pensionContribution + 2.05 * newEmpData.totalRegHoursWorked;

	newEmpData.currentFDTaxDeductions = federalTaxDeductionByPayPeriod;
	newEmpData.currentStateTaxDeductions = totalProvincialTaxDeduction;
	newEmpData.currentIncomeTaxDeductions =
		federalTaxDeductionByPayPeriod + totalProvincialTaxDeduction;
	newEmpData.currentCPPDeductions = CPPContribution;
	newEmpData.currentEmployeeEIDeductions = EmployeeEIContribution;
	newEmpData.currentEmployerEIDeductions = EmployerEIContribution;
	newEmpData.currentUnionDuesDeductions = unionDues;
	newEmpData.currentEmployeeHealthContributions = EE_EHP;
	newEmpData.currentPrimaryDeposit = 0;
	newEmpData.currentEmployeePensionContributions = EE_EPP;
	newEmpData.currentOtherDeductions = 0;

	newEmpData.currentEmployerPensionContributions = ER_EPP;
	newEmpData.currentEmployerHealthContributions = ER_EHP;

	newEmpData.currentEmployerContributions = ER_EPP + ER_EHP;
	let k = parseFloat(empBenefitInfoResult?.vacationPayPercent) || 0;
	newEmpData.currentVacationAccrued = k * newEmpData.currentGrossPay;
	newEmpData.currentVacationUsed =
		empBenefitInfoResult?.typeOfVacationTreatment === "Payout"
			? newEmpData.currentVacationAccrued
			: newEmpData.currentVacationPayTotal;

	newEmpData.vacationBalance =
		newEmpData.currentVacationBalanceFwd +
		(newEmpData.currentVacationAccrued - newEmpData.currentVacationUsed);
	newEmpData.currentSickAccrued = 0;
	newEmpData.currentSickUsed = 0;
	newEmpData.sickBalance = 0;

	const deductions = calcCurrentDeductionsTotal(newEmpData);
	newEmpData.currentDeductionsTotal = deductions < 0 ? 0 : deductions;

	const netPay = newEmpData.currentGrossPay - newEmpData.currentDeductionsTotal;
	// newEmpData.currentNetPay = netPay < 0 ? 0 : netPay;
	newEmpData.currentNetPay = netPay;
	newEmpData.totalAmountAllocated =
		newEmpData.commission +
		newEmpData.bonus +
		newEmpData.retroactive +
		newEmpData.reimbursement +
		newEmpData.terminationPayout +
		newEmpData.vacationPayout;

	const prevPayPeriodNum = isExtraRun ? payPeriod : payPeriod - 1;

	const prevPayPayInfo = await findCurrentPayStub(prevPayPeriodNum, companyName, empId, false);

	const currentPayStub = buildPayStub(
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
	);
	const currentPayInfo = await findCurrentPayStub(
		payPeriod,
		companyName,
		empId,
		isExtraRun ? isExtraRun : false,
	);
	if (currentPayInfo) {
		await updatePayStub(currentPayInfo._id, currentPayStub);
		// await addSeparateCheque();
	} else {
		await addPayStub(currentPayStub);
		await addSeparateCheque(
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
			empAdditionalHoursAllocated,
		);
	}
};

const findCurrentPayStub = async (payPeriodNum, companyName, empId, isExtra) => {
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

const findEmpPayStubDetail = async (empId, payPeriodPayDate, companyName) =>
	await EmployeePayStub.findOne({
		empId,
		payPeriodPayDate,
		companyName,
	})
		.populate({
			path: "empId",
			model: "Employee",
			select: "fullName",
		})
		.select("commission retroactive reimbursement vacationPayout bonus terminationPayout");

const calcCurrentGrossPay = (newEmpData) =>
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

const calcCurrentDeductionsTotal = (newEmpData) => {
	const sum =
		newEmpData.currentFDTaxDeductions +
		newEmpData.currentStateTaxDeductions +
		newEmpData.currentCPPDeductions +
		newEmpData.currentEmployeeEIDeductions +
		newEmpData.currentUnionDuesDeductions +
		newEmpData.currentEmployeeHealthContributions +
		newEmpData.currentPrimaryDeposit +
		newEmpData.currentEmployeePensionContributions +
		newEmpData.currentOtherDeductions;
	// if (!newEmpData.currentGrossPay) {
	// 	console.log(
	// 		newEmpData.currentGrossPay,
	// 		newEmpData.currentFDTaxDeductions,
	// 		newEmpData.currentStateTaxDeductions,
	// 		newEmpData.currentCPPDeductions,
	// 		newEmpData.currentEmployeeEIDeductions,
	// 		newEmpData.currentUnionDuesDeductions,
	// 		newEmpData.currentEmployeeHealthContributions,
	// 		newEmpData.currentPrimaryDeposit,
	// 		newEmpData.currentEmployeePensionContributions,
	// 		newEmpData.currentOtherDeductions,
	// 		sum,
	// 	);
	// }
	return sum;
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

const addPayStub = async (data) => await EmployeePayStub.create(data);

const updatePayStub = async (id, data) =>
	await EmployeePayStub.findByIdAndUpdate(id, data, {
		new: true,
	});

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
			: await calculateTotalAggregatedHours(payPeriodStartDate, payPeriodEndDate, companyName);

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
		generateT4Slip(companyName, payPeriod);
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
	findEmpPayStubDetail,
	getRecordId,
	calculateTotalAggregatedHours,
};
