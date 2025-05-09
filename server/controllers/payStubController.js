const EmployeePayStub = require("../models/EmployeePayStub");
const { getSumTotal } = require("../services/payrollService");
const { findAllAdditionalHoursAllocatedInfo } = require("./payrunExtraAllocationInfoController");
const { getEmployeeId } = require("./userController");
const moment = require("moment");
const { generateT4Slip } = require("./t4SlipController");
const {
	buildNewEmpPayStubInfo,
	findEmployeeBenefitInfo,
	calculateTimesheetApprovedHours,
} = require("./payrollHelper");
const { findEmployeeGovernmentInfoDetails } = require("./governmentInfoController");
const { PAYRUN_TYPE, BUSINESSN_ORG, COMPANIES } = require("../services/data");
const { addSeparateSuperficialCheque } = require("./payStubSuperficialCalc");
const { addSeparateManualCheque } = require("./payStubManualCalc");
const { addSeparatePayoutCheque } = require("./payStubPayoutCalc");
const { appendPrevPayInfoBalance } = require("./payStubHelper");
const { getPayrollActiveEmployees } = require("./appController");
const FundingTotalsPay = require("../models/FundingTotalsPay");
const Order = require("../models/Order");
const JournalEntry = require("../models/JournalEntry");
const { findEmployeeEmploymentInfo } = require("./employmentInfoController");
const EmployeePayInfo = require("../models/EmployeePayInfo");

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

		YTDDeductionsTotal: getSumTotal(
			prevPayPayInfo?.YTDDeductionsTotal || 0,
			currentDeductionsTotal || 0,
		),

		YTDNetPay: getSumTotal(prevPayPayInfo?.YTDNetPay || 0, currentNetPay || 0),

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
		frequency,
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
		frequency,
	);

	const prevPayPeriodNum = isExtraRun ? payPeriod : payPeriod - 1;
	let prevPayPayInfo = await findPayStub(prevPayPeriodNum, companyName, empId, false);
	const currentPayInfo = await findPayStub(
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
		return currentPayStub;
	}
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
					prevPayPayInfo,
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
				await addPayStub(newPayStub);
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
		await addPayStub(updatedPayStub);
		return updatedPayStub;
	}
};

const findPayStub = async (payPeriodNum, companyName, empId, isExtra) => {
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
		const {
			payPeriodStartDate,
			payPeriodEndDate,
			isExtraRun,
			selectedEmp,
			payPeriod,
			payPeriodPayDate,
			payPeriodProcessingDate,
		} = currentPayPeriod;

		const activeEmployees = isExtraRun
			? await getEmployeeId(selectedEmp)
			: await getPayrollActiveEmployees(companyName, req.body?.deptName);

		const result = isExtraRun
			? null
			: await calculateTimesheetApprovedHours(payPeriodStartDate, payPeriodEndDate, companyName);
		const isCornerStone = companyName === COMPANIES.CORNERSTONE;
		const fundingTotal = {
			companyName,
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
				isExtraRun,
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
		);
		// if (!isExtraRun) generateT4Slip(companyName, payPeriod);
		res.status(200).json({ message: "Paystub created successfully" });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const buildFundingTotalsReport = async (
	fundingTotal,
	totalEmployees,
	isExtraRun = false,
	isCornerStone,
) => {
	fundingTotal.totalCPP_Contr =
		fundingTotal?.totalCPP_EE_Contr + fundingTotal?.totalCPP_ER_Contr || 0;
	fundingTotal.totalEI_Contr = fundingTotal?.totalEI_EE_Contr + fundingTotal?.totalEI_ER_Contr || 0;
	fundingTotal.totalGovtContr =
		fundingTotal?.totalCPP_Contr +
			fundingTotal?.totalEI_Contr +
			fundingTotal?.totalIncomeTaxContr || 0;

	fundingTotal.totalEmpPaymentRemitCost = fundingTotal.totalNetPay || 0;

	fundingTotal.totalEmpPayrollCost = isCornerStone ? 0 : totalEmployees * 2;
	fundingTotal.totalTimeManagementEmpCost = isCornerStone ? 0 : totalEmployees * 1.75;

	fundingTotal.totalCorePayrollCost =
		fundingTotal.totalBatchCharges + fundingTotal.totalEmpPayrollCost || 0;
	fundingTotal.totalTimeManagementPayrollCost =
		fundingTotal.timeClockMaintenanceCost + fundingTotal.totalTimeManagementEmpCost || 0;
	fundingTotal.totalServiceCharges =
		fundingTotal.totalCorePayrollCost + fundingTotal.totalTimeManagementPayrollCost || 0;

	fundingTotal.totalFundingWithDrawals =
		fundingTotal.totalGovtContr +
			fundingTotal.totalEmpPaymentRemitCost +
			fundingTotal.totalServiceCharges || 0;
	if (isExtraRun) fundingTotal.isExtraRun = isExtraRun;

	const existsFundDetails = await FundingTotalsPay.findOne({
		companyName: fundingTotal.companyName,
		payPeriodNum: fundingTotal.payPeriodNum,
		isExtraRun,
	});
	if (existsFundDetails) {
		fundingTotal.updatedOn = moment();
		await FundingTotalsPay.findByIdAndUpdate(existsFundDetails._id, fundingTotal, {
			new: true,
		});
	} else {
		const newTotals = await FundingTotalsPay.create(fundingTotal);
		if (newTotals) {
			const { companyName } = fundingTotal;
			createNewOrder(newTotals._id, companyName, totalEmployees);
			createJournalEntry(newTotals._id, companyName);
		}
	}
};

const createNewOrder = async (fundingTotalsId, customer, totalRecipients) => {
	const length = await Order.countDocuments({ companyName: BUSINESSN_ORG });
	const orderNumber = `BE100${length + 1}`;
	const newOrder = {
		companyName: BUSINESSN_ORG,
		orderNumber,
		fundingTotalsId,
		totalRecipients,
		customer,
	};
	await Order.create(newOrder);
};

const createJournalEntry = async (fundingTotalReportId, companyName) => {
	let journalEntry = {
		companyName,
		departmentBreakDown: [],
		totalDebit: 0,
		totalCredit: 0,
		netFundingWithdrawals: 0,
	};
	const existsFundDetails = await FundingTotalsPay.findById(fundingTotalReportId);
	if (existsFundDetails) {
		const {
			totalEmpPaymentRemitCost,
			totalGovtContr,
			totalEI_Contr,
			totalCPP_Contr,
			totalIncomeTaxContr,
			totalServiceCharges,
			totalFundingWithDrawals,
			payPeriodNum,
			isExtraRun,
			payPeriodProcessingDate,
		} = existsFundDetails;

		const currentPayStubs = await EmployeePayStub.find({
			companyName,
			payPeriodNum,
			isExtraRun,
		}).select(
			"empId currentGrossPay currentCPPDeductions currentRegPayTotal2 currentEmployerCPPDeductions currentEmployerEIDeductions currentEmployeeEIDeductions currentIncomeTaxDeductions",
		);
		const deptPromises = await Promise.all(
			currentPayStubs.map(async (empPayStub) => {
				const empDeptInfoResult = await findEmployeeEmploymentInfo(empPayStub?.empId, companyName);
				const departments =
					empDeptInfoResult?.positions?.map((pos) => pos?.employmentDepartment).filter(Boolean) ||
					[];
				if (empDeptInfoResult) {
					const originalPayStub = empPayStub.toObject();
					originalPayStub.currentEmployerCPPDeductions = originalPayStub.currentCPPDeductions;
					const grossPay = originalPayStub.currentGrossPay || 0;
					const cppDeductions = originalPayStub.currentCPPDeductions || 0;
					const eiEmployee = originalPayStub.currentEmployeeEIDeductions || 0;
					const eiEmployer = originalPayStub.currentEmployerEIDeductions || 0;
					const cppEmployer = originalPayStub.currentEmployerCPPDeductions || 0;
					const incomeTax = originalPayStub.currentIncomeTaxDeductions || 0;
					const regPay2 = originalPayStub.currentRegPayTotal2 || 0;

					if (departments.length > 1) {
						const dept1Stub = {
							currentGrossPay: grossPay - regPay2,
							currentCPPDeductions: cppDeductions,
							currentEmployerCPPDeductions:
								cppDeductions - (regPay2 / grossPay) * cppDeductions || 0,
							currentEmployeeEIDeductions: eiEmployee,
							currentEmployerEIDeductions: eiEmployer - (regPay2 / grossPay) * eiEmployer || 0,
							currentIncomeTaxDeductions: incomeTax,
							currentRegPayTotal2: regPay2,
						};

						const dept2Stub = {
							currentGrossPay: regPay2,
							currentCPPDeductions: 0,
							currentEmployerCPPDeductions: (regPay2 / grossPay) * cppDeductions || 0,
							currentEmployeeEIDeductions: 0,
							currentEmployerEIDeductions: (regPay2 / grossPay) * eiEmployer || 0,
							currentIncomeTaxDeductions: 0,
							currentRegPayTotal2: regPay2,
						};
						return {
							records: [dept1Stub, dept2Stub],
							departments,
						};
					}

					return {
						records: [originalPayStub],
						departments,
					};
				}
			}),
		);

		const allDepartmentBreakDown = await Promise.all(deptPromises);
		const departmentBreakdown = allDepartmentBreakDown.reduce((acc, { records, departments }) => {
			records.forEach((record, idx) => {
				const department = departments[idx] || "Unknown";

				const dept = acc[department] || {
					department,
					incomeTaxContribution: 0,
					employeeEIContribution: 0,
					employerEIBenefitExpense: 0,
					employeeCPPContribution: 0,
					employerCPPBenefitExpense: 0,
					grossWageExpense: 0,
					CPPPayable: 0,
					EIPayable: 0,
				};

				dept.incomeTaxContribution += record.currentIncomeTaxDeductions || 0;
				dept.employeeEIContribution += record.currentEmployeeEIDeductions || 0;
				dept.employerEIBenefitExpense += record.currentEmployerEIDeductions || 0;
				dept.employeeCPPContribution += record.currentCPPDeductions || 0;
				dept.employerCPPBenefitExpense += record.currentEmployerCPPDeductions || 0;
				dept.grossWageExpense += record.currentGrossPay || 0;
				dept.CPPPayable = dept.employerCPPBenefitExpense;
				dept.EIPayable = dept.employerEIBenefitExpense;

				acc[department] = dept;
			});
			return acc;
		}, {});

		const groupedDepartmentBreakDown = Object.values(departmentBreakdown);

		journalEntry = {
			companyName,
			departmentBreakDown: groupedDepartmentBreakDown,
			totalDebit: 0,
			totalCredit: 0,
			netFundingWithdrawals: totalEmpPaymentRemitCost + totalGovtContr,
			totalEIPayable: totalEI_Contr,
			totalCPPPayable: totalCPP_Contr,
			totalIncomeTaxPayable: totalIncomeTaxContr,
			totalServiceCharges,
			totalFundingWithDrawals,
			payPeriodProcessingDate,
			payPeriodNum,
			isExtraRun,
		};
		const newEntry = await JournalEntry.create(journalEntry);
	}
};

const EMP_INFO = {
	path: "empId",
	model: "Employee",
	select: ["companyId", "employeeId", "fullName", "primaryAddress", "employeeNo"],
};

const getFundPayDetailsReportInfo = async (req, res) => {
	const { companyName, payPeriodNum, isExtraRun } = req.params;
	try {
		const isExtraPayRun = isExtraRun === "true";
		const payStubs = await FundingTotalsPay.findOne({
			companyName,
			payPeriodNum,
			isExtraRun: isExtraPayRun,
			payPeriodPayDate: {
				$gte: moment().startOf("year").toDate(),
				$lt: moment().endOf("year").toDate(),
			},
		}).sort({
			createdOn: -1,
		});
		res.status(200).json(payStubs);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getJournalEntryReportInfo = async (req, res) => {
	const { companyName, payPeriodNum, isExtraRun } = req.params;

	try {
		const isExtraPayRun = isExtraRun === "true";
		const entries = await JournalEntry.findOne({
			companyName,
			payPeriodNum,
			isExtraRun: isExtraPayRun,
			payPeriodProcessingDate: {
				$gte: moment().startOf("year").toDate(),
				$lt: moment().endOf("year").toDate(),
			},
		});
		// if (entries)
		res.status(200).json(entries);
		// return res.status(200).json({
		// 	totalIncomeTaxContr: 0,
		// 	totalCPP_EE_Contr: 0,
		// 	totalCPP_ER_Contr: 0,
		// 	totalCPP_Contr: 0,
		// 	totalBatchCharges: 0,
		// 	timeClockMaintenanceCost: 0,
		// 	totalCorePayrollCost: 0,
		// 	totalEI_Contr: 0,
		// 	totalEI_EE_Contr: 0,
		// 	totalEI_ER_Contr: 0,
		// 	totalEmpPaymentRemitCost: 0,
		// 	totalEmpPayrollCost: 0,
		// 	totalFundingWithDrawals: 0,
		// 	totalGovtContr: 0,
		// 	totalNetPay: 0,
		// 	totalServiceCharges: 0,
		// 	totalTimeManagementEmpCost: 0,
		// 	totalTimeManagementPayrollCost: 0,
		// });
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getFundingPayDetailsReportInfo = async (req, res) => {
	const { companyName, payPeriodNum, isExtraRun } = req.params;

	try {
		const isExtraPayRun = isExtraRun === "true";
		const totals = await FundingTotalsPay.findOne({
			companyName,
			payPeriodNum,
			isExtraRun: isExtraPayRun,
			payPeriodPayDate: {
				$gte: moment().startOf("year").toDate(),
				$lt: moment().endOf("year").toDate(),
			},
		});
		if (totals) return res.status(200).json(totals);

		return res.status(200).json({
			totalIncomeTaxContr: 0,
			totalCPP_EE_Contr: 0,
			totalCPP_ER_Contr: 0,
			totalCPP_Contr: 0,
			totalBatchCharges: 0,
			timeClockMaintenanceCost: 0,
			totalCorePayrollCost: 0,
			totalEI_Contr: 0,
			totalEI_EE_Contr: 0,
			totalEI_ER_Contr: 0,
			totalEmpPaymentRemitCost: 0,
			totalEmpPayrollCost: 0,
			totalFundingWithDrawals: 0,
			totalGovtContr: 0,
			totalNetPay: 0,
			totalServiceCharges: 0,
			totalTimeManagementEmpCost: 0,
			totalTimeManagementPayrollCost: 0,
		});
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getPayDetailsReportInfo = async (req, res) => {
	const { companyName, payPeriodNum, isExtraRun, year } = req.params;

	try {
		const startOfYear = moment().year(year).startOf("year").toDate();
		const endOfYear = moment().year(year).endOf("year").toDate();

		const isExtraPayRun = isExtraRun === "true";
		let payStubs = await EmployeePayStub.find({
			companyName,
			payPeriodNum,
			isExtraRun: isExtraPayRun,
			payPeriodPayDate: {
				$gte: startOfYear,
				$lt: endOfYear,
			},
		}).populate(EMP_INFO);

		payStubs = payStubs?.filter((a) => a?.empId);
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
			reportType: { $nin: [PAYRUN_TYPE.SUPERFICIAL, PAYRUN_TYPE.MANUAL, PAYRUN_TYPE.PAYOUT] },
			currentNetPay: { $ne: 0 },
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
	getFundPayDetailsReportInfo,
	getFundingPayDetailsReportInfo,
	getJournalEntryReportInfo,
};
