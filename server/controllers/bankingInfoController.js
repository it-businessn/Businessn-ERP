const EmployeeBankingInfo = require("../models/EmployeeBankingInfo");
const { encryptData, decryptData } = require("../services/encryptDataService");
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
	const { company, employeeId } = req.params;
	try {
		const key = process.env.ENCRYPTION_KEY;
		// const updatedData = {
		// 	bankNum: null,
		// 	transitNum: null,
		// 	accountNum: null,
		// };
		// const updatedLeads = await EmployeeBankingInfo.updateMany({}, { $set: updatedData });

		const result = await findEmployeeBankingInfo(employeeId, company);

		const { _id, empId, companyName, directDeposit, payStubSendByEmail, paymentEmail } = result;
		const newData = {
			_id,
			empId,
			companyName,
			directDeposit,
			payStubSendByEmail,
			paymentEmail,
		};

		const accountNumber = result?.accountNum
			? decryptData(result.accountNum, key, result.accountIv).replace(/.(?=.{3})/g, "*")
			: "";
		const bankNumber = result?.bankNum
			? `**${decryptData(result.bankNum, key, result.bankIv).slice(-1)}`
			: "";
		const transitNumber = result?.transitNum
			? `***${decryptData(result.transitNum, key, result.transitIv).slice(-2)}`
			: "";

		newData.accountNum = accountNumber;
		newData.bankNum = bankNumber;
		newData.transitNum = transitNumber;

		res.status(200).json(newData);
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
	const { empId, companyName, directDeposit, payStubSendByEmail, paymentEmail } = req.body;
	const key = process.env.ENCRYPTION_KEY;
	try {
		const bankEncrypted = encryptData(req.body?.bankDetails?.bankNum, key);
		const transitEncrypted = encryptData(req.body?.bankDetails?.transitNum, key);
		const accountEncrypted = encryptData(req.body?.bankDetails?.accountNum, key);

		const existingBankingInfo = await findEmployeeBankingInfo(empId, companyName);
		// if (bankNum !== "" || transitNum !== "" || accountNum !== "") {
		// 	await deleteAlerts(empId);
		// }
		const updatedData = {
			empId,
			companyName,
			directDeposit,
			bankNum: bankEncrypted.encryptedData,
			bankIv: bankEncrypted.iv,
			transitNum: transitEncrypted.encryptedData,
			accountNum: accountEncrypted.encryptedData,
			accountIv: accountEncrypted.iv,
			transitIv: transitEncrypted.iv,
			payStubSendByEmail,
			paymentEmail,
		};
		if (existingBankingInfo) {
			const updatedBankingInfo = await updateBankingInfo(existingBankingInfo._id, updatedData);
			return res.status(201).json(updatedBankingInfo);
		}
		const newBankingInfo = await EmployeeBankingInfo.create(updatedData);
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
