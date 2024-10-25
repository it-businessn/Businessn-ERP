const EmployeeExtraAllocation = require("../models/EmployeeExtraAllocation");

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
	} = req.body;
	try {
		const existingInfo = await findAdditionalHoursAllocatedInfo({
			empId: empId._id,
			companyName,
		});

		if (existingInfo) {
			const updatedInfo = await updateAdditionalHoursAllocatedInfo(
				existingInfo._id,
				req.body,
			);
			return res.status(201).json(updatedInfo);
		}
		const newInfo = await EmployeeExtraAllocation.create({
			empId,
			companyName,
			additionalRegHoursWorked,
			additionalOvertimeHoursWorked,
			additionalDblOvertimeHoursWorked,
			additionalStatDayHoursWorked,
			additionalVacationHoursWorked,
			additionalSickHoursWorked,
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

module.exports = {
	addAdditionalHoursAllocationInfo,
	findAdditionalHoursAllocatedInfo,
};
