const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const EmployeePayInfo = require("../models/EmployeePayInfo");
const Timesheet = require("../models/Timesheet");
const { getPayrollActiveEmployees } = require("./payrollController");

const getAllEmploymentInfo = async (req, res) => {
	const { companyName, startDate, endDate } = req.params;
	try {
		const payrollActiveEmployees = await getPayrollActiveEmployees();
		const currentPeriodEmployees = await Timesheet.find({
			companyName,
			createdOn: { $gte: startDate, $lte: endDate },
			approveStatus: "Approved",
		}).select("employeeId");

		const uniqueEmployeeIds = new Set();
		const currentEmployees = currentPeriodEmployees.length
			? currentPeriodEmployees
			: payrollActiveEmployees;

		const filteredArray = currentEmployees.filter((item) => {
			const employeeIdStr = item.employeeId.toString();
			if (uniqueEmployeeIds.has(employeeIdStr)) {
				return false;
			} else {
				uniqueEmployeeIds.add(employeeIdStr);
				return true;
			}
		});

		const result = [];
		for (emp of filteredArray) {
			const empInfoResult = await EmployeeEmploymentInfo.findOne({
				empId: emp._id,
			}).populate({
				path: "empId",
				model: "Employee",
				select: ["employeeId", "fullName"],
			});
			if (empInfoResult) {
				result.push(empInfoResult);
			}
		}

		const payInfoResult = await EmployeePayInfo.find({
			companyName,
		}).select("empId regPay");

		const payInfoMap = new Map(
			payInfoResult.map((payInfo) => [payInfo.empId, payInfo.regPay]),
		);

		result.forEach((empInfo) => {
			const empIdStr = empInfo.empId._id.toString();
			if (payInfoMap.has(empIdStr)) {
				empInfo.regPay = payInfoMap.get(empIdStr);
			}
		});
		//   empInfoResult?.map((empInfo) => {
		// 	payInfoResult?.map((payInfo) => {
		// 		if (empInfo.empId._id.toString() === payInfo.empId) {
		// 			empInfo.regPay = payInfo.regPay;
		// 		}
		// 		return empInfo;
		// 	});
		// });

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
