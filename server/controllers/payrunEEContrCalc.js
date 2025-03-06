const EmployeeExtraAllocation = require("../models/EmployeeExtraAllocation");
const { findEmployeePayInfoDetails } = require("./payInfoController");
const {
	findEmployeeBenefitInfo,
	getContributionsDeductions,
	calcHoursWorkedTotals,
	calcPayRates,
	calcEmpBenefits,
} = require("./payrollHelper");
const {
	findAdditionalHoursAllocatedInfo,
	findEESuperficialContribution,
} = require("./payrunExtraAllocationInfoController");

const getPayrunEEContributionResult = async (
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
			await calcSuperficialEEContribution(
				employee._id,
				employee.fullName,
				payDate,
				aggregatedResult,
			);
			// } else if (isManual) {
			// 	await calcManualEEContribution(
			// 		currentPeriodEmployees,
			// 		employee._id,
			// 		employee.fullName,
			// 		payDate,
			// 		companyName,
			// 		aggregatedResult,
			// 	);
			// } else if (isPayout) {
			// 	await calcPayoutEEContribution(
			// 		currentPeriodEmployees,
			// 		employee._id,
			// 		employee.fullName,
			// 		payDate,
			// 		companyName,
			// 		aggregatedResult,
			// 	);
		} else {
			await calcRegularEEContribution(
				employee._id,
				employee.fullName,
				payDate,
				aggregatedResult,
				currentPeriodEmployees,
				companyName,
			);
		}
	}
	return aggregatedResult;
};

const calcSuperficialEEContribution = async (empId, fullName, payDate, aggregatedResult) => {
	const empEESuperficialContribution = await findEESuperficialContribution({
		empId,
		payPeriodPayDate: payDate,
	});

	aggregatedResult.push({
		_id: empId,
		empId: { fullName, _id: empId },
		unionDuesSuperficial: empEESuperficialContribution?.unionDuesSuperficial || 0,
		EE_EHPSuperficial: empEESuperficialContribution?.EE_EHPSuperficial || 0,
		EE_EPPSuperficial: empEESuperficialContribution?.EE_EPPSuperficial || 0,
		EE_EISuperficial: empEESuperficialContribution?.EE_EISuperficial || 0,
		EE_CPPSuperficial: empEESuperficialContribution?.EE_CPPSuperficial || 0,
	});

	return aggregatedResult;
};

const calcPayoutEEContribution = async (
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
	const empPayInfoResult = await findEmployeePayInfoDetails(empId, companyName);
	const empAdditionalHoursAllocated = await findAdditionalHoursAllocatedInfo({
		empId,
		payPeriodPayDate: payDate,
	});
	const empBenefitInfoResult = await findEmployeeBenefitInfo(empId, companyName);

	const newEmpData = empTimesheetData ? empTimesheetData : {};
	newEmpData.regPay = empPayInfoResult?.regPay || 0;
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
		EPP: EE_EPP,
		EHP: EE_EHP,
	});

	return aggregatedResult;
};

const calcManualEEContribution = async (
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
	const empPayInfoResult = await findEmployeePayInfoDetails(empId, companyName);
	const empAdditionalHoursAllocated = await findAdditionalHoursAllocatedInfo({
		empId,
		payPeriodPayDate: payDate,
	});
	const empBenefitInfoResult = await findEmployeeBenefitInfo(empId, companyName);

	const newEmpData = empTimesheetData ? empTimesheetData : {};
	newEmpData.regPay = empPayInfoResult?.regPay || 0;
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
		EPP: EE_EPP,
		EHP: EE_EHP,
	});

	return aggregatedResult;
};

const calcRegularEEContribution = async (
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
	const empPayInfoResult = await findEmployeePayInfoDetails(empId, companyName);
	const empBenefitInfoResult = await findEmployeeBenefitInfo(empId, companyName);

	const empAdditionalHoursAllocated = await findAdditionalHoursAllocatedInfo({
		empId,
		payPeriodPayDate,
	});

	const newEmpData = empTimesheetData ? empTimesheetData : {};
	newEmpData.regPay = empPayInfoResult?.regPay || 0;
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
		EPP: EE_EPP,
		EHP: EE_EHP,
	});

	return aggregatedResult;
};

const findAdditionalRegularAmountAllocatedInfo = async (record) =>
	await EmployeeExtraAllocation.findOne(record)
		.populate({
			path: "empId",
			model: "Employee",
			select: ["fullName"],
		})
		.select(
			"empId regPayAmt OTPayAmt dblOTPayAmt statPayAmt statWorkPayAmt vacationPayAmt sickPayAmt totalAmountAllocated commission bonus retroactive reimbursement terminationPayout vacationPayout vacationBalAdjust vacationAccrual vacationUsed federalTax provTax incomeTax",
		);

const findAdditionalPayoutAmountAllocatedInfo = async (record) =>
	await EmployeeExtraAllocation.findOne(record)
		.populate({
			path: "empId",
			model: "Employee",
			select: ["fullName"],
		})
		.select(
			"empId regPayAmtPayout OTPayAmtPayout dblOTPayAmtPayout statPayAmtPayout statWorkPayAmtPayout vacationPayAmtPayout sickPayAmtPayout totalPayoutAmountAllocated commissionPayout bonusPayout retroactivePayout reimbursementPayout terminationPayoutPayout vacationPayoutPayout vacationBalAdjustPayout vacationAccrualPayout vacationUsedPayout federalTaxPayout provTaxPayout incomeTaxPayout",
		);

const findAdditionalManualAmountAllocatedInfo = async (record) =>
	await EmployeeExtraAllocation.findOne(record)
		.populate({
			path: "empId",
			model: "Employee",
			select: ["fullName"],
		})
		.select(
			"empId regPayAmtManual OTPayAmtManual dblOTPayAmtManual statPayAmtManual statWorkPayAmtManual vacationPayAmtManual sickPayAmtManual totalManualAmountAllocated commissionManual bonusManual retroactiveManual reimbursementManual terminationPayoutManual vacationPayoutManual vacationBalAdjustManual vacationAccrualManual vacationUsedManual federalTaxManual provTaxManual incomeTaxManual",
		);

const findAdditionalSuperficialAmountAllocatedInfo = async (record) =>
	await EmployeeExtraAllocation.findOne(record)
		.populate({
			path: "empId",
			model: "Employee",
			select: ["fullName"],
		})
		.select(
			"empId regPayAmtSuperficial OTPayAmtSuperficial dblOTPayAmtSuperficial statPayAmtSuperficial statWorkPayAmtSuperficial vacationPayAmtSuperficial sickPayAmtSuperficial totalSuperficialAmountAllocated commissionSuperficial bonusSuperficial retroactiveSuperficial reimbursementSuperficial terminationPayoutSuperficial vacationPayoutSuperficial vacationBalAdjustSuperficial vacationAccrualSuperficial vacationUsedSuperficial federalTaxSuperficial provTaxSuperficial incomeTaxSuperficial",
		);

module.exports = {
	findAdditionalRegularAmountAllocatedInfo,
	findAdditionalPayoutAmountAllocatedInfo,
	findAdditionalManualAmountAllocatedInfo,
	findAdditionalSuperficialAmountAllocatedInfo,
	getPayrunEEContributionResult,
};
