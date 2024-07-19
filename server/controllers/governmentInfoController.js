const EmployeeGovernmentInfo = require("../models/EmployeeGovernmentInfo");

const getAllGovernmentInfo = async (req, res) => {
	const { companyName } = req.params;
	try {
		const pay = await EmployeeGovernmentInfo.find({
			companyName,
		}).sort({
			createdOn: -1,
		});

		res.status(200).json(pay);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getEmployeeGovernmentInfo = async (req, res) => {
	const { company, empId } = req.params;
	try {
		const pay = await EmployeeGovernmentInfo.find({
			empId,
			companyName: company,
		});
		res.status(200).json(pay);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const addEmployeeGovernmentInfo = async (req, res) => {
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
		const newGovernmentInfo = await EmployeeGovernmentInfo.create({
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
		res.status(201).json(newGovernmentInfo);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateEmployeeGovernmentInfo = async (req, res) => {
	const { id } = req.params;
	try {
		const pay = await EmployeeGovernmentInfo.findByIdAndUpdate(id, req.body, {
			new: true,
		});

		res.status(201).json(pay);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = {
	getAllGovernmentInfo,
	getEmployeeGovernmentInfo,
	addEmployeeGovernmentInfo,
	updateEmployeeGovernmentInfo,
};
