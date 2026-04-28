const moment = require("moment");

const EmployeePayStub = require("../models/EmployeePayStub");
const FundingTotalsPay = require("../models/FundingTotalsPay");
const Order = require("../models/Order");
const JournalEntry = require("../models/JournalEntry");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const { updatePayGroup } = require("./setUpController");
const { vopayFundTransfer } = require("./vopayController");
const { getEmployeeId } = require("./userController");
const { checkExtraRun } = require("../helpers/payrollHelper");
const { COMPANIES } = require("../constants/constant");
const { PAYRUN_TYPE } = require("../constants/pay.constants");
const { sortByEmpFullName } = require("../services/userService");
const { safeNum } = require("../utils/time.util");

const buildFundingTotalsReport = async (
	fundingTotal,
	totalEmployees,
	isExtraRun = false,
	isCornerStone,
	scheduleFrequency,
) => {
	try {
		fundingTotal.totalCPP_Contr =
			safeNum(fundingTotal?.totalCPP_EE_Contr) + safeNum(fundingTotal?.totalCPP_ER_Contr);

		fundingTotal.totalEI_Contr =
			safeNum(fundingTotal?.totalEI_EE_Contr) + safeNum(fundingTotal?.totalEI_ER_Contr);

		fundingTotal.totalGovtContr =
			safeNum(fundingTotal?.totalCPP_Contr) +
			safeNum(fundingTotal?.totalEI_Contr) +
			safeNum(fundingTotal?.totalIncomeTaxContr);

		fundingTotal.totalEmpPaymentRemitCost = safeNum(fundingTotal.totalNetPay);

		fundingTotal.totalEmpPayrollCost = isCornerStone ? 0 : totalEmployees * 2;
		fundingTotal.totalTimeManagementEmpCost = isCornerStone ? 0 : totalEmployees * 1.75;

		fundingTotal.totalCorePayrollCost =
			safeNum(fundingTotal.totalBatchCharges) + safeNum(fundingTotal.totalEmpPayrollCost);

		fundingTotal.totalTimeManagementPayrollCost =
			safeNum(fundingTotal.timeClockMaintenanceCost) +
			safeNum(fundingTotal.totalTimeManagementEmpCost);

		fundingTotal.totalServiceCharges =
			safeNum(fundingTotal.totalCorePayrollCost) +
			safeNum(fundingTotal.totalTimeManagementPayrollCost);

		fundingTotal.totalFundingWithDrawals =
			safeNum(fundingTotal.totalGovtContr) +
			safeNum(fundingTotal.totalEmpPaymentRemitCost) +
			safeNum(fundingTotal.totalServiceCharges);

		if (isExtraRun) fundingTotal.isExtraRun = isExtraRun;

		const existsFundDetails = await FundingTotalsPay.findOne({
			companyName: fundingTotal.companyName,
			payPeriodNum: fundingTotal.payPeriodNum,
			isExtraRun,
			payPeriodPayDate: moment.utc(fundingTotal.payPeriodPayDate).startOf("day").toDate(),
			scheduleFrequency,
		}).sort({
			createdOn: -1,
		});
		let result;
		if (existsFundDetails) {
			await FundingTotalsPay.findByIdAndUpdate(
				existsFundDetails._id,
				{ $set: fundingTotal },
				{
					new: true,
				},
			);
		} else {
			result = await FundingTotalsPay.create(fundingTotal);
			createJournalEntry(result._id, fundingTotal.companyName, scheduleFrequency).catch((err) =>
				console.error("Journal entry failed:", err),
			);
			return result;
		}
	} catch (error) {
		console.error("❌ buildFundingTotalsReport Error:", {
			message: error.message,
			stack: error.stack,
		});
		throw error;
	}
};

const createNewOrder = async (fundingTotalsId, customer, totalRecipients) => {
	try {
		const length = await Order.countDocuments({ companyName: COMPANIES.BUSINESSN_ORG });
		const orderNumber = `BE100${length + 1}`;
		const newOrder = {
			companyName: COMPANIES.BUSINESSN_ORG,
			orderNumber,
			fundingTotalsId,
			totalRecipients,
			customer,
		};
		const existingRecord = await Order.findOne(newOrder);
		if (!existingRecord) {
			await Order.create(newOrder);
		}
		return orderNumber;
	} catch (error) {
		console.error("❌ createNewOrder Error:", {
			message: error.message,
			stack: error.stack,
		});
		throw error;
	}
};

const createJournalEntry = async (fundingTotalReportId, companyName) => {
	try {
		const existsFundDetails = await FundingTotalsPay.findById(fundingTotalReportId);
		if (!existsFundDetails) return;

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
			scheduleFrequency,
		} = existsFundDetails;

		const currentPayStubs = await EmployeePayStub.find({
			companyName,
			payPeriodNum,
			isExtraRun,
			scheduleFrequency,
		}).select(
			"empId currentGrossPay currentCPPDeductions currentRegPayTotal2 currentEmployerCPPDeductions currentEmployerEIDeductions currentEmployeeEIDeductions currentIncomeTaxDeductions",
		);
		const empIds = currentPayStubs.map((e) => e.empId);
		// -----------------------------
		// BULK FETCH (FIXES N+1 PROBLEM)
		// -----------------------------
		const empInfoList = await EmployeeEmploymentInfo.find({
			empId: { $in: empIds },
			companyName,
		});
		const empDeptMap = new Map(empInfoList.map((e) => [e.empId, e]));
		// -----------------------------
		// BUILD BREAKDOWN
		// -----------------------------
		const departmentBreakdown = {};

		for (const empPayStub of currentPayStubs) {
			const empDeptInfo = empDeptMap.get(empPayStub.empId);

			const departments =
				empDeptInfo?.positions?.map((p) => p?.employmentDepartment).filter(Boolean) || [];

			const grossPay = empPayStub.currentGrossPay;
			const regPay2 = empPayStub.currentRegPayTotal2;

			const safeRatio = grossPay > 0 ? regPay2 / grossPay : 0;

			const baseRecord = empPayStub.toObject();

			const records =
				departments.length > 1
					? [
							{
								...baseRecord,
								currentGrossPay: grossPay - regPay2,
								currentEmployerCPPDeductions:
									safeNum(empPayStub.currentCPPDeductions) * (1 - safeRatio),
								currentEmployerEIDeductions:
									safeNum(empPayStub.currentEmployerEIDeductions) * (1 - safeRatio),
							},
							{
								...baseRecord,
								currentGrossPay: regPay2,
								currentCPPDeductions: 0,
								currentEmployerCPPDeductions: safeNum(empPayStub.currentCPPDeductions) * safeRatio,
								currentEmployerEIDeductions:
									safeNum(empPayStub.currentEmployerEIDeductions) * safeRatio,
							},
						]
					: [baseRecord];

			records.forEach((record, idx) => {
				const deptName = departments[idx] || "Unknown";

				if (!departmentBreakdown[deptName]) {
					departmentBreakdown[deptName] = {
						department: deptName,
						incomeTaxContribution: 0,
						employeeEIContribution: 0,
						employerEIBenefitExpense: 0,
						employeeCPPContribution: 0,
						employerCPPBenefitExpense: 0,
						grossWageExpense: 0,
						CPPPayable: 0,
						EIPayable: 0,
					};
				}

				const dept = departmentBreakdown[deptName];

				dept.incomeTaxContribution += safeNum(record.currentIncomeTaxDeductions);
				dept.employeeEIContribution += safeNum(record.currentEmployeeEIDeductions);
				dept.employerEIBenefitExpense += safeNum(record.currentEmployerEIDeductions);
				dept.employeeCPPContribution += safeNum(record.currentCPPDeductions);
				dept.employerCPPBenefitExpense += safeNum(record.currentEmployerCPPDeductions);
				dept.grossWageExpense += safeNum(record.currentGrossPay);

				dept.CPPPayable = dept.employerCPPBenefitExpense;
				dept.EIPayable = dept.employerEIBenefitExpense;
			});
		}

		// -----------------------------
		// JOURNAL ENTRY
		// -----------------------------
		const journalEntry = {
			companyName,
			departmentBreakDown: Object.values(departmentBreakdown),
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
			scheduleFrequency,
		};

		const existingRecord = await JournalEntry.findOne(journalEntry);

		if (!existingRecord) {
			await JournalEntry.create(journalEntry);
		}
	} catch (error) {
		console.error("❌ createJournalEntry  Error:", {
			message: error.message,
			stack: error.stack,
		});
		throw error;
	}
};

const updatePayrollProcess = async (req, res) => {
	const { id } = req.params;
	const { yearSchedules, companyName, currentPayPeriod } = req.body;
	try {
		const { _id, ...updateData } = req.body;
		const updatedPaygroup = await updatePayGroup(id, {
			yearSchedules,
		});
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
		const searchObj = {
			payPeriodPayDate,
			payPeriodNum: payPeriod,
			companyName,
			isExtraRun: isExtraRun || false,
			scheduleFrequency,
		};

		const fundTotalsReport = await FundingTotalsPay.findOne(searchObj).select(
			"totalFundingWithDrawals totalEmpPaymentRemitCost totalGovtContr totalServiceCharges",
		);

		searchObj.isProcessed = true;

		const employeePayStubs = await EmployeePayStub.find(searchObj).select("empId currentNetPay");
		const employeesToReceivePayment = employeePayStubs.filter((rec) => rec.currentNetPay > 0);

		if (fundTotalsReport) {
			await vopayFundTransfer(companyName, fundTotalsReport, employeesToReceivePayment);
			// createNewOrder(fundTotalsReport._id, companyName, employeesToReceivePayment?.length);
		}

		return res.status(200).json({ employeePayStubs, fundTotalsReport });
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const EMP_INFO = {
	path: "empId",
	model: "Employee",
	select: ["companyId", "employeeId", "fullName", "primaryAddress", "employeeNo"],
};

const getFundReportInfo = async (req, res) => {
	const { companyName, payPeriodNum, payPeriodPayDate, isExtraRun, scheduleFrequency } = req.params;
	try {
		const isExtraPayRun = checkExtraRun(isExtraRun);
		const payStubs = await FundingTotalsPay.findOne({
			companyName,
			payPeriodNum,
			isExtraRun: isExtraPayRun,
			payPeriodPayDate: moment.utc(payPeriodPayDate).startOf("day").toDate(),
			scheduleFrequency,
		}).sort({
			createdOn: -1,
		});
		return res.status(200).json(payStubs);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getJournalEntryReportInfo = async (req, res) => {
	const { companyName, payPeriodNum, payPeriodProcessingDate, isExtraRun, scheduleFrequency } =
		req.params;

	try {
		const isExtraPayRun = checkExtraRun(isExtraRun);
		const entries = await JournalEntry.findOne({
			companyName,
			payPeriodNum,
			isExtraRun: isExtraPayRun,
			payPeriodProcessingDate: moment.utc(payPeriodProcessingDate).startOf("day").toDate(),
			scheduleFrequency,
		});
		// if (entries)
		return res.status(200).json(entries);
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
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getFundingReportInfo = async (req, res) => {
	const { companyName, payPeriodNum, payPeriodPayDate, isExtraRun, scheduleFrequency } = req.params;

	try {
		const isExtraPayRun = checkExtraRun(isExtraRun);
		const totals = await FundingTotalsPay.findOne({
			companyName,
			payPeriodNum,
			isExtraRun: isExtraPayRun,
			payPeriodPayDate: moment.utc(payPeriodPayDate).startOf("day").toDate(),
			scheduleFrequency,
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
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getReportInfo = async (req, res) => {
	const { companyName, payPeriodNum, isExtraRun, payPeriodPayDate, scheduleFrequency, year } =
		req.params;

	try {
		const startOfYear = moment().year(year).startOf("year").toDate();
		const endOfYear = moment().year(year).endOf("year").toDate();

		const isExtraPayRun = checkExtraRun(isExtraRun);

		let payStubs = await EmployeePayStub.find({
			empId: { $exists: true },
			companyName,
			payPeriodNum,
			isExtraRun: isExtraPayRun,
			// payPeriodPayDate: moment.utc(payPeriodPayDate).startOf("day").toDate(),
			payPeriodPayDate: {
				$gte: startOfYear,
				$lt: endOfYear,
			},
			scheduleFrequency,
		}).populate(EMP_INFO);

		payStubs = payStubs?.filter((p) => p?.empId);
		return res.status(200).json(sortByEmpFullName(payStubs));
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getEmployeeReportInfo = async (req, res) => {
	const { companyName, empId } = req.params;

	try {
		const payStubs = await EmployeePayStub.find({
			companyName,
			empId,
			isProcessed: true,
			reportType: {
				$nin: [PAYRUN_TYPE.SUPERFICIAL, PAYRUN_TYPE.MANUAL, PAYRUN_TYPE.PAYOUT],
			},
			currentNetPay: { $ne: 0 },
		})
			.populate(EMP_INFO)
			.sort({
				payPeriodPayDate: -1,
			});
		return res.status(200).json(payStubs);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

module.exports = {
	getReportInfo,
	getEmployeeReportInfo,
	getFundReportInfo,
	getFundingReportInfo,
	getJournalEntryReportInfo,
	buildFundingTotalsReport,
	updatePayrollProcess,
};
