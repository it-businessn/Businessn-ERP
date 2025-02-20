const EmployeeExtraAllocation = require("../models/EmployeeExtraAllocation");
const { PAYRUN_TYPE } = require("../services/data");
const { calcSalary } = require("../services/payrollService");
const { findEmployeePayInfoDetails } = require("./payInfoController");
const { fetchActiveEmployees } = require("./userController");

const getAmountAllocation = async (req, res) => {
	const { companyName, payDate, isExtraRun, groupId, payrunType } = req.params;

	try {
		const isExtraPayRun = isExtraRun === "true";

		const activeEmployees = await fetchActiveEmployees(
			isExtraPayRun,
			groupId,
			payDate,
			companyName,
		);

		const aggregatedResult = [];
		for (const employee of activeEmployees) {
			const empPayInfoResult = await findEmployeePayInfoDetails(employee._id, companyName);
			const result = await findAdditionalAmountAllocatedInfo({
				empId: employee._id,
				companyName,
				payPeriodPayDate: payDate,
			});
			if (result) {
				// const isSuperficial = payrunType === PAYRUN_TYPE.SUPERFICIAL;
				// const isManual = payrunType === PAYRUN_TYPE.MANUAL;
				// const isPayout = payrunType === PAYRUN_TYPE.PAYOUT;

				// if (isSuperficial) {
				// 	const {
				// 		commissionSuperficial,
				// 		bonusSuperficial,
				// 		retroactiveSuperficial,
				// 		reimbursementSuperficial,
				// 		terminationPayoutSuperficial,
				// 		vacationPayoutSuperficial,
				// 		vacationBalAdjustSuperficial,
				// 		vacationAccrualSuperficial,
				// 		vacationUsedSuperficial,
				// 		federalTaxSuperficial,
				// 		provTaxSuperficial,
				// 		incomeTaxSuperficial,
				// 	} = result;

				// 	result.totalAmountAllocated =
				// 		(commissionSuperficial || 0) +
				// 		(bonusSuperficial || 0) +
				// 		(retroactiveSuperficial || 0) +
				// 		(reimbursementSuperficial || 0) +
				// 		(terminationPayoutSuperficial || 0) +
				// 		(vacationPayoutSuperficial || 0);
				// 	aggregatedResult.push(result);
				// } else if (isManual) {
				// 	const {
				// 		commissionManual,
				// 		bonusManual,
				// 		retroactiveManual,
				// 		reimbursementManual,
				// 		terminationPayoutManual,
				// 		vacationPayoutManual,
				// 		vacationBalAdjustManual,
				// 		vacationAccrualManual,
				// 		vacationUsedManual,
				// 		federalTaxManual,
				// 		provTaxManual,
				// 		incomeTaxManual,
				// 	} = result;

				// 	result.totalAmountAllocated =
				// 		(commissionManual || 0) +
				// 		(bonusManual || 0) +
				// 		(retroactiveManual || 0) +
				// 		(reimbursementManual || 0) +
				// 		(terminationPayoutManual || 0) +
				// 		(vacationPayoutManual || 0);
				// 	aggregatedResult.push(result);
				// } else if (isPayout) {
				// 	const {
				// 		commissionPayout,
				// 		bonusPayout,
				// 		retroactivePayout,
				// 		reimbursementPayout,
				// 		terminationPayoutPayout,
				// 		vacationPayoutPayout,
				// 		vacationBalAdjustPayout,
				// 		vacationAccrualPayout,
				// 		vacationUsedPayout,
				// 		federalTaxPayout,
				// 		provTaxPayout,
				// 		incomeTaxPayout,
				// 	} = result;

				// 	result.totalAmountAllocated =
				// 		(commissionPayout || 0) +
				// 		(bonusPayout || 0) +
				// 		(retroactivePayout || 0) +
				// 		(reimbursementPayout || 0) +
				// 		(terminationPayoutPayout || 0) +
				// 		(vacationPayoutPayout || 0);
				// 	aggregatedResult.push(result);
				// } else {
				const {
					commission,
					bonus,
					retroactive,
					reimbursement,
					terminationPayout,
					vacationPayout,
					vacationBalAdjust,
					vacationAccrual,
					vacationUsed,
					federalTax,
					provTax,
					incomeTax,
					regPayAmt,
					OTPayAmt,
					dblOTPayAmt,
					statPayAmt,
					statWorkPayAmt,
					vacationPayAmt,
					sickPayAmt,
				} = result;
				if (!result.totalAmountAllocated)
					result.totalAmountAllocated =
						commission +
						bonus +
						retroactive +
						reimbursement +
						terminationPayout +
						vacationPayout +
						vacationBalAdjust +
						vacationAccrual +
						vacationUsed +
						federalTax +
						provTax +
						incomeTax +
						regPayAmt +
						OTPayAmt +
						dblOTPayAmt +
						statPayAmt +
						statWorkPayAmt +
						vacationPayAmt +
						sickPayAmt;
				aggregatedResult.push(result);
				// }
			} else {
				const result = {
					empId: { _id: employee._id, fullName: employee.fullName },
					totalAmountAllocated: 0,
				};
				aggregatedResult.push(result);
			}
		}
		res.status(200).json(aggregatedResult);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const addAdditionalHoursAllocationInfo = async (req, res) => {
	const {
		empId,
		companyName,
		additionalRegHoursWorked,
		additionalOvertimeHoursWorked,
		additionalDblOvertimeHoursWorked,
		additionalStatHoursWorked,
		additionalStatDayHoursWorked,
		additionalVacationHoursWorked,
		additionalSickHoursWorked,
		additionalPayoutRegHoursWorked,
		additionalPayoutOvertimeHoursWorked,
		additionalPayoutDblOvertimeHoursWorked,
		additionalPayoutStatHoursWorked,
		additionalPayoutStatDayHoursWorked,
		additionalPayoutVacationHoursWorked,
		additionalPayoutSickHoursWorked,
		additionalManualRegHoursWorked,
		additionalManualOvertimeHoursWorked,
		additionalManualDblOvertimeHoursWorked,
		additionalManualStatHoursWorked,
		additionalManualStatDayHoursWorked,
		additionalManualVacationHoursWorked,
		additionalManualSickHoursWorked,
		additionalSuperficialRegHoursWorked,
		additionalSuperficialOvertimeHoursWorked,
		additionalSuperficialDblOvertimeHoursWorked,
		additionalSuperficialStatHoursWorked,
		additionalSuperficialStatDayHoursWorked,
		additionalSuperficialVacationHoursWorked,
		additionalSuperficialSickHoursWorked,
		payPeriodPayDate,
		totalHoursWorked,
		totalSuperficialHoursWorked,
		totalManualHoursWorked,
		totalPayoutHoursWorked,
	} = req.body;
	try {
		const existingInfo = await findAdditionalHoursAllocatedInfo({
			empId: empId._id,
			companyName,
			payPeriodPayDate,
		});

		if (existingInfo) {
			const updatedInfo = await updateAdditionalHoursAllocatedInfo(existingInfo._id, {
				additionalRegHoursWorked,
				additionalOvertimeHoursWorked,
				additionalDblOvertimeHoursWorked,
				additionalStatHoursWorked,
				additionalStatDayHoursWorked,
				additionalVacationHoursWorked,
				additionalSickHoursWorked,
				additionalPayoutRegHoursWorked,
				additionalPayoutOvertimeHoursWorked,
				additionalPayoutDblOvertimeHoursWorked,
				additionalPayoutStatHoursWorked,
				additionalPayoutStatDayHoursWorked,
				additionalPayoutVacationHoursWorked,
				additionalPayoutSickHoursWorked,
				additionalManualRegHoursWorked,
				additionalManualOvertimeHoursWorked,
				additionalManualDblOvertimeHoursWorked,
				additionalManualStatHoursWorked,
				additionalManualStatDayHoursWorked,
				additionalManualVacationHoursWorked,
				additionalManualSickHoursWorked,
				additionalSuperficialRegHoursWorked,
				additionalSuperficialOvertimeHoursWorked,
				additionalSuperficialDblOvertimeHoursWorked,
				additionalSuperficialStatHoursWorked,
				additionalSuperficialStatDayHoursWorked,
				additionalSuperficialVacationHoursWorked,
				additionalSuperficialSickHoursWorked,
				totalHoursWorked,
				totalSuperficialHoursWorked,
				totalManualHoursWorked,
				totalPayoutHoursWorked,
			});
			return res.status(201).json(updatedInfo);
		}
		const newInfo = await addNewAllocationRecord({
			empId,
			companyName,
			additionalRegHoursWorked,
			additionalOvertimeHoursWorked,
			additionalDblOvertimeHoursWorked,
			additionalStatDayHoursWorked,
			additionalStatHoursWorked,
			additionalVacationHoursWorked,
			additionalSickHoursWorked,
			additionalPayoutRegHoursWorked,
			additionalPayoutOvertimeHoursWorked,
			additionalPayoutDblOvertimeHoursWorked,
			additionalPayoutStatHoursWorked,
			additionalPayoutStatDayHoursWorked,
			additionalPayoutVacationHoursWorked,
			additionalPayoutSickHoursWorked,
			additionalManualRegHoursWorked,
			additionalManualOvertimeHoursWorked,
			additionalManualDblOvertimeHoursWorked,
			additionalManualStatHoursWorked,
			additionalManualStatDayHoursWorked,
			additionalManualVacationHoursWorked,
			additionalManualSickHoursWorked,
			additionalSuperficialRegHoursWorked,
			additionalSuperficialOvertimeHoursWorked,
			additionalSuperficialDblOvertimeHoursWorked,
			additionalSuperficialStatHoursWorked,
			additionalSuperficialStatDayHoursWorked,
			additionalSuperficialVacationHoursWorked,
			additionalSuperficialSickHoursWorked,
			payPeriodPayDate,
			totalHoursWorked,
			totalSuperficialHoursWorked,
			totalManualHoursWorked,
			totalPayoutHoursWorked,
		});
		return res.status(201).json(newInfo);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const addNewAllocationRecord = async (data) => await EmployeeExtraAllocation.create(data);

const addAmountAllocation = async (req, res) => {
	const { empId, companyName, updatedRec, payPeriodPayDate } = req.body;
	try {
		const existingInfo = await findAdditionalHoursAllocatedInfo({
			empId: empId._id,
			companyName,
			payPeriodPayDate,
		});

		const {
			commission,
			bonus,
			retroactive,
			reimbursement,
			terminationPayout,
			vacationPayout,
			vacationBalAdjust,
			vacationAccrual,
			vacationUsed,
			federalTax,
			provTax,
			incomeTax,
			regPayAmt,
			OTPayAmt,
			dblOTPayAmt,
			statPayAmt,
			statWorkPayAmt,
			vacationPayAmt,
			sickPayAmt,

			commissionPayout,
			bonusPayout,
			retroactivePayout,
			reimbursementPayout,
			terminationPayoutPayout,
			vacationPayoutPayout,
			vacationBalAdjustPayout,
			vacationAccrualPayout,
			vacationUsedPayout,
			federalTaxPayout,
			provTaxPayout,
			incomeTaxPayout,

			commissionManual,
			bonusManual,
			retroactiveManual,
			reimbursementManual,
			terminationPayoutManual,
			vacationPayoutManual,
			vacationBalAdjustManual,
			vacationAccrualManual,
			vacationUsedManual,
			federalTaxManual,
			provTaxManual,
			incomeTaxManual,

			commissionSuperficial,
			bonusSuperficial,
			retroactiveSuperficial,
			reimbursementSuperficial,
			terminationPayoutSuperficial,
			vacationPayoutSuperficial,
			vacationBalAdjustSuperficial,
			vacationAccrualSuperficial,
			vacationUsedSuperficial,
			federalTaxSuperficial,
			provTaxSuperficial,
			incomeTaxSuperficial,

			totalAmountAllocated,
			totalSuperficialAmountAllocated,
			totalManualAmountAllocated,
			totalPayoutAmountAllocated,
		} = updatedRec;

		const newData = {
			commission,
			bonus,
			retroactive,
			reimbursement,
			terminationPayout,
			vacationPayout,
			vacationBalAdjust,
			vacationAccrual,
			vacationUsed,
			federalTax,
			provTax,
			incomeTax,
			regPayAmt,
			OTPayAmt,
			dblOTPayAmt,
			statPayAmt,
			statWorkPayAmt,
			vacationPayAmt,
			sickPayAmt,

			commissionPayout,
			bonusPayout,
			retroactivePayout,
			reimbursementPayout,
			terminationPayoutPayout,
			vacationPayoutPayout,
			vacationBalAdjustPayout,
			vacationAccrualPayout,
			vacationUsedPayout,
			federalTaxPayout,
			provTaxPayout,
			incomeTaxPayout,

			commissionManual,
			bonusManual,
			retroactiveManual,
			reimbursementManual,
			terminationPayoutManual,
			vacationPayoutManual,
			vacationBalAdjustManual,
			vacationAccrualManual,
			vacationUsedManual,
			federalTaxManual,
			provTaxManual,
			incomeTaxManual,

			commissionSuperficial,
			bonusSuperficial,
			retroactiveSuperficial,
			reimbursementSuperficial,
			terminationPayoutSuperficial,
			vacationPayoutSuperficial,
			vacationBalAdjustSuperficial,
			vacationAccrualSuperficial,
			vacationUsedSuperficial,
			federalTaxSuperficial,
			provTaxSuperficial,
			incomeTaxSuperficial,

			totalAmountAllocated,
			totalSuperficialAmountAllocated,
			totalManualAmountAllocated,
			totalPayoutAmountAllocated,
		};
		if (existingInfo) {
			const updatedInfo = await updateAdditionalHoursAllocatedInfo(existingInfo._id, newData);
			return res.status(201).json(updatedInfo);
		}

		newData.empId = empId;
		newData.companyName = companyName;
		newData.payPeriodPayDate = payPeriodPayDate;

		const newInfo = await addNewAllocationRecord(newData);

		return res.status(201).json(newInfo);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateAdditionalHoursAllocatedInfo = async (id, data) =>
	await EmployeeExtraAllocation.findByIdAndUpdate(id, data, {
		new: true,
	});

const findAdditionalSuperficialHoursAllocatedInfo = async (record) =>
	await EmployeeExtraAllocation.findOne(record).select(
		"empId totalSuperficialHoursWorked additionalSuperficialRegHoursWorked additionalSuperficialOvertimeHoursWorked additionalSuperficialDblOvertimeHoursWorked additionalSuperficialStatDayHoursWorked additionalSuperficialVacationHoursWorked additionalSuperficialStatHoursWorked additionalSuperficialSickHoursWorked ",
	);

const findAdditionalPayoutHoursAllocatedInfo = async (record) =>
	await EmployeeExtraAllocation.findOne(record).select(
		"empId totalPayoutHoursWorked additionalPayoutRegHoursWorked additionalPayoutOvertimeHoursWorked additionalPayoutDblOvertimeHoursWorked additionalPayoutStatDayHoursWorked additionalPayoutVacationHoursWorked additionalPayoutStatHoursWorked additionalPayoutSickHoursWorked ",
	);

const findAdditionalManualHoursAllocatedInfo = async (record) =>
	await EmployeeExtraAllocation.findOne(record).select(
		"empId totalManualHoursWorked additionalManualRegHoursWorked additionalManualOvertimeHoursWorked additionalManualDblOvertimeHoursWorked additionalManualStatDayHoursWorked additionalManualVacationHoursWorked additionalManualStatHoursWorked additionalManualSickHoursWorked ",
	);

const findAllAdditionalHoursAllocatedInfo = async (record) =>
	await EmployeeExtraAllocation.findOne(record).select(
		"empId additionalRegHoursWorked additionalOvertimeHoursWorked additionalDblOvertimeHoursWorked additionalStatDayHoursWorked additionalVacationHoursWorked additionalStatHoursWorked additionalSickHoursWorked additionalManualRegHoursWorked additionalManualOvertimeHoursWorked additionalManualDblOvertimeHoursWorked additionalManualStatDayHoursWorked additionalManualVacationHoursWorked additionalManualStatHoursWorked additionalManualSickHoursWorked additionalPayoutRegHoursWorked additionalPayoutOvertimeHoursWorked additionalPayoutDblOvertimeHoursWorked additionalPayoutStatDayHoursWorked additionalPayoutVacationHoursWorked additionalPayoutStatHoursWorked additionalPayoutSickHoursWorked additionalSuperficialRegHoursWorked additionalSuperficialOvertimeHoursWorked additionalSuperficialDblOvertimeHoursWorked additionalSuperficialStatDayHoursWorked additionalSuperficialVacationHoursWorked additionalSuperficialStatHoursWorked additionalSuperficialSickHoursWorked commissionPayout bonusPayout retroactivePayout reimbursementPayout terminationPayoutPayout vacationPayoutPayout vacationBalAdjustPayout vacationAccrualPayout vacationUsedPayout federalTaxPayout provTaxPayout incomeTaxPayout commissionManual bonusManual retroactiveManual reimbursementManual terminationPayoutManual vacationPayoutManual vacationBalAdjustManual vacationAccrualManual vacationUsedManual federalTaxManual provTaxManual incomeTaxManual commissionSuperficial bonusSuperficial retroactiveSuperficial reimbursementSuperficial terminationPayoutSuperficial vacationPayoutSuperficial vacationBalAdjustSuperficial vacationAccrualSuperficial vacationUsedSuperficial federalTaxSuperficial provTaxSuperficial incomeTaxSuperficial",
	);

const findAdditionalAmountAllocatedInfo = async (record) =>
	await EmployeeExtraAllocation.findOne(record)
		.populate({
			path: "empId",
			model: "Employee",
			select: ["fullName"],
		})
		.select(
			"empId regPayAmt OTPayAmt dblOTPayAmt statPayAmt statWorkPayAmt vacationPayAmt sickPayAmt totalAmountAllocated totalSuperficialAmountAllocated totalManualAmountAllocated totalPayoutAmountAllocated commission bonus retroactive reimbursement terminationPayout vacationPayout vacationBalAdjust vacationAccrual vacationUsed federalTax provTax incomeTax commissionPayout bonusPayout retroactivePayout reimbursementPayout terminationPayoutPayout vacationPayoutPayout vacationBalAdjustPayout vacationAccrualPayout vacationUsedPayout federalTaxPayout provTaxPayout incomeTaxPayout commissionManual bonusManual retroactiveManual reimbursementManual terminationPayoutManual vacationPayoutManual vacationBalAdjustManual vacationAccrualManual vacationUsedManual federalTaxManual provTaxManual incomeTaxManual commissionSuperficial bonusSuperficial retroactiveSuperficial reimbursementSuperficial terminationPayoutSuperficial vacationPayoutSuperficial vacationBalAdjustSuperficial vacationAccrualSuperficial vacationUsedSuperficial federalTaxSuperficial provTaxSuperficial incomeTaxSuperficial",
		);

const findAdditionalHoursAllocatedInfo = async (record) =>
	await EmployeeExtraAllocation.findOne(record).select(
		"empId totalHoursWorked additionalRegHoursWorked additionalOvertimeHoursWorked additionalDblOvertimeHoursWorked additionalStatDayHoursWorked additionalVacationHoursWorked additionalStatHoursWorked additionalSickHoursWorked ",
	);

module.exports = {
	findAdditionalSuperficialHoursAllocatedInfo,
	findAdditionalPayoutHoursAllocatedInfo,
	findAdditionalManualHoursAllocatedInfo,
	addAdditionalHoursAllocationInfo,
	findAdditionalHoursAllocatedInfo,
	findAdditionalAmountAllocatedInfo,
	addAmountAllocation,
	getAmountAllocation,
	findAllAdditionalHoursAllocatedInfo,
};
