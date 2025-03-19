const EmployeePayStub = require("../models/EmployeePayStub");
const { getSumTotal } = require("../services/payrollService");
const { findAllAdditionalHoursAllocatedInfo } = require("./payrunExtraAllocationInfoController");
const { getEmployeeId } = require("./userController");
const moment = require("moment");
// const { generateT4Slip } = require("./t4SlipController");
const {
	buildNewEmpPayStubInfo,
	findEmployeeBenefitInfo,
	calculateTimesheetApprovedHours,
} = require("./payrollHelper");
const { findEmployeePayInfoDetails } = require("./payInfoController");
const { findEmployeeGovernmentInfoDetails } = require("./governmentInfoController");
const { PAYRUN_TYPE } = require("../services/data");
const { addSeparateSuperficialCheque } = require("./payStubSuperficialCalc");
const { addSeparateManualCheque } = require("./payStubManualCalc");
const { addSeparatePayoutCheque } = require("./payStubPayoutCalc");
const { appendPrevPayInfoBalance } = require("./payStubHelper");
const { getPayrollActiveEmployees } = require("./appController");
const FundingTotalsPay = require("../models/FundingTotalsPay");

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
	} = currentPayPeriod;

	const empPayInfoResult = await findEmployeePayInfoDetails(empId, companyName);
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
			: await getPayrollActiveEmployees(companyName);

		const result = isExtraRun
			? null
			: await calculateTimesheetApprovedHours(payPeriodStartDate, payPeriodEndDate, companyName);

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
			totalBatchCharges: 20,
			totalEmpPayrollCost: 0,
			timeClockMaintenanceCost: 5.75,
			totalTimeManagementEmpCost: 0,
			totalCorePayrollCost: 0,
			totalTimeManagementPayrollCost: 0,
			totalServiceCharges: 0,
			totalFundingWithDrawals: 0,
			totalEmpPaymentRemitCost: 0,
		};

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
			fundingTotal.totalIncomeTaxContr += payStubResult?.currentIncomeTaxDeductions || 0;
			fundingTotal.totalCPP_EE_Contr += payStubResult?.currentCPPDeductions || 0;
			fundingTotal.totalCPP_ER_Contr += payStubResult?.currentCPPDeductions || 0;
			fundingTotal.totalEI_EE_Contr += payStubResult?.currentEmployeeEIDeductions || 0;
			fundingTotal.totalEI_ER_Contr += payStubResult?.currentEmployerEIDeductions || 0;
			fundingTotal.totalNetPay += payStubResult?.currentNetPay || 0;
		}

		await buildFundingTotalsReport(fundingTotal, activeEmployees?.length);
		// generateT4Slip(companyName, payPeriod);
		//if payroll processed successful
		//alerts violation generate independently based on emp data, on process payroll will run again to check alerts or violations.
		res.status(200).json({ message: "Paystub created successfully" });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const buildFundingTotalsReport = async (fundingTotal, totalEmployees) => {
	fundingTotal.totalCPP_Contr =
		fundingTotal?.totalCPP_EE_Contr + fundingTotal?.totalCPP_ER_Contr || 0;
	fundingTotal.totalEI_Contr = fundingTotal?.totalEI_EE_Contr + fundingTotal?.totalEI_ER_Contr || 0;
	fundingTotal.totalGovtContr =
		fundingTotal?.totalCPP_Contr +
			fundingTotal?.totalEI_Contr +
			fundingTotal?.totalIncomeTaxContr || 0;

	fundingTotal.totalEmpPaymentRemitCost = fundingTotal.totalNetPay || 0;

	fundingTotal.totalEmpPayrollCost = totalEmployees * 2;
	fundingTotal.totalTimeManagementEmpCost = totalEmployees * 1.75;

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

	const existsFundDetails = await FundingTotalsPay.findOne({
		companyName: fundingTotal.companyName,
		payPeriodNum: fundingTotal.payPeriodNum,
	});
	if (existsFundDetails) {
		fundingTotal.updatedOn = moment();
		await FundingTotalsPay.findByIdAndUpdate(existsFundDetails._id, fundingTotal, {
			new: true,
		});
	} else {
		await FundingTotalsPay.create(fundingTotal);
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
	const { companyName, payPeriodNum, isExtraRun } = req.params;

	try {
		const isExtraPayRun = isExtraRun === "true";
		const payStubs = await EmployeePayStub.find({
			companyName,
			payPeriodNum,
			isExtraRun: isExtraPayRun,
			payPeriodPayDate: {
				$gte: moment().startOf("year").toDate(),
				$lt: moment().endOf("year").toDate(),
			},
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
	getFundPayDetailsReportInfo,
	getFundingPayDetailsReportInfo,
};
