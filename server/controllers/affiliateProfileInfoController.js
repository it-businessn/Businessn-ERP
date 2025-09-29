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

		return res.status(200).json(result);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getEmployeeProfileInfo = async (req, res) => {
	const { companyName, empId } = req.params;
	try {
		const sin_key = Buffer.from(process.env.SIN_ENCRYPTION_KEY, "hex");

		const result = await findEmployeeProfileInfo(empId, companyName);

		if (!result) {
			const user = await Employee.findById(empId)
				.select("firstName middleName lastName email phoneNumber")
				.sort({
					createdOn: -1,
				});
			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}
			return res.status(200).json(user);
		}
		if (result) {
			result.SIN =
				!result?.SIN?.includes("*") && result?.SINIv && isNaN(Number(result?.SIN))
					? decryptData(result?.SIN, sin_key, result?.SINIv).replace(/.(?=.{3})/g, "*")
					: result.SIN?.replace(/.(?=.{3})/g, "*") || "";
			return res.status(200).json(result);
		}
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
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
		const updatedData = {
			companyName: defaultCompany,
			firstName,
			lastName,
			personalEmail: email,
			isAffiliate: true,
		};
		const existingProfileInfo = await EmployeeProfileInfo.findOne(updatedData);
		if (!existingProfileInfo) {
			const existingEmp = await Employee.findOne({
				email,
			});
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
			let profileInfoEmpId = existingEmp?._id;
			updatedData.empId = profileInfoEmpId;
			updatedData.affiliateCode = nanoid(8);
			const newProfileInfo = await EmployeeProfileInfo.create(updatedData);
			const referralLink = `${process.env.BASE_URL_LIVE}/ref=${newProfileInfo.affiliateCode}`;
			return res.status(201).json({ newProfileInfo, referralLink });
		}

		updatedData.province = province;
		updatedData.country = country;
		updatedData.contentToShare = contentToShare;
		updatedData.marketingComms = marketingComms;
		updatedData.insta = insta;
		updatedData.linkedIn = linkedIn;
		updatedData.tiktok = tiktok;
		updatedData.youtube = youtube;

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
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const addAffiliateSale = async (req, res) => {
	const { companyName, affiliate, amount, customerName, customerCode, saleId, status } = req.body;
	try {
		const affiliateCodeExists = await EmployeeProfileInfo.findOne({ affiliateCode: saleId });
		const data = {
			amount,
			saleId,
			companyName,
			affiliate,
			customerName,
			customerCode,
			status,
		};
		if (affiliateCodeExists) {
			const existingRecord = await Payout.findOne(data);
			if (existingRecord) {
				return res.status(409).json({ message: "Payout already exists" });
			}
			const newPayout = await Payout.create(data);
			return res.status(201).json(newPayout);
		} else {
			return res.status(404).json({ message: "Affiliate not found" });
		}
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

module.exports = {
	getAffiliateProfileInfo,
	getEmployeeProfileInfo,
	addAffiliateProfileInfo,
	addAffiliateSale,
	findEmployeeProfileInfo,
};
