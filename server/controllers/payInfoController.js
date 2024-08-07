const EmployeePayInfo = require("../models/EmployeePayInfo");
const Timesheet = require("../models/Timesheet");

const getAllPayInfo = async (req, res) => {
	const { companyName, startDate, endDate } = req.params;
	try {
		const currentPeriodEmployees = await Timesheet.find({
			companyName,
			createdOn: { $gte: startDate, $lte: endDate },
		}).select("employeeId");

		const uniqueEmployeeIds = new Set();

		const filteredArray = currentPeriodEmployees.filter((item) => {
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
			const empResult = await EmployeePayInfo.findOne({
				empId: emp.employeeId,
			}).populate({
				path: "empId",
				model: "Employee",
				select: "fullName",
			});
			if (empResult) {
				result.push(empResult);
			}
		}

		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
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
