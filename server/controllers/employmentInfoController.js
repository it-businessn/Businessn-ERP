const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const EmployeePayInfo = require("../models/EmployeePayInfo");
const Timesheet = require("../models/Timesheet");
const {
	getPayrollActiveEmployees,
	getEmployeeId,
} = require("./payrollController");
const { findGroupEmployees } = require("./setUpController");

const getAllEmploymentInfo = async (req, res) => {
	const { companyName, startDate, endDate, payDate, isExtraRun, groupId } =
		req.params;
	try {
		const employees =
			isExtraRun && (await findGroupEmployees(groupId, payDate));

		const activeEmployees = isExtraRun
			? await getEmployeeId(employees)
			: await getPayrollActiveEmployees();

		const currentPeriodEmployees = isExtraRun
			? null
			: await Timesheet.find({
					companyName,
					createdOn: { $gte: startDate, $lte: endDate },
					approveStatus: "Approved",
			  }).select("employeeId");

		const aggregatedResult = [];
		for (const employee of activeEmployees) {
			const empTimesheetData = currentPeriodEmployees?.find(
				(el) => el.employeeId.toString() === employee._id.toString(),
			);
			if (empTimesheetData) {
				const result = await buildPayPeriodEmpDetails(
					companyName,
					empTimesheetData,
					employee._id,
				);
				aggregatedResult.push(result);
			} else {
				const result = await buildPayPeriodEmpDetails(
					companyName,
					null,
					employee._id,
				);
				aggregatedResult.push(result);
			}
		}
		aggregatedResult.map((empInfo) => {
			const empIdStr = empInfo.empPayStubResult.empId._id.toString();
			if (empInfo.payInfoMapResult.has(empIdStr)) {
				empInfo.regPay = empInfo.payInfoMapResult.get(empIdStr);
			}
			empInfo._id = empInfo.empPayStubResult._id;
			empInfo.empId = empInfo.empPayStubResult.empId;
			empInfo.companyDepartment = empInfo.empPayStubResult.companyDepartment;
			empInfo.employmentCostCenter =
				empInfo.empPayStubResult.employmentCostCenter;
		});

		res.status(200).json(aggregatedResult);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const findEmpEmploymentInfo = async (empId) =>
	await EmployeeEmploymentInfo.findOne({
		empId,
	}).populate({
		path: "empId",
		model: "Employee",
		select: ["employeeId", "fullName"],
	});

const findEmpPayInfo = async (companyName) =>
	await EmployeePayInfo.find({
		companyName,
	}).select("empId regPay");

const buildPayPeriodEmpDetails = async (
	companyName,
	empTimesheetData,
	empId,
) => {
	const employeeId = empTimesheetData ? empTimesheetData.employeeId : empId;

	const empPayStubResult = await findEmpEmploymentInfo(employeeId);

	const payInfoResult = await findEmpPayInfo(companyName);
	const payInfoMapResult = new Map(
		payInfoResult.map((payInfo) => [payInfo.empId, payInfo.regPay]),
	);
	return { empPayStubResult, payInfoMapResult };
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
