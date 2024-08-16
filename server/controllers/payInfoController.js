const EmployeePayInfo = require("../models/EmployeePayInfo");
const EmployeePayStub = require("../models/EmployeePayStub");
const { getPayrollActiveEmployees } = require("./payrollController");

const getAllPayInfo = async (req, res) => {
	const { companyName, startDate, endDate } = req.params;
	try {
		const payrollActiveEmployees = await getPayrollActiveEmployees();

		const aggregatedResult = [];
		for (const employee of payrollActiveEmployees) {
			const result = await buildAmountAllocationEmpDetails(
				startDate,
				endDate,
				employee,
			);
			aggregatedResult.push(result);
		}

		res.status(200).json(aggregatedResult);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const findEmpPayStub = async (empId, payPeriodStartDate, payPeriodEndDate) =>
	await EmployeePayStub.findOne({
		empId,
		payPeriodStartDate,
		payPeriodEndDate,
	})
		.populate({
			path: "empId",
			model: "Employee",
			select: "fullName",
		})
		.select(
			"commission retroactive reimbursement vacationPayout bonus terminationPayout",
		);

const buildAmountAllocationEmpDetails = async (
	startDate,
	endDate,
	employee,
) => {
	const employeeId = employee._id;
	const fullName = employee.fullName;

	const empPayStubResult = await findEmpPayStub(employeeId, startDate, endDate);

	const result = {
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
