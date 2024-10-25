const EmployeeExtraAllocation = require("../models/EmployeeExtraAllocation");
const { getEmployeeId } = require("./payrollController");
const { findGroupEmployees } = require("./setUpController");
const { getPayrollActiveEmployees } = require("./userController");

const getAmountAllocation = async (req, res) => {
	const { companyName, payDate, isExtraRun, groupId } = req.params;

	try {
		const isExtraPayRun = isExtraRun === "true";
		const employees = isExtraPayRun
			? await findGroupEmployees(groupId, payDate)
			: null;

		const activeEmployees = isExtraPayRun
			? await getEmployeeId(employees)
			: await getPayrollActiveEmployees(companyName);

		const aggregatedResult = [];
		for (const employee of activeEmployees) {
			const result = await findAdditionalAmountAllocatedInfo({
				empId: employee._id,
				companyName,
				payPeriodPayDate: payDate,
			});
			if (result) {
				aggregatedResult.push(result);
			} else {
				aggregatedResult.push({
					empId: { _id: employee._id, fullName: employee.fullName },
				});
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
		additionalStatDayHoursWorked,
		additionalVacationHoursWorked,
		additionalSickHoursWorked,
		payPeriodPayDate,
	} = req.body;
	try {
		const existingInfo = await findAdditionalHoursAllocatedInfo({
			empId: empId._id,
			companyName,
			payPeriodPayDate,
		});

		if (existingInfo) {
			const updatedInfo = await updateAdditionalHoursAllocatedInfo(
				existingInfo._id,
				req.body,
			);
			return res.status(201).json(updatedInfo);
		}
		const newInfo = await addNewAllocationRecord({
			empId,
			companyName,
			additionalRegHoursWorked,
			additionalOvertimeHoursWorked,
			additionalDblOvertimeHoursWorked,
			additionalStatDayHoursWorked,
			additionalVacationHoursWorked,
			additionalSickHoursWorked,
			payPeriodPayDate,
		});
		return res.status(201).json(newInfo);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const addNewAllocationRecord = async (data) =>
	await EmployeeExtraAllocation.create(data);

const addAmountAllocation = async (req, res) => {
	const {
		empId,
		companyName,
		commission,
		bonus,
		retroactive,
		reimbursement,
		terminationPayout,
		vacationPayout,
		payPeriodPayDate,
	} = req.body;
	try {
		const existingInfo = await findAdditionalHoursAllocatedInfo({
			empId: empId._id,
			companyName,
			payPeriodPayDate,
		});

		if (existingInfo) {
			const updatedInfo = await updateAdditionalHoursAllocatedInfo(
				existingInfo._id,
				req.body,
			);
			return res.status(201).json(updatedInfo);
		}
		const newInfo = await addNewAllocationRecord({
			empId,
			companyName,
			commission,
			bonus,
			retroactive,
			reimbursement,
			terminationPayout,
			vacationPayout,
			payPeriodPayDate,
		});

		return res.status(201).json(newInfo);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateAdditionalHoursAllocatedInfo = async (id, data) =>
	await EmployeeExtraAllocation.findByIdAndUpdate(id, data, {
		new: true,
	});

const findAdditionalHoursAllocatedInfo = async (record) =>
	await EmployeeExtraAllocation.findOne(record).select(
		"empId additionalRegHoursWorked additionalOvertimeHoursWorked additionalDblOvertimeHoursWorked additionalStatDayHoursWorked additionalVacationHoursWorked additionalSickHoursWorked",
	);

const findAdditionalAmountAllocatedInfo = async (record) =>
	await EmployeeExtraAllocation.findOne(record)
		.populate({
			path: "empId",
			model: "Employee",
			select: ["fullName"],
		})
		.select(
			"empId commission bonus retroactive reimbursement terminationPayout vacationPayout",
		);

module.exports = {
	addAdditionalHoursAllocationInfo,
	findAdditionalHoursAllocatedInfo,
	addAmountAllocation,
	getAmountAllocation,
};
