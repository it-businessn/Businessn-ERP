const moment = require("moment");
const { nanoid } = require("nanoid");
const Employee = require("../models/Employee");
const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");
const { addEmployee, findCompany } = require("./appController");
const { deleteAlerts } = require("./payrollController");
const { decryptData, encryptData } = require("../services/encryptDataService");
const { ALERTS_TYPE } = require("../services/data");
const Payout = require("../models/Payout");

const getAllProfileInfo = async (req, res) => {
	const { companyName } = req.params;
	try {
		const result = await EmployeeProfileInfo.find({
			companyName,
			isAffiliate: true,
		}).sort({
			createdOn: -1,
		});

		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getEmployeeProfileInfo = async (req, res) => {
	const { companyName, empId } = req.params;
	try {
		const sin_key = Buffer.from(process.env.SIN_ENCRYPTION_KEY, "hex");

		const result = await findEmployeeProfileInfo(empId, companyName);
		if (result) {
			if (!result?.SIN?.includes("*") && result?.SINIv && isNaN(Number(result?.SIN))) {
				result.SIN = decryptData(result?.SIN, sin_key, result?.SINIv).replace(/.(?=.{3})/g, "*");
			} else {
				result.SIN = result.SIN?.replace(/.(?=.{3})/g, "*") || "";
			}
			return res.status(200).json(result);
		}

		if (!result) {
			const user = await Employee.findById(empId)
				.select("firstName middleName lastName email phoneNumber")
				.sort({
					createdOn: -1,
				});
			return res.status(200).json(user);
		}
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const findEmployeeProfileInfo = async (empId, companyName) =>
	await EmployeeProfileInfo.findOne({
		empId,
		companyName,
	});

const updateProfileInfo = async (id, data) =>
	await EmployeeProfileInfo.findByIdAndUpdate(id, data, {
		new: true,
	});

const updateEmployee = async (empId, data) => {
	const {
		businessEmail,
		personalEmail,
		streetAddressSuite,
		streetAddress,
		city,
		province,
		postalCode,
		country,
		companyName,
		firstName,
		middleName,
		lastName,
	} = data;
	const streetNumber = `${streetAddressSuite || ""} ${streetAddress || ""}`;

	const employee = await Employee.findById(empId);

	const primaryAddress =
		streetNumber && streetNumber !== ""
			? {
					streetNumber,
					city,
					state: province,
					postalCode,
					country,
			  }
			: employee?.primaryAddress;
	const empEmail = personalEmail || businessEmail;
	const email = empEmail && empEmail !== "" ? empEmail : employee?.email;

	const updatedObj = {
		primaryAddress,
		updatedOn: moment(),
		firstName,
		middleName,
		lastName,
		fullName: `${firstName} ${middleName} ${lastName}`,
	};
	if (email === employee?.email) updatedObj.email = email;
	await Employee.findByIdAndUpdate(empId, updatedObj, {
		new: true,
	});
	const existingCompany = await findCompany("name", companyName);
	if (!existingCompany.employees.includes(empId)) existingCompany.employees.push(empId);
	await existingCompany.save();
};

const addAffiliateProfileInfo = async (req, res) => {
	const {
		firstName,
		lastName,
		email,
		contentToShare,
		marketingComms,
		insta,
		linkedIn,
		tiktok,
		youtube,
		province,
		country,
	} = req.body;
	try {
		const defaultCompany = process.env.DEFAULT_ORG;
		const existingProfileInfo = await EmployeeProfileInfo.findOne({
			companyName: defaultCompany,
			firstName,
			lastName,
			personalEmail: email,
			isAffiliate: true,
		});
		const updatedData = {
			companyName: defaultCompany,
			personalEmail: email,
			firstName,
			lastName,
			province,
			country,
			isAffiliate: true,
			contentToShare,
			marketingComms,
			insta,
			linkedIn,
			tiktok,
			youtube,
		};
		if (existingProfileInfo) {
			const updatedProfileInfo = await updateProfileInfo(existingProfileInfo._id, updatedData);
			// const data = {
			// 	personalEmail: email,
			// 	province,
			// 	country,
			// 	firstName,
			// 	lastName,
			// };
			// await updateEmployee(existingProfileInfo?.empId, data);
			return res.status(201).json(updatedProfileInfo);
		}
		const existingEmp = await Employee.findOne({
			firstName,
			lastName,
			companyName: defaultCompany,
		});
		let profileInfoEmpId = existingEmp?._id;
		if (!existingEmp) {
			const newRecord = {
				firstName,
				lastName,
				email,
				fullName: `${firstName} ${lastName}`,
			};
			const newEmployee = await addEmployee(defaultCompany, newRecord);
			profileInfoEmpId = newEmployee._id;
		}
		updatedData.empId = profileInfoEmpId;
		updatedData.affiliateCode = nanoid(8);
		const newProfileInfo = await EmployeeProfileInfo.create(updatedData);
		const referralLink = `${process.env.BASE_URL_LIVE}/ref=${newProfileInfo.affiliateCode}`;
		return res.status(201).json({ newProfileInfo, referralLink });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const addAffiliateSale = async (req, res) => {
	const { companyName, affiliate, amount, customerName, customerCode, saleId, status } = req.body;
	try {
		const affiliateCodeExists = await EmployeeProfileInfo.findOne({ affiliateCode: saleId });
		if (affiliateCodeExists) {
			const newPayout = await Payout.create({
				amount,
				saleId,
				companyName,
				affiliate,
				customerName,
				customerCode,
				status,
			});
			return res.status(201).json(newPayout);
		} else {
			return res.status(404).json({ error: "Affiliate not found" });
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateEmployeeProfileInfo = async (req, res) => {
	const { id } = req.params;
	try {
		const {
			empId,
			companyName,
			firstName,
			middleName,
			lastName,
			SIN,
			personalEmail,
			businessEmail,
			streetAddress,
			streetAddressSuite,
			city,
			province,
			country,
			postalCode,
		} = req.body;

		const data = {
			personalEmail,
			businessEmail,
			streetAddressSuite,
			streetAddress,
			city,
			province,
			postalCode,
			country,
			firstName,
			middleName,
			lastName,
			companyName,
		};

		const existingProfileInfo = await EmployeeProfileInfo.findById(id);
		if (SIN && SIN !== "") {
			await deleteAlerts(empId, ALERTS_TYPE.SIN);
		}
		await updateEmployee(empId, data);
		if (existingProfileInfo) {
			req.body.updatedOn = moment();
			if (SIN && !SIN.includes("*")) {
				const ENCRYPTION_KEY = Buffer.from(process.env.SIN_ENCRYPTION_KEY, "hex");
				const sinEncrypted = encryptData(SIN, ENCRYPTION_KEY);
				req.body.SIN = sinEncrypted.encryptedData;
				req.body.SINIv = sinEncrypted.iv;
			}
			if (req.body?._id) delete req.body._id;
			const updatedProfileInfo = await updateProfileInfo(existingProfileInfo._id, req.body);
			return res.status(201).json(updatedProfileInfo);
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = {
	getAllProfileInfo,
	getEmployeeProfileInfo,
	addAffiliateProfileInfo,
	addAffiliateSale,
	updateEmployeeProfileInfo,
	findEmployeeProfileInfo,
};
