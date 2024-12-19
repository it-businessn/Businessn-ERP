// const Employee = require("../models/Employee");
const Employee = require("../models/Employee");
const EmployeeAlertsViolationInfo = require("../models/EmployeeAlertsViolationInfo");
const EmployeeBalanceInfo = require("../models/EmployeeBalanceInfo");
const EmployeeBankingInfo = require("../models/EmployeeBankingInfo");
const EmployeeGovernmentInfo = require("../models/EmployeeGovernmentInfo");
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
const {
	findAdditionalHoursAllocatedInfo,
	findAdditionalAmountAllocatedInfo,
} = require("./additionalAllocationInfoController");

const { findGroupEmployees } = require("./setUpController");
const { generateT4Slip } = require("./t4SlipController");
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
		}).select("scheduleSettings name");
		res.status(200).json(groups);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getGroupedTimesheet = async (req, res) => {
	const { companyName, startDate, endDate, payDate, isExtraRun, groupId } = req.params;

	try {
		const isExtraPayRun = isExtraRun === "true";

		const activeEmployees = await fetchActiveEmployees(
			isExtraPayRun,
			groupId,
			payDate,
			companyName,
		);

		const currentPeriodEmployees = isExtraPayRun
			? null
			: await calculateTotalAggregatedHours(startDate, endDate, companyName);

		const aggregatedResult = [];

		for (const employee of activeEmployees) {
			const empTimesheetData = currentPeriodEmployees?.find(
				(el) => el.empId._id.toString() === employee._id.toString(),
			);
			const result = await buildEmpHourlyDetails(empTimesheetData ?? null, employee, companyName);
			const additionalHoursAllocatedInfo = await findAdditionalHoursAllocatedInfo({
				empId: employee._id,
				companyName,
				payPeriodPayDate: payDate,
			});

			result.additionalRegHoursWorked = additionalHoursAllocatedInfo?.additionalRegHoursWorked ?? 0;
			result.additionalOvertimeHoursWorked =
				additionalHoursAllocatedInfo?.additionalOvertimeHoursWorked || 0;
			result.additionalDblOvertimeHoursWorked =
				additionalHoursAllocatedInfo?.additionalDblOvertimeHoursWorked || 0;
			result.additionalStatHoursWorked =
				additionalHoursAllocatedInfo?.additionalStatHoursWorked || 0;
			result.additionalStatDayHoursWorked =
				additionalHoursAllocatedInfo?.additionalStatDayHoursWorked || 0;
			result.additionalSickHoursWorked =
				additionalHoursAllocatedInfo?.additionalSickHoursWorked || 0;
			result.additionalVacationHoursWorked =
				additionalHoursAllocatedInfo?.additionalVacationHoursWorked || 0;

			const {
				totalDblOvertimeHoursWorked,
				totalOvertimeHoursWorked,
				totalRegHoursWorked,
				totalSickHoursWorked,
				totalStatDayHoursWorked,
				totalStatHours,
				totalVacationHoursWorked,
				additionalRegHoursWorked,
				additionalOvertimeHoursWorked,
				additionalDblOvertimeHoursWorked,
				additionalStatHoursWorked,
				additionalStatDayHoursWorked,
				additionalSickHoursWorked,
				additionalVacationHoursWorked,
			} = result;

			result.totalHoursWorked =
				totalDblOvertimeHoursWorked +
				totalOvertimeHoursWorked +
				totalRegHoursWorked +
				totalSickHoursWorked +
				totalStatDayHoursWorked +
				totalStatHours +
				totalVacationHoursWorked +
				additionalRegHoursWorked +
				additionalOvertimeHoursWorked +
				additionalDblOvertimeHoursWorked +
				additionalStatHoursWorked +
				additionalStatDayHoursWorked +
				additionalSickHoursWorked +
				additionalVacationHoursWorked;
			aggregatedResult.push(result);
		}
		res.status(200).json(aggregatedResult);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const fetchActiveEmployees = async (isExtraPayRun, groupId, payDate, companyName) => {
	const employees = isExtraPayRun && (await findGroupEmployees(groupId, payDate));

	return isExtraPayRun
		? await getEmployeeId(employees)
		: await getPayrollActiveEmployees(companyName);
};

const basicInfo = async (currentPeriodEmployees, empId, payPeriodPayDate, companyName) => {
	const empAdditionalHoursAllocated = await findAdditionalHoursAllocatedInfo({
		empId,
		payPeriodPayDate,
	});

	const empPayInfoResult = await findEmployeePayInfo(empId, companyName);
	const empTimesheetData = currentPeriodEmployees?.find(
		(el) => el.empId._id.toString() === empId.toString(),
	);
	return { empAdditionalHoursAllocated, empPayInfoResult, empTimesheetData };
};

const getEEContribution = async (req, res) => {
	const { companyName, startDate, endDate, payDate, isExtraRun, groupId } = req.params;

	try {
		const isExtraPayRun = isExtraRun === "true";

		const activeEmployees = await fetchActiveEmployees(
			isExtraPayRun,
			groupId,
			payDate,
			companyName,
		);

		const currentPeriodEmployees = isExtraPayRun
			? null
			: await calculateTotalAggregatedHours(startDate, endDate, companyName);

		const aggregatedResult = [];

		for (const employee of activeEmployees) {
			const { empTimesheetData, empPayInfoResult, empAdditionalHoursAllocated } = await basicInfo(
				currentPeriodEmployees,
				employee._id,
				payDate,
				companyName,
			);
			const empBenefitInfoResult = await findEmployeeBenefitInfo(employee._id, companyName);

			const result = buildEmpEEDetails(
				empTimesheetData ?? null,
				empPayInfoResult,
				empAdditionalHoursAllocated,
				employee,
				empBenefitInfoResult,
			);
			aggregatedResult.push(result);
		}
		res.status(200).json(aggregatedResult);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getERContribution = async (req, res) => {
	const { companyName, startDate, endDate, payDate, isExtraRun, groupId } = req.params;

	try {
		const isExtraPayRun = isExtraRun === "true";
		const activeEmployees = await fetchActiveEmployees(
			isExtraPayRun,
			groupId,
			payDate,
			companyName,
		);
		const currentPeriodEmployees = isExtraPayRun
			? null
			: await calculateTotalAggregatedHours(startDate, endDate, companyName);

		const aggregatedResult = [];

		for (const employee of activeEmployees) {
			const { empTimesheetData, empPayInfoResult, empAdditionalHoursAllocated } = await basicInfo(
				currentPeriodEmployees,
				employee._id,
				payDate,
				companyName,
			);
			const empBenefitInfoResult = await findEmployeeBenefitInfo(employee._id, companyName);

			const result = buildEmpERDetails(
				empTimesheetData ?? null,
				empPayInfoResult,
				empAdditionalHoursAllocated,
				employee,
				empBenefitInfoResult,
			);
			aggregatedResult.push(result);
		}
		res.status(200).json(aggregatedResult);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const buildEmpEEDetails = (
	empTimesheetData,
	empPayInfoResult,
	empAdditionalHoursAllocated,
	employee,
	empBenefitInfoResult,
) => {
	const data = ERData(empTimesheetData, empPayInfoResult, empAdditionalHoursAllocated);

	data.vacationPayPercent = parseFloat(empBenefitInfoResult?.vacationPayPercent) || 0;
	data.typeOfUnionDuesTreatment = empBenefitInfoResult?.typeOfUnionDuesTreatment;
	data.unionDuesContribution = parseFloat(empBenefitInfoResult?.unionDuesContribution) || 0;
	data.typeOfPensionEETreatment = empBenefitInfoResult?.typeOfPensionEETreatment;
	data.pensionEEContribution = parseFloat(empBenefitInfoResult?.pensionEEContribution) || 0;
	data.typeOfExtendedHealthEETreatment = empBenefitInfoResult?.typeOfExtendedHealthEETreatment;
	data.extendedHealthEEContribution =
		parseFloat(empBenefitInfoResult?.extendedHealthEEContribution) || 0;
	data.typeOfPensionERTreatment = empBenefitInfoResult?.typeOfPensionERTreatment;
	data.pensionERContribution = parseFloat(empBenefitInfoResult?.pensionERContribution) || 0;
	data.typeOfExtendedHealthERTreatment = empBenefitInfoResult?.typeOfExtendedHealthERTreatment;
	data.extendedHealthERContribution =
		parseFloat(empBenefitInfoResult?.extendedHealthERContribution) || 0;

	const { unionDues, EE_EPP, EE_EHP } = getContributionsDeductions(data);
	const { _id, fullName } = employee;
	return {
		_id,
		empId: { fullName, _id },
		unionDues,
		// CPP: CPPContribution,
		// EI: EIContribution,
		EPP: EE_EPP,
		EHP: EE_EHP,
	};
};

const ERData = (empTimesheetData, empPayInfoResult, empAdditionalHoursAllocated) => {
	const newEmpData = getCurrentTotals(
		empTimesheetData,
		empPayInfoResult,
		empAdditionalHoursAllocated,
	);

	const {
		totalRegHoursWorked,
		totalOvertimeHoursWorked,
		totalDblOvertimeHoursWorked,
		totalStatDayHoursWorked,
		totalStatHours,
		totalSickHoursWorked,
		totalVacationHoursWorked,
		regPay,
		overTimePay,
		dblOverTimePay,
		sickPay,
		statPay,
		statWorkPay,
		vacationPay,
	} = newEmpData;

	const data = {
		regPay,
		overTimePay,
		dblOverTimePay,
		statPay,
		statWorkPay,
		sickPay,
		vacationPay,
		totalRegHoursWorked,
		totalOvertimeHoursWorked,
		totalDblOvertimeHoursWorked,
		totalStatDayHoursWorked,
		totalStatHours,
		totalSickHoursWorked,
		totalVacationHoursWorked,
	};
	return data;
};

const buildEmpERDetails = (
	empTimesheetData,
	empPayInfoResult,
	empAdditionalHoursAllocated,
	employee,
	empBenefitInfoResult,
) => {
	const data = ERData(empTimesheetData, empPayInfoResult, empAdditionalHoursAllocated);
	data.vacationPayPercent = parseFloat(empBenefitInfoResult?.vacationPayPercent) || 0;
	data.typeOfUnionDuesTreatment = empBenefitInfoResult?.typeOfUnionDuesTreatment;
	data.unionDuesContribution = parseFloat(empBenefitInfoResult?.unionDuesContribution) || 0;
	data.typeOfPensionEETreatment = empBenefitInfoResult?.typeOfPensionEETreatment;
	data.pensionEEContribution = parseFloat(empBenefitInfoResult?.pensionEEContribution) || 0;
	data.typeOfExtendedHealthEETreatment = empBenefitInfoResult?.typeOfExtendedHealthEETreatment;
	data.extendedHealthEEContribution =
		parseFloat(empBenefitInfoResult?.extendedHealthEEContribution) || 0;
	data.typeOfPensionERTreatment = empBenefitInfoResult?.typeOfPensionERTreatment;
	data.pensionERContribution = parseFloat(empBenefitInfoResult?.pensionERContribution) || 0;
	data.typeOfExtendedHealthERTreatment = empBenefitInfoResult?.typeOfExtendedHealthERTreatment;
	data.extendedHealthERContribution =
		parseFloat(empBenefitInfoResult?.extendedHealthERContribution) || 0;

	const { ER_EPP, ER_EHP } = getContributionsDeductions(data);
	const { _id, fullName } = employee;

	return {
		_id,
		empId: { fullName, _id },
		EPP: ER_EPP,
		EHP: ER_EHP,
	};
};

const getGroupedData = async (empTimesheetData, employee, companyName) => {
	const empPayInfoResult = await EmployeePayInfo.findOne({
		empId: employee._id,
		companyName,
	}).select("empId typeOfEarning fullTimeStandardHours partTimeStandardHours");

	const isFT = empPayInfoResult?.typeOfEarning === "Full Time Salaried";
	const isPT = empPayInfoResult?.typeOfEarning === "Part Time Salaried";

	const employeeId = empTimesheetData ? empTimesheetData.empId.employeeId : employee.employeeId;

	const recordId = empTimesheetData ? empTimesheetData.empId._id : employee._id;
	const fullName = empTimesheetData ? empTimesheetData.empId.fullName : employee.fullName;

	const totalRegHoursWorked = isFT
		? empPayInfoResult?.fullTimeStandardHours
		: isPT
		? empPayInfoResult?.partTimeStandardHours
		: empTimesheetData
		? empTimesheetData.totalRegHoursWorked
		: 0;
	const totalOvertimeHoursWorked = empTimesheetData ? empTimesheetData.totalOvertimeHoursWorked : 0;
	const totalDblOvertimeHoursWorked = empTimesheetData
		? empTimesheetData.totalDblOvertimeHoursWorked
		: 0;
	const totalStatDayHoursWorked = empTimesheetData ? empTimesheetData.totalStatDayHoursWorked : 0;
	const totalStatHours = empTimesheetData ? empTimesheetData.totalStatHours : 0;
	const totalSickHoursWorked = empTimesheetData ? empTimesheetData.totalSickHoursWorked : 0;
	const totalVacationHoursWorked = empTimesheetData ? empTimesheetData.totalVacationHoursWorked : 0;
	return {
		employeeId,
		recordId,
		fullName,
		totalRegHoursWorked: parseFloat(totalRegHoursWorked || 0),
		totalOvertimeHoursWorked: parseFloat(totalOvertimeHoursWorked || 0),
		totalDblOvertimeHoursWorked: parseFloat(totalDblOvertimeHoursWorked || 0),
		totalStatDayHoursWorked: parseFloat(totalStatDayHoursWorked || 0),
		totalStatHours: parseFloat(totalStatHours || 0),
		totalSickHoursWorked: parseFloat(totalSickHoursWorked || 0),
		totalVacationHoursWorked: parseFloat(totalVacationHoursWorked || 0),
	};
};

const buildEmpHourlyDetails = async (empTimesheetData, employee, companyName) => {
	const {
		employeeId,
		recordId,
		fullName,
		totalRegHoursWorked,
		totalOvertimeHoursWorked,
		totalDblOvertimeHoursWorked,
		totalStatDayHoursWorked,
		totalStatHours,
		totalSickHoursWorked,
		totalVacationHoursWorked,
	} = await getGroupedData(empTimesheetData, employee, companyName);
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
	select: ["companyId", "employeeId", "fullName", "primaryAddress", "employeeNo"],
};

const getPayDetailsReportInfo = async (req, res) => {
	const { companyName, payPeriodNum, isExtraRun } = req.params;

	try {
		const isExtraPayRun = isExtraRun === "true";
		const payStubs = await EmployeePayStub.find({
			companyName,
			payPeriodNum,
			isExtraRun: isExtraPayRun,
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

const getTotalAlertsAndViolationsInfo = async (req, res) => {
	const { companyName, payPeriodNum } = req.params;

	try {
		const payStubs = await EmployeeAlertsViolationInfo.countDocuments({
			companyName,
			payPeriodNum,
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

const findCurrentPayStub = async (payPeriodNum, companyName, empId, isExtra) => {
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

const calculateTotalAggregatedHours = async (startDate, endDate, companyName) => {
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

		acc[timesheet.employeeId].totalRegHoursWorked += timesheet.regHoursWorked || 0;
		acc[timesheet.employeeId].totalOvertimeHoursWorked += timesheet.overtimeHoursWorked || 0;
		acc[timesheet.employeeId].totalDblOvertimeHoursWorked += timesheet.dblOvertimeHoursWorked || 0;
		acc[timesheet.employeeId].totalStatHours += timesheet.statDayHours || 0;
		acc[timesheet.employeeId].totalStatDayHoursWorked += timesheet.statDayHoursWorked || 0;
		acc[timesheet.employeeId].totalSickHoursWorked += timesheet.sickPayHours || 0;
		acc[timesheet.employeeId].totalVacationHoursWorked += timesheet.vacationPayHours || 0;
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
		.select("commission retroactive reimbursement vacationPayout bonus terminationPayout");

const findEmployeePayStub = async (empId, payPeriodNum) =>
	await EmployeePayStub.findOne({
		empId,
		payPeriodNum,
	}).select("empId commission retroactive vacationPayout bonus terminationPayout");

const findEmployeePayInfo = async (empId, companyName) =>
	await EmployeePayInfo.findOne({
		empId,
		companyName,
	}).select("empId regPay overTimePay dblOverTimePay statWorkPay statPay sickPay vacationPay");

const findEmployeeBenefitInfo = async (empId, companyName) =>
	await EmployeeBalanceInfo.findOne({
		empId,
		companyName,
	});

const findEmployeeGovernmentInfo = async (empId, companyName) =>
	await EmployeeGovernmentInfo.findOne({
		empId,
		companyName,
	}).select("empId federalTaxCredit regionalTaxCredit");

const addEmployeePayStubInfo = async (req, res) => {
	const { companyName, currentPayPeriod } = req.body;
	try {
		const { payPeriodStartDate, payPeriodEndDate, isExtraRun, selectedEmp, payPeriod } =
			currentPayPeriod;

		const activeEmployees = isExtraRun
			? await getEmployeeId(selectedEmp)
			: await getPayrollActiveEmployees(companyName);

		const result = isExtraRun
			? null
			: await calculateTotalAggregatedHours(payPeriodStartDate, payPeriodEndDate, companyName);

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
		}
		generateT4Slip(companyName, payPeriod);
		//if payroll processed successful
		//alerts violation generate independently based on emp data, on process payroll will run again to check alerts or violations.
		res.status(200).json({ message: "Paystub created successfully" });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const getCurrentTotals = (empTimesheetData, empPayInfoResult, empAdditionalHoursAllocated) => {
	const newEmpData = empTimesheetData ? empTimesheetData : {};

	newEmpData.regPay = empPayInfoResult?.regPay;
	newEmpData.overTimePay = 1.5 * empPayInfoResult?.regPay;
	newEmpData.dblOverTimePay = 2 * empPayInfoResult?.regPay;
	newEmpData.statPay = empPayInfoResult?.regPay;
	newEmpData.statWorkPay = 1.5 * empPayInfoResult?.regPay;
	newEmpData.sickPay = empPayInfoResult?.regPay;
	newEmpData.vacationPay = empPayInfoResult?.regPay;
	newEmpData.sprayPay = 1;
	newEmpData.firstAidPay = 0.5;

	newEmpData.totalRegHoursWorked =
		getSumHours(empTimesheetData?.totalRegHoursWorked) +
		getSumHours(empAdditionalHoursAllocated?.additionalRegHoursWorked);
	newEmpData.totalOvertimeHoursWorked =
		getSumHours(empTimesheetData?.totalOvertimeHoursWorked) +
		getSumHours(empAdditionalHoursAllocated?.additionalOvertimeHoursWorked);
	newEmpData.totalDblOvertimeHoursWorked =
		getSumHours(empTimesheetData?.totalDblOvertimeHoursWorked) +
		getSumHours(empAdditionalHoursAllocated?.additionalDblOvertimeHoursWorked);
	newEmpData.totalStatHours =
		getSumHours(empTimesheetData?.totalStatHours) +
		getSumHours(empAdditionalHoursAllocated?.additionalStatHoursWorked);
	newEmpData.totalStatDayHoursWorked =
		getSumHours(empTimesheetData?.totalStatDayHoursWorked) +
		getSumHours(empAdditionalHoursAllocated?.additionalStatDayHoursWorked);
	newEmpData.totalSickHoursWorked =
		getSumHours(empTimesheetData?.totalSickHoursWorked) +
		getSumHours(empAdditionalHoursAllocated?.additionalSickHoursWorked);
	newEmpData.totalVacationHoursWorked =
		getSumHours(empTimesheetData?.totalVacationHoursWorked) +
		getSumHours(empAdditionalHoursAllocated?.additionalVacationHoursWorked);

	newEmpData.totalHoursWorked =
		newEmpData.totalRegHoursWorked +
		newEmpData.totalOvertimeHoursWorked +
		newEmpData.totalDblOvertimeHoursWorked +
		newEmpData.totalStatHours +
		newEmpData.totalStatDayHoursWorked +
		newEmpData.totalSickHoursWorked +
		newEmpData.totalVacationHoursWorked;

	newEmpData.totalSprayHoursWorked = getSumHours(empTimesheetData?.totalSprayHoursWorked);
	newEmpData.totalFirstAidHoursWorked = getSumHours(empTimesheetData?.totalFirstAidHoursWorked);
	newEmpData.currentRegPayTotal = getCalcAmount(
		newEmpData?.totalRegHoursWorked || 0,
		newEmpData.regPay,
	);
	newEmpData.currentOverTimePayTotal = getCalcAmount(
		newEmpData?.totalOvertimeHoursWorked || 0,
		newEmpData.overTimePay,
	);
	newEmpData.currentDblOverTimePayTotal = getCalcAmount(
		newEmpData?.totalDblOvertimeHoursWorked || 0,
		newEmpData.dblOverTimePay,
	);
	newEmpData.currentStatWorkPayTotal = getCalcAmount(
		newEmpData?.totalStatDayHoursWorked || 0,
		newEmpData.statWorkPay,
	);
	newEmpData.currentStatPayTotal = getCalcAmount(
		newEmpData?.totalStatHours || 0,
		newEmpData.statPay,
	);
	newEmpData.currentSickPayTotal = getCalcAmount(
		newEmpData?.totalSickHoursWorked || 0,
		newEmpData.sickPay,
	);
	newEmpData.currentVacationPayTotal = getCalcAmount(
		newEmpData?.totalVacationHoursWorked || 0,
		newEmpData.vacationPay,
	);
	newEmpData.currentSprayPayTotal = getCalcAmount(
		newEmpData?.totalSprayHoursWorked || 0,
		newEmpData.sprayPay,
	);
	newEmpData.currentFirstAidPayTotal = getCalcAmount(
		newEmpData?.totalFirstAidHoursWorked || 0,
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

const calcCurrentDeductionsTotal = (newEmpData) => {
	const sum =
		newEmpData.currentFDTaxDeductions +
		newEmpData.currentStateTaxDeductions +
		newEmpData.currentCPPDeductions +
		newEmpData.currentEmployeeEIDeductions +
		newEmpData.currentUnionDuesDeductions +
		newEmpData.currentEmployeeHealthContributions +
		newEmpData.currentPrimaryDeposit +
		newEmpData.currentEmployeePensionContributions +
		newEmpData.currentOtherDeductions;
	// if (!newEmpData.currentGrossPay) {
	// 	console.log(
	// 		newEmpData.currentGrossPay,
	// 		newEmpData.currentFDTaxDeductions,
	// 		newEmpData.currentStateTaxDeductions,
	// 		newEmpData.currentCPPDeductions,
	// 		newEmpData.currentEmployeeEIDeductions,
	// 		newEmpData.currentUnionDuesDeductions,
	// 		newEmpData.currentEmployeeHealthContributions,
	// 		newEmpData.currentPrimaryDeposit,
	// 		newEmpData.currentEmployeePensionContributions,
	// 		newEmpData.currentOtherDeductions,
	// 		sum,
	// 	);
	// }
	return sum;
};

const calcEmployeeContribution = (grossPay, newEmpData) =>
	grossPay -
	(newEmpData.retroactive +
		newEmpData.currentOverTimePayTotal +
		newEmpData.currentDblOverTimePayTotal);

const validateContribution = (
	treatmentType,
	contributionAmt,
	accumulatedHrs,
	totalAllocatedHours,
) => {
	const newAmount = treatmentType?.includes("No")
		? 0
		: treatmentType?.includes("%")
		? accumulatedHrs * contributionAmt
		: treatmentType?.includes("per Hour")
		? contributionAmt * totalAllocatedHours
		: contributionAmt;
	return newAmount;
};

const getContributionsDeductions = (data) => {
	const {
		regPay,
		overTimePay,
		dblOverTimePay,
		statPay,
		statWorkPay,
		sickPay,
		totalRegHoursWorked,
		totalOvertimeHoursWorked,
		totalDblOvertimeHoursWorked,
		totalStatDayHoursWorked,
		totalStatHours,
		totalSickHoursWorked,
		vacationPayPercent,
		typeOfUnionDuesTreatment,
		unionDuesContribution,
		typeOfPensionEETreatment,
		pensionEEContribution,
		typeOfExtendedHealthEETreatment,
		extendedHealthEEContribution,
		typeOfPensionERTreatment,
		pensionERContribution,
		typeOfExtendedHealthERTreatment,
		extendedHealthERContribution,
	} = data;

	const totalAllocatedHours =
		// data.totalDblOvertimeHoursWorked +
		data.totalOvertimeHoursWorked +
		data.totalRegHoursWorked +
		data.totalSickHoursWorked +
		data.totalStatDayHoursWorked +
		data.totalStatHours;

	const sumTotalHoursWithoutVacation =
		totalSickHoursWorked + totalStatHours + totalStatDayHoursWorked + totalRegHoursWorked;

	const sumTotalOvertimeHours = totalOvertimeHoursWorked + totalDblOvertimeHoursWorked;

	const sumTotalWithoutVacation =
		getCalcAmount(totalSickHoursWorked, sickPay) +
		getCalcAmount(totalStatHours, statPay) +
		getCalcAmount(totalStatDayHoursWorked, statWorkPay) +
		getCalcAmount(totalRegHoursWorked, regPay);

	const sumTotalOvertime =
		getCalcAmount(totalOvertimeHoursWorked, overTimePay) +
		getCalcAmount(totalDblOvertimeHoursWorked, dblOverTimePay);

	// const sumTotalWithVacation =
	// 	getCalcAmount(totalSickHoursWorked, sickPay) +
	// 	getCalcAmount(totalStatHours, statPay) +
	// 	getCalcAmount(totalStatDayHoursWorked, statWorkPay) +
	// 	getCalcAmount(totalRegHoursWorked, regPay) +
	// 	getCalcAmount(totalVacationHoursWorked, vacationPay);

	const vacationAccruedAmount = (sumTotalWithoutVacation + sumTotalOvertime) * vacationPayPercent;

	const unionDues = validateContribution(
		typeOfUnionDuesTreatment,
		unionDuesContribution,
		sumTotalWithoutVacation + sumTotalOvertime + vacationAccruedAmount,
		totalAllocatedHours,
	);

	const EE_EPP = validateContribution(
		typeOfPensionEETreatment,
		pensionEEContribution,
		sumTotalWithoutVacation + vacationAccruedAmount,
		data.totalRegHoursWorked +
			data.totalSickHoursWorked +
			data.totalStatDayHoursWorked +
			data.totalStatHours,
	);

	const EE_EHP = validateContribution(
		typeOfExtendedHealthEETreatment,
		extendedHealthEEContribution,
		sumTotalHoursWithoutVacation,
		data.totalRegHoursWorked +
			data.totalSickHoursWorked +
			data.totalStatDayHoursWorked +
			data.totalStatHours,
	);

	const ER_EPP = validateContribution(
		typeOfPensionERTreatment,
		pensionERContribution,
		sumTotalWithoutVacation + vacationAccruedAmount,
		data.totalRegHoursWorked +
			data.totalSickHoursWorked +
			data.totalStatDayHoursWorked +
			data.totalStatHours,
	);

	const ER_EHP = validateContribution(
		typeOfExtendedHealthERTreatment,
		extendedHealthERContribution,
		sumTotalHoursWithoutVacation,
		totalAllocatedHours,
	);

	return {
		unionDues,
		EE_EPP,
		EE_EHP,
		ER_EPP,
		ER_EHP,
	};
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

	const empPayStubResult = await findEmployeePayStub(empId, payPeriod);

	const empAdditionalHoursAllocated = await findAdditionalHoursAllocatedInfo({
		empId,
		payPeriodPayDate,
	});

	const empAdditionalAmountAllocated = await findAdditionalAmountAllocatedInfo({
		empId,
		payPeriodPayDate,
	});

	const empPayInfoResult = await findEmployeePayInfo(empId, companyName);
	const empBenefitInfoResult = await findEmployeeBenefitInfo(empId, companyName);
	const empTaxCreditResult = await findEmployeeGovernmentInfo(empId, companyName);

	const newEmpData = getCurrentTotals(
		empTimesheetData,
		empPayInfoResult,
		empAdditionalHoursAllocated,
	);
	newEmpData.vacationPayPercent = parseFloat(empBenefitInfoResult?.vacationPayPercent) || 0;
	newEmpData.typeOfUnionDuesTreatment = empBenefitInfoResult?.typeOfUnionDuesTreatment;
	newEmpData.unionDuesContribution = parseFloat(empBenefitInfoResult?.unionDuesContribution) || 0;
	newEmpData.typeOfPensionEETreatment = empBenefitInfoResult?.typeOfPensionEETreatment;
	newEmpData.pensionEEContribution = parseFloat(empBenefitInfoResult?.pensionEEContribution) || 0;
	newEmpData.typeOfExtendedHealthEETreatment =
		empBenefitInfoResult?.typeOfExtendedHealthEETreatment;
	newEmpData.extendedHealthEEContribution =
		parseFloat(empBenefitInfoResult?.extendedHealthEEContribution) || 0;
	newEmpData.typeOfPensionERTreatment = empBenefitInfoResult?.typeOfPensionERTreatment;
	newEmpData.pensionERContribution = parseFloat(empBenefitInfoResult?.pensionERContribution) || 0;
	newEmpData.typeOfExtendedHealthERTreatment =
		empBenefitInfoResult?.typeOfExtendedHealthERTreatment;
	newEmpData.extendedHealthERContribution =
		parseFloat(empBenefitInfoResult?.extendedHealthERContribution) || 0;

	newEmpData.payInLieuPay = empPayStubResult?.payInLieuPay ?? 0;
	newEmpData.pILBenefitPay = empPayStubResult?.pILBenefitPay ?? 0;
	newEmpData.bankedTimePay = empPayStubResult?.bankedTimePay ?? 0;
	newEmpData.regularByAmount = empPayStubResult?.regularByAmount ?? 0;

	newEmpData.commission = empAdditionalAmountAllocated?.commission ?? 0;
	newEmpData.retroactive = empAdditionalAmountAllocated?.retroactive ?? 0;
	newEmpData.vacationPayout = empAdditionalAmountAllocated?.vacationPayout ?? 0;
	newEmpData.terminationPayout = empAdditionalAmountAllocated?.terminationPayout ?? 0;
	newEmpData.bonus = empAdditionalAmountAllocated?.bonus ?? 0;
	newEmpData.reimbursement = empAdditionalAmountAllocated?.reimbursement ?? 0;

	newEmpData.currentVacationBalanceFwd = 0;

	newEmpData.currentGrossPay = calcCurrentGrossPay(newEmpData);

	const {
		CPPContribution,
		totalProvincialTaxDeduction,
		federalTaxDeductionByPayPeriod,
		EmployeeEIContribution,
		EmployerEIContribution,
	} = getTaxDetails(newEmpData?.regPay, newEmpData?.currentGrossPay, empTaxCreditResult);

	const { unionDues, EE_EPP, EE_EHP, ER_EPP, ER_EHP } = getContributionsDeductions(newEmpData);

	// const employeeContribution = calcEmployeeContribution(
	// 	newEmpData.currentGrossPay,
	// 	newEmpData,
	// );

	// const pensionContribution = 0.4 * employeeContribution;
	// const employerContribution =
	// 	pensionContribution + 2.05 * newEmpData.totalRegHoursWorked;

	newEmpData.currentFDTaxDeductions = federalTaxDeductionByPayPeriod;
	newEmpData.currentStateTaxDeductions = totalProvincialTaxDeduction;
	newEmpData.currentIncomeTaxDeductions =
		federalTaxDeductionByPayPeriod + totalProvincialTaxDeduction;
	newEmpData.currentCPPDeductions = CPPContribution;
	newEmpData.currentEmployeeEIDeductions = EmployeeEIContribution;
	newEmpData.currentEmployerEIDeductions = EmployerEIContribution;
	newEmpData.currentUnionDuesDeductions = unionDues;
	newEmpData.currentEmployeeHealthContributions = EE_EHP;
	newEmpData.currentPrimaryDeposit = 0;
	newEmpData.currentEmployeePensionContributions = EE_EPP;
	newEmpData.currentOtherDeductions = 0;

	newEmpData.currentEmployerPensionContributions = ER_EPP;
	newEmpData.currentEmployerHealthContributions = ER_EHP;

	newEmpData.currentEmployerContributions = ER_EPP + ER_EHP;

	newEmpData.currentVacationAccrued = empBenefitInfoResult
		? parseFloat(empBenefitInfoResult.vacationPayPercent) * newEmpData.currentGrossPay
		: 0;

	newEmpData.currentVacationUsed =
		empBenefitInfoResult?.typeOfVacationTreatment === "Payout"
			? newEmpData.currentVacationAccrued
			: newEmpData.currentVacationPayTotal;

	newEmpData.vacationBalance =
		newEmpData.currentVacationBalanceFwd +
		(newEmpData.currentVacationAccrued - newEmpData.currentVacationUsed);
	newEmpData.currentSickAccrued = 0;
	newEmpData.currentSickUsed = 0;
	newEmpData.sickBalance = 0;

	newEmpData.currentDeductionsTotal = calcCurrentDeductionsTotal(newEmpData);

	const netPay = newEmpData.currentGrossPay - newEmpData.currentDeductionsTotal;
	// newEmpData.currentNetPay = netPay < 0 ? 0 : netPay;
	newEmpData.currentNetPay = netPay;
	newEmpData.totalAmountAllocated =
		newEmpData.commission +
		newEmpData.bonus +
		newEmpData.retroactive +
		newEmpData.reimbursement +
		newEmpData.terminationPayout +
		newEmpData.vacationPayout;

	const prevPayPeriodNum = isExtraRun ? payPeriod : payPeriod - 1;

	const prevPayPayInfo = await findCurrentPayStub(prevPayPeriodNum, companyName, empId, false);

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
		YTD_FDTaxDeductions: getSumTotal(prevPayPayInfo?.YTD_FDTaxDeductions, currentFDTaxDeductions),
		YTDStateTaxDeductions: getSumTotal(
			prevPayPayInfo?.YTDStateTaxDeductions,
			currentStateTaxDeductions,
		),
		YTD_IncomeTaxDeductions: getSumTotal(
			prevPayPayInfo?.YTD_IncomeTaxDeductions,
			currentIncomeTaxDeductions,
		),
		YTD_EmployeeEIDeductions: getSumTotal(
			prevPayPayInfo?.YTD_EmployeeEIDeductions,
			currentEmployeeEIDeductions,
		),
		YTD_EmployerEIDeductions: getSumTotal(
			prevPayPayInfo?.YTD_EmployerEIDeductions,
			currentEmployerEIDeductions,
		),
		YTD_CPPDeductions: getSumTotal(prevPayPayInfo?.YTD_CPPDeductions, currentCPPDeductions),
		YTDUnionDuesDeductions: getSumTotal(
			prevPayPayInfo?.YTDUnionDuesDeductions,
			currentUnionDuesDeductions,
		),
		YTDEmployeeHealthContributions: getSumTotal(
			prevPayPayInfo?.YTDEmployeeHealthContributions,
			currentEmployeeHealthContributions,
		),
		YTDPrimaryDeposit: getSumTotal(prevPayPayInfo?.YTDPrimaryDeposit, currentPrimaryDeposit),
		YTDEmployeePensionContributions: getSumTotal(
			prevPayPayInfo?.YTDEmployeePensionContributions,
			currentEmployeePensionContributions,
		),
		YTDOtherDeductions: getSumTotal(prevPayPayInfo?.YTDOtherDeductions, currentOtherDeductions),

		YTDGrossPay: getSumTotal(prevPayPayInfo?.YTDGrossPay, currentGrossPay),

		YTDDeductionsTotal: getSumTotal(prevPayPayInfo?.YTDDeductionsTotal, currentDeductionsTotal),

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

const findAlertInfo = async (record) => await EmployeeAlertsViolationInfo.findOne(record);

const addAlertsAndViolations = async (req, res) => {
	const { companyName, inputsReviewData } = req.body;

	try {
		for (const data of inputsReviewData) {
			const empResult = await EmployeeBankingInfo.findOne({
				empId: data?.empId?._id,
			}).select("empId bankNum transitNum accountNum");

			const empSINResult = await EmployeeProfileInfo.findOne({
				empId: data?.empId?._id,
			}).select("empId SIN");
			if (
				!empResult ||
				empResult.bankNum === "" ||
				empResult.transitNum === "" ||
				empResult.accountNum === ""
			) {
				const alertsExists = await findAlertInfo({
					empId: data?.empId?._id,
					companyName,
					actionRequired: true,
				});
				if (alertsExists) {
				} else {
					await EmployeeAlertsViolationInfo.create({
						empId: data?.empId?._id,
						companyName,
						description: "Banking information missing",
						actionRequired: true,
						payPeriodNum: data.payPeriodNum,
					});
				}
			}
			if (!empSINResult || empSINResult.SIN === "") {
				const alertsExists = await findAlertInfo({
					empId: data?.empId?._id,
					companyName,
					actionRequired: false,
				});
				if (alertsExists) {
				} else {
					await EmployeeAlertsViolationInfo.create({
						empId: data?.empId?._id,
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
	getEmployeeId,
	addPayStub,
	findEmpPayStubDetail,
	getEmployeePayDetailsReportInfo,
	getEEContribution,
	getERContribution,
	getTotalAlertsAndViolationsInfo,
};
