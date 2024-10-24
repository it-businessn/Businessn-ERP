const EmployeePayInfo = require("../models/EmployeePayInfo");
const {
	getEmployeeId,
	addPayStub,
	findEmpPayStubDetail,
} = require("./payrollController");
const { findGroupEmployees } = require("./setUpController");
const { getPayrollActiveEmployees } = require("./userController");

const getAllPayInfo = async (req, res) => {
	const { companyName, payDate, isExtraRun, groupId } = req.params;
	try {
		const isExtraPayRun = isExtraRun === "true";
		const employees =
			isExtraPayRun && (await findGroupEmployees(groupId, payDate));

		const activeEmployees = isExtraPayRun
			? await getEmployeeId(employees)
			: await getPayrollActiveEmployees(companyName);

		const aggregatedResult = [];
		for (const employee of activeEmployees) {
			const result = await buildAmountAllocationEmpDetails(
				payDate,
				employee,
				companyName,
			);
			aggregatedResult.push(result);
		}

		res.status(200).json(aggregatedResult);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getRecordId = async (
	empPayStubResult,
	empId,
	companyName,
	payPeriodPayDate,
) => {
	if (empPayStubResult) {
		return empPayStubResult._id;
	}
	const payStub = {
		empId,
		companyName,
		payPeriodPayDate,
		commission: 0,
		retroactive: 0,
		vacationPayout: 0,
		bonus: 0,
		terminationPayout: 0,
		reimbursement: 0,
	};
	const newPayStub = await addPayStub(payStub);
	return newPayStub._id;
};

const buildAmountAllocationEmpDetails = async (
	payDate,
	employee,
	companyName,
) => {
	const employeeId = employee._id;
	const fullName = employee.fullName;

	const empPayStubResult = await findEmpPayStubDetail(
		employeeId,
		payDate,
		companyName,
	);

	const recordId = await getRecordId(
		empPayStubResult,
		employeeId,
		companyName,
		payDate,
	);

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
		const result = await findEmployeePayInfo(empId, companyName);
		res.status(200).json(result);
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
	const {
		empId,
		companyName,
		regPay,
		overTimePay,
		dblOverTimePay,
		statWorkPay,
		statPay,
		sickPay,
		salaryRate,
		dailyHours,
		longTermDisabilityEE,
		longTermDisabilityER,
		dentalEE,
		dentalER,
		extendedHealthEE,
		extendedHealthER,
		unionDues,
		vacationPay,
		standardHours,
	} = req.body;
	try {
		const existingPayInfo = await findEmployeePayInfo(empId, companyName);
		if (existingPayInfo) {
			const updatedPayInfo = await updatePayInfo(existingPayInfo._id, req.body);
			return res.status(201).json(updatedPayInfo);
		}
		const newPayInfo = await EmployeePayInfo.create({
			empId,
			companyName,
			regPay,
			overTimePay: 1.5 * regPay,
			dblOverTimePay: 2 * regPay,
			statWorkPay: 1.5 * regPay,
			statPay: regPay,
			sickPay: regPay,
			salaryRate,
			dailyHours,
			longTermDisabilityEE,
			longTermDisabilityER,
			dentalEE,
			dentalER,
			extendedHealthEE,
			extendedHealthER,
			unionDues,
			vacationPay: regPay,
			standardHours,
		});
		return res.status(201).json(newPayInfo);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateEmployeePayInfo = async (req, res) => {
	const { id } = req.params;
	try {
		const updatedPayInfo = await updatePayInfo(id, req.body);

		res.status(201).json(updatedPayInfo);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = {
	getAllPayInfo,
	getEmployeePayInfo,
	addEmployeePayInfo,
	updateEmployeePayInfo,
};
