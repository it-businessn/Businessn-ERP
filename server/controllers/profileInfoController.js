const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");

const getAllProfileInfo = async (req, res) => {
	const { companyName } = req.params;
	try {
		const pay = await EmployeeProfileInfo.find({
			companyName,
		}).sort({
			createdOn: -1,
		});

		res.status(200).json(pay);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getEmployeeProfileInfo = async (req, res) => {
	const { company, empId } = req.params;
	try {
		const pay = await EmployeeProfileInfo.find({
			empId,
			companyName: company,
		});
		res.status(200).json(pay);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const addEmployeeProfileInfo = async (req, res) => {
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
		const newProfileInfo = await EmployeeProfileInfo.create({
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
		res.status(201).json(newProfileInfo);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateEmployeeProfileInfo = async (req, res) => {
	const { id } = req.params;
	try {
		const pay = await EmployeeProfileInfo.findByIdAndUpdate(id, req.body, {
			new: true,
		});

		res.status(201).json(pay);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = {
	getAllProfileInfo,
	getEmployeeProfileInfo,
	addEmployeeProfileInfo,
	updateEmployeeProfileInfo,
};
