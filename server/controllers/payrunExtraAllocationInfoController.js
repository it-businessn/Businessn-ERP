const { PAYRUN_TYPE } = require("../constants/pay.constants");
const { checkExtraRun } = require("../helpers/payrollHelper");
const EmployeeExtraAllocation = require("../models/EmployeeExtraAllocation");
const { getPayrunAmtAllocatedResult } = require("./payrunAmtAllocatedCalc");
const { fetchActiveEmployees } = require("./userController");

const getAmountAllocation = async (req, res) => {
	const {
		companyName,
		payDate,
		isExtraRun,
		groupId,
		payrunType,
		deptName,
		selectedPayGroupOption,
	} = req.body;

	try {
		const isExtraPayRun = checkExtraRun(isExtraRun);
		const isSuperficial = payrunType === PAYRUN_TYPE.SUPERFICIAL;
		const isManual = payrunType === PAYRUN_TYPE.MANUAL;
		const isPayout = payrunType === PAYRUN_TYPE.PAYOUT;

		const activeEmployees = await fetchActiveEmployees(
			isExtraPayRun,
			groupId,
			payDate,
			companyName,
			deptName,
			selectedPayGroupOption,
		);
		if (!activeEmployees?.length) {
			console.warn("⚠️ No active employees found", {
				companyName,
				payDate,
				groupId,
				selectedPayGroupOption,
			});

			return res.status(200).json({
				items: [],
				total: 0,
				message: "No active employees found for given filters",
			});
		}
		const aggregatedResult = await getPayrunAmtAllocatedResult(
			activeEmployees,
			companyName,
			payDate,
			isSuperficial,
			isManual,
			isPayout,
		);

		return res.status(200).json(aggregatedResult);
	} catch (error) {
		console.error("❌ getAmountAllocation error:", {
			message: error.message,
			stack: error.stack,
			body: req.body,
		});

		return res.status(500).json({
			message: "Internal server error",
		});
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
		additionalRegHoursWorked2,

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
		const empIdStr = empId?._id?.toString() || empId;
		const existingInfo = await findAdditionalHoursAllocatedInfo({
			empId: empIdStr,
			companyName,
			payPeriodPayDate,
		});
		const chequeSet = new Set(existingInfo?.chequesType || []);
		if (totalSuperficialHoursWorked !== undefined) chequeSet.add(PAYRUN_TYPE.SUPERFICIAL);

		if (totalManualHoursWorked !== undefined) chequeSet.add(PAYRUN_TYPE.MANUAL);

		if (totalPayoutHoursWorked !== undefined) chequeSet.add(PAYRUN_TYPE.PAYOUT);
		const chequesType = Array.from(chequeSet);
		const updateData = Object.fromEntries(
			Object.entries({
				additionalRegHoursWorked,
				chequesType,
				additionalOvertimeHoursWorked,
				additionalDblOvertimeHoursWorked,
				additionalStatHoursWorked,
				additionalStatDayHoursWorked,
				additionalVacationHoursWorked,
				additionalSickHoursWorked,
				additionalRegHoursWorked2,

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
			}).filter(([_, v]) => v !== undefined),
		);
		if (existingInfo) {
			const updatedInfo = await updateAdditionalHoursAllocatedInfo(existingInfo._id, updateData);
			return res.status(201).json(updatedInfo);
		}
		const newInfo = await addNewAllocationRecord({
			empId: empIdStr,
			companyName,
			payPeriodPayDate,
			...updateData,
		});

		return res.status(201).json(newInfo);
	} catch (error) {
		console.error("❌ addAdditionalHoursAllocationInfo  error:", {
			message: error.message,
			stack: error.stack,
			body: req.body,
		});

		return res.status(500).json({
			message: "Internal server error",
		});
	}
};

const addNewAllocationRecord = async (data) => await EmployeeExtraAllocation.create(data);

const addAmountAllocation = async (req, res) => {
	const { empId, companyName, updatedRec, payPeriodPayDate } = req.body;
	try {
		const {
			commission,
			bonus,
			retroactive,
			pILBenefitPay,
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
			pILBenefitPaySuperficial,
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
		if (!updatedRec || typeof updatedRec !== "object") {
			return res.status(400).json({ message: "Invalid updatedRec" });
		}
		const empIdStr = empId?._id?.toString() || empId;

		const existingInfo = await findAdditionalHoursAllocatedInfo({
			empId: empIdStr,
			companyName,
			payPeriodPayDate,
		});
		const newData = Object.fromEntries(
			Object.entries(updatedRec).filter(([_, v]) => v !== undefined),
		);

		const chequeSet = new Set(existingInfo?.chequesType || []);

		if (updatedRec.totalSuperficialAmountAllocated !== undefined)
			chequeSet.add(PAYRUN_TYPE.SUPERFICIAL);

		if (updatedRec.totalManualAmountAllocated !== undefined) chequeSet.add(PAYRUN_TYPE.MANUAL);

		if (updatedRec.totalPayoutAmountAllocated !== undefined) chequeSet.add(PAYRUN_TYPE.PAYOUT);

		newData.chequesType = Array.from(chequeSet);

		if (existingInfo) {
			const updated = await updateAdditionalHoursAllocatedInfo(existingInfo._id, newData);
			return res.status(200).json(updated);
		}

		const newInfo = await addNewAllocationRecord({
			...newData,
			empId: empIdStr,
			companyName,
			payPeriodPayDate,
		});

		return res.status(201).json(newInfo);
	} catch (error) {
		console.error("❌ addAmountAllocation error:", {
			message: error.message,
			stack: error.stack,
			body: req.body,
		});

		return res.status(500).json({
			message: "Internal server error",
		});
	}
};

const addEmployeeContribution = async (req, res) => {
	const { empId, companyName, updatedRec, payPeriodPayDate } = req.body;
	try {
		const empIdStr = empId?._id || empId;

		const existingInfo = await findEESuperficialContribution({
			empId: empIdStr,
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
			const chequeSet = new Set(existingInfo.chequesType || []);
			chequeSet.add(PAYRUN_TYPE.SUPERFICIAL);

			newData.chequesType = Array.from(chequeSet);

			const updatedInfo = await updateAdditionalHoursAllocatedInfo(existingInfo._id, newData);

			return res.status(200).json(updatedInfo);
		}

		newData.chequesType = [PAYRUN_TYPE.SUPERFICIAL];
		newData.empId = empIdStr;
		newData.companyName = companyName;
		newData.payPeriodPayDate = payPeriodPayDate;

		const newInfo = await addNewAllocationRecord(newData);

		return res.status(201).json(newInfo);
	} catch (error) {
		console.error("❌ addEmployeeContribution Error:", {
			message: error.message,
			stack: error.stack,
			body: req.body,
		});

		return res.status(500).json({ message: "Internal server error" });
	}
};

const addEmployerContribution = async (req, res) => {
	const { empId, companyName, updatedRec, payPeriodPayDate } = req.body;
	try {
		const empIdStr = empId?._id || empId;

		const existingInfo = await findEESuperficialContribution({
			empId: empIdStr,
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
			const chequeSet = new Set(existingInfo.chequesType || []);
			chequeSet.add(PAYRUN_TYPE.SUPERFICIAL);

			newData.chequesType = Array.from(chequeSet);

			const updatedInfo = await updateAdditionalHoursAllocatedInfo(existingInfo._id, newData);

			return res.status(200).json(updatedInfo);
		}

		newData.chequesType = [PAYRUN_TYPE.SUPERFICIAL];
		newData.empId = empIdStr;
		newData.companyName = companyName;
		newData.payPeriodPayDate = payPeriodPayDate;

		const newInfo = await addNewAllocationRecord(newData);

		return res.status(201).json(newInfo);
	} catch (error) {
		console.error("❌ addEmployerContribution Error:", {
			message: error.message,
			stack: error.stack,
			body: req.body,
		});

		return res.status(500).json({ message: "Internal server error" });
	}
};

const updateAdditionalHoursAllocatedInfo = async (id, data) =>
	await EmployeeExtraAllocation.findByIdAndUpdate(
		id,
		{ $set: data },
		{
			new: true,
		},
	);

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
		"empId chequesType totalHoursWorked additionalRegHoursWorked additionalRegHoursWorked2 additionalOvertimeHoursWorked additionalDblOvertimeHoursWorked additionalStatDayHoursWorked additionalVacationHoursWorked additionalStatHoursWorked additionalSickHoursWorked ",
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
