const CONFIG = require("../config/app.config");
const { ALERTS_TYPE } = require("../constants/pay.constants");
const EmployeeBankingInfo = require("../models/EmployeeBankingInfo");
const { encryptData, decryptData, shouldDecrypt } = require("../services/encryptDataService");
const { deleteAlerts } = require("./alertsController");
// const { saveKeyToEnv } = require("../services/fileService");

const BANKING_ENCRYPTION_KEY = CONFIG.BANKING_KEY;
const getAllBankingInfo = async (req, res) => {
	const { companyName } = req.params;
	try {
		const result = await EmployeeBankingInfo.find({
			companyName,
		}).sort({
			createdOn: -1,
		});

		return res.status(200).json(result);
	} catch (error) {
		console.error("❌ Error getAllBankingInfo:", {
			message: error.message,
			stack: error.stack,
			params: req.params,
		});

		return res.status(500).json({
			message: "Internal Server Error while fetching banking info",
		});
	}
};

const getEmployeeBankingInfo = async (req, res) => {
	try {
		// const updatedData = {
		// 	bankNum: null,
		// 	transitNum: null,
		// 	accountNum: null,
		// };
		// const updatedLeads = await EmployeeBankingInfo.updateMany({}, { $set: updatedData });

		const { company, employeeId } = req.params;
		const result = await findEmployeeBankingInfo(employeeId, company);

		if (!result) {
			return res.status(404).json({ message: "Record not found!" });
		}

		const newData = {
			_id: result._id,
			empId: result.empId,
			companyName: result.companyName,
			directDeposit: result.directDeposit,
			payStubSendByEmail: result.payStubSendByEmail,
			paymentEmail: result.paymentEmail,
		};

		if (!BANKING_ENCRYPTION_KEY) {
			console.error("❌ Missing BANKING_ENCRYPTION_KEY");

			newData.accountNum = "";
			newData.bankNum = "";
			newData.transitNum = "";
			return res.status(200).json(newData);
		}
		// SAFE DECRYPT FUNCTION
		const safeDecrypt = (value, iv, label) => {
			try {
				if (shouldDecrypt(value, iv)) return decryptData(value, BANKING_ENCRYPTION_KEY, iv);
			} catch (err) {
				console.error(`❌ Decryption failed for ${label}`, {
					message: err.message,
					value,
					iv,
				});
				return "";
			}
		};
		// console.log("RAW DB DATA", {
		// 	accountNum: result.accountNum,
		// });
		newData.accountNum = safeDecrypt(result.accountNum, result.accountIv, "accountNum");
		newData.bankNum = safeDecrypt(result.bankNum, result.bankIv, "bankNum");
		newData.transitNum = safeDecrypt(result.transitNum, result.transitIv, "transitNum");

		console.log("✅ Banking info fetched", {
			employeeId,
			company,
		});

		return res.status(200).json(newData);
	} catch (error) {
		console.error("❌ getEmployeeBankingInfo ERROR", {
			message: error.message,
			stack: error.stack,
			params: req.params,
		});

		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

const findEmployeeBankingInfo = async (empId, companyName) =>
	await EmployeeBankingInfo.findOne({
		empId,
		companyName,
	});

const updateBankingInfo = async (id, data) =>
	await EmployeeBankingInfo.findByIdAndUpdate(
		id,
		{ $set: data },
		{
			new: true,
		},
	);

const addEmployeeBankingInfo = async (req, res) => {
	const start = Date.now();
	try {
		const { empId, companyName, directDeposit, payStubSendByEmail, paymentEmail, bankDetails } =
			req.body;
		// const ENCRYPTION_KEY = newEncryptionKey;
		// saveKeyToEnv("BANKING_ENCRYPTION_KEY", ENCRYPTION_KEY);

		const updatedData = {
			empId,
			companyName,
			directDeposit,
			payStubSendByEmail,
			paymentEmail,
		};

		const existingBankingInfo = await findEmployeeBankingInfo(empId, companyName);
		if (bankDetails) {
			let { bankNum, transitNum, accountNum } = bankDetails;
			// normalize to string (VERY important)
			bankNum = bankNum?.toString();
			transitNum = transitNum?.toString();
			accountNum = accountNum?.toString();
			if (
				bankNum &&
				transitNum &&
				accountNum &&
				!bankNum.includes("*") &&
				!transitNum.includes("*") &&
				!accountNum.includes("*")
			) {
				const bankEncrypted = encryptData(bankNum, BANKING_ENCRYPTION_KEY);
				const transitEncrypted = encryptData(transitNum, BANKING_ENCRYPTION_KEY);
				const accountEncrypted = encryptData(accountNum, BANKING_ENCRYPTION_KEY);
				Object.assign(updatedData, {
					bankNum: bankEncrypted.encryptedData,
					bankIv: bankEncrypted.iv,
					transitNum: transitEncrypted.encryptedData,
					transitIv: transitEncrypted.iv,
					accountNum: accountEncrypted.encryptedData,
					accountIv: accountEncrypted.iv,
				});
			}
		}
		let result;

		if (existingBankingInfo) {
			result = await updateBankingInfo(existingBankingInfo._id, updatedData);
		} else {
			result = await EmployeeBankingInfo.create(updatedData);
		}
		console.log("✅ Banking info saved", {
			empId,
			companyName,
			timeMs: Date.now() - start,
		});
		return res.status(201).json(result);
	} catch (error) {
		console.error("❌ addEmployeeBankingInfo ERROR", {
			message: error.message,
			stack: error.stack,
			body: req.body,
			time: new Date().toISOString(),
		});

		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

const updateEmployeeBankingInfo = async (req, res) => {
	const start = Date.now();
	try {
		const { id } = req.params;
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
		if (!existingInfo) {
			return res.status(404).json({ message: "Record does not exist" });
		}
		let updatedData = {
			directDeposit,
			payStubSendByEmail,
			paymentEmail,
		};
		let b = bankNum?.toString();
		let t = transitNum?.toString();
		let a = accountNum?.toString();
		if (b && t && a && b !== "" && t !== "" && a !== "") {
			await deleteAlerts(empId, ALERTS_TYPE.BANK);
		}
		if (b && t && a && !b.includes("*") && !t.includes("*") && !a.includes("*")) {
			const bankEncrypted = encryptData(b, BANKING_ENCRYPTION_KEY);
			const transitEncrypted = encryptData(t, BANKING_ENCRYPTION_KEY);
			const accountEncrypted = encryptData(a, BANKING_ENCRYPTION_KEY);
			Object.assign(updatedData, {
				bankNum: bankEncrypted.encryptedData,
				bankIv: bankEncrypted.iv,
				transitNum: transitEncrypted.encryptedData,
				transitIv: transitEncrypted.iv,
				accountNum: accountEncrypted.encryptedData,
				accountIv: accountEncrypted.iv,
			});
		}

		const updatedInfo = await updateBankingInfo(id, updatedData);
		console.log("✅ Banking info updated", {
			id,
			empId,
			timeMs: Date.now() - start,
		});

		return res.status(200).json(updatedInfo);
	} catch (error) {
		console.error("❌ updateEmployeeBankingInfo ERROR", {
			message: error.message,
			stack: error.stack,
			body: req.body,
			params: req.params,
		});

		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

module.exports = {
	getAllBankingInfo,
	getEmployeeBankingInfo,
	addEmployeeBankingInfo,
	updateEmployeeBankingInfo,
};
