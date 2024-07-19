const EmployeeBankingInfo = require("../models/EmployeeBankingInfo");

const getAllBankingInfo = async (req, res) => {
	const { companyName } = req.params;
	try {
		const pay = await EmployeeBankingInfo.find({
			companyName,
		}).sort({
			createdOn: -1,
		});

		res.status(200).json(pay);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getEmployeeBankingInfo = async (req, res) => {
	const { company, empId } = req.params;
	try {
		const pay = await EmployeeBankingInfo.find({
			empId,
			companyName: company,
		});
		res.status(200).json(pay);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const addEmployeeBankingInfo = async (req, res) => {
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
		const newBankingInfo = await EmployeeBankingInfo.create({
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
		res.status(201).json(newBankingInfo);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateEmployeeBankingInfo = async (req, res) => {
	const { id } = req.params;
	try {
		const pay = await EmployeeBankingInfo.findByIdAndUpdate(id, req.body, {
			new: true,
		});

		res.status(201).json(pay);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = {
	getAllBankingInfo,
	getEmployeeBankingInfo,
	addEmployeeBankingInfo,
	updateEmployeeBankingInfo,
};
