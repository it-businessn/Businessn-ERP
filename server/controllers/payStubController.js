const EmployeePayInfo = require("../models/EmployeePayInfo");
const EmployeePayStub = require("../models/EmployeePayStub");

const { COMPANIES } = require("../services/data");
const { getSumTotal } = require("../services/payrollService");
const { getPayrollActiveEmployees } = require("./appController");
const { findEmployeeGovernmentInfoDetails } = require("./governmentInfoController");
const {
	calculateTimesheetApprovedHours,
	findEmployeeBenefitInfo,
	buildNewEmpPayStubInfo,
} = require("../helpers/payrollHelper");
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

		YTDRegHoursWorked: getSumTotal(prevPayPayInfo?.YTDRegHoursWorked, totalRegHoursWorked),
		YTDRegHoursWorked2: getSumTotal(prevPayPayInfo?.YTDRegHoursWorked2, totalRegHoursWorked2),
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
		YTDPersonalDayHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDPersonalDayHoursWorked,
			totalPersonalDayHoursWorked,
		),
		YTDBereavementHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDBereavementHoursWorked,
			totalBereavementHoursWorked,
		),
		YTDSprayHoursWorked: getSumTotal(prevPayPayInfo?.YTDSprayHoursWorked, totalSprayHoursWorked),
		YTDFirstAidHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDFirstAidHoursWorked,
			totalFirstAidHoursWorked,
		),

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

		YTDRegPayTotal: getSumTotal(prevPayPayInfo?.YTDRegPayTotal, currentRegPayTotal),
		YTDRegPayTotal2: getSumTotal(prevPayPayInfo?.YTDRegPayTotal2, currentRegPayTotal2),
		YTDOverTimePayTotal: getSumTotal(prevPayPayInfo?.YTDOverTimePayTotal, currentOverTimePayTotal),
		YTDDblOverTimePayTotal: getSumTotal(
			prevPayPayInfo?.YTDDblOverTimePayTotal,
			currentDblOverTimePayTotal,
		),
		YTDStatWorkPayTotal: getSumTotal(prevPayPayInfo?.YTDStatWorkPayTotal, currentStatWorkPayTotal),
		YTDStatPayTotal: getSumTotal(prevPayPayInfo?.YTDStatPayTotal, currentStatPayTotal),
		YTDSickPayTotal: getSumTotal(prevPayPayInfo?.YTDSickPayTotal, currentSickPayTotal),
		YTDVacationPayTotal: getSumTotal(prevPayPayInfo?.YTDVacationPayTotal, currentVacationPayTotal),
		YTDBereavementPayTotal: getSumTotal(
			prevPayPayInfo?.YTDBereavementPayTotal,
			currentBereavementPayTotal,
		),
		YTDPersonalDayPayTotal: getSumTotal(
			prevPayPayInfo?.YTDPersonalDayPayTotal,
			currentPersonalDayPayTotal,
		),
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
		YTD_FDTaxDeductions: getSumTotal(
			prevPayPayInfo?.YTD_FDTaxDeductions || 0,
			currentFDTaxDeductions || 0,
		),
		YTDStateTaxDeductions: getSumTotal(
			prevPayPayInfo?.YTDStateTaxDeductions || 0,
			currentStateTaxDeductions || 0,
		),
		YTD_IncomeTaxDeductions: getSumTotal(
			prevPayPayInfo?.YTD_IncomeTaxDeductions || 0,
			currentIncomeTaxDeductions || 0,
		),
		YTD_EmployeeEIDeductions: getSumTotal(
			prevPayPayInfo?.YTD_EmployeeEIDeductions || 0,
			currentEmployeeEIDeductions || 0,
		),
		YTD_EmployerEIDeductions:
			getSumTotal(prevPayPayInfo?.YTD_EmployerEIDeductions || 0, currentEmployerEIDeductions || 0) <
			0
				? 0
				: getSumTotal(
						prevPayPayInfo?.YTD_EmployerEIDeductions || 0,
						currentEmployerEIDeductions || 0,
				  ),
		YTD_CPPDeductions:
			getSumTotal(prevPayPayInfo?.YTD_CPPDeductions || 0, currentCPPDeductions || 0) < 0
				? 0
				: getSumTotal(prevPayPayInfo?.YTD_CPPDeductions || 0, currentCPPDeductions || 0),
		YTDUnionDuesDeductions: getSumTotal(
			prevPayPayInfo?.YTDUnionDuesDeductions || 0,
			currentUnionDuesDeductions || 0,
		),
		YTDEmployeeHealthContributions: getSumTotal(
			prevPayPayInfo?.YTDEmployeeHealthContributions || 0,
			currentEmployeeHealthContributions || 0,
		),
		YTDPrimaryDeposit: getSumTotal(prevPayPayInfo?.YTDPrimaryDeposit, currentPrimaryDeposit),
		YTDEmployeePensionContributions: getSumTotal(
			prevPayPayInfo?.YTDEmployeePensionContributions,
			currentEmployeePensionContributions || 0,
		),
		YTDOtherDeductions: getSumTotal(
			prevPayPayInfo?.YTDOtherDeductions || 0,
			currentOtherDeductions,
		),

		YTDGrossPay: getSumTotal(prevPayPayInfo?.YTDGrossPay || 0, currentGrossPay || 0),

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
		YTDVacationAccrued: getSumTotal(prevPayPayInfo?.YTDVacationAccrued, 0),
		YTDVacationBalanceFwd: currentVacationBalanceFwd,
		YTDSickAccrued: getSumTotal(prevPayPayInfo?.YTDSickAccrued, currentSickAccrued),
		YTDSickUsed: getSumTotal(prevPayPayInfo?.YTDSickUsed, currentSickUsed),
		YTDSickBalance: getSumTotal(prevPayPayInfo?.YTDSickBalance, sickBalance),
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
	} = newPayStub;

	// YTDVacationAccrued: getSumTotal(prevPayPayInfo?.YTDVacationAccrued, currentVacationAccrued),
	// YTDVacationUsed: getSumTotal(prevPayPayInfo?.YTDVacationUsed, currentVacationUsed),
	// YTDVacationBalance: getSumTotal(prevPayPayInfo?.YTDVacationBalance, vacationBalance),
	newPayStub.YTDVacationUsed = YTDVacationPayout + YTDVacationPayTotal;
	newPayStub.YTDVacationBalance = YTDVacationAccrued - newPayStub.YTDVacationUsed;

	newPayStub.YTDDeductionsTotal =
		YTDEmployeePensionContributions +
		YTDPrimaryDeposit +
		YTDEmployeeHealthContributions +
		YTDUnionDuesDeductions +
		YTD_CPPDeductions +
		YTD_EmployeeEIDeductions +
		YTD_IncomeTaxDeductions;
	newPayStub.YTDNetPay = YTDGrossPay - newPayStub.YTDDeductionsTotal;

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
		prevPayPeriodNum,
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
const addPayStub = async (data) => await EmployeePayStub.create(data);

const updatePayStub = async (id, data) =>
	await EmployeePayStub.findByIdAndUpdate(id, data, {
		new: true,
	});

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
		res.status(200).json({ message: "Paystub created successfully" });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = { addPayStub, addEmployeePayStubInfo };
