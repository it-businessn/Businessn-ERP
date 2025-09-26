const { nanoid } = require("nanoid");

const Employee = require("../models/Employee");
const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");
const Payout = require("../models/Payout");

const { decryptData } = require("../services/encryptDataService");
const { COMPANIES } = require("../services/data");
const { addEmployee } = require("../helpers/userHelper");
const { findEmployeeProfileInfo, updateProfileInfo } = require("./profileInfoController");

const getAffiliateProfileInfo = async (req, res) => {
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
		const defaultCompany = COMPANIES.BUSINESSN_ORG;
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

module.exports = {
	getAffiliateProfileInfo,
	getEmployeeProfileInfo,
	addAffiliateProfileInfo,
	addAffiliateSale,
	findEmployeeProfileInfo,
};
