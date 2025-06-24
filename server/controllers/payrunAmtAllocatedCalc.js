const EmployeeExtraAllocation = require("../models/EmployeeExtraAllocation");

const getPayrunAmtAllocatedResult = async (
	activeEmployees,
	companyName,
	payDate,
	isSuperficial,
	isManual,
	isPayout,
) => {
	const aggregatedResult = [];
	for (const employee of activeEmployees) {
		if (isSuperficial) {
			await calcSuperficialAggregatedAmount(
				employee.empId?._id,
				employee.empId?.fullName,
				companyName,
				payDate,
				aggregatedResult,
			);
		} else if (isManual) {
			await calcManualAggregatedAmount(
				employee.empId?._id,
				employee.empId?.fullName,
				companyName,
				payDate,
				aggregatedResult,
			);
		} else if (isPayout) {
			await calcPayoutAggregatedAmount(
				employee.empId?._id,
				employee.empId?.fullName,
				companyName,
				payDate,
				aggregatedResult,
			);
		} else {
			await calcRegularAggregatedAmount(
				employee.empId?._id,
				employee.empId?.fullName,
				companyName,
				payDate,
				aggregatedResult,
			);
		}
	}
	return aggregatedResult;
};

const calcManualAggregatedAmount = async (
	empId,
	fullName,
	companyName,
	payPeriodPayDate,
	aggregatedResult,
) => {
	const result = await findAdditionalManualAmountAllocatedInfo({
		empId,
		companyName,
		payPeriodPayDate,
	});

	if (result) {
		const {
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
			regPayAmtManual,
			OTPayAmtManual,
			dblOTPayAmtManual,
			statPayAmtManual,
			statWorkPayAmtManual,
			vacationPayAmtManual,
			sickPayAmtManual,
		} = result;

		if (!result.totalManualAmountAllocated) {
			const regSumHrs =
				commissionManual +
				bonusManual +
				retroactiveManual +
				reimbursementManual +
				terminationPayoutManual +
				vacationPayoutManual +
				vacationBalAdjustManual +
				vacationAccrualManual +
				vacationUsedManual +
				federalTaxManual +
				provTaxManual +
				incomeTaxManual +
				regPayAmtManual +
				OTPayAmtManual +
				dblOTPayAmtManual +
				statPayAmtManual +
				statWorkPayAmtManual +
				vacationPayAmtManual +
				sickPayAmtManual;
			result.totalAmountAllocated = regSumHrs;
		}
		aggregatedResult.push(result);
	} else {
		const result = {
			empId: { _id: empId, fullName },
			totalManualAmountAllocated: 0,
		};
		aggregatedResult.push(result);
	}

	return aggregatedResult;
};

const calcPayoutAggregatedAmount = async (
	empId,
	fullName,
	companyName,
	payPeriodPayDate,
	aggregatedResult,
) => {
	const result = await findAdditionalPayoutAmountAllocatedInfo({
		empId,
		companyName,
		payPeriodPayDate,
	});

	if (result) {
		const {
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
			regPayAmtPayout,
			OTPayAmtPayout,
			dblOTPayAmtPayout,
			statPayAmtPayout,
			statWorkPayAmtPayout,
			vacationPayAmtPayout,
			sickPayAmtPayout,
		} = result;

		if (!result.totalPayoutAmountAllocated) {
			const regSumHrs =
				commissionPayout +
				bonusPayout +
				retroactivePayout +
				reimbursementPayout +
				terminationPayoutPayout +
				vacationPayoutPayout +
				vacationBalAdjustPayout +
				vacationAccrualPayout +
				vacationUsedPayout +
				federalTaxPayout +
				provTaxPayout +
				incomeTaxPayout +
				regPayAmtPayout +
				OTPayAmtPayout +
				dblOTPayAmtPayout +
				statPayAmtPayout +
				statWorkPayAmtPayout +
				vacationPayAmtPayout +
				sickPayAmtPayout;
			result.totalAmountAllocated = regSumHrs;
		}
		aggregatedResult.push(result);
	} else {
		const result = {
			empId: { _id: empId, fullName },
			totalPayoutAmountAllocated: 0,
		};
		aggregatedResult.push(result);
	}

	return aggregatedResult;
};

const calcSuperficialAggregatedAmount = async (
	empId,
	fullName,
	companyName,
	payPeriodPayDate,
	aggregatedResult,
) => {
	const result = await findAdditionalSuperficialAmountAllocatedInfo({
		empId,
		companyName,
		payPeriodPayDate,
	});

	if (result) {
		const {
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
			regPayAmtSuperficial,
			OTPayAmtSuperficial,
			dblOTPayAmtSuperficial,
			statPayAmtSuperficial,
			statWorkPayAmtSuperficial,
			vacationPayAmtSuperficial,
			sickPayAmtSuperficial,
		} = result;

		if (!result.totalSuperficialAmountAllocated) {
			const regSumHrs =
				commissionSuperficial +
				bonusSuperficial +
				retroactiveSuperficial +
				reimbursementSuperficial +
				terminationPayoutSuperficial +
				vacationPayoutSuperficial +
				vacationBalAdjustSuperficial +
				vacationAccrualSuperficial +
				vacationUsedSuperficial +
				federalTaxSuperficial +
				provTaxSuperficial +
				incomeTaxSuperficial +
				regPayAmtSuperficial +
				OTPayAmtSuperficial +
				dblOTPayAmtSuperficial +
				statPayAmtSuperficial +
				statWorkPayAmtSuperficial +
				vacationPayAmtSuperficial +
				sickPayAmtSuperficial;
			result.totalSuperficialAmountAllocated = regSumHrs;
		}
		aggregatedResult.push(result);
	} else {
		const result = {
			empId: { _id: empId, fullName },
			totalSuperficialAmountAllocated: 0,
		};
		aggregatedResult.push(result);
	}

	return aggregatedResult;
};

const calcRegularAggregatedAmount = async (
	empId,
	fullName,
	companyName,
	payPeriodPayDate,
	aggregatedResult,
) => {
	const result = await findAdditionalRegularAmountAllocatedInfo({
		empId,
		companyName,
		payPeriodPayDate,
	});

	if (result) {
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
			regPayAmt2,
			OTPayAmt,
			dblOTPayAmt,
			statPayAmt,
			statWorkPayAmt,
			vacationPayAmt,
			bereavementPayAmt,
			personalDayPayAmt,
			sickPayAmt,
		} = result;

		if (!result.totalAmountAllocated) {
			const regSumHrs =
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
				regPayAmt2 +
				OTPayAmt +
				dblOTPayAmt +
				statPayAmt +
				statWorkPayAmt +
				vacationPayAmt +
				bereavementPayAmt +
				personalDayPayAmt +
				sickPayAmt;
			result.totalAmountAllocated = regSumHrs;
		}
		aggregatedResult.push(result);
	} else {
		const result = {
			empId: { _id: empId, fullName },
			totalAmountAllocated: 0,
		};
		aggregatedResult.push(result);
	}

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
			"empId regPayAmt regPayAmt2 OTPayAmt dblOTPayAmt statPayAmt statWorkPayAmt vacationPayAmt personalDayPayAmt bereavementPayAmt sickPayAmt totalAmountAllocated commission bonus retroactive reimbursement terminationPayout vacationPayout vacationBalAdjust vacationAccrual vacationUsed federalTax provTax incomeTax",
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
	getPayrunAmtAllocatedResult,
	findAdditionalRegularAmountAllocatedInfo,
	findAdditionalPayoutAmountAllocatedInfo,
	findAdditionalManualAmountAllocatedInfo,
	findAdditionalSuperficialAmountAllocatedInfo,
};
