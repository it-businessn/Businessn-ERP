const EmployeePayStub = require("../models/EmployeePayStub");
const { getSumTotal } = require("../services/payrollService");
const {
	findAdditionalAmountAllocatedInfo,
	findAllAdditionalHoursAllocatedInfo,
} = require("./additionalAllocationInfoController");
const { getEmployeeId, getPayrollActiveEmployees } = require("./userController");
// const { generateT4Slip } = require("./t4SlipController");
const {
	buildNewEmpPayStubInfo,
	findEmployeeBenefitInfo,
	calculateTimesheetApprovedHours,
} = require("./payrollHelper");
const { findEmployeePayInfoDetails } = require("./payInfoController");
const { findEmployeeGovernmentInfoDetails } = require("./governmentInfoController");

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

	const empPayInfoResult = await findEmployeePayInfoDetails(empId, companyName);
	const empBenefitInfoResult = await findEmployeeBenefitInfo(empId, companyName);
	const empAdditionalAmountAllocated = await findAdditionalAmountAllocatedInfo({
		empId,
		payPeriodPayDate,
	});
	const empAdditionalHoursAllocated = await findAllAdditionalHoursAllocatedInfo({
		empId,
		payPeriodPayDate,
	});

	const empTaxCreditResult = await findEmployeeGovernmentInfoDetails(empId, companyName);

	const payStubInfoData = buildNewEmpPayStubInfo(
		empTimesheetData,
		empPayInfoResult,
		empAdditionalHoursAllocated,
		empBenefitInfoResult,
		empAdditionalAmountAllocated,
		empTaxCreditResult,
	);

	const prevPayPeriodNum = isExtraRun ? payPeriod : payPeriod - 1;
	const prevPayPayInfo = await findCurrentPayStub(prevPayPeriodNum, companyName, empId, false);
	const currentPayInfo = await findCurrentPayStub(
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
		// await addSeparateCheque();
	} else {
		await addPayStub(currentPayStub);
		// await addSeparateCheque(
		// 	empId,
		// 	companyName,
		// 	payPeriodStartDate,
		// 	payPeriodEndDate,
		// 	payPeriodPayDate,
		// 	payPeriodProcessingDate,
		// 	payPeriod,
		// 	isExtraRun,
		// 	newEmpData,
		// 	prevPayPayInfo,
		// 	empAdditionalHoursAllocated,
		// );
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
