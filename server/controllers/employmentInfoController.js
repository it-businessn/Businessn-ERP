const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");

const getAllEmploymentInfo = async (req, res) => {
	const { companyName } = req.params;
	try {
		const result = await EmployeeEmploymentInfo.find({
			companyName,
		})
			.populate({
				path: "empId",
				model: "Employee",
				select: ["employeeId", "fullName"],
			})
			.sort({
				createdOn: -1,
			});

		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getEmployeeEmploymentInfo = async (req, res) => {
	const { companyName, empId } = req.params;
	try {
		const result = await findEmployeeEmploymentInfo(empId, companyName);
		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const findEmployeeEmploymentInfo = async (empId, companyName) =>
	await EmployeeEmploymentInfo.findOne({
		empId,
		companyName,
	});

const updateEmploymentInfo = async (id, data) =>
	await EmployeeEmploymentInfo.findByIdAndUpdate(id, data, {
		new: true,
	});

const addEmployeeEmploymentInfo = async (req, res) => {
	const {
		empId,
		companyName,
		employmentStartDate,
		employmentLeaveDate,
		employmentRole,
		employmentPayGroup,
		employmentCostCenter,
		employmentDepartment,
		companyDepartment,
	} = req.body;
	try {
		const existingEmploymentInfo = await findEmployeeEmploymentInfo(
			empId,
			companyName,
		);
		if (existingEmploymentInfo) {
			const updatedEmploymentInfo = await updateEmploymentInfo(
				existingEmploymentInfo._id,
				req.body,
			);
			return res.status(201).json(updatedEmploymentInfo);
		}
		const newEmploymentInfo = await EmployeeEmploymentInfo.create({
			empId,
			companyName,
			employmentStartDate,
			employmentLeaveDate,
			employmentRole,
			employmentPayGroup,
			employmentCostCenter,
			employmentDepartment,
			companyDepartment,
		});
		return res.status(201).json(newEmploymentInfo);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateEmployeeEmploymentInfo = async (req, res) => {
	const { id } = req.params;
	try {
		const updatedInfo = await updateEmploymentInfo(id, req.body);
		res.status(201).json(updatedInfo);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = {
	getAllEmploymentInfo,
	getEmployeeEmploymentInfo,
	addEmployeeEmploymentInfo,
	updateEmployeeEmploymentInfo,
};
