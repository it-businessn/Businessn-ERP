const EmployeeBankingInfo = require("../models/EmployeeBankingInfo");
const { ALERTS_TYPE } = require("../services/data");
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

		const accountNumber =
			result?.accountNum && !result?.accountNum?.includes("*") && isNaN(Number(result?.accountNum))
				? decryptData(result.accountNum, banking_key, result.accountIv).replace(/.(?=.{3})/g, "*")
				: "";

		const bankNumber =
			result?.bankNum && !result?.bankNum?.includes("*") && isNaN(Number(result?.bankNum))
				? `**${decryptData(result.bankNum, banking_key, result.bankIv).slice(-1)}`
				: "";

		const transitNumber =
			result?.transitNum && !result?.transitNum?.includes("*") && isNaN(Number(result?.transitNum))
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
		const existingBankingInfo = await findEmployeeBankingInfo(empId, companyName);
		if (bankDetails) {
			const { bankNum, transitNum, accountNum } = bankDetails;

			if (!bankNum.includes("*") && !transitNum.includes("*") && !accountNum.includes("*")) {
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
		}
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
		const {
			empId,
			bankNum,
			transitNum,
			accountNum,
			paymentEmail,
			payStubSendByEmail,
			directDeposit,
		} = req.body;

		const existingInfo = await EmployeeBankingInfo.findById(id);
		const updatedData = {
			directDeposit,
			payStubSendByEmail,
			paymentEmail,
		};
		if (existingInfo) {
			if (
				bankNum &&
				transitNum &&
				accountNum &&
				bankNum !== "" &&
				transitNum !== "" &&
				accountNum !== ""
			) {
				await deleteAlerts(empId, ALERTS_TYPE.BANK);
			}
			if (!bankNum.includes("*") && !transitNum.includes("*") && !accountNum.includes("*")) {
				const ENCRYPTION_KEY = Buffer.from(process.env.BANKING_ENCRYPTION_KEY, "hex");
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

			const updatedInfo = await updateBankingInfo(id, updatedData);
			return res.status(201).json(updatedInfo);
		}
		return res.status(201).json("Record does not exist");
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
