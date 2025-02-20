const EmployeeExtraAllocation = require("../models/EmployeeExtraAllocation");
const { PAYRUN_TYPE } = require("../services/data");
const { getPayrunAmtAllocatedResult } = require("./payrunAmtAllocatedCalc");
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

		const isSuperficial = payrunType === PAYRUN_TYPE.SUPERFICIAL;
		const isManual = payrunType === PAYRUN_TYPE.MANUAL;
		const isPayout = payrunType === PAYRUN_TYPE.PAYOUT;

		const aggregatedResult = await getPayrunAmtAllocatedResult(
			activeEmployees,
			companyName,
			payDate,
			isSuperficial,
			isManual,
			isPayout,
		);

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
			regPayAmtPayout,
			OTPayAmtPayout,
			dblOTPayAmtPayout,
			statPayAmtPayout,
			statWorkPayAmtPayout,
			vacationPayAmtPayout,
			sickPayAmtPayout,

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
			regPayAmtPayout,
			OTPayAmtPayout,
			dblOTPayAmtPayout,
			statPayAmtPayout,
			statWorkPayAmtPayout,
			vacationPayAmtPayout,
			sickPayAmtPayout,

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

const addEmployeeContribution = async (req, res) => {
	const { empId, companyName, updatedRec, payPeriodPayDate } = req.body;
	try {
		const existingInfo = await findEESuperficialContribution({
			empId: empId._id,
			companyName,
			payPeriodPayDate,
		});

		const {
			unionDuesSuperficial,
			EE_EHPSuperficial,
			EE_EPPSuperficial,
			EE_EISuperficial,
			EE_CPPSuperficial,
		} = updatedRec;

		const newData = {
			unionDuesSuperficial,
			EE_EHPSuperficial,
			EE_EPPSuperficial,
			EE_EISuperficial,
			EE_CPPSuperficial,
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

const addEmployerContribution = async (req, res) => {
	const { empId, companyName, updatedRec, payPeriodPayDate } = req.body;
	try {
		const existingInfo = await findEESuperficialContribution({
			empId: empId._id,
			companyName,
			payPeriodPayDate,
		});

		const { ER_EHPSuperficial, ER_EPPSuperficial, ER_EISuperficial, ER_CPPSuperficial } =
			updatedRec;

		const newData = {
			ER_EHPSuperficial,
			ER_EPPSuperficial,
			ER_EISuperficial,
			ER_CPPSuperficial,
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

const findAdditionalHoursAllocatedInfo = async (record) =>
	await EmployeeExtraAllocation.findOne(record).select(
		"empId totalHoursWorked additionalRegHoursWorked additionalOvertimeHoursWorked additionalDblOvertimeHoursWorked additionalStatDayHoursWorked additionalVacationHoursWorked additionalStatHoursWorked additionalSickHoursWorked ",
	);

const findEESuperficialContribution = async (record) =>
	await EmployeeExtraAllocation.findOne(record).select(
		"empId unionDuesSuperficial EE_EHPSuperficial EE_EPPSuperficial EE_EISuperficial EE_CPPSuperficial ER_EHPSuperficial ER_EPPSuperficial ER_EISuperficial ER_CPPSuperficial",
	);

module.exports = {
	findAdditionalSuperficialHoursAllocatedInfo,
	findAdditionalPayoutHoursAllocatedInfo,
	findAdditionalManualHoursAllocatedInfo,
	addAdditionalHoursAllocationInfo,
	findAdditionalHoursAllocatedInfo,
	addAmountAllocation,
	getAmountAllocation,
	findAllAdditionalHoursAllocatedInfo,
	addEmployeeContribution,
	addEmployerContribution,
	findEESuperficialContribution,
};
