const EmployeePayInfo = require("../models/EmployeePayInfo");
const EmployeePayStub = require("../models/EmployeePayStub");

const { COMPANIES } = require("../services/data");
const { getSumTotal } = require("../services/payrollService");
const { findEmployeeGovernmentInfoDetails } = require("./governmentInfoController");
const {
	calculateTimesheetApprovedHours,
	findEmployeeBenefitInfo,
	buildNewEmpPayStubInfo,
} = require("../helpers/payrollHelper");
const { getPayrollActiveEmployees } = require("../helpers/userHelper");
const { appendPrevPayInfoBalance } = require("../helpers/payStubHelper");
const { findAllAdditionalHoursAllocatedInfo } = require("./payrunExtraAllocationInfoController");
const { addSeparateManualCheque } = require("./payStubManualCalc");
const { addSeparatePayoutCheque } = require("./payStubPayoutCalc");
const { addSeparateSuperficialCheque } = require("./payStubSuperficialCalc");
const { buildFundingTotalsReport } = require("./reportController");
const { generateT4Slip } = require("./t4SlipController");
const { getEmployeeId } = require("./userController");

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
				: getSumTotal(prevPayPayInfo?.YTD_FDTaxDeductions || 0, currentFDTaxDeductions || 0),
		YTDStateTaxDeductions:
			payPeriod == 1
				? currentStateTaxDeductions
				: getSumTotal(prevPayPayInfo?.YTDStateTaxDeductions || 0, currentStateTaxDeductions || 0),
		YTD_IncomeTaxDeductions:
			payPeriod == 1
				? currentIncomeTaxDeductions
				: getSumTotal(
						prevPayPayInfo?.YTD_IncomeTaxDeductions || 0,
						currentIncomeTaxDeductions || 0,
				  ),
		YTD_EmployeeEIDeductions:
			payPeriod == 1
				? currentEmployeeEIDeductions
				: getSumTotal(
						prevPayPayInfo?.YTD_EmployeeEIDeductions || 0,
						currentEmployeeEIDeductions || 0,
				  ),
		YTD_EmployerEIDeductions:
			payPeriod == 1
				? currentEmployerEIDeductions
				: getSumTotal(
						prevPayPayInfo?.YTD_EmployerEIDeductions || 0,
						currentEmployerEIDeductions || 0,
				  ) < 0
				? 0
				: getSumTotal(
						prevPayPayInfo?.YTD_EmployerEIDeductions || 0,
						currentEmployerEIDeductions || 0,
				  ),
		YTD_CPPDeductions:
			payPeriod == 1
				? currentCPPDeductions
				: getSumTotal(prevPayPayInfo?.YTD_CPPDeductions || 0, currentCPPDeductions || 0) < 0
				? 0
				: getSumTotal(prevPayPayInfo?.YTD_CPPDeductions || 0, currentCPPDeductions || 0),
		YTDUnionDuesDeductions:
			payPeriod == 1
				? currentUnionDuesDeductions
				: getSumTotal(prevPayPayInfo?.YTDUnionDuesDeductions || 0, currentUnionDuesDeductions || 0),
		YTDEmployeeHealthContributions:
			payPeriod == 1
				? currentEmployeeHealthContributions
				: getSumTotal(
						prevPayPayInfo?.YTDEmployeeHealthContributions || 0,
						currentEmployeeHealthContributions || 0,
				  ),
		YTDPrimaryDeposit: getSumTotal(prevPayPayInfo?.YTDPrimaryDeposit, currentPrimaryDeposit),
		YTDEmployeePensionContributions:
			payPeriod == 1
				? currentEmployeePensionContributions
				: getSumTotal(
						prevPayPayInfo?.YTDEmployeePensionContributions,
						currentEmployeePensionContributions || 0,
				  ),
		YTDOtherDeductions:
			payPeriod == 1
				? currentOtherDeductions
				: getSumTotal(prevPayPayInfo?.YTDOtherDeductions || 0, currentOtherDeductions),

		YTDGrossPay:
			payPeriod == 1
				? currentGrossPay
				: getSumTotal(prevPayPayInfo?.YTDGrossPay || 0, currentGrossPay || 0),

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
			payPeriod == 1
				? currentVacationAccrued
				: getSumTotal(prevPayPayInfo?.YTDVacationAccrued) || 0,
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
			? YTDVacationBalanceFwd + YTDVacationAccrued - newPayStub.YTDVacationUsed
			: YTDVacationAccrued - newPayStub.YTDVacationUsed;

	newPayStub.YTDDeductionsTotal =
		YTDEmployeePensionContributions +
			YTDPrimaryDeposit +
			YTDEmployeeHealthContributions +
			YTDUnionDuesDeductions +
			YTD_CPPDeductions +
			YTD_EmployeeEIDeductions +
			YTD_IncomeTaxDeductions || 0;
	newPayStub.YTDNetPay = YTDGrossPay - newPayStub.YTDDeductionsTotal || 0;

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

	const prevPayPeriodNum = isExtraRun ? payPeriod : payPeriod - 1;
	let prevPayPayInfo = await findPayStub(
		prevPayPeriodNum == 0 ? 26 : prevPayPeriodNum,
		companyName,
		empId,
		false,
		scheduleFrequency,
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

	const checkAllChequesRun = await runBalances();

	if (checkAllChequesRun) {
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
		const currentPayInfo = await findPayStub(
			payPeriod,
			companyName,
			empId,
			isExtraRun ? isExtraRun : false,
			scheduleFrequency,
		);
		if (currentPayInfo?.scheduleFrequency) {
			updatedPayStub.scheduleFrequency = currentPayInfo.scheduleFrequency;
			await updatePayStub(currentPayInfo._id, updatedPayStub);
			return updatedPayStub;
		}
		updatedPayStub.scheduleFrequency = scheduleFrequency;
		await addPayStub(updatedPayStub);
		return updatedPayStub;
	}
};

const findPayStub = async (payPeriodNum, companyName, empId, isExtra, scheduleFrequency) => {
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
	return await EmployeePayStub.findOne(searchObj).sort({ payPeriodProcessingDate: -1 });
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

const addEmployeePayStubInfo = async (req, res) => {
	const { companyName, currentPayPeriod, selectedPayGroupOption } = req.body;
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
		// 	{ companyName: COMPANIES.NW },
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
			? await getEmployeeId(selectedEmp)
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
			fundingTotal.totalIncomeTaxContr += payStubResult?.currentIncomeTaxDeductions || 0;
			fundingTotal.totalCPP_EE_Contr += payStubResult?.currentCPPDeductions || 0;
			fundingTotal.totalCPP_ER_Contr += payStubResult?.currentCPPDeductions || 0;
			fundingTotal.totalEI_EE_Contr += payStubResult?.currentEmployeeEIDeductions || 0;
			fundingTotal.totalEI_ER_Contr += payStubResult?.currentEmployerEIDeductions || 0;
			fundingTotal.totalNetPay += payStubResult?.currentNetPay || 0;
		}

		await buildFundingTotalsReport(
			fundingTotal,
			activeEmployees?.length,
			isExtraRun,
			isCornerStone,
			scheduleFrequency,
		);
		if (!isExtraRun) generateT4Slip(companyName, payPeriod, payPeriodEndDate);
		return res.status(200).json({ message: "Paystub created successfully" });
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

module.exports = { addPayStub, addEmployeePayStubInfo, getRecordId };
