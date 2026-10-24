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
	ytdBase,
	vacationCarryIn = 0,
) => {
	// YTD-01: year-to-date totals add this stub to `ytdBase`, the totals of the
	// pay year's earlier stubs (findYtdBase); none = first stub of the year.
	// Sick balances keep the original period-based logic with `prevPayPayInfo`.
	// VAC-01: vacation balances, see below.
	const isFirstOfYear = !ytdBase;
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
		currentCPP2Deductions,
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
			isFirstOfYear
				? totalRegHoursWorked
				: getSumTotal(ytdBase?.YTDRegHoursWorked, totalRegHoursWorked),
		YTDRegHoursWorked2:
			isFirstOfYear
				? totalRegHoursWorked2
				: getSumTotal(ytdBase?.YTDRegHoursWorked2, totalRegHoursWorked2),
		YTDOvertimeHoursWorked:
			isFirstOfYear
				? totalOvertimeHoursWorked
				: getSumTotal(ytdBase?.YTDOvertimeHoursWorked, totalOvertimeHoursWorked),
		YTDDblOvertimeHoursWorked:
			isFirstOfYear
				? totalDblOvertimeHoursWorked
				: getSumTotal(ytdBase?.YTDDblOvertimeHoursWorked, totalDblOvertimeHoursWorked),
		YTDStatDayHoursWorked:
			isFirstOfYear
				? totalStatDayHoursWorked
				: getSumTotal(ytdBase?.YTDStatDayHoursWorked, totalStatDayHoursWorked),
		YTDStatHoursWorked:
			isFirstOfYear
				? totalStatHours
				: getSumTotal(ytdBase?.YTDStatHoursWorked, totalStatHours),
		YTDSickHoursWorked:
			isFirstOfYear
				? totalSickHoursWorked
				: getSumTotal(ytdBase?.YTDSickHoursWorked, totalSickHoursWorked),
		YTDVacationHoursWorked:
			isFirstOfYear
				? totalVacationHoursWorked
				: getSumTotal(ytdBase?.YTDVacationHoursWorked, totalVacationHoursWorked),
		YTDPersonalDayHoursWorked:
			isFirstOfYear
				? totalPersonalDayHoursWorked
				: getSumTotal(ytdBase?.YTDPersonalDayHoursWorked, totalPersonalDayHoursWorked),
		YTDBereavementHoursWorked:
			isFirstOfYear
				? totalBereavementHoursWorked
				: getSumTotal(ytdBase?.YTDBereavementHoursWorked, totalBereavementHoursWorked),
		YTDSprayHoursWorked:
			isFirstOfYear
				? totalSprayHoursWorked
				: getSumTotal(ytdBase?.YTDSprayHoursWorked, totalSprayHoursWorked),
		YTDFirstAidHoursWorked:
			isFirstOfYear
				? totalFirstAidHoursWorked
				: getSumTotal(ytdBase?.YTDFirstAidHoursWorked, totalFirstAidHoursWorked),

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
		currentCPP2Deductions,
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
			isFirstOfYear
				? currentRegPayTotal
				: getSumTotal(ytdBase?.YTDRegPayTotal, currentRegPayTotal),
		YTDRegPayTotal2:
			isFirstOfYear
				? currentRegPayTotal2
				: getSumTotal(ytdBase?.YTDRegPayTotal2, currentRegPayTotal2),
		YTDOverTimePayTotal:
			isFirstOfYear
				? currentOverTimePayTotal
				: getSumTotal(ytdBase?.YTDOverTimePayTotal, currentOverTimePayTotal),
		YTDDblOverTimePayTotal:
			isFirstOfYear
				? currentDblOverTimePayTotal
				: getSumTotal(ytdBase?.YTDDblOverTimePayTotal, currentDblOverTimePayTotal),
		YTDStatWorkPayTotal:
			isFirstOfYear
				? currentStatWorkPayTotal
				: getSumTotal(ytdBase?.YTDStatWorkPayTotal, currentStatWorkPayTotal),
		YTDStatPayTotal:
			isFirstOfYear
				? currentStatPayTotal
				: getSumTotal(ytdBase?.YTDStatPayTotal, currentStatPayTotal),
		YTDSickPayTotal:
			isFirstOfYear
				? currentSickPayTotal
				: getSumTotal(ytdBase?.YTDSickPayTotal, currentSickPayTotal),
		YTDVacationPayTotal:
			isFirstOfYear
				? currentVacationPayTotal
				: getSumTotal(ytdBase?.YTDVacationPayTotal, currentVacationPayTotal),
		YTDBereavementPayTotal:
			isFirstOfYear
				? currentBereavementPayTotal
				: getSumTotal(ytdBase?.YTDBereavementPayTotal, currentBereavementPayTotal),
		YTDPersonalDayPayTotal:
			isFirstOfYear
				? currentPersonalDayPayTotal
				: getSumTotal(ytdBase?.YTDPersonalDayPayTotal, currentPersonalDayPayTotal),
		YTDSprayPayTotal:
			isFirstOfYear
				? currentSprayPayTotal
				: getSumTotal(ytdBase?.YTDSprayPayTotal, currentSprayPayTotal),
		YTDFirstAidPayTotal:
			isFirstOfYear
				? currentFirstAidPayTotal
				: getSumTotal(ytdBase?.YTDFirstAidPayTotal, currentFirstAidPayTotal),
		YTDPayInLieuPay:
			isFirstOfYear ? payInLieuPay : getSumTotal(ytdBase?.YTDPayInLieuPay, payInLieuPay),
		YTDBenefitPay:
			isFirstOfYear ? pILBenefitPay : getSumTotal(ytdBase?.YTDBenefitPay, pILBenefitPay),
		YTDBankedTimePay:
			isFirstOfYear ? bankedTimePay : getSumTotal(ytdBase?.YTDBankedTimePay, bankedTimePay),
		YTDRegularByAmount:
			isFirstOfYear
				? regularByAmount
				: getSumTotal(ytdBase?.YTDRegularByAmount, regularByAmount),
		YTDCommission:
			isFirstOfYear ? commission : getSumTotal(ytdBase?.YTDCommission, commission),
		YTDRetroactive:
			isFirstOfYear ? retroactive : getSumTotal(ytdBase?.YTDRetroactive, retroactive),
		YTDVacationPayout:
			isFirstOfYear
				? vacationPayout
				: getSumTotal(ytdBase?.YTDVacationPayout, vacationPayout),
		YTDBonus: isFirstOfYear ? bonus : getSumTotal(ytdBase?.YTDBonus, bonus),
		YTDTerminationPayout:
			isFirstOfYear
				? terminationPayout
				: getSumTotal(ytdBase?.YTDTerminationPayout, terminationPayout),
		YTD_FDTaxDeductions:
			isFirstOfYear
				? currentFDTaxDeductions
				: getSumTotal(ytdBase?.YTD_FDTaxDeductions, currentFDTaxDeductions),
		YTDStateTaxDeductions:
			isFirstOfYear
				? currentStateTaxDeductions
				: getSumTotal(ytdBase?.YTDStateTaxDeductions, currentStateTaxDeductions),
		YTD_IncomeTaxDeductions:
			isFirstOfYear
				? currentIncomeTaxDeductions
				: getSumTotal(ytdBase?.YTD_IncomeTaxDeductions, currentIncomeTaxDeductions),
		YTD_EmployeeEIDeductions:
			isFirstOfYear
				? currentEmployeeEIDeductions
				: getSumTotal(ytdBase?.YTD_EmployeeEIDeductions, currentEmployeeEIDeductions),
		YTD_EmployerEIDeductions:
			isFirstOfYear
				? currentEmployerEIDeductions
				: getSumTotal(ytdBase?.YTD_EmployerEIDeductions, currentEmployerEIDeductions) < 0
					? 0
					: getSumTotal(ytdBase?.YTD_EmployerEIDeductions, currentEmployerEIDeductions),
		// PAYROLL-CALC: CPP2 part of the CPP deduction, kept for the annual CPP2 maximum
		YTD_CPP2Deductions:
			isFirstOfYear
				? safeNum(currentCPP2Deductions)
				: getSumTotal(ytdBase?.YTD_CPP2Deductions, safeNum(currentCPP2Deductions)),
		YTD_CPPDeductions:
			isFirstOfYear
				? currentCPPDeductions
				: getSumTotal(ytdBase?.YTD_CPPDeductions, currentCPPDeductions) < 0
					? 0
					: getSumTotal(ytdBase?.YTD_CPPDeductions, currentCPPDeductions),
		YTDUnionDuesDeductions:
			isFirstOfYear
				? currentUnionDuesDeductions
				: getSumTotal(ytdBase?.YTDUnionDuesDeductions, currentUnionDuesDeductions),
		YTDEmployeeHealthContributions:
			isFirstOfYear
				? currentEmployeeHealthContributions
				: getSumTotal(
						ytdBase?.YTDEmployeeHealthContributions,
						currentEmployeeHealthContributions,
					),
		YTDPrimaryDeposit: getSumTotal(ytdBase?.YTDPrimaryDeposit, currentPrimaryDeposit),
		YTDEmployeePensionContributions:
			isFirstOfYear
				? currentEmployeePensionContributions
				: getSumTotal(
						ytdBase?.YTDEmployeePensionContributions,
						currentEmployeePensionContributions,
					),
		YTDOtherDeductions:
			isFirstOfYear
				? currentOtherDeductions
				: getSumTotal(ytdBase?.YTDOtherDeductions, currentOtherDeductions),

		YTDGrossPay:
			isFirstOfYear ? currentGrossPay : getSumTotal(ytdBase?.YTDGrossPay, currentGrossPay),

		YTDEmployerPensionContributions:
			isFirstOfYear
				? currentEmployerPensionContributions
				: getSumTotal(
						ytdBase?.YTDEmployerPensionContributions,
						currentEmployerPensionContributions,
					),
		YTDEmployerHealthContributions:
			isFirstOfYear
				? currentEmployerHealthContributions
				: getSumTotal(
						ytdBase?.YTDEmployerHealthContributions,
						currentEmployerHealthContributions,
					),
		YTDEmployerContributions:
			isFirstOfYear
				? currentEmployerContributions
				: getSumTotal(ytdBase?.YTDEmployerContributions, currentEmployerContributions),
		// VAC-01: the per-period amounts of calcVacBalance (payrollHelper) added up
		// over the pay year, like the other YTD totals. Balance forward = last
		// year's closing balance (vacationCarryIn, findVacationCarryIn) plus this
		// year's balance adjustments, so the carry-over stays all year.
		YTDVacationAccrued: isFirstOfYear
			? safeNum(currentVacationAccrued)
			: getSumTotal(ytdBase?.YTDVacationAccrued, safeNum(currentVacationAccrued)),
		YTDVacationBalanceFwd:
			safeNum(vacationCarryIn) +
			safeNum(ytdBase?.vacationAdjustYTD) +
			safeNum(currentVacationBalanceFwd),

		// sick balances: unchanged from the original logic
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
		YTDVacationAccrued,
		YTDVacationBalanceFwd,
	} = newPayStub;

	// VAC-01: used = vacation payouts + this year's calcVacBalance "used" amounts
	// (vacation pay taken, or the accrual itself for the Payout treatment, plus
	// the "vacation used" adjustment); balance = forward + accrued - used, the
	// period-1 formula, now for every stub of the year.
	newPayStub.YTDVacationUsed =
		safeNum(YTDVacationPayout) +
		(isFirstOfYear
			? safeNum(currentVacationUsed)
			: getSumTotal(ytdBase?.vacationUsedYTD, safeNum(currentVacationUsed)));
	newPayStub.YTDVacationBalance =
		safeNum(YTDVacationBalanceFwd) + safeNum(YTDVacationAccrued) - newPayStub.YTDVacationUsed;

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

	// PAYROLL-CALC / YTD-01: CPP, CPP2 and EI already deducted this year (from the
	// latest earlier stub of the year), so the annual maximums are applied.
	const ytdThisYear = await findYtdBase({
		companyName,
		empId,
		scheduleFrequency,
		payPeriodPayDate,
		payPeriodProcessingDate,
		payPeriod,
		isExtraRun,
	});
	const vacationCarryIn = await findVacationCarryIn({ companyName, empId, payPeriodPayDate });
	const ytd = {
		cpp: safeNum(ytdThisYear?.YTD_CPPDeductions) - safeNum(ytdThisYear?.YTD_CPP2Deductions),
		cpp2: safeNum(ytdThisYear?.YTD_CPP2Deductions),
		ei: safeNum(ytdThisYear?.YTD_EmployeeEIDeductions),
		pensionableEarnings: safeNum(ytdThisYear?.YTDGrossPay),
	};

	const payStubInfoData = buildNewEmpPayStubInfo(
		empTimesheetData,
		empPayInfoResult,
		empAdditionalDataAllocated,
		empBenefitInfoResult,
		empTaxCreditResult,
		isExtraRun,
		scheduleFrequency,
		payPeriodPayDate, // TAX-TABLES: tax tables in force on the pay date
		ytd,
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
		ytdThisYear,
		vacationCarryIn,
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

/** YTD-01: year-to-date field -> the per-stub amount it totals. */
const YTD_SUMS = [
	["YTDRegHoursWorked", "totalRegHoursWorked"],
	["YTDRegHoursWorked2", "totalRegHoursWorked2"],
	["YTDOvertimeHoursWorked", "totalOvertimeHoursWorked"],
	["YTDDblOvertimeHoursWorked", "totalDblOvertimeHoursWorked"],
	["YTDStatDayHoursWorked", "totalStatDayHoursWorked"],
	["YTDStatHoursWorked", "totalStatHours"],
	["YTDSickHoursWorked", "totalSickHoursWorked"],
	["YTDVacationHoursWorked", "totalVacationHoursWorked"],
	["YTDPersonalDayHoursWorked", "totalPersonalDayHoursWorked"],
	["YTDBereavementHoursWorked", "totalBereavementHoursWorked"],
	["YTDSprayHoursWorked", "totalSprayHoursWorked"],
	["YTDFirstAidHoursWorked", "totalFirstAidHoursWorked"],
	["YTDRegPayTotal", "currentRegPayTotal"],
	["YTDRegPayTotal2", "currentRegPayTotal2"],
	["YTDOverTimePayTotal", "currentOverTimePayTotal"],
	["YTDDblOverTimePayTotal", "currentDblOverTimePayTotal"],
	["YTDStatWorkPayTotal", "currentStatWorkPayTotal"],
	["YTDStatPayTotal", "currentStatPayTotal"],
	["YTDSickPayTotal", "currentSickPayTotal"],
	["YTDVacationPayTotal", "currentVacationPayTotal"],
	["YTDBereavementPayTotal", "currentBereavementPayTotal"],
	["YTDPersonalDayPayTotal", "currentPersonalDayPayTotal"],
	["YTDSprayPayTotal", "currentSprayPayTotal"],
	["YTDFirstAidPayTotal", "currentFirstAidPayTotal"],
	["YTDPayInLieuPay", "payInLieuPay"],
	["YTDBenefitPay", "pILBenefitPay"],
	["YTDBankedTimePay", "bankedTimePay"],
	["YTDRegularByAmount", "regularByAmount"],
	["YTDCommission", "commission"],
	["YTDRetroactive", "retroactive"],
	["YTDVacationPayout", "vacationPayout"],
	["YTDBonus", "bonus"],
	["YTDTerminationPayout", "terminationPayout"],
	["YTD_FDTaxDeductions", "currentFDTaxDeductions"],
	["YTDStateTaxDeductions", "currentStateTaxDeductions"],
	["YTD_IncomeTaxDeductions", "currentIncomeTaxDeductions"],
	["YTD_EmployeeEIDeductions", "currentEmployeeEIDeductions"],
	["YTD_EmployerEIDeductions", "currentEmployerEIDeductions"],
	["YTD_CPP2Deductions", "currentCPP2Deductions"],
	["YTD_CPPDeductions", "currentCPPDeductions"],
	["YTDUnionDuesDeductions", "currentUnionDuesDeductions"],
	["YTDEmployeeHealthContributions", "currentEmployeeHealthContributions"],
	["YTDEmployeePensionContributions", "currentEmployeePensionContributions"],
	["YTDOtherDeductions", "currentOtherDeductions"],
	["YTDGrossPay", "currentGrossPay"],
	["YTDEmployerPensionContributions", "currentEmployerPensionContributions"],
	["YTDEmployerHealthContributions", "currentEmployerHealthContributions"],
	["YTDEmployerContributions", "currentEmployerContributions"],
	["YTDPrimaryDeposit", "currentPrimaryDeposit"],
	// VAC-01: vacation (vacationUsedYTD / vacationAdjustYTD are only used to
	// build YTDVacationUsed / YTDVacationBalanceFwd)
	["YTDVacationAccrued", "currentVacationAccrued"],
	["vacationUsedYTD", "currentVacationUsed"],
	["vacationAdjustYTD", "currentVacationBalanceFwd"],
];

const YTD_FIELDS_NEEDED = [
	"payPeriodNum",
	"isExtraRun",
	"scheduleFrequency",
	"payPeriodPayDate",
	"payPeriodProcessingDate",
	...YTD_SUMS.map(([, key]) => key),
].join(" ");

/**
 * YTD-01: the order stubs are paid in: by pay date; on the same pay date a
 * regular run comes before extra runs; two runs of the same kind (two extra
 * runs, or two pay schedules) by processing date, then schedule and period
 * number, so each counts the other exactly once. < 0 = `a` paid before `b`.
 */
const compareRuns = (a, b) => {
	const paidA = normalisePayDate(a.payPeriodPayDate)?.getTime() || 0;
	const paidB = normalisePayDate(b.payPeriodPayDate)?.getTime() || 0;
	if (paidA !== paidB) return paidA - paidB;
	if (Boolean(a.isExtraRun) !== Boolean(b.isExtraRun)) return a.isExtraRun ? 1 : -1;
	const processedA = new Date(a.payPeriodProcessingDate).getTime() || 0;
	const processedB = new Date(b.payPeriodProcessingDate).getTime() || 0;
	if (processedA !== processedB) return processedA - processedB;
	const tie = (s) => `${s.scheduleFrequency || ""}|${String(s.payPeriodNum).padStart(4, "0")}`;
	return tie(a) < tie(b) ? -1 : tie(a) > tie(b) ? 1 : 0;
};

/**
 * YTD-01: the year-to-date base for a pay stub: the per-stub amounts of every
 * processed stub of the employee in the same pay year paid BEFORE it, added up
 * (pay schedules combined: the CPP / EI maximums are per employer and year).
 * On the same pay date a regular run comes before extra runs; runs of the same
 * kind follow their processing date. The stub being (re)built is left out. A sum
 * gives the same result in any processing order; continuing from one
 * "previous" stub (the old "period N-1" lookup) double-counted a re-run extra
 * run, restarted the year after an extra run in period 1, a period without a
 * stub or a pay-schedule change, and lost extra runs paid between two regular
 * runs. Stored YTD fields are not read, so a wrong legacy total does not carry
 * on. null = no earlier stub this year (first stub of the year). Opening
 * balances from before the app are not supported (nothing records them).
 */
const findYtdBase = async ({
	companyName,
	empId,
	scheduleFrequency,
	payPeriodPayDate,
	payPeriodProcessingDate,
	payPeriod,
	isExtraRun,
}) => {
	const day = normalisePayDate(payPeriodPayDate);
	const year = payYearOf(payPeriodPayDate);
	if (!day || year === null) return null;
	const stubs = await EmployeePayStub.find({
		companyName,
		empId,
		isProcessed: true,
		reportType: null,
		payPeriodPayDate: payYearWindow(year),
	})
		.select(YTD_FIELDS_NEEDED)
		.lean();
	const self = {
		payPeriodPayDate: day,
		payPeriodProcessingDate,
		payPeriodNum: payPeriod,
		isExtraRun,
		scheduleFrequency,
	};
	const isSelf = (stub) =>
		String(stub.payPeriodNum) === String(payPeriod) &&
		Boolean(stub.isExtraRun) === Boolean(isExtraRun) &&
		String(stub.scheduleFrequency || "") === String(scheduleFrequency || "");
	const earlier = (stubs || []).filter((stub) => !isSelf(stub) && compareRuns(stub, self) < 0);
	if (!earlier.length) return null;
	return Object.fromEntries(
		YTD_SUMS.map(([ytdKey, key]) => [ytdKey, earlier.reduce((t, stub) => t + safeNum(stub[key]), 0)]),
	);
};

/**
 * VAC-01: vacation balance carried into a pay year = the closing vacation
 * balance (YTDVacationBalance) of the employee's last stub paid in the
 * previous pay year (any pay schedule, same order as compareRuns). The old
 * code carried last year's ACCRUED amount, in period 1 only, so vacation
 * already taken or paid out last year was carried again, and from period 2 the
 * carry-over was dropped. 0 when there is no stub last year.
 */
const findVacationCarryIn = async ({ companyName, empId, payPeriodPayDate }) => {
	const year = payYearOf(payPeriodPayDate);
	if (year === null) return 0;
	const stubs = await EmployeePayStub.find({
		companyName,
		empId,
		isProcessed: true,
		reportType: null,
		payPeriodPayDate: payYearWindow(year - 1),
	})
		.select(
			"payPeriodNum isExtraRun scheduleFrequency payPeriodPayDate payPeriodProcessingDate YTDVacationBalance",
		)
		.lean();
	if (!stubs?.length) return 0;
	const last = stubs.reduce((a, b) => (compareRuns(a, b) >= 0 ? a : b));
	return safeNum(last.YTDVacationBalance);
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
