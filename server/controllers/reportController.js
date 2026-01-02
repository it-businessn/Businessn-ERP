const moment = require("moment");

const EmployeePayStub = require("../models/EmployeePayStub");
const FundingTotalsPay = require("../models/FundingTotalsPay");
const Order = require("../models/Order");
const JournalEntry = require("../models/JournalEntry");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");

const { PAYRUN_TYPE, COMPANIES } = require("../services/data");
const { checkExtraRun } = require("../services/util");
const { sortByEmpFullName } = require("../helpers/userHelper");

const buildFundingTotalsReport = async (
	fundingTotal,
	totalEmployees,
	isExtraRun = false,
	isCornerStone,
	scheduleFrequency,
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
		payPeriodPayDate: moment.utc(fundingTotal.payPeriodPayDate).startOf("day").toDate(),
		scheduleFrequency,
	}).sort({
		createdOn: -1,
	});
	if (existsFundDetails) {
		await FundingTotalsPay.findByIdAndUpdate(
			existsFundDetails._id,
			{ $set: fundingTotal },
			{
				new: true,
			},
		);
		return;
	}
	const newTotals = await FundingTotalsPay.create(fundingTotal);
	if (newTotals) {
		const { companyName } = fundingTotal;
		createNewOrder(newTotals._id, companyName, totalEmployees);
		createJournalEntry(newTotals._id, companyName, scheduleFrequency);
	}
};

const createNewOrder = async (fundingTotalsId, customer, totalRecipients) => {
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
};

const createJournalEntry = async (fundingTotalReportId, companyName) => {
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
		const deptPromises = await Promise.all(
			currentPayStubs.map(async (empPayStub) => {
				const empDeptInfoResult = await EmployeeEmploymentInfo.findOne({
					empId: empPayStub?.empId,
					companyName,
				});
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

		const journalEntry = {
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
			scheduleFrequency,
		};
		const existingRecord = await JournalEntry.findOne(journalEntry);
		if (!existingRecord) {
			await JournalEntry.create(journalEntry);
		}
	}
};

const EMP_INFO = {
	path: "empId",
	model: "Employee",
	select: ["companyId", "employeeId", "fullName", "primaryAddress", "employeeNo"],
};

const getFundReportInfo = async (req, res) => {
	const { companyName, payPeriodNum, isExtraRun, scheduleFrequency } = req.params;
	try {
		const isExtraPayRun = checkExtraRun(isExtraRun);
		const payStubs = await FundingTotalsPay.findOne({
			companyName,
			payPeriodNum,
			isExtraRun: isExtraPayRun,
			payPeriodPayDate: {
				$gte: moment().startOf("year").toDate(),
				$lt: moment().endOf("year").toDate(),
			},
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
	const { companyName, payPeriodNum, isExtraRun, scheduleFrequency } = req.params;

	try {
		const isExtraPayRun = checkExtraRun(isExtraRun);
		const entries = await JournalEntry.findOne({
			companyName,
			payPeriodNum,
			isExtraRun: isExtraPayRun,
			payPeriodProcessingDate: {
				$gte: moment().startOf("year").toDate(),
				$lt: moment().endOf("year").toDate(),
			},
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

		payStubs = payStubs?.filter((_) => _?.empId);
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
			reportType: { $nin: [PAYRUN_TYPE.SUPERFICIAL, PAYRUN_TYPE.MANUAL, PAYRUN_TYPE.PAYOUT] },
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
};
