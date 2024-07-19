const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");

const getAllEmploymentInfo = async (req, res) => {
	const { companyName } = req.params;
	try {
		const pay = await EmployeeEmploymentInfo.find({
			companyName,
		}).sort({
			createdOn: -1,
		});

		res.status(200).json(pay);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getEmployeeEmploymentInfo = async (req, res) => {
	const { company, empId } = req.params;
	try {
		const pay = await EmployeeEmploymentInfo.find({
			empId,
			companyName: company,
		});
		res.status(200).json(pay);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const addEmployeeEmploymentInfo = async (req, res) => {
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
		const newEmploymentInfo = await EmployeeEmploymentInfo.create({
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
		res.status(201).json(newEmploymentInfo);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateEmployeeEmploymentInfo = async (req, res) => {
	const { id } = req.params;
	try {
		const pay = await EmployeeEmploymentInfo.findByIdAndUpdate(id, req.body, {
			new: true,
		});

		res.status(201).json(pay);
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
