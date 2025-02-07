const Employee = require("../models/Employee");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const EmployeePayInfo = require("../models/EmployeePayInfo");
const { isRoleManager } = require("../services/data");
const { setInitialPermissions } = require("./appController");
const { getEmployeeId } = require("./payrollController");
const { findGroupEmployees } = require("./setUpController");
const { getPayrollActiveEmployees } = require("./userController");

const getAllEmploymentInfo = async (req, res) => {
	const { companyName, startDate, endDate, payDate, isExtraRun, groupId } = req.params;
	try {
		const isExtraPayRun = isExtraRun === "true";
		const employees = isExtraPayRun ? await findGroupEmployees(groupId, payDate) : null;

		const activeEmployees = isExtraPayRun
			? await getEmployeeId(employees)
			: await getPayrollActiveEmployees(companyName);

		const aggregatedResult = [];
		for (const employee of activeEmployees) {
			const result = await buildPayPeriodEmpDetails(companyName, employee._id, true);
			aggregatedResult.push(result);
		}
		aggregatedResult.map((empInfo) => {
			const empIdStr = empInfo.empPayStubResult?.empId?._id.toString();
			if (empInfo?.payInfoMapResult.has(empIdStr)) {
				empInfo.regPay = empInfo.payInfoMapResult.get(empIdStr);
			}
			empInfo._id = empInfo?.empPayStubResult?._id;
			empInfo.empId = empInfo?.empPayStubResult?.empId;
			empInfo.employmentCostCenter = empInfo?.empPayStubResult?.employmentCostCenter;
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

const buildPayPeriodEmpDetails = async (companyName, employeeId, hideDetails) => {
	const empPayStubResult = hideDetails
		? await EmployeeEmploymentInfo.findOne({
				empId: employeeId,
		  })
				.populate({
					path: "empId",
					model: "Employee",
					select: ["employeeId", "fullName"],
				})
				.select("empId companyDepartment employmentCostCenter")
		: await findEmpEmploymentInfo(employeeId);

	const payInfoResult = await findEmpPayInfo(companyName);
	const payInfoMapResult = new Map(payInfoResult.map((payInfo) => [payInfo.empId, payInfo.regPay]));
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

const updateEmployee = async (empId, data) => {
	const {
		employmentRole,
		employmentCostCenter,
		employmentDepartment,
		payrollStatus,
		employeeNo,
		timeManagementBadgeID,
	} = data;
	const employee = await Employee.findById(empId);

	if (employmentRole) {
		employee.role = employmentRole;
	}
	if (employmentDepartment) {
		employee.department = employmentDepartment;
	}
	if (employee?.payrollStatus !== payrollStatus) {
		employee.payrollStatus = payrollStatus;
	}
	if (employeeNo && employeeNo !== "") {
		employee.employeeNo = employeeNo;
	}
	if (timeManagementBadgeID && timeManagementBadgeID !== "") {
		employee.timeManagementBadgeID = timeManagementBadgeID;
	}

	await employee.save();
};

const addEmployeeEmploymentInfo = async (req, res) => {
	const {
		empId,
		companyName,
		payrollStatus,
		employeeNo,
		timeManagementBadgeID,
		employmentStartDate,
		employmentLeaveDate,
		employmentRole,
		employmentPayGroup,
		employmentCostCenter,
		employmentDepartment,
		companyDepartment,
	} = req.body;
	try {
		const data = {
			payrollStatus,
			employeeNo,
			timeManagementBadgeID,
			employmentRole,
			employmentCostCenter,
			employmentDepartment,
		};
		const existingEmploymentInfo = await findEmployeeEmploymentInfo(empId, companyName);
		if (existingEmploymentInfo) {
			const updatedEmploymentInfo = await updateEmploymentInfo(
				existingEmploymentInfo._id,
				req.body,
			);
			await updateEmployee(existingEmploymentInfo.empId, data);
			await setInitialPermissions(
				existingEmploymentInfo.empId,
				isRoleManager(employmentRole),
				companyName,
			);
			return res.status(201).json(updatedEmploymentInfo);
		}
		const newEmploymentInfo = await EmployeeEmploymentInfo.create({
			empId,
			payrollStatus,
			employeeNo,
			timeManagementBadgeID,
			companyName,
			employmentStartDate,
			employmentLeaveDate,
			employmentRole,
			employmentPayGroup,
			employmentCostCenter,
			employmentDepartment,
			companyDepartment,
		});
		await updateEmployee(empId, data);
		await setInitialPermissions(empId, isRoleManager(employmentRole), companyName);
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
