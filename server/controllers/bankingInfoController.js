const EmployeeBankingInfo = require("../models/EmployeeBankingInfo");
const { deleteAlerts } = require("./payrollController");

const getAllBankingInfo = async (req, res) => {
	const { companyName } = req.params;
	try {
		const result = await EmployeeBankingInfo.find({
			companyName,
		}).sort({
			createdOn: -1,
		});

		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getEmployeeBankingInfo = async (req, res) => {
	const { companyName, empId } = req.params;
	try {
		const result = await findEmployeeBankingInfo(empId, companyName);
		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const findEmployeeBankingInfo = async (empId, companyName) =>
	await EmployeeBankingInfo.findOne({
		empId,
		companyName,
	});

const updateBankingInfo = async (id, data) =>
	await EmployeeBankingInfo.findByIdAndUpdate(id, data, {
		new: true,
	});

const addEmployeeBankingInfo = async (req, res) => {
	const {
		empId,
		companyName,
		directDeposit,
		bankNum,
		transitNum,
		accountNum,
		payStubSendByEmail,
		paymentEmail,
	} = req.body;
	try {
		const existingBankingInfo = await findEmployeeBankingInfo(
			empId,
			companyName,
		);
		if (bankNum !== "" || transitNum !== "" || accountNum !== "") {
			await deleteAlerts(empId);
		}
		if (existingBankingInfo) {
			const updatedBankingInfo = await updateBankingInfo(
				existingBankingInfo._id,
				req.body,
			);
			return res.status(201).json(updatedBankingInfo);
		}
		const newBankingInfo = await EmployeeBankingInfo.create({
			empId,
			companyName,
			directDeposit,
			bankNum,
			transitNum,
			accountNum,
			payStubSendByEmail,
			paymentEmail,
		});
		return res.status(201).json(newBankingInfo);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateEmployeeBankingInfo = async (req, res) => {
	const { id } = req.params;
	try {
		const updatedInfo = await updateBankingInfo(id, req.body);
		res.status(201).json(updatedInfo);
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
