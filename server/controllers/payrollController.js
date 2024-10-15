// const Employee = require("../models/Employee");
const Employee = require("../models/Employee");
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
	getSumTotal,
	getSumHours,
} = require("../services/payrollService");
const { findGroupEmployees } = require("./setUpController");
const { getPayrollActiveEmployees } = require("./userController");

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
	const { companyName, startDate, endDate, payDate, isExtraRun, groupId } =
		req.params;

	try {
		const isExtraPayRun = isExtraRun === "true";
		const employees =
			isExtraPayRun && (await findGroupEmployees(groupId, payDate));

		const activeEmployees = isExtraPayRun
			? await getEmployeeId(employees)
			: await getPayrollActiveEmployees(companyName);

		const currentPeriodEmployees = isExtraPayRun
			? null
			: await calculateTotalAggregatedHours(startDate, endDate, companyName);

		const aggregatedResult = [];

		for (const employee of activeEmployees) {
			const empTimesheetData = currentPeriodEmployees?.find(
				(el) => el.empId._id.toString() === employee._id.toString(),
			);
			if (empTimesheetData) {
				const result = buildEmpHourlyDetails(empTimesheetData, employee);
				aggregatedResult.push(result);
			} else {
				const result = buildEmpHourlyDetails(null, employee);
				aggregatedResult.push(result);
			}
		}
		res.status(200).json(aggregatedResult);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const buildEmpHourlyDetails = (empTimesheetData, employee) => {
	const employeeId = empTimesheetData
		? empTimesheetData.empId.employeeId
		: employee.employeeId;

	const recordId = empTimesheetData ? empTimesheetData.empId._id : employee._id;
	const fullName = empTimesheetData
		? empTimesheetData.empId.fullName
		: employee.fullName;

	const totalRegHoursWorked = empTimesheetData
		? empTimesheetData.totalRegHoursWorked
		: 0;
	const totalOvertimeHoursWorked = empTimesheetData
		? empTimesheetData.totalOvertimeHoursWorked
		: 0;
	const totalDblOvertimeHoursWorked = empTimesheetData
		? empTimesheetData.totalDblOvertimeHoursWorked
		: 0;
	const totalStatDayHoursWorked = empTimesheetData
		? empTimesheetData.totalStatDayHoursWorked
		: 0;
	const totalStatHours = empTimesheetData ? empTimesheetData.totalStatHours : 0;
	const totalSickHoursWorked = empTimesheetData
		? empTimesheetData.totalSickHoursWorked
		: 0;
	const totalVacationHoursWorked = empTimesheetData
		? empTimesheetData.totalVacationHoursWorked
		: 0;
	return {
		_id: employeeId,
		empId: { fullName, _id: recordId },
		totalRegHoursWorked,
		totalOvertimeHoursWorked,
		totalDblOvertimeHoursWorked,
		totalStatDayHoursWorked,
		totalStatHours,
		totalSickHoursWorked,
		totalVacationHoursWorked,
	};
};

const EMP_INFO = {
	path: "empId",
	model: "Employee",
	select: ["companyId", "employeeId", "fullName", "primaryAddress"],
};

const getPayDetailsReportInfo = async (req, res) => {
	const { companyName, payPeriodNum, isExtraRun } = req.params;

	try {
		const isExtraPayRun = isExtraRun === "true";
		const payStubs = await EmployeePayStub.find({
			companyName,
			payPeriodNum,
			isExtraRun: isExtraPayRun,
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

const updateAmountAllocation = async (req, res) => {
	const { id } = req.params;
	try {
		const newRecord = await updatePayStub(id, req.body);
		res.status(201).json(newRecord);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const findCurrentPayStub = async (
	payPeriodNum,
	companyName,
	empId,
	isExtra,
) => {
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

const calculateTotalAggregatedHours = async (
	startDate,
	endDate,
	companyName,
) => {
	const timesheets = await Timesheet.find({
		companyName,
		clockIn: { $gte: startDate, $lte: endDate },
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

const addPayStub = async (data) => await EmployeePayStub.create(data);

const getEmployeeId = async (empList) => {
	const list = [];
	for (const fullName of empList) {
		const employee = await Employee.findOne({ fullName });
		list.push(employee);
	}
	return list;
};

const findEmpPayStubDetail = async (empId, payPeriodPayDate, companyName) =>
	await EmployeePayStub.findOne({
		empId,
		payPeriodPayDate,
		companyName,
	})
		.populate({
			path: "empId",
			model: "Employee",
			select: "fullName",
		})
		.select(
			"commission retroactive reimbursement vacationPayout bonus terminationPayout",
		);

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
		const { payPeriodStartDate, payPeriodEndDate, isExtraRun, selectedEmp } =
			currentPayPeriod;

		const activeEmployees = isExtraRun
			? await getEmployeeId(selectedEmp)
			: await getPayrollActiveEmployees(companyName);

		const result = isExtraRun
			? null
			: await calculateTotalAggregatedHours(
					payPeriodStartDate,
					payPeriodEndDate,
					companyName,
			  );

		for (const employee of activeEmployees) {
			const empTimesheetData = result?.find(
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

const getCurrentTotals = (empTimesheetData, empPayInfoResult) => {
	const newEmpData = empTimesheetData ? empTimesheetData : {};

	newEmpData.regPay = empPayInfoResult.regPay;
	newEmpData.overTimePay = 1.5 * empPayInfoResult.regPay;
	newEmpData.dblOverTimePay = 2 * empPayInfoResult.regPay;
	newEmpData.statPay = empPayInfoResult.regPay;
	newEmpData.statWorkPay = 1.5 * empPayInfoResult.regPay;
	newEmpData.sickPay = empPayInfoResult.regPay;
	newEmpData.vacationPay = empPayInfoResult.regPay;
	newEmpData.sprayPay = 1;
	newEmpData.firstAidPay = 0.5;

	newEmpData.totalRegHoursWorked = getSumHours(
		empTimesheetData?.totalRegHoursWorked,
	);
	newEmpData.totalOvertimeHoursWorked = getSumHours(
		empTimesheetData?.totalOvertimeHoursWorked,
	);
	newEmpData.totalDblOvertimeHoursWorked = getSumHours(
		empTimesheetData?.totalDblOvertimeHoursWorked,
	);
	newEmpData.totalStatDayHoursWorked = getSumHours(
		empTimesheetData?.totalStatDayHoursWorked,
	);
	newEmpData.totalStatHours = getSumHours(empTimesheetData?.totalStatHours);
	newEmpData.totalSickHoursWorked = getSumHours(
		empTimesheetData?.totalSickHoursWorked,
	);
	newEmpData.totalVacationHoursWorked = getSumHours(
		empTimesheetData?.totalVacationHoursWorked,
	);
	newEmpData.totalSprayHoursWorked = getSumHours(
		empTimesheetData?.totalSprayHoursWorked,
	);
	newEmpData.totalFirstAidHoursWorked = getSumHours(
		empTimesheetData?.totalFirstAidHoursWorked,
	);
	newEmpData.currentRegPayTotal = getCalcAmount(
		empTimesheetData?.totalRegHoursWorked || 0,
		newEmpData.regPay,
	);
	newEmpData.currentOverTimePayTotal = getCalcAmount(
		empTimesheetData?.totalOvertimeHoursWorked || 0,
		newEmpData.overTimePay,
	);
	newEmpData.currentDblOverTimePayTotal = getCalcAmount(
		empTimesheetData?.totalDblOvertimeHoursWorked || 0,
		newEmpData.dblOverTimePay,
	);
	newEmpData.currentStatWorkPayTotal = getCalcAmount(
		empTimesheetData?.totalStatDayHoursWorked || 0,
		newEmpData.statWorkPay,
	);
	newEmpData.currentStatPayTotal = getCalcAmount(
		empTimesheetData?.totalStatHours || 0,
		newEmpData.statPay,
	);
	newEmpData.currentSickPayTotal = getCalcAmount(
		empTimesheetData?.totalSickHoursWorked || 0,
		newEmpData.sickPay,
	);
	newEmpData.currentVacationPayTotal = getCalcAmount(
		empTimesheetData?.totalVacationHoursWorked || 0,
		newEmpData.vacationPay,
	);
	newEmpData.currentSprayPayTotal = getCalcAmount(
		empTimesheetData?.totalSprayHoursWorked || 0,
		newEmpData.sprayPay,
	);
	newEmpData.currentFirstAidPayTotal = getCalcAmount(
		empTimesheetData?.totalFirstAidHoursWorked || 0,
		newEmpData.firstAidPay,
	);
	return newEmpData;
};

const calcCurrentGrossPay = (newEmpData) =>
	newEmpData.currentRegPayTotal +
	newEmpData.currentOverTimePayTotal +
	newEmpData.currentDblOverTimePayTotal +
	newEmpData.currentStatWorkPayTotal +
	newEmpData.currentStatPayTotal +
	newEmpData.currentSickPayTotal +
	newEmpData.currentVacationPayTotal +
	newEmpData.currentSprayPayTotal +
	newEmpData.currentFirstAidPayTotal +
	newEmpData.payInLieuPay +
	newEmpData.pILBenefitPay +
	newEmpData.bankedTimePay +
	newEmpData.regularByAmount +
	newEmpData.commission +
	newEmpData.retroactive +
	newEmpData.vacationPayout +
	newEmpData.bonus +
	newEmpData.terminationPayout;

const calcCurrentDeductionsTotal = (newEmpData) =>
	newEmpData.currentFDTaxDeductions +
	newEmpData.currentStateTaxDeductions +
	newEmpData.currentCPPDeductions +
	newEmpData.currentEIDeductions +
	newEmpData.currentUnionDuesDeductions +
	newEmpData.currentEmployeeHealthContributions +
	newEmpData.currentPrimaryDeposit +
	newEmpData.currentEmployeePensionContributions +
	newEmpData.currentOtherDeductions;

const calcEmployeeContribution = (grossPay, newEmpData) =>
	grossPay -
	(newEmpData.retroactive +
		newEmpData.currentOverTimePayTotal +
		newEmpData.currentDblOverTimePayTotal);

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
		isExtraRun,
	} = currentPayPeriod;

	const empPayStubResult = await findEmployeePayStub(empId, payPeriod);

	const empPayInfoResult = await findEmployeePayInfo(empId);

	const newEmpData = getCurrentTotals(empTimesheetData, empPayInfoResult);

	newEmpData.payInLieuPay = empPayStubResult?.payInLieuPay ?? 0;
	newEmpData.pILBenefitPay = empPayStubResult?.pILBenefitPay ?? 0;
	newEmpData.bankedTimePay = empPayStubResult?.bankedTimePay ?? 0;
	newEmpData.regularByAmount = empPayStubResult?.regularByAmount ?? 0;
	newEmpData.commission = empPayStubResult?.commission ?? 0;
	newEmpData.retroactive = empPayStubResult?.retroactive ?? 0;
	newEmpData.vacationPayout = empPayStubResult?.vacationPayout ?? 0;
	newEmpData.terminationPayout = empPayStubResult?.terminationPayout ?? 0;
	newEmpData.bonus = empPayStubResult?.bonus ?? 0;
	newEmpData.currentVacationBalanceFwd = 0;

	newEmpData.currentGrossPay = calcCurrentGrossPay(newEmpData);

	const {
		currentUnionDuesDeductions,
		grossSalaryByPayPeriod,
		CPPContribution,
		totalProvincialTaxDeduction,
		federalTaxDeductionByPayPeriod,
		EIContribution,
	} = getTaxDetails(newEmpData.currentGrossPay);

	const employeeContribution = calcEmployeeContribution(
		newEmpData.currentGrossPay,
		newEmpData,
	);

	const pensionContribution = 0.4 * employeeContribution;
	const employerContribution =
		pensionContribution + 2.05 * newEmpData.totalRegHoursWorked;

	newEmpData.currentFDTaxDeductions = federalTaxDeductionByPayPeriod;
	newEmpData.currentStateTaxDeductions = totalProvincialTaxDeduction;
	newEmpData.currentCPPDeductions = CPPContribution;
	newEmpData.currentEIDeductions = EIContribution;
	newEmpData.currentUnionDuesDeductions = currentUnionDuesDeductions;
	newEmpData.currentEmployeeHealthContributions =
		0.42 * newEmpData.totalRegHoursWorked;
	newEmpData.currentPrimaryDeposit = 0;
	newEmpData.currentEmployeePensionContributions = pensionContribution;
	newEmpData.currentOtherDeductions = 0;

	newEmpData.currentEmployerPensionContributions = pensionContribution;
	newEmpData.currentEmployerHealthContributions =
		2.05 * newEmpData.totalRegHoursWorked;

	newEmpData.currentEmployerContributions = employerContribution;

	newEmpData.currentVacationAccrued = 0;
	newEmpData.currentVacationUsed = newEmpData.currentVacationPayTotal;
	newEmpData.vacationBalance =
		newEmpData.currentVacationBalanceFwd +
		newEmpData.currentVacationAccrued +
		newEmpData.currentVacationUsed;
	newEmpData.currentSickAccrued = 0;
	newEmpData.currentSickUsed = 0;
	newEmpData.sickBalance = 0;

	newEmpData.currentDeductionsTotal = calcCurrentDeductionsTotal(newEmpData);

	newEmpData.currentNetPay =
		grossSalaryByPayPeriod - newEmpData.currentDeductionsTotal;

	const prevPayPeriodNum = isExtraRun ? payPeriod : payPeriod - 1;

	const prevPayPayInfo = await findCurrentPayStub(
		prevPayPeriodNum,
		companyName,
		empId,
		false,
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
		newEmpData,
		prevPayPayInfo,
	);
	const currentPayInfo = await findCurrentPayStub(
		payPeriod,
		companyName,
		empId,
		isExtraRun ? isExtraRun : false,
	);
	if (currentPayInfo) {
		await updatePayStub(currentPayInfo._id, currentPayStub);
	} else {
		await addPayStub(currentPayStub);
	}
};

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
		terminationPayout,

		totalRegHoursWorked,
		totalOvertimeHoursWorked,
		totalDblOvertimeHoursWorked,
		totalStatDayHoursWorked,
		totalStatHours,
		totalSickHoursWorked,
		totalVacationHoursWorked,
		totalSprayHoursWorked,
		totalFirstAidHoursWorked,
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
		currentCPPDeductions,
		currentUnionDuesDeductions,
		currentEIDeductions,
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

		totalRegHoursWorked,
		totalOvertimeHoursWorked,
		totalDblOvertimeHoursWorked,
		totalStatDayHoursWorked,
		totalStatHours,
		totalSickHoursWorked,
		totalVacationHoursWorked,
		totalSprayHoursWorked,
		totalFirstAidHoursWorked,

		YTDRegHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDRegHoursWorked,
			totalRegHoursWorked,
		),
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
		YTDStatHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDStatHoursWorked,
			totalStatHours,
		),
		YTDSickHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDSickHoursWorked,
			totalSickHoursWorked,
		),
		YTDVacationHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDVacationHoursWorked,
			totalVacationHoursWorked,
		),
		YTDSprayHoursWorked: getSumTotal(
			prevPayPayInfo?.YTDSprayHoursWorked,
			totalSprayHoursWorked,
		),
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
		currentCPPDeductions,
		currentUnionDuesDeductions,
		currentEIDeductions,
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

		YTDRegPayTotal: getSumTotal(
			prevPayPayInfo?.YTDRegPayTotal,
			currentRegPayTotal,
		),
		YTDOverTimePayTotal: getSumTotal(
			prevPayPayInfo?.YTDOverTimePayTotal,
			currentOverTimePayTotal,
		),
		YTDDblOverTimePayTotal: getSumTotal(
			prevPayPayInfo?.YTDDblOverTimePayTotal,
			currentDblOverTimePayTotal,
		),
		YTDStatWorkPayTotal: getSumTotal(
			prevPayPayInfo?.YTDStatWorkPayTotal,
			currentStatWorkPayTotal,
		),
		YTDStatPayTotal: getSumTotal(
			prevPayPayInfo?.YTDStatPayTotal,
			currentStatPayTotal,
		),
		YTDSickPayTotal: getSumTotal(
			prevPayPayInfo?.YTDSickPayTotal,
			currentSickPayTotal,
		),
		YTDVacationPayTotal: getSumTotal(
			prevPayPayInfo?.YTDVacationPayTotal,
			currentVacationPayTotal,
		),
		YTDSprayPayTotal: getSumTotal(
			prevPayPayInfo?.YTDSprayPayTotal,
			currentSprayPayTotal,
		),
		YTDFirstAidPayTotal: getSumTotal(
			prevPayPayInfo?.YTDFirstAidPayTotal,
			currentFirstAidPayTotal,
		),
		YTDPayInLieuPay: getSumTotal(prevPayPayInfo?.YTDPayInLieuPay, payInLieuPay),
		YTDBenefitPay: getSumTotal(prevPayPayInfo?.YTDBenefitPay, pILBenefitPay),
		YTDBankedTimePay: getSumTotal(
			prevPayPayInfo?.YTDBankedTimePay,
			bankedTimePay,
		),
		YTDRegularByAmount: getSumTotal(
			prevPayPayInfo?.YTDRegularByAmount,
			regularByAmount,
		),
		YTDCommission: getSumTotal(prevPayPayInfo?.YTDCommission, commission),
		YTDRetroactive: getSumTotal(prevPayPayInfo?.YTDRetroactive, retroactive),
		YTDVacationPayout: getSumTotal(
			prevPayPayInfo?.YTDVacationPayout,
			vacationPayout,
		),
		YTDBonus: getSumTotal(prevPayPayInfo?.YTDBonus, bonus),
		YTDTerminationPayout: getSumTotal(
			prevPayPayInfo?.YTDTerminationPayout,
			terminationPayout,
		),
		YTD_FDTaxDeductions: getSumTotal(
			prevPayPayInfo?.YTD_FDTaxDeductions,
			currentFDTaxDeductions,
		),
		YTDStateTaxDeductions: getSumTotal(
			prevPayPayInfo?.YTDStateTaxDeductions,
			currentStateTaxDeductions,
		),
		YTD_EIDeductions: getSumTotal(
			prevPayPayInfo?.YTD_EIDeductions,
			currentEIDeductions,
		),
		YTD_CPPDeductions: getSumTotal(
			prevPayPayInfo?.YTD_CPPDeductions,
			currentCPPDeductions,
		),
		YTDUnionDuesDeductions: getSumTotal(
			prevPayPayInfo?.YTDUnionDuesDeductions,
			currentUnionDuesDeductions,
		),
		YTDEmployeeHealthContributions: getSumTotal(
			prevPayPayInfo?.YTDEmployeeHealthContributions,
			currentEmployeeHealthContributions,
		),
		YTDPrimaryDeposit: getSumTotal(
			prevPayPayInfo?.YTDPrimaryDeposit,
			currentPrimaryDeposit,
		),
		YTDEmployeePensionContributions: getSumTotal(
			prevPayPayInfo?.YTDEmployeePensionContributions,
			currentEmployeePensionContributions,
		),
		YTDOtherDeductions: getSumTotal(
			prevPayPayInfo?.YTDOtherDeductions,
			currentOtherDeductions,
		),

		YTDGrossPay: getSumTotal(prevPayPayInfo?.YTDGrossPay, currentGrossPay),

		YTDDeductionsTotal: getSumTotal(
			prevPayPayInfo?.YTDDeductionsTotal,
			currentDeductionsTotal,
		),

		YTDNetPay: getSumTotal(prevPayPayInfo?.YTDNetPay, currentNetPay),

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
		YTDVacationAccrued: getSumTotal(
			prevPayPayInfo?.YTDVacationAccrued,
			currentVacationAccrued,
		),
		YTDVacationUsed: getSumTotal(
			prevPayPayInfo?.YTDVacationUsed,
			currentVacationUsed,
		),
		YTDVacationBalanceFwd: currentVacationBalanceFwd,
		YTDVacationBalance: getSumTotal(
			prevPayPayInfo?.YTDVacationBalance,
			vacationBalance,
		),
		YTDSickAccrued: getSumTotal(
			prevPayPayInfo?.YTDSickAccrued,
			currentSickAccrued,
		),
		YTDSickUsed: getSumTotal(prevPayPayInfo?.YTDSickUsed, currentSickUsed),
		YTDSickBalance: getSumTotal(prevPayPayInfo?.YTDSickBalance, sickBalance),
	};
	return newPayStub;
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
	updateAmountAllocation,
	getEmployeeId,
	addPayStub,
	findEmpPayStubDetail,
	getEmployeePayDetailsReportInfo,
};
