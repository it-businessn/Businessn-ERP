// const Employee = require("../models/Employee");
const Employee = require("../models/Employee");
const EmployeeAlertsViolationInfo = require("../models/EmployeeAlertsViolationInfo");
const EmployeeBankingInfo = require("../models/EmployeeBankingInfo");
const EmployeePayInfo = require("../models/EmployeePayInfo");
const EmployeePayStub = require("../models/EmployeePayStub");
const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");
// const EmployeeRole = require("../models/EmployeeRole");
const Group = require("../models/Group");
const Timesheet = require("../models/Timesheet");
const {
	getCalcAmount,
	getTaxDetails,
	getHrs,
	getSumTotal,
} = require("../services/payrollService");

//update roles-

// const groups1 = await Employee.find({}).select("role");

// console.log(groups1);
// const updatedData = { name: "Employee" };
// const updatedRoles = await EmployeeRole.updateMany(
// 	{
// 		name: {
// 			$in: ["Sales Associate"],
// 		},
// 	},
// 	{ $set: updatedData },
// );
// console.log(updatedRoles);

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
		const payrollActiveEmployees = await getPayrollActiveEmployees();
		const result = await calculateTotalAggregatedHours(
			startDate,
			endDate,
			companyName,
		);
		if (!result.length) {
			for (const data of payrollActiveEmployees) {
				result.push({
					_id: data._id,
					empId: { fullName: data.fullName, _id: data._id },
					totalRegHoursWorked: 0,
					totalOvertimeHoursWorked: 0,
					totalDblOvertimeHoursWorked: 0,
					totalStatDayHoursWorked: 0,
					totalStatHours: 0,
					totalSickHoursWorked: 0,
					totalVacationHoursWorked: 0,
				});
			}
		}
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
		isProcessed: true,
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
		select: ["companyId", "employeeId", "fullName", "payrollStatus"],
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

const getPayrollActiveEmployees = async () =>
	await Employee.find({ payrollStatus: "Payroll Active" });

const findEmployeePayStub = async (empId, payPeriodNum) =>
	await EmployeePayStub.findOne({
		empId,
		payPeriodNum,
	}).select(
		"empId commission retroactive vacationPayout bonus terminationPayout",
	);

const findEmployeePayInfo = async (empId) =>
	await EmployeePayInfo.findOne({
		empId,
	}).select(
		"empId regPay overTimePay dblOverTimePay statWorkPay statPay sickPay vacationPay",
	);

const addEmployeePayStubInfo = async (req, res) => {
	const { companyName, currentPayPeriod } = req.body;
	try {
		const { payPeriodStartDate, payPeriodEndDate } = currentPayPeriod;

		const result = await calculateTotalAggregatedHours(
			payPeriodStartDate,
			payPeriodEndDate,
			companyName,
		);

		const payrollActiveEmployees = await getPayrollActiveEmployees();
		for (const employee of payrollActiveEmployees) {
			const empTimesheetData = result.find(
				(el) => el.empId._id.toString() === employee._id.toString(),
			);
			if (empTimesheetData) {
				await buildPayStubDetails(
					currentPayPeriod,
					companyName,
					empTimesheetData,
					employee._id,
				);
			} else {
				await buildPayStubDetails(
					currentPayPeriod,
					companyName,
					null,
					employee._id,
				);
			}
		}
		res.status(200).json({ message: "Paystub created successfully" });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const buildPayStubDetails = async (
	currentPayPeriod,
	companyName,
	empTimesheetData,
	empId,
) => {
	const {
		payPeriodStartDate,
		payPeriodEndDate,
		payPeriodPayDate,
		payPeriodProcessingDate,
		payPeriod,
	} = currentPayPeriod;

	const employeeId = empTimesheetData ? empTimesheetData.empId._id : empId;

	const empPayStubResult = await findEmployeePayStub(employeeId, payPeriod);

	const empResult = await findEmployeePayInfo(employeeId);
	const newEmpData = empTimesheetData ? empTimesheetData : {};

	newEmpData.empId = employeeId;
	newEmpData.currentPayDetails = empResult;
	newEmpData.currentRegPayTotal = getCalcAmount(
		empTimesheetData?.totalRegHoursWorked || 0,
		empResult.regPay,
	);
	newEmpData.currentOverTimePayTotal = getCalcAmount(
		empTimesheetData?.totalOvertimeHoursWorked || 0,
		empResult.overTimePay,
	);
	newEmpData.currentDblOverTimePayTotal = getCalcAmount(
		empTimesheetData?.totalDblOvertimeHoursWorked || 0,
		empResult.dblOverTimePay,
	);
	newEmpData.currentStatWorkPayTotal = getCalcAmount(
		empTimesheetData?.totalStatDayHoursWorked || 0,
		empResult.statWorkPay,
	);
	newEmpData.currentStatPayTotal = getCalcAmount(
		empTimesheetData?.totalStatHours || 0,
		empResult.statPay,
	);
	newEmpData.currentSickPayTotal = getCalcAmount(
		empTimesheetData?.totalSickHoursWorked || 0,
		empResult.sickPay,
	);
	newEmpData.currentVacationPayTotal = getCalcAmount(
		empTimesheetData?.totalVacationHoursWorked || 0,
		empResult.vacationPay,
	);
	newEmpData.commission = empPayStubResult?.commission ?? 0;
	newEmpData.retroactive = empPayStubResult?.retroactive ?? 0;
	newEmpData.vacationPayout = empPayStubResult?.vacationPayout ?? 0;
	newEmpData.bonus = empPayStubResult?.bonus ?? 0;
	newEmpData.terminationPayout = empPayStubResult?.terminationPayout ?? 0;

	newEmpData.currentGrossPay =
		newEmpData.currentRegPayTotal +
		newEmpData.currentOverTimePayTotal +
		newEmpData.currentDblOverTimePayTotal +
		newEmpData.currentStatWorkPayTotal +
		newEmpData.currentStatPayTotal +
		newEmpData.currentSickPayTotal +
		newEmpData.currentVacationPayTotal +
		newEmpData.commission +
		newEmpData.retroactive +
		newEmpData.vacationPayout +
		newEmpData.bonus +
		newEmpData.terminationPayout;

	const {
		grossSalaryByPayPeriod,
		CPPContribution,
		totalProvincialTaxDeduction,
		federalTaxDeductionByPayPeriod,
		EIContribution,
	} = getTaxDetails(newEmpData.currentGrossPay);

	newEmpData.currentFDTaxDeductions = federalTaxDeductionByPayPeriod;
	newEmpData.currentStateTaxDeductions = totalProvincialTaxDeduction;
	newEmpData.currentCPPDeductions = CPPContribution;
	newEmpData.currentEIDeductions = EIContribution;
	newEmpData.currentOtherDeductions = 0;

	newEmpData.currentDeductionsTotal =
		newEmpData.currentFDTaxDeductions +
		newEmpData.currentStateTaxDeductions +
		newEmpData.currentCPPDeductions +
		newEmpData.currentEIDeductions +
		newEmpData.currentOtherDeductions;

	newEmpData.currentNetPay =
		grossSalaryByPayPeriod - newEmpData.currentDeductionsTotal;

	const prevPayPayInfo = await findCurrentPayStub(
		payPeriod - 1,
		companyName,
		employeeId,
	);

	const currentPayStub = {
		isProcessed: true,
		empId: employeeId,
		companyName,
		payPeriodStartDate,
		payPeriodEndDate,
		payPeriodPayDate,
		payPeriodProcessingDate,
		payPeriodNum: payPeriod,
		currentNetPay: newEmpData.currentNetPay,
		commission: newEmpData.commission,
		retroactive: newEmpData.retroactive,
		vacationPayout: newEmpData.vacationPayout,
		bonus: newEmpData.bonus,
		terminationPayout: newEmpData.terminationPayout,
		regPay: empResult.regPay,
		overTimePay: empResult.overTimePay,
		dblOverTimePay: empResult.dblOverTimePay,
		statWorkPay: empResult.statWorkPay,
		statPay: empResult.statPay,
		sickPay: empResult.sickPay,
		vacationPay: empResult.vacationPay,
		totalRegHoursWorked: empTimesheetData?.totalRegHoursWorked
			? parseFloat(getHrs(empTimesheetData.totalRegHoursWorked))
			: 0,
		totalOvertimeHoursWorked: empTimesheetData?.totalOvertimeHoursWorked
			? parseFloat(getHrs(empTimesheetData.totalOvertimeHoursWorked))
			: 0,
		totalDblOvertimeHoursWorked: empTimesheetData?.totalDblOvertimeHoursWorked
			? parseFloat(getHrs(empTimesheetData.totalDblOvertimeHoursWorked))
			: 0,
		totalStatDayHoursWorked: empTimesheetData?.totalStatDayHoursWorked
			? parseFloat(getHrs(empTimesheetData.totalStatDayHoursWorked))
			: 0,
		totalStatHours: empTimesheetData?.totalStatHours
			? parseFloat(getHrs(empTimesheetData.totalStatHours))
			: 0,
		totalSickHoursWorked: empTimesheetData?.totalSickHoursWorked
			? parseFloat(getHrs(empTimesheetData.totalSickHoursWorked))
			: 0,
		totalVacationHoursWorked: empTimesheetData?.totalVacationHoursWorked
			? parseFloat(getHrs(empTimesheetData.totalVacationHoursWorked))
			: 0,

		currentRegPayTotal: newEmpData.currentRegPayTotal,
		currentOverTimePayTotal: newEmpData.currentOverTimePayTotal,
		currentDblOverTimePayTotal: newEmpData.currentDblOverTimePayTotal,
		currentStatWorkPayTotal: newEmpData.currentStatWorkPayTotal,
		currentStatPayTotal: newEmpData.currentStatPayTotal,
		currentSickPayTotal: newEmpData.currentSickPayTotal,
		currentVacationPayTotal: newEmpData.currentVacationPayTotal,
		currentGrossPay: newEmpData.currentGrossPay,
		currentFDTaxDeductions: newEmpData.currentFDTaxDeductions,
		currentStateTaxDeductions: newEmpData.currentStateTaxDeductions,
		currentCPPDeductions: newEmpData.currentCPPDeductions,
		currentEIDeductions: newEmpData.currentEIDeductions,
		currentOtherDeductions: newEmpData.currentOtherDeductions,
		currentDeductionsTotal: newEmpData.currentDeductionsTotal,
		currentNetPay: newEmpData.currentNetPay,
		YTDRegPayTotal: getSumTotal(
			prevPayPayInfo?.YTDRegPayTotal,
			newEmpData.currentRegPayTotal,
		),
		YTDOverTimePayTotal: getSumTotal(
			prevPayPayInfo?.YTDOverTimePayTotal,
			newEmpData.currentOverTimePayTotal,
		),
		YTDDblOverTimePayTotal: getSumTotal(
			prevPayPayInfo?.YTDDblOverTimePayTotal,
			newEmpData.currentDblOverTimePayTotal,
		),
		YTDStatWorkPayTotal: getSumTotal(
			prevPayPayInfo?.YTDStatWorkPayTotal,
			newEmpData.currentStatWorkPayTotal,
		),
		YTDStatPayTotal: getSumTotal(
			prevPayPayInfo?.YTDStatPayTotal,
			newEmpData.currentStatPayTotal,
		),
		YTDSickPayTotal: getSumTotal(
			prevPayPayInfo?.YTDSickPayTotal,
			newEmpData.currentSickPayTotal,
		),
		YTDVacationPayTotal: getSumTotal(
			prevPayPayInfo?.YTDVacationPayTotal,
			newEmpData.currentVacationPayTotal,
		),

		YTDCommission: getSumTotal(
			prevPayPayInfo?.YTDCommission,
			newEmpData.commission,
		),
		YTDRetroactive: getSumTotal(
			prevPayPayInfo?.YTDRetroactive,
			newEmpData.retroactive,
		),
		YTDVacationPayout: getSumTotal(
			prevPayPayInfo?.YTDVacationPayout,
			newEmpData.vacationPayout,
		),
		YTDBonus: getSumTotal(prevPayPayInfo?.YTDBonus, newEmpData.bonus),
		YTDTerminationPayout: getSumTotal(
			prevPayPayInfo?.YTDTerminationPayout,
			newEmpData.terminationPayout,
		),
		YTDGrossPay: prevPayPayInfo?.YTDGrossPay || 0 + newEmpData.currentGrossPay,
		YTD_FDTaxDeductions:
			prevPayPayInfo?.YTD_FDTaxDeductions ||
			0 + newEmpData.currentFDTaxDeductions,
		YTDStateTaxDeductions:
			prevPayPayInfo?.YTDStateTaxDeductions ||
			0 + newEmpData.currentStateTaxDeductions,
		YTD_CPPDeductions:
			prevPayPayInfo?.YTD_CPPDeductions || 0 + newEmpData.currentCPPDeductions,
		YTD_EIDeductions:
			prevPayPayInfo?.YTD_EIDeductions || 0 + newEmpData.currentEIDeductions,
		YTDOtherDeductions:
			prevPayPayInfo?.YTDOtherDeductions ||
			0 + newEmpData.currentOtherDeductions,
		YTDDeductionsTotal:
			prevPayPayInfo?.YTDDeductionsTotal ||
			0 + newEmpData.currentDeductionsTotal,
		YTDNetPay: (prevPayPayInfo?.YTDNetPay || 0) + newEmpData.currentNetPay,
	};

	const currentPayInfo = await findCurrentPayStub(
		payPeriod,
		companyName,
		employeeId,
	);

	if (currentPayInfo) {
		await updatePayStub(currentPayInfo._id, currentPayStub);
	} else {
		await EmployeePayStub.create(currentPayStub);
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
			if (!empSINResult || empSINResult.SIN === "") {
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
	if (existingAlert) {
		const deleted = await EmployeeAlertsViolationInfo.findByIdAndDelete({
			_id: existingAlert._id,
		});
		if (deleted) {
			console.log(`Alert  with id ${existingAlert._id} deleted successfully.`);
		} else {
			console.log("Alert Details not found.");
		}
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
	getPayrollActiveEmployees,
};
