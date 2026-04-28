const EmployeePayInfo = require("../models/EmployeePayInfo");
const {
	getContributionsDeductions,
	calcHoursWorkedTotals,
	calcPayRates,
	calcEmpBenefits,
} = require("../helpers/payrollHelper");
const {
	findAdditionalHoursAllocatedInfo,
	findEESuperficialContribution,
} = require("./payrunExtraAllocationInfoController");
const { findEmployeeBenefitInfo } = require("../services/payrollService");
const { safeNum } = require("../utils/time.util");

const getPayrunERContributionResult = async (
	activeEmployees,
	currentPeriodEmployees,
	companyName,
	payDate,
	isSuperficial,
	isManual,
	isPayout,
) => {
	const aggregatedResult = [];
	for (const employee of activeEmployees) {
		if (isSuperficial) {
			await calcSuperficialERContribution(
				employee?.empId?._id,
				employee?.empId?.fullName,
				payDate,
				aggregatedResult,
			);
			// } else if (isManual) {
			// await calcManualERContribution(
			// 	currentPeriodEmployees,
			// employee?.empId?._id,
			// employee?.empId?.fullName,
			// 	payDate,
			// 	companyName,
			// 	aggregatedResult,
			// );
			// } else if (isPayout) {
			// await calcPayoutERContribution(
			// 	currentPeriodEmployees,
			// employee?.empId?._id,
			// employee?.empId?.fullName,
			// 	payDate,
			// 	companyName,
			// 	aggregatedResult,
			// );
		} else {
			await calcRegularERContribution(
				employee?.empId?._id,
				employee?.empId?.fullName,
				payDate,
				aggregatedResult,
				currentPeriodEmployees,
				companyName,
			);
		}
	}
	return aggregatedResult;
};

const calcSuperficialERContribution = async (empId, fullName, payDate, aggregatedResult) => {
	const empERSuperficialContribution = await findEESuperficialContribution({
		empId,
		payPeriodPayDate: payDate,
	});

	aggregatedResult.push({
		_id: empId,
		empId: { fullName, _id: empId },
		ER_EHPSuperficial: safeNum(empERSuperficialContribution?.ER_EHPSuperficial),
		ER_EPPSuperficial: safeNum(empERSuperficialContribution?.ER_EPPSuperficial),
		ER_EISuperficial: safeNum(empERSuperficialContribution?.ER_EISuperficial),
		ER_CPPSuperficial: safeNum(empERSuperficialContribution?.ER_CPPSuperficial),
	});

	return aggregatedResult;
};

const calcPayoutERContribution = async (
	currentPeriodEmployees,
	empId,
	fullName,
	payDate,
	companyName,
	aggregatedResult,
) => {
	const empTimesheetData = currentPeriodEmployees?.find(
		(el) => el.empId._id.toString() === empId.toString(),
	);
	const empPayInfoResult = await EmployeePayInfo.findOne({
		empId,
		companyName,
	});
	const empAdditionalHoursAllocated = await findAdditionalHoursAllocatedInfo({
		empId,
		payPeriodPayDate: payDate,
	});
	const empBenefitInfoResult = await findEmployeeBenefitInfo(empId, companyName);

	const newEmpData = empTimesheetData ? empTimesheetData : {};
	newEmpData.regPay = safeNum(empPayInfoResult?.roles?.[0]?.payRate);
	calcPayRates(newEmpData);
	calcHoursWorkedTotals(
		newEmpData,
		empPayInfoResult,
		empTimesheetData,
		empAdditionalHoursAllocated,
	);
	calcEmpBenefits(newEmpData, empBenefitInfoResult);

	const { unionDues, EE_EPP, EE_EHP, ER_EPP, ER_EHP } = getContributionsDeductions(newEmpData);

	aggregatedResult.push({
		_id: empId,
		empId: { fullName, _id: empId },
		unionDues,
		// CPP: CPPContribution,
		// EI: EIContribution,
		EPP: ER_EPP,
		EHP: ER_EHP,
	});

	return aggregatedResult;
};

const calcManualERContribution = async (
	currentPeriodEmployees,
	empId,
	fullName,
	payDate,
	companyName,
	aggregatedResult,
) => {
	const empTimesheetData = currentPeriodEmployees?.find(
		(el) => el.empId._id.toString() === empId.toString(),
	);
	const empPayInfoResult = await EmployeePayInfo.findOne({
		empId,
		companyName,
	});
	const empAdditionalHoursAllocated = await findAdditionalHoursAllocatedInfo({
		empId,
		payPeriodPayDate: payDate,
	});
	const empBenefitInfoResult = await findEmployeeBenefitInfo(empId, companyName);

	const newEmpData = empTimesheetData ? empTimesheetData : {};
	newEmpData.regPay = safeNum(empPayInfoResult?.roles?.[0]?.payRate);
	calcPayRates(newEmpData);
	calcHoursWorkedTotals(
		newEmpData,
		empPayInfoResult,
		empTimesheetData,
		empAdditionalHoursAllocated,
	);
	calcEmpBenefits(newEmpData, empBenefitInfoResult);

	const { unionDues, EE_EPP, EE_EHP, ER_EPP, ER_EHP } = getContributionsDeductions(newEmpData);

	aggregatedResult.push({
		_id: empId,
		empId: { fullName, _id: empId },
		unionDues,
		// CPP: CPPContribution,
		// EI: EIContribution,
		EPP: ER_EPP,
		EHP: ER_EHP,
	});

	return aggregatedResult;
};

const calcRegularERContribution = async (
	empId,
	fullName,
	payPeriodPayDate,
	aggregatedResult,
	currentPeriodEmployees,
	companyName,
) => {
	const empTimesheetData = currentPeriodEmployees?.find(
		(el) => el.empId._id.toString() === empId.toString(),
	);
	const empPayInfoResult = await EmployeePayInfo.findOne({
		empId,
		companyName,
	});
	const empBenefitInfoResult = await findEmployeeBenefitInfo(empId, companyName);

	const empAdditionalHoursAllocated = await findAdditionalHoursAllocatedInfo({
		empId,
		payPeriodPayDate,
	});

	const newEmpData = empTimesheetData ? empTimesheetData : {};
	newEmpData.regPay = safeNum(empPayInfoResult?.roles?.[0]?.payRate);
	calcPayRates(newEmpData);
	calcHoursWorkedTotals(
		newEmpData,
		empPayInfoResult,
		empTimesheetData,
		empAdditionalHoursAllocated,
	);
	calcEmpBenefits(newEmpData, empBenefitInfoResult);

	const { ER_EPP, ER_EHP } = getContributionsDeductions(newEmpData);

	aggregatedResult.push({
		_id: empId,
		empId: { fullName, _id: empId },
		EPP: ER_EPP,
		EHP: ER_EHP,
	});

	return aggregatedResult;
};

module.exports = {
	getPayrunERContributionResult,
};
