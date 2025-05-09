const EmployeeBankingInfo = require("../models/EmployeeBankingInfo");
const { encryptData, decryptData } = require("../services/encryptDataService");
// const { saveKeyToEnv } = require("../services/fileService");
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
		// const updatedData = {
		// 	bankNum: null,
		// 	transitNum: null,
		// 	accountNum: null,
		// };
		// const updatedLeads = await EmployeeBankingInfo.updateMany({}, { $set: updatedData });

		const result = await findEmployeeBankingInfo(employeeId, company);

		const newData = {
			_id: result?._id,
			empId: result?.empId,
			companyName: result?.companyName,
			directDeposit: result?.directDeposit,
			payStubSendByEmail: result?.payStubSendByEmail,
			paymentEmail: result?.paymentEmail,
		};

		const banking_key = Buffer.from(process.env.BANKING_ENCRYPTION_KEY, "hex");

		if (!banking_key) {
			newData.accountNum = "";
			newData.bankNum = "";
			newData.transitNum = "";
			return res.status(200).json(newData);
		}

		const accountNumber = result?.accountNum
			? decryptData(result.accountNum, banking_key, result.accountIv).replace(/.(?=.{3})/g, "*")
			: "";

		const bankNumber = result?.bankNum
			? `**${decryptData(result.bankNum, banking_key, result.bankIv).slice(-1)}`
			: "";

		const transitNumber = result?.transitNum
			? `***${decryptData(result.transitNum, banking_key, result.transitIv).slice(-2)}`
			: "";

		newData.accountNum = accountNumber;
		newData.bankNum = bankNumber;
		newData.transitNum = transitNumber;

		return res.status(200).json(newData);
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
	const { empId, companyName, directDeposit, payStubSendByEmail, paymentEmail, bankDetails } =
		req.body;
	// const ENCRYPTION_KEY = newEncryptionKey;
	// saveKeyToEnv("BANKING_ENCRYPTION_KEY", ENCRYPTION_KEY);
	const ENCRYPTION_KEY = Buffer.from(process.env.BANKING_ENCRYPTION_KEY, "hex");

	const updatedData = {
		empId,
		companyName,
		directDeposit,
		payStubSendByEmail,
		paymentEmail,
	};
	try {
		if (
			bankDetails.bankNum &&
			bankDetails.transitNum &&
			bankDetails.accountNum &&
			bankDetails.bankNum !== "" &&
			bankDetails.transitNum !== "" &&
			bankDetails.accountNum !== ""
		) {
			await deleteAlerts(empId);
		}

		const existingBankingInfo = await findEmployeeBankingInfo(empId, companyName);

		if (existingBankingInfo) {
			const { bankNum, transitNum, accountNum } = bankDetails;

			if (bankNum && existingBankingInfo?.bankNum !== bankNum) {
				const bankEncrypted = encryptData(bankNum, ENCRYPTION_KEY);
				updatedData.bankNum = bankEncrypted.encryptedData;
				updatedData.bankIv = bankEncrypted.iv;
			}
			if (transitNum && existingBankingInfo?.transitNum !== transitNum) {
				const transitEncrypted = encryptData(transitNum, ENCRYPTION_KEY);
				updatedData.transitNum = transitEncrypted.encryptedData;
				updatedData.transitIv = transitEncrypted.iv;
			}
			if (accountNum && existingBankingInfo?.accountNum !== accountNum) {
				const accountEncrypted = encryptData(accountNum, ENCRYPTION_KEY);
				updatedData.accountNum = accountEncrypted.encryptedData;
				updatedData.accountIv = accountEncrypted.iv;
			}

			const updatedBankingInfo = await updateBankingInfo(existingBankingInfo._id, updatedData);
			return res.status(201).json(updatedBankingInfo);
		}
		if (bankDetails) {
			const { bankNum, transitNum, accountNum } = bankDetails;
			const bankEncrypted = encryptData(bankNum, ENCRYPTION_KEY);
			const transitEncrypted = encryptData(transitNum, ENCRYPTION_KEY);
			const accountEncrypted = encryptData(accountNum, ENCRYPTION_KEY);

			updatedData.bankNum = bankEncrypted.encryptedData;
			updatedData.bankIv = bankEncrypted.iv;

			updatedData.transitNum = transitEncrypted.encryptedData;
			updatedData.transitIv = transitEncrypted.iv;

			updatedData.accountNum = accountEncrypted.encryptedData;
			updatedData.accountIv = accountEncrypted.iv;
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
		if (req.body?._id) delete req.body._id;
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
