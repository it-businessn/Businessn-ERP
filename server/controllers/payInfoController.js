const EmployeePayInfo = require("../models/EmployeePayInfo");

const getAllPayInfo = async (req, res) => {
	const { companyName } = req.params;
	try {
		const result = await EmployeePayInfo.find({
			companyName,
		}).sort({
			createdOn: -1,
		});

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
