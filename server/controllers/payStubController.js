const EmployeePayInfo = require("../models/EmployeePayInfo");
const EmployeePayStub = require("../models/EmployeePayStub");

const { findEmployeeGovernmentInfoDetails } = require("./governmentInfoController");
const {
	buildNewEmpPayStubInfo,
	getSumTotal,
	appendPrevPayInfoBalance,
} = require("../helpers/payrollHelper");
const { findAllAdditionalHoursAllocatedInfo } = require("./payrunExtraAllocationInfoController");
const { addSeparateManualCheque } = require("./payStubManualCalc");
const { addSeparatePayoutCheque } = require("./payStubPayoutCalc");
const { addSeparateSuperficialCheque } = require("./payStubSuperficialCalc");
const { buildFundingTotalsReport } = require("./reportController");
const { generateT4Slip } = require("./t4SlipController");
const { getEmployeeId } = require("./userController");
const { COMPANIES } = require("../constants/constant");
const { PAYRUN_TYPE } = require("../constants/pay.constants");
const {
	calculateTimesheetApprovedHours,
	findEmployeeBenefitInfo,
} = require("../services/payrollService");
const { getPayrollActiveEmployees } = require("../services/userService");
const { safeNum } = require("../utils/time.util");
const { runInTransaction } = require("../utils/db.util");
const {
	normalisePayDate,
	payYearOf,
	payYearWindow,
	payDateYearWindow,
	lastPayPeriodNum,
} = require("../utils/payYear.util");

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
		regPay2,
		overTimePay,
		dblOverTimePay,
		statPay,
		statWorkPay,
		sickPay,
		vacationPay,
		bereavementPay,
		personalDayPay,
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
		totalRegHoursWorked2,
		totalRegHoursWorked,
		totalOvertimeHoursWorked,
		totalDblOvertimeHoursWorked,
		totalStatDayHoursWorked,
		totalStatHours,
		totalSickHoursWorked,
		totalVacationHoursWorked,
		totalBereavementHoursWorked,
		totalPersonalDayHoursWorked,
		totalSprayHoursWorked,
		totalFirstAidHoursWorked,
		totalHoursWorked,
		currentRegPayTotal,
		currentRegPayTotal2,
		currentOverTimePayTotal,
		currentDblOverTimePayTotal,
		currentStatWorkPayTotal,
		currentStatPayTotal,
		currentSickPayTotal,
		currentVacationPayTotal,
		currentBereavementPayTotal,
		currentPersonalDayPayTotal,
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
		regPay2,
		overTimePay,
		dblOverTimePay,
		statPay,
		statWorkPay,
		sickPay,
		vacationPay,
		bereavementPay,
		personalDayPay,
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
		totalRegHoursWorked2,
		totalOvertimeHoursWorked,
		totalDblOvertimeHoursWorked,
		totalStatDayHoursWorked,
		totalStatHours,
		totalSickHoursWorked,
		totalVacationHoursWorked,
		totalBereavementHoursWorked,
		totalPersonalDayHoursWorked,
		totalSprayHoursWorked,
		totalFirstAidHoursWorked,
		totalHoursWorked,

		YTDRegHoursWorked:
			payPeriod == 1
				? totalRegHoursWorked
				: getSumTotal(prevPayPayInfo?.YTDRegHoursWorked, totalRegHoursWorked),
		YTDRegHoursWorked2:
			payPeriod == 1
				? totalRegHoursWorked2
				: getSumTotal(prevPayPayInfo?.YTDRegHoursWorked2, totalRegHoursWorked2),
		YTDOvertimeHoursWorked:
			payPeriod == 1
				? totalOvertimeHoursWorked
				: getSumTotal(prevPayPayInfo?.YTDOvertimeHoursWorked, totalOvertimeHoursWorked),
		YTDDblOvertimeHoursWorked:
			payPeriod == 1
				? totalDblOvertimeHoursWorked
				: getSumTotal(prevPayPayInfo?.YTDDblOvertimeHoursWorked, totalDblOvertimeHoursWorked),
		YTDStatDayHoursWorked:
			payPeriod == 1
				? totalStatDayHoursWorked
				: getSumTotal(prevPayPayInfo?.YTDStatDayHoursWorked, totalStatDayHoursWorked),
		YTDStatHoursWorked:
			payPeriod == 1
				? totalStatHours
				: getSumTotal(prevPayPayInfo?.YTDStatHoursWorked, totalStatHours),
		YTDSickHoursWorked:
			payPeriod == 1
				? totalSickHoursWorked
				: getSumTotal(prevPayPayInfo?.YTDSickHoursWorked, totalSickHoursWorked),
		YTDVacationHoursWorked:
			payPeriod == 1
				? totalVacationHoursWorked
				: getSumTotal(prevPayPayInfo?.YTDVacationHoursWorked, totalVacationHoursWorked),
		YTDPersonalDayHoursWorked:
			payPeriod == 1
				? totalPersonalDayHoursWorked
				: getSumTotal(prevPayPayInfo?.YTDPersonalDayHoursWorked, totalPersonalDayHoursWorked),
		YTDBereavementHoursWorked:
			payPeriod == 1
				? totalBereavementHoursWorked
				: getSumTotal(prevPayPayInfo?.YTDBereavementHoursWorked, totalBereavementHoursWorked),
		YTDSprayHoursWorked:
			payPeriod == 1
				? totalSprayHoursWorked
				: getSumTotal(prevPayPayInfo?.YTDSprayHoursWorked, totalSprayHoursWorked),
		YTDFirstAidHoursWorked:
			payPeriod == 1
				? totalFirstAidHoursWorked
				: getSumTotal(prevPayPayInfo?.YTDFirstAidHoursWorked, totalFirstAidHoursWorked),

		currentRegPayTotal,
		currentRegPayTotal2,
		currentOverTimePayTotal,
		currentDblOverTimePayTotal,
		currentStatWorkPayTotal,
		currentStatPayTotal,
		currentSickPayTotal,
		currentVacationPayTotal,
		currentBereavementPayTotal,
		currentPersonalDayPayTotal,
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

		YTDRegPayTotal:
			payPeriod == 1
				? currentRegPayTotal
				: getSumTotal(prevPayPayInfo?.YTDRegPayTotal, currentRegPayTotal),
		YTDRegPayTotal2:
			payPeriod == 1
				? currentRegPayTotal2
				: getSumTotal(prevPayPayInfo?.YTDRegPayTotal2, currentRegPayTotal2),
		YTDOverTimePayTotal:
			payPeriod == 1
				? currentOverTimePayTotal
				: getSumTotal(prevPayPayInfo?.YTDOverTimePayTotal, currentOverTimePayTotal),
		YTDDblOverTimePayTotal:
			payPeriod == 1
				? currentDblOverTimePayTotal
				: getSumTotal(prevPayPayInfo?.YTDDblOverTimePayTotal, currentDblOverTimePayTotal),
		YTDStatWorkPayTotal:
			payPeriod == 1
				? currentStatWorkPayTotal
				: getSumTotal(prevPayPayInfo?.YTDStatWorkPayTotal, currentStatWorkPayTotal),
		YTDStatPayTotal:
			payPeriod == 1
				? currentStatPayTotal
				: getSumTotal(prevPayPayInfo?.YTDStatPayTotal, currentStatPayTotal),
		YTDSickPayTotal:
			payPeriod == 1
				? currentSickPayTotal
				: getSumTotal(prevPayPayInfo?.YTDSickPayTotal, currentSickPayTotal),
		YTDVacationPayTotal:
			payPeriod == 1
				? currentVacationPayTotal
				: getSumTotal(prevPayPayInfo?.YTDVacationPayTotal, currentVacationPayTotal),
		YTDBereavementPayTotal:
			payPeriod == 1
				? currentBereavementPayTotal
				: getSumTotal(prevPayPayInfo?.YTDBereavementPayTotal, currentBereavementPayTotal),
		YTDPersonalDayPayTotal:
			payPeriod == 1
				? currentPersonalDayPayTotal
				: getSumTotal(prevPayPayInfo?.YTDPersonalDayPayTotal, currentPersonalDayPayTotal),
		YTDSprayPayTotal:
			payPeriod == 1
				? currentSprayPayTotal
				: getSumTotal(prevPayPayInfo?.YTDSprayPayTotal, currentSprayPayTotal),
		YTDFirstAidPayTotal:
			payPeriod == 1
				? currentFirstAidPayTotal
				: getSumTotal(prevPayPayInfo?.YTDFirstAidPayTotal, currentFirstAidPayTotal),
		YTDPayInLieuPay:
			payPeriod == 1 ? payInLieuPay : getSumTotal(prevPayPayInfo?.YTDPayInLieuPay, payInLieuPay),
		YTDBenefitPay:
			payPeriod == 1 ? pILBenefitPay : getSumTotal(prevPayPayInfo?.YTDBenefitPay, pILBenefitPay),
		YTDBankedTimePay:
			payPeriod == 1 ? bankedTimePay : getSumTotal(prevPayPayInfo?.YTDBankedTimePay, bankedTimePay),
		YTDRegularByAmount:
			payPeriod == 1
				? regularByAmount
				: getSumTotal(prevPayPayInfo?.YTDRegularByAmount, regularByAmount),
		YTDCommission:
			payPeriod == 1 ? commission : getSumTotal(prevPayPayInfo?.YTDCommission, commission),
		YTDRetroactive:
			payPeriod == 1 ? retroactive : getSumTotal(prevPayPayInfo?.YTDRetroactive, retroactive),
		YTDVacationPayout:
			payPeriod == 1
				? vacationPayout
				: getSumTotal(prevPayPayInfo?.YTDVacationPayout, vacationPayout),
		YTDBonus: payPeriod == 1 ? bonus : getSumTotal(prevPayPayInfo?.YTDBonus, bonus),
		YTDTerminationPayout:
			payPeriod == 1
				? terminationPayout
				: getSumTotal(prevPayPayInfo?.YTDTerminationPayout, terminationPayout),
		YTD_FDTaxDeductions:
			payPeriod == 1
				? currentFDTaxDeductions
				: getSumTotal(prevPayPayInfo?.YTD_FDTaxDeductions, currentFDTaxDeductions),
		YTDStateTaxDeductions:
			payPeriod == 1
				? currentStateTaxDeductions
				: getSumTotal(prevPayPayInfo?.YTDStateTaxDeductions, currentStateTaxDeductions),
		YTD_IncomeTaxDeductions:
			payPeriod == 1
				? currentIncomeTaxDeductions
				: getSumTotal(prevPayPayInfo?.YTD_IncomeTaxDeductions, currentIncomeTaxDeductions),
		YTD_EmployeeEIDeductions:
			payPeriod == 1
				? currentEmployeeEIDeductions
				: getSumTotal(prevPayPayInfo?.YTD_EmployeeEIDeductions, currentEmployeeEIDeductions),
		YTD_EmployerEIDeductions:
			payPeriod == 1
				? currentEmployerEIDeductions
				: getSumTotal(prevPayPayInfo?.YTD_EmployerEIDeductions, currentEmployerEIDeductions) < 0
					? 0
					: getSumTotal(prevPayPayInfo?.YTD_EmployerEIDeductions, currentEmployerEIDeductions),
		YTD_CPPDeductions:
			payPeriod == 1
				? currentCPPDeductions
				: getSumTotal(prevPayPayInfo?.YTD_CPPDeductions, currentCPPDeductions) < 0
					? 0
					: getSumTotal(prevPayPayInfo?.YTD_CPPDeductions, currentCPPDeductions),
		YTDUnionDuesDeductions:
			payPeriod == 1
				? currentUnionDuesDeductions
				: getSumTotal(prevPayPayInfo?.YTDUnionDuesDeductions, currentUnionDuesDeductions),
		YTDEmployeeHealthContributions:
			payPeriod == 1
				? currentEmployeeHealthContributions
				: getSumTotal(
						prevPayPayInfo?.YTDEmployeeHealthContributions,
						currentEmployeeHealthContributions,
					),
		YTDPrimaryDeposit: getSumTotal(prevPayPayInfo?.YTDPrimaryDeposit, currentPrimaryDeposit),
		YTDEmployeePensionContributions:
			payPeriod == 1
				? currentEmployeePensionContributions
				: getSumTotal(
						prevPayPayInfo?.YTDEmployeePensionContributions,
						currentEmployeePensionContributions,
					),
		YTDOtherDeductions:
			payPeriod == 1
				? currentOtherDeductions
				: getSumTotal(prevPayPayInfo?.YTDOtherDeductions, currentOtherDeductions),

		YTDGrossPay:
			payPeriod == 1 ? currentGrossPay : getSumTotal(prevPayPayInfo?.YTDGrossPay, currentGrossPay),

		YTDEmployerPensionContributions:
			payPeriod == 1
				? currentEmployerPensionContributions
				: getSumTotal(
						prevPayPayInfo?.YTDEmployerPensionContributions,
						currentEmployerPensionContributions,
					),
		YTDEmployerHealthContributions:
			payPeriod == 1
				? currentEmployerHealthContributions
				: getSumTotal(
						prevPayPayInfo?.YTDEmployerHealthContributions,
						currentEmployerHealthContributions,
					),
		YTDEmployerContributions:
			payPeriod == 1
				? currentEmployerContributions
				: getSumTotal(prevPayPayInfo?.YTDEmployerContributions, currentEmployerContributions),
		YTDVacationAccrued:
			payPeriod == 1 ? currentVacationAccrued : getSumTotal(prevPayPayInfo?.YTDVacationAccrued),
		YTDVacationBalanceFwd:
			payPeriod == 1 ? prevPayPayInfo?.YTDVacationAccrued : currentVacationBalanceFwd,

		YTDSickAccrued:
			payPeriod == 1
				? currentSickAccrued
				: getSumTotal(prevPayPayInfo?.YTDSickAccrued, currentSickAccrued),
		YTDSickUsed:
			payPeriod == 1 ? currentSickUsed : getSumTotal(prevPayPayInfo?.YTDSickUsed, currentSickUsed),
		YTDSickBalance:
			payPeriod == 1 ? sickBalance : getSumTotal(prevPayPayInfo?.YTDSickBalance, sickBalance),
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
		YTDVacationPayout,
		YTDVacationPayTotal,
		YTDVacationAccrued,
		YTDVacationBalanceFwd,
	} = newPayStub;

	// YTDVacationUsed: getSumTotal(prevPayPayInfo?.YTDVacationUsed, currentVacationUsed),
	// YTDVacationBalance: getSumTotal(prevPayPayInfo?.YTDVacationBalance, vacationBalance),
	newPayStub.YTDVacationUsed = YTDVacationPayout + YTDVacationPayTotal;
	newPayStub.YTDVacationBalance =
		payPeriod == 1
			? safeNum(YTDVacationBalanceFwd) + safeNum(YTDVacationAccrued) - newPayStub.YTDVacationUsed
			: YTDVacationAccrued - newPayStub.YTDVacationUsed;

	newPayStub.YTDDeductionsTotal =
		YTDEmployeePensionContributions +
		YTDPrimaryDeposit +
		YTDEmployeeHealthContributions +
		YTDUnionDuesDeductions +
		YTD_CPPDeductions +
		YTD_EmployeeEIDeductions +
		safeNum(YTD_IncomeTaxDeductions);
	newPayStub.YTDNetPay = YTDGrossPay - safeNum(newPayStub.YTDDeductionsTotal);

	return newPayStub;
};

const buildPayStubDetails = async (
	currentPayPeriod,
	companyName,
	empTimesheetData,
	empId,
	scheduleFrequency,
) => {
	const {
		payPeriodStartDate,
		payPeriodEndDate,
		payPeriodPayDate,
		payPeriodProcessingDate,
		payPeriod,
		isExtraRun,
	} = currentPayPeriod;

	const empPayInfoResult = await EmployeePayInfo.findOne({
		empId,
		companyName,
	});
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
		isExtraRun,
		scheduleFrequency,
	);

	// PAYYEAR-01: period numbers restart each payroll year (pay-date year), so the
	// previous stub is looked up in this run's year; period 1 takes the last period
	// of the previous year (26 bi-weekly, 12 monthly, ...). Extra runs: same period.
	const payYear = payYearOf(payPeriodPayDate);
	const prevPayPeriodNum = isExtraRun ? payPeriod : payPeriod - 1;
	const prevIsLastYear = prevPayPeriodNum == 0;
	let prevPayPayInfo = await findPayStub(
		prevIsLastYear ? lastPayPeriodNum(scheduleFrequency) : prevPayPeriodNum,
		companyName,
		empId,
		false,
		scheduleFrequency,
		payYear === null ? null : prevIsLastYear ? payYear - 1 : payYear,
	);

	const runBalances = async () => {
		for (const chequeType of empAdditionalDataAllocated?.chequesType || []) {
			let newPayStub;

			if (chequeType === PAYRUN_TYPE.SUPERFICIAL) {
				newPayStub = await addSeparateSuperficialCheque(
					empId,
					companyName,
					payPeriodStartDate,
					payPeriodEndDate,
					payPeriodPayDate,
					payPeriodProcessingDate,
					payPeriod,
					isExtraRun,
				);
				newPayStub.reportType = PAYRUN_TYPE.SUPERFICIAL;
			}

			if (chequeType === PAYRUN_TYPE.MANUAL) {
				newPayStub = await addSeparateManualCheque(
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
				newPayStub.reportType = PAYRUN_TYPE.MANUAL;
			}

			if (chequeType === PAYRUN_TYPE.PAYOUT) {
				newPayStub = await addSeparatePayoutCheque(
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
				newPayStub.reportType = PAYRUN_TYPE.PAYOUT;
			}

			if (newPayStub) {
				const separateChequeExists = await EmployeePayStub.findOne({
					payPeriodNum: payPeriod,
					companyName,
					empId,
					// isExtraRun:,
					scheduleFrequency,
					reportType: newPayStub.reportType,
					// PAYYEAR-01: same payroll year only (runBalances is currently unused).
					...(payYear === null ? {} : { payPeriodPayDate: payYearWindow(payYear) }),
				});
				if (separateChequeExists?.scheduleFrequency) {
					newPayStub.scheduleFrequency = separateChequeExists.scheduleFrequency;
					await updatePayStub(separateChequeExists._id, newPayStub);
				} else {
					newPayStub.scheduleFrequency = scheduleFrequency;
					await addPayStub(newPayStub);
				}
				prevPayPayInfo = appendPrevPayInfoBalance(prevPayPayInfo, newPayStub);
			}
		}
		return prevPayPayInfo || 1;
	};

	// const checkAllChequesRun = await runBalances();

	// if (checkAllChequesRun) {
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
	// AUD-015: the stub is only computed here; addEmployeePayStubInfo writes all
	// stubs of the run with upsertProcessedPayStub (find-then-create raced).
	updatedPayStub.scheduleFrequency = scheduleFrequency;
	return updatedPayStub;
	// }
};

// AUD-015: natural key of a processed pay stub, backed by the unique index
// uniq_processed_paystub_v2. Regular runs now match isExtraRun:false explicitly; the
// old lookup omitted it and could overwrite the same period's extra-run stub.
// PAYYEAR-01: + the pay-date year, so period N of this year no longer overwrites
// period N of last year. A year window (not the exact date) also matches older
// stubs whose pay date was stored with a time part.
const processedPayStubKey = (
	payPeriodNum,
	companyName,
	empId,
	isExtraRun,
	scheduleFrequency,
	payPeriodPayDate,
) => {
	const key = {
		companyName,
		empId,
		payPeriodNum,
		isExtraRun: isExtraRun ? isExtraRun : false,
		scheduleFrequency,
		reportType: null,
		isProcessed: true,
	};
	const payYear = payDateYearWindow(payPeriodPayDate);
	if (payYear) key.payPeriodPayDate = payYear;
	return key;
};

// AUD-015: atomic create-or-update (replaces findPayStub + create/findByIdAndUpdate).
// PAYYEAR-01: the pay date is written at UTC start of day (the unique index key);
// an upsert-insert takes it from $set (a range in the filter is not copied).
const upsertProcessedPayStub = (stub, session) => {
	const doc = stub?.payPeriodPayDate
		? { ...stub, payPeriodPayDate: normalisePayDate(stub.payPeriodPayDate) }
		: stub;
	return EmployeePayStub.findOneAndUpdate(
		processedPayStubKey(
			doc.payPeriodNum,
			doc.companyName,
			doc.empId,
			doc.isExtraRun,
			doc.scheduleFrequency,
			doc.payPeriodPayDate,
		),
		{ $set: doc },
		{
			upsert: true,
			new: true,
			sort: { payPeriodProcessingDate: -1 },
			session: session || undefined,
		},
	);
};

// PAYYEAR-01: payYear scopes the lookup to that payroll year (pay-date year).
// Without a year the most recent pay date wins (newest year's stub).
const findPayStub = async (
	payPeriodNum,
	companyName,
	empId,
	isExtra,
	scheduleFrequency,
	payYear = null,
) => {
	const searchObj = isExtra
		? {
				payPeriodNum,
				companyName,
				empId,
				isProcessed: true,
				isExtraRun: isExtra,
				scheduleFrequency,
			}
		: {
				payPeriodNum,
				companyName,
				empId,
				isProcessed: true,
				scheduleFrequency,
			};
	if (payYear !== null && payYear !== undefined) {
		searchObj.payPeriodPayDate = payYearWindow(Number(payYear));
		return await EmployeePayStub.findOne(searchObj).sort({ payPeriodProcessingDate: -1 });
	}
	return await EmployeePayStub.findOne(searchObj).sort({
		payPeriodPayDate: -1,
		payPeriodProcessingDate: -1,
	});
};

const getRecordId = async (
	empPayStubResult,
	empId,
	companyName,
	payPeriodPayDate,
	scheduleFrequency,
) => {
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
		scheduleFrequency,
	};
	const newPayStub = await addPayStub(payStub);
	return newPayStub._id;
};
const addPayStub = async (data) => await EmployeePayStub.create(data);

const updatePayStub = async (id, data) =>
	await EmployeePayStub.findByIdAndUpdate(
		id,
		{ $set: data },
		{
			new: true,
		},
	);

// REV-009: in-process guard against concurrent duplicate pay runs for the same
// company/period (double-click, retry storm). Single-instance only — a cluster
// needs a lock document in MongoDB (see docs/CHANGES.md AUD-015).
const runsInProgress = new Set();
const payRunKey = (companyName, period) =>
	`${companyName}|${period?.payPeriod}|${period?.isExtraRun ? "extra" : "regular"}|${period?.frequency}`;

// AUD-015: T4 generation stays fire-and-forget, but a failure (sync throw or
// rejection) is logged instead of becoming an unhandled rejection.
// PAYYEAR-01: the pay date scopes the T4 data to this run's payroll year.
const startT4Generation = (companyName, payPeriod, payPeriodEndDate, payPeriodPayDate) =>
	Promise.resolve()
		.then(() => generateT4Slip(companyName, payPeriod, payPeriodEndDate, payPeriodPayDate))
		.catch((error) =>
			console.error("❌ T4 generation failed:", {
				companyName,
				payPeriod,
				message: error?.message,
			}),
		);

const addEmployeePayStubInfo = async (req, res) => {
	const { companyName, currentPayPeriod, selectedPayGroupOption } = req.body || {};
	// FIX (AUD-015, partial): reject malformed payroll runs with 400 instead of a
	// TypeError 500 while destructuring. Idempotency/transactions remain open.
	if (typeof companyName !== "string" || !companyName.trim()) {
		return res.status(400).json({ message: "companyName is required" });
	}
	if (!currentPayPeriod || typeof currentPayPeriod !== "object") {
		return res.status(400).json({ message: "currentPayPeriod is required" });
	}
	if (!currentPayPeriod.payPeriodStartDate || !currentPayPeriod.payPeriodEndDate) {
		return res.status(400).json({ message: "payPeriodStartDate and payPeriodEndDate are required" });
	}
	if (currentPayPeriod.isExtraRun && !Array.isArray(currentPayPeriod.selectedEmp)) {
		return res.status(400).json({ message: "selectedEmp must be an array for an extra pay run" });
	}
	const lockKey = payRunKey(companyName, currentPayPeriod);
	if (runsInProgress.has(lockKey)) {
		return res.status(409).json({
			message: "A pay run for this company and pay period is already being processed",
			code: "PAYRUN_IN_PROGRESS",
		});
	}
	runsInProgress.add(lockKey);
	try {
		// const y = await EmployeePayStub.deleteMany({
		// 	payPeriodNum: "6",
		// 	companyName,
		// });

		// const k = await FundingTotalsPay.deleteMany({
		// 	payPeriodNum: "6",
		// 	companyName,
		// });
		// console.log("del", y, k);
		// return;

		// const kg = await EmployeePayStub.updateMany(
		//  { companyName: COMPANIES.NW },
		// 	{ $set: { scheduleFrequency: "Biweekly" } },
		// );
		// console.log("upd", kg);

		const {
			payPeriodStartDate,
			payPeriodEndDate,
			isExtraRun,
			selectedEmp,
			payPeriod,
			payPeriodPayDate,
			payPeriodProcessingDate,
			frequency,
		} = currentPayPeriod;
		const scheduleFrequency = frequency === "bi-weekly" ? "Biweekly" : frequency;

		const activeEmployees = isExtraRun
			? await getEmployeeId(selectedEmp, companyName) // NEW-05: scoped to this company
			: await getPayrollActiveEmployees(companyName, req.body?.deptName, selectedPayGroupOption);
		const result = isExtraRun
			? null
			: await calculateTimesheetApprovedHours(payPeriodStartDate, payPeriodEndDate, companyName);
		const isCornerStone = companyName === COMPANIES.CORNERSTONE;
		const fundingTotal = {
			companyName,
			scheduleFrequency,
			payPeriodStartDate,
			payPeriodEndDate,
			payPeriodPayDate,
			payPeriodProcessingDate,
			payPeriodNum: payPeriod,
			totalIncomeTaxContr: 0,
			totalCPP_EE_Contr: 0,
			totalCPP_ER_Contr: 0,
			totalCPP_Contr: 0,
			totalEI_EE_Contr: 0,
			totalEI_ER_Contr: 0,
			totalEI_Contr: 0,
			totalGovtContr: 0,
			totalNetPay: 0,
			totalBatchCharges: isCornerStone ? 0 : 20,
			totalEmpPayrollCost: 0,
			timeClockMaintenanceCost: isCornerStone ? 0 : 5.75,
			totalTimeManagementEmpCost: 0,
			totalCorePayrollCost: 0,
			totalTimeManagementPayrollCost: 0,
			totalServiceCharges: 0,
			totalFundingWithDrawals: 0,
			totalEmpPaymentRemitCost: 0,
		};

		// AUD-015: compute every stub first (reads only), then write the whole run
		// in one short transaction so a failure leaves no half-written pay run.
		const payStubs = [];
		for (const employee of activeEmployees) {
			const empTimesheetData = result?.find(
				(el) => el.empId?._id.toString() === employee?.empId?._id.toString(),
			);

			const payStubResult = await buildPayStubDetails(
				currentPayPeriod,
				companyName,
				empTimesheetData || null,
				employee?.empId?._id,
				scheduleFrequency,
			);
			payStubs.push(payStubResult);
			fundingTotal.totalIncomeTaxContr += safeNum(payStubResult?.currentIncomeTaxDeductions);
			fundingTotal.totalCPP_EE_Contr += safeNum(payStubResult?.currentCPPDeductions);
			fundingTotal.totalCPP_ER_Contr += safeNum(payStubResult?.currentCPPDeductions);
			fundingTotal.totalEI_EE_Contr += safeNum(payStubResult?.currentEmployeeEIDeductions);
			fundingTotal.totalEI_ER_Contr += safeNum(payStubResult?.currentEmployerEIDeductions);
			fundingTotal.totalNetPay += safeNum(payStubResult?.currentNetPay);
		}

		let afterCommit = [];
		await runInTransaction(async (session) => {
			afterCommit = []; // the callback may be retried
			for (const stub of payStubs) {
				await upsertProcessedPayStub(stub, session);
			}
			await buildFundingTotalsReport(
				fundingTotal,
				activeEmployees?.length,
				isExtraRun,
				isCornerStone,
				scheduleFrequency,
				{ session, afterCommit },
			);
		});
		// AUD-015: follow-up work (journal entry) reads committed data only.
		afterCommit.forEach((task) => task());
		if (!isExtraRun) startT4Generation(companyName, payPeriod, payPeriodEndDate, payPeriodPayDate);
		return res.status(200).json({ message: "Paystub created successfully" });
	} catch (error) {
		console.error("❌ addEmployeePayStubInfo error:", {
			body: req.body,
			message: error.message,
			stack: error.stack,
		});
		return res.status(500).json({ message: "Internal Server Error" });
	}
	finally {
		runsInProgress.delete(lockKey);
	}
};

module.exports = { addPayStub, addEmployeePayStubInfo, getRecordId, findPayStub };
