const EmployeeExtraAllocation = require("../models/EmployeeExtraAllocation");
const { PAYRUN_TYPE } = require("../services/data");
const { getPayrunAmtAllocatedResult } = require("./payrunAmtAllocatedCalc");
const { fetchActiveEmployees } = require("./userController");

const getAmountAllocation = async (req, res) => {
	const { companyName, payDate, isExtraRun, groupId, payrunType, deptName } = req.params;

	try {
		const isExtraPayRun = isExtraRun === "true";

		const activeEmployees = await fetchActiveEmployees(
			isExtraPayRun,
			groupId,
			payDate,
			companyName,
			deptName,
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
			if (totalSuperficialHoursWorked) {
				const chequeTypeSuperficialExists = existingInfo?.chequesType?.find(
					(_) => _ === PAYRUN_TYPE.SUPERFICIAL,
				);
				if (!chequeTypeSuperficialExists) existingInfo?.chequesType.push(PAYRUN_TYPE.SUPERFICIAL);
			}
			if (totalManualHoursWorked) {
				const chequeTypeManualExists = existingInfo?.chequesType?.find(
					(_) => _ === PAYRUN_TYPE.MANUAL,
				);
				if (!chequeTypeManualExists) existingInfo?.chequesType.push(PAYRUN_TYPE.MANUAL);
			}
			if (totalPayoutHoursWorked) {
				const chequeTypePayoutExists = existingInfo?.chequesType?.find(
					(_) => _ === PAYRUN_TYPE.PAYOUT,
				);
				if (!chequeTypePayoutExists) existingInfo?.chequesType.push(PAYRUN_TYPE.PAYOUT);
			}
			const updatedInfo = await updateAdditionalHoursAllocatedInfo(existingInfo._id, {
				additionalRegHoursWorked,
				chequesType: existingInfo.chequesType,
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
		const chequesType = [];
		if (totalSuperficialHoursWorked) {
			chequesType.push(PAYRUN_TYPE.SUPERFICIAL);
		}
		if (totalManualHoursWorked) {
			chequesType.push(PAYRUN_TYPE.MANUAL);
		}
		if (totalPayoutHoursWorked) {
			chequesType.push(PAYRUN_TYPE.PAYOUT);
		}
		const newInfo = await addNewAllocationRecord({
			empId,
			chequesType,
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
			if (totalSuperficialAmountAllocated) {
				const chequeTypeSuperficialExists = existingInfo?.chequesType?.find(
					(_) => _ === PAYRUN_TYPE.SUPERFICIAL,
				);
				if (!chequeTypeSuperficialExists) existingInfo?.chequesType.push(PAYRUN_TYPE.SUPERFICIAL);
			}
			if (totalManualAmountAllocated) {
				const chequeTypeManualExists = existingInfo?.chequesType?.find(
					(_) => _ === PAYRUN_TYPE.MANUAL,
				);
				if (!chequeTypeManualExists) existingInfo?.chequesType.push(PAYRUN_TYPE.MANUAL);
			}
			if (totalPayoutAmountAllocated) {
				const chequeTypePayoutExists = existingInfo?.chequesType?.find(
					(_) => _ === PAYRUN_TYPE.PAYOUT,
				);
				if (!chequeTypePayoutExists) existingInfo?.chequesType.push(PAYRUN_TYPE.PAYOUT);
			}
			newData.chequesType = existingInfo?.chequesType;
			const updatedInfo = await updateAdditionalHoursAllocatedInfo(existingInfo._id, newData);
			return res.status(201).json(updatedInfo);
		}
		const chequesType = [];
		if (totalSuperficialAmountAllocated) {
			chequesType.push(PAYRUN_TYPE.SUPERFICIAL);
		}
		if (totalManualAmountAllocated) {
			chequesType.push(PAYRUN_TYPE.MANUAL);
		}
		if (totalPayoutAmountAllocated) {
			chequesType.push(PAYRUN_TYPE.PAYOUT);
		}
		newData.chequesType = chequesType;
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
			const chequeTypeSuperficialExists = existingInfo?.chequesType?.find(
				(_) => _ === PAYRUN_TYPE.SUPERFICIAL,
			);
			if (!chequeTypeSuperficialExists) {
				if (!existingInfo?.chequesType?.length) existingInfo.chequesType = [];
				existingInfo?.chequesType.push(PAYRUN_TYPE.SUPERFICIAL);
			}
			newData.chequesType = existingInfo?.chequesType;

			const updatedInfo = await updateAdditionalHoursAllocatedInfo(existingInfo._id, newData);
			return res.status(201).json(updatedInfo);
		}

		newData.chequesType = [PAYRUN_TYPE.SUPERFICIAL];
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
			const chequeTypeSuperficialExists = existingInfo?.chequesType?.find(
				(_) => _ === PAYRUN_TYPE.SUPERFICIAL,
			);
			if (!chequeTypeSuperficialExists) {
				if (!existingInfo?.chequesType?.length) existingInfo.chequesType = [];
				existingInfo?.chequesType.push(PAYRUN_TYPE.SUPERFICIAL);
			}
			newData.chequesType = existingInfo?.chequesType;

			const updatedInfo = await updateAdditionalHoursAllocatedInfo(existingInfo._id, newData);
			return res.status(201).json(updatedInfo);
		}

		newData.chequesType = [PAYRUN_TYPE.SUPERFICIAL];
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
	await EmployeeExtraAllocation.findOne(record);

const findAdditionalHoursAllocatedInfo = async (record) =>
	await EmployeeExtraAllocation.findOne(record).select(
		"empId chequesType totalHoursWorked additionalRegHoursWorked additionalOvertimeHoursWorked additionalDblOvertimeHoursWorked additionalStatDayHoursWorked additionalVacationHoursWorked additionalStatHoursWorked additionalSickHoursWorked ",
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
