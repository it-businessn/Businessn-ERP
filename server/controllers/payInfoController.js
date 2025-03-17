const Employee = require("../models/Employee");
const EmployeePayInfo = require("../models/EmployeePayInfo");
const { ROLES } = require("../services/data");
const { getPayrollActiveEmployees } = require("./appController");
const { findEmpPayStubDetail } = require("./payStubHelper");
const { findGroupEmployees } = require("./setUpController");
const { getEmployeeId } = require("./userController");

const getAllPayInfo = async (req, res) => {
	const { companyName, payDate, isExtraRun, groupId } = req.params;
	try {
		const isExtraPayRun = isExtraRun === "true";
		const employees = isExtraPayRun && (await findGroupEmployees(groupId, payDate));

		const activeEmployees = isExtraPayRun
			? await getEmployeeId(employees)
			: await getPayrollActiveEmployees(companyName);

		const aggregatedResult = [];
		for (const employee of activeEmployees) {
			const result = await buildAmountAllocationEmpDetails(payDate, employee, companyName);
			aggregatedResult.push(result);
		}

		res.status(200).json(aggregatedResult);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const buildAmountAllocationEmpDetails = async (payDate, employee, companyName) => {
	const employeeId = employee._id;
	const fullName = employee.fullName;

	const empPayStubResult = await findEmpPayStubDetail(employeeId, payDate, companyName);

	const recordId = await getRecordId(empPayStubResult, employeeId, companyName, payDate);

	const result = {
		_id: recordId,
		empId: { _id: employeeId, fullName },
		commission: empPayStubResult?.commission ?? 0,
		bonus: empPayStubResult?.bonus ?? 0,
		reimbursement: empPayStubResult?.reimbursement ?? 0,
		retroactive: empPayStubResult?.retroactive ?? 0,
		terminationPayout: empPayStubResult?.terminationPayout ?? 0,
		vacationPayout: empPayStubResult?.vacationPayout ?? 0,
	};
	return result;
};

const getEmployeePayInfo = async (req, res) => {
	const { companyName, empId } = req.params;
	try {
		const employee = await Employee.findById(empId);
		if (employee?.role === ROLES.SHADOW_ADMIN) {
			const result = await EmployeePayInfo.findOne({
				empId,
			});
			return res.status(200).json(result);
		}
		const result = await findEmployeePayInfo(empId, companyName);
		return res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const findEmployeePayInfo = async (empId, companyName) =>
	await EmployeePayInfo.findOne({
		empId,
		companyName,
	});

const updatePayInfo = async (id, data) =>
	await EmployeePayInfo.findByIdAndUpdate(id, data, {
		new: true,
	});

const addEmployeePayInfo = async (req, res) => {
	const { empId, companyName, roles } = req.body;
	try {
		if (roles) {
			roles.forEach((role) => {
				const regPay = role?.payRate;
				if (regPay) {
					role.overTimePay = 1.5 * regPay;
					role.dblOverTimePay = 2 * regPay;
					role.statWorkPay = 1.5 * regPay;
					role.statPay = regPay;
					role.sickPay = regPay;
					role.vacationPay = regPay;
				}
			});
		}
		const existingPayInfo = await findEmployeePayInfo(empId, companyName);
		if (existingPayInfo) {
			const updatedPayInfo = await updatePayInfo(existingPayInfo._id, { roles });
			return res.status(201).json(updatedPayInfo);
		}
		const newPayInfo = await EmployeePayInfo.create({
			empId,
			companyName,
			roles,
		});
		return res.status(201).json(newPayInfo);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateEmployeePayInfo = async (req, res) => {
	const { id } = req.params;
	try {
		req.body.updatedOn = moment();
		const updatedPayInfo = await updatePayInfo(id, req.body);

		res.status(201).json(updatedPayInfo);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const findEmployeePayInfoDetails = async (empId, companyName) =>
	await EmployeePayInfo.findOne({
		empId,
		companyName,
	}).select(
		"empId typeOfEarning fullTimeStandardHours partTimeStandardHours regPay overTimePay dblOverTimePay statWorkPay statPay sickPay vacationPay",
	);

module.exports = {
	getAllPayInfo,
	getEmployeePayInfo,
	addEmployeePayInfo,
	updateEmployeePayInfo,
	findEmployeePayInfoDetails,
	updatePayInfo,
};
