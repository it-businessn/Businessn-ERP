const EmployeeAlertsViolationInfo = require("../models/EmployeeAlertsViolationInfo");
const EmployeeBankingInfo = require("../models/EmployeeBankingInfo");
const EmployeePayInfo = require("../models/EmployeePayInfo");
const EmployeePayStub = require("../models/EmployeePayStub");
const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");
const Group = require("../models/Group");
const Timesheet = require("../models/Timesheet");
const {
	getCalcAmount,
	getTaxDetails,
	getHrs,
	getSumTotal,
} = require("../services/payrollService");

const getAllPayGroups = async (req, res) => {
	const { companyName } = req.params;
	try {
		const groups = await Group.find({
			companyName,
			payrollActivated: true,
		});
		res.status(200).json(groups);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getGroupedTimesheet = async (req, res) => {
	const { companyName, startDate, endDate } = req.params;

	try {
		const result = await calculateTotalAggregatedHours(
			startDate,
			endDate,
			companyName,
		);
		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const EMP_INFO = {
	path: "empId",
	model: "Employee",
	select: ["companyId", "employeeId", "fullName"],
};

const getPayDetailsReportInfo = async (req, res) => {
	const { companyName, payPeriodNum } = req.params;

	try {
		const payStubs = await EmployeePayStub.find({
			companyName,
			payPeriodNum,
		})
			.populate(EMP_INFO)
			.sort({
				"empId.fullName": 1,
			});
		res.status(200).json(payStubs);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getAlertsAndViolationsInfo = async (req, res) => {
	const { companyName, payPeriodNum } = req.params;

	try {
		const payStubs = await EmployeeAlertsViolationInfo.find({
			companyName,
			payPeriodNum,
		})
			.populate(EMP_INFO)
			.sort({
				createdOn: -1,
			});
		res.status(200).json(payStubs);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

// const findEmployeePayInfo = async (empId, companyName) =>
// 	await EmployeePayInfo.findOne({
// 		empId,
// 		companyName,
// 	});

// const updatePayInfo = async (id, data) =>
// 	await EmployeePayInfo.findByIdAndUpdate(id, data, {
// 		new: true,
// 	});
// const addPayGroup = async (req, res) => {
// 	const {
// 		empId,
// 		companyName,
// 		regPay,
// 		overTimePay,
// 		dblOverTimePay,
// 		statWorkPay,
// 		statPay,
// 		sickPay,
// 		salaryRate,
// 		dailyHours,
// 		longTermDisabilityEE,
// 		longTermDisabilityER,
// 		dentalEE,
// 		dentalER,
// 		extendedHealthEE,
// 		extendedHealthER,
// 		unionDues,
// 		vacationPay,
// 	} = req.body;
// 	try {
// 		const existingPayInfo = await findEmployeePayInfo(empId, companyName);
// 		if (existingPayInfo) {
// 			const updatedPayInfo = await updatePayInfo(existingPayInfo._id, req.body);
// 			return res.status(201).json(updatedPayInfo);
// 		}
// 		const newPayInfo = await EmployeePayInfo.create({
// 			empId,
// 			companyName,
// 			regPay,
// 			overTimePay,
// 			dblOverTimePay,
// 			statWorkPay,
// 			statPay,
// 			sickPay,
// 			salaryRate,
// 			dailyHours,
// 			longTermDisabilityEE,
// 			longTermDisabilityER,
// 			dentalEE,
// 			dentalER,
// 			extendedHealthEE,
// 			extendedHealthER,
// 			unionDues,
// 			vacationPay,
// 		});
// 		return res.status(201).json(newPayInfo);
// 	} catch (error) {
// 		res.status(400).json({ message: error.message });
// 	}
// };
const getPayGroup = () => {};
const addPayGroup = () => {};
const updatePayGroup = () => {};

const findCurrentPayStub = async (payPeriodNum, companyName, empId) =>
	await EmployeePayStub.findOne({
		payPeriodNum,
		companyName,
		empId,
	});

const calculateTotalAggregatedHours = async (
	startDate,
	endDate,
	companyName,
) => {
	const timesheets = await Timesheet.find({
		companyName,
		createdOn: { $gte: startDate, $lte: endDate },
		approveStatus: "Approved",
	}).populate({
		path: "employeeId",
		model: "Employee",
		select: ["companyId", "employeeId", "fullName"],
	});

	const aggregatedHours = timesheets.reduce((acc, timesheet) => {
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

		acc[timesheet.employeeId].totalRegHoursWorked +=
			timesheet.regHoursWorked || 0;
		acc[timesheet.employeeId].totalOvertimeHoursWorked +=
			timesheet.overtimeHoursWorked || 0;
		acc[timesheet.employeeId].totalDblOvertimeHoursWorked +=
			timesheet.dblOvertimeHoursWorked || 0;
		acc[timesheet.employeeId].totalStatHours += timesheet.statDayHours || 0;
		acc[timesheet.employeeId].totalStatDayHoursWorked +=
			timesheet.statDayHoursWorked || 0;
		acc[timesheet.employeeId].totalSickHoursWorked +=
			timesheet.sickPayHours || 0;
		acc[timesheet.employeeId].totalVacationHoursWorked +=
			timesheet.vacationPayHours || 0;
		return acc;
	}, {});

	const result = Object.values(aggregatedHours);
	return result;
};

const updatePayStub = async (id, data) =>
	await EmployeePayStub.findByIdAndUpdate(id, data, {
		new: true,
	});

const addEmployeePayStubInfo = async (req, res) => {
	const { companyName, currentPayPeriod } = req.body;
	try {
		const {
			payPeriodStartDate,
			payPeriodEndDate,
			payPeriodPayDate,
			payPeriodProcessingDate,
			payPeriod,
		} = currentPayPeriod;

		const result = await calculateTotalAggregatedHours(
			payPeriodStartDate,
			payPeriodEndDate,
			companyName,
		);
		for (const data of result) {
			const empResult = await EmployeePayInfo.findOne({
				empId: data.empId._id,
			}).select(
				"empId regPay overTimePay dblOverTimePay statWorkPay statPay sickPay vacationPay commission retroactive vacationPayout bonus terminationPayout",
			);
			if (empResult) {
				data.empId = data.empId._id;
				data.currentPayDetails = empResult;
				data.currentRegPayTotal = getCalcAmount(
					data.totalRegHoursWorked,
					empResult.regPay,
				);
				data.currentOverTimePayTotal = getCalcAmount(
					data.totalOvertimeHoursWorked,
					empResult.overTimePay,
				);
				data.currentDblOverTimePayTotal = getCalcAmount(
					data.totalDblOvertimeHoursWorked,
					empResult.dblOverTimePay,
				);
				data.currentStatWorkPayTotal = getCalcAmount(
					data.totalStatDayHoursWorked,
					empResult.statWorkPay,
				);
				data.currentStatPayTotal = getCalcAmount(
					data.totalStatHours,
					empResult.statPay,
				);
				data.currentSickPayTotal = getCalcAmount(
					data.totalSickHoursWorked,
					empResult.sickPay,
				);
				data.currentVacationPayTotal = getCalcAmount(
					data.totalVacationHoursWorked,
					empResult.vacationPay,
				);
				data.currentGrossPay =
					data.currentRegPayTotal +
					data.currentOverTimePayTotal +
					data.currentDblOverTimePayTotal +
					data.currentStatWorkPayTotal +
					data.currentStatPayTotal +
					data.currentSickPayTotal +
					data.currentVacationPayTotal +
					empResult.commission +
					empResult.retroactive +
					empResult.vacationPayout +
					empResult.bonus +
					empResult.terminationPayout;

				const {
					grossSalaryByPayPeriod,
					CPPContribution,
					totalProvincialTaxDeduction,
					federalTaxDeductionByPayPeriod,
					EIContribution,
				} = getTaxDetails(data.currentGrossPay);

				data.currentFDTaxDeductions = federalTaxDeductionByPayPeriod;
				data.currentStateTaxDeductions = totalProvincialTaxDeduction;
				data.currentCPPDeductions = CPPContribution;
				data.currentEIDeductions = EIContribution;
				data.currentOtherDeductions = 0;

				data.currentDeductionsTotal =
					data.currentFDTaxDeductions +
					data.currentStateTaxDeductions +
					data.currentCPPDeductions +
					data.currentEIDeductions +
					data.currentOtherDeductions;

				data.currentNetPay =
					grossSalaryByPayPeriod - data.currentDeductionsTotal;

				const prevPayPayInfo = await findCurrentPayStub(
					payPeriod - 1,
					companyName,
					data.empId,
				);

				const currentPayInfo = await findCurrentPayStub(
					payPeriod,
					companyName,
					data.empId,
				);

				const currentPayStub = {
					empId: data.empId,
					companyName,
					payPeriodStartDate,
					payPeriodEndDate,
					payPeriodPayDate,
					payPeriodProcessingDate,
					payPeriodNum: payPeriod,
					currentNetPay: data.currentNetPay,
					commission: empResult.commission,
					retroactive: empResult.retroactive,
					vacationPayout: empResult.vacationPayout,
					bonus: empResult.bonus,
					terminationPayout: empResult.terminationPayout,
					regPay: empResult.regPay,
					overTimePay: empResult.overTimePay,
					dblOverTimePay: empResult.dblOverTimePay,
					statWorkPay: empResult.statWorkPay,
					statPay: empResult.statPay,
					sickPay: empResult.sickPay,
					vacationPay: data.vacationPay,
					totalRegHoursWorked: parseFloat(getHrs(data.totalRegHoursWorked)),
					totalOvertimeHoursWorked: parseFloat(
						getHrs(data.totalOvertimeHoursWorked),
					),
					totalDblOvertimeHoursWorked: parseFloat(
						getHrs(data.totalDblOvertimeHoursWorked),
					),
					totalStatDayHoursWorked: parseFloat(
						getHrs(data.totalStatDayHoursWorked),
					),
					totalStatHours: parseFloat(getHrs(data.totalStatHours)),
					totalSickHoursWorked: parseFloat(getHrs(data.totalSickHoursWorked)),
					totalVacationHoursWorked: parseFloat(
						getHrs(data.totalVacationHoursWorked),
					),

					currentRegPayTotal: data.currentRegPayTotal,
					currentOverTimePayTotal: data.currentOverTimePayTotal,
					currentDblOverTimePayTotal: data.currentDblOverTimePayTotal,
					currentStatWorkPayTotal: data.currentStatWorkPayTotal,
					currentStatPayTotal: data.currentStatPayTotal,
					currentSickPayTotal: data.currentSickPayTotal,
					currentVacationPayTotal: data.currentVacationPayTotal,
					currentGrossPay: data.currentGrossPay,
					currentFDTaxDeductions: data.currentFDTaxDeductions,
					currentStateTaxDeductions: data.currentStateTaxDeductions,
					currentCPPDeductions: data.currentCPPDeductions,
					currentEIDeductions: data.currentEIDeductions,
					currentOtherDeductions: data.currentOtherDeductions,
					currentDeductionsTotal: data.currentDeductionsTotal,
					currentNetPay: data.currentNetPay,
					YTDRegPayTotal: getSumTotal(
						prevPayPayInfo?.YTDRegPayTotal,
						data.currentRegPayTotal,
					),
					YTDOverTimePayTotal: getSumTotal(
						prevPayPayInfo?.YTDOverTimePayTotal,
						data.currentOverTimePayTotal,
					),
					YTDDblOverTimePayTotal: getSumTotal(
						prevPayPayInfo?.YTDDblOverTimePayTotal,
						data.currentDblOverTimePayTotal,
					),
					YTDStatWorkPayTotal: getSumTotal(
						prevPayPayInfo?.YTDStatWorkPayTotal,
						data.currentStatWorkPayTotal,
					),
					YTDStatPayTotal: getSumTotal(
						prevPayPayInfo?.YTDStatPayTotal,
						data.currentStatPayTotal,
					),
					YTDSickPayTotal: getSumTotal(
						prevPayPayInfo?.YTDSickPayTotal,
						data.currentSickPayTotal,
					),
					YTDVacationPayTotal: getSumTotal(
						prevPayPayInfo?.YTDVacationPayTotal,
						data.currentVacationPayTotal,
					),

					YTDCommission: getSumTotal(
						prevPayPayInfo?.YTDCommission,
						empResult.commission,
					),
					YTDRetroactive: getSumTotal(
						prevPayPayInfo?.YTDRetroactive,
						empResult.retroactive,
					),
					YTDVacationPayout: getSumTotal(
						prevPayPayInfo?.YTDVacationPayout,
						empResult.vacationPayout,
					),
					YTDBonus: getSumTotal(prevPayPayInfo?.YTDBonus, empResult.bonus),
					YTDTerminationPayout: getSumTotal(
						prevPayPayInfo?.YTDTerminationPayout,
						empResult.terminationPayout,
					),
					YTDGrossPay: prevPayPayInfo?.YTDGrossPay || 0 + data.currentGrossPay,
					YTD_FDTaxDeductions:
						prevPayPayInfo?.YTD_FDTaxDeductions ||
						0 + data.currentFDTaxDeductions,
					YTDStateTaxDeductions:
						prevPayPayInfo?.YTDStateTaxDeductions ||
						0 + data.currentStateTaxDeductions,
					YTD_CPPDeductions:
						prevPayPayInfo?.YTD_CPPDeductions || 0 + data.currentCPPDeductions,
					YTD_EIDeductions:
						prevPayPayInfo?.YTD_EIDeductions || 0 + data.currentEIDeductions,
					YTDOtherDeductions:
						prevPayPayInfo?.YTDOtherDeductions ||
						0 + data.currentOtherDeductions,
					YTDDeductionsTotal:
						prevPayPayInfo?.YTDDeductionsTotal ||
						0 + data.currentDeductionsTotal,
					YTDNetPay: prevPayPayInfo?.YTDNetPay || 0 + data.currentNetPay,
				};
				if (currentPayInfo) {
					await updatePayStub(currentPayInfo._id, currentPayStub);
				} else {
					await EmployeePayStub.create(currentPayStub);
				}
			}
		}
		res.status(200).json({ message: "Paystub created successfully" });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const findAlertInfo = async (record) =>
	await EmployeeAlertsViolationInfo.findOne(record);

const addAlertsAndViolations = async (req, res) => {
	const { companyName, inputsReviewData } = req.body;

	try {
		for (const data of inputsReviewData) {
			const empResult = await EmployeeBankingInfo.findOne({
				empId: data.empId._id,
			}).select("empId bankNum transitNum accountNum");

			const empSINResult = await EmployeeProfileInfo.findOne({
				empId: data.empId._id,
			}).select("empId SIN");
			if (
				!empResult ||
				empResult.bankNum === "" ||
				empResult.transitNum === "" ||
				empResult.accountNum === ""
			) {
				const alertsExists = await findAlertInfo({
					empId: data.empId._id,
					companyName,
					actionRequired: true,
				});
				if (alertsExists) {
				} else {
					await EmployeeAlertsViolationInfo.create({
						empId: data.empId._id,
						companyName,
						description: "Banking information missing",
						actionRequired: true,
						payPeriodNum: data.payPeriodNum,
					});
				}
			}
			if (empSINResult.SIN === "") {
				const alertsExists = await findAlertInfo({
					empId: data.empId._id,
					companyName,
					actionRequired: false,
				});
				if (alertsExists) {
				} else {
					await EmployeeAlertsViolationInfo.create({
						empId: data.empId._id,
						companyName,
						description: "SIN missing",
						actionRequired: false,
						payPeriodNum: data.payPeriodNum,
					});
				}
			}
		}
		res.status(200).json({ message: "Alerts processed successfully" });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const deleteAlerts = async (empId) => {
	const existingAlert = await EmployeeAlertsViolationInfo.findOne({
		empId,
	});
	const deleted = await EmployeeAlertsViolationInfo.findByIdAndDelete({
		_id: existingAlert._id,
	});
	if (deleted) {
		console.log(`Alert  with id ${existingAlert._id} deleted successfully.`);
	} else {
		console.log("Alert Details not found.");
	}
};

module.exports = {
	getAllPayGroups,
	getPayGroup,
	addPayGroup,
	updatePayGroup,
	getGroupedTimesheet,
	getPayDetailsReportInfo,
	addEmployeePayStubInfo,
	addAlertsAndViolations,
	getAlertsAndViolationsInfo,
	deleteAlerts,
};
