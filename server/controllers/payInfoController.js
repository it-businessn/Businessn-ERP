const EmployeePayInfo = require("../models/EmployeePayInfo");

const getAllPayInfo = async (req, res) => {
	const { companyName } = req.params;
	try {
		const pay = await EmployeePayInfo.find({
			companyName,
		}).sort({
			createdOn: -1,
		});

		res.status(200).json(pay);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getEmployeePayInfo = async (req, res) => {
	const { company, empId } = req.params;
	try {
		const pay = await EmployeePayInfo.find({
			empId,
			companyName: company,
		});
		res.status(200).json(pay);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

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
		res.status(201).json(newPayInfo);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateEmployeePayInfo = async (req, res) => {
	const { id } = req.params;
	try {
		const pay = await EmployeePayInfo.findByIdAndUpdate(id, req.body, {
			new: true,
		});

		res.status(201).json(pay);
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
