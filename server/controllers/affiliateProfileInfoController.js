const { nanoid } = require("nanoid");

const Employee = require("../models/Employee");
const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");
const Payout = require("../models/Payout");

const { decryptData, shouldDecrypt } = require("../services/encryptDataService");
const { findEmployeeProfileInfo, updateProfileInfo } = require("./profileInfoController");
const CONFIG = require("../config/app.config");
const { COMPANIES } = require("../constants/constant");
const { addEmployee } = require("../services/userService");

const getAffiliateProfileInfo = async (req, res) => {
	const { companyName } = req.params;

	try {
		const result = await EmployeeProfileInfo.find({
			companyName,
			isAffiliate: true,
		})
			.sort({ createdOn: -1 })
			.lean();

		return res.status(200).json(result);
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

const getEmployeeProfileInfo = async (req, res) => {
	const { companyName, empId } = req.params;

	try {
		let result = await findEmployeeProfileInfo(empId, companyName);

		if (!result) {
			const user = await Employee.findById(empId)
				.select("firstName middleName lastName email phoneNumber")
				.lean();

			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}

			return res.status(200).json(user);
		}

		const safeResult = { ...result };

		let maskedSIN = "";

		try {
			if (shouldDecrypt(safeResult?.SIN, safeResult?.SINIv)) {
				maskedSIN = decryptData(safeResult.SIN, CONFIG.SIN_KEY, safeResult.SINIv);
			} else {
				maskedSIN = safeResult?.SIN || "";
			}
		} catch (e) {
			console.error("SIN decrypt failed:", e);
			maskedSIN = safeResult?.SIN || "";
		}

		safeResult.SIN = maskedSIN.replace(/.(?=.{4})/g, "*");

		return res.status(200).json(safeResult);
	} catch (error) {
		console.error(error);

		return res.status(500).json({
			message: "Internal Server Error",
			error: error.message,
		});
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

	const defaultCompany = COMPANIES.BUSINESSN_ORG;

	try {
		let profileInfoEmpId;

		const existingEmp = await Employee.findOne({ email });

		if (!existingEmp) {
			const newEmployee = await addEmployee(defaultCompany, {
				firstName,
				lastName,
				email,
				fullName: `${firstName} ${lastName}`,
			});
			profileInfoEmpId = newEmployee._id;
		} else {
			profileInfoEmpId = existingEmp._id;
		}

		let profile = await EmployeeProfileInfo.findOne({
			personalEmail: email,
			companyName: defaultCompany,
		});

		if (!profile) {
			profile = await EmployeeProfileInfo.create({
				companyName: defaultCompany,
				firstName,
				lastName,
				personalEmail: email,
				isAffiliate: true,
				empId: profileInfoEmpId,
				affiliateCode: nanoid(8),
			});

			const referralLink = `${CONFIG.BASE_URL_LIVE}/ref?code=${profile.affiliateCode}`;

			return res.status(201).json({ profile, referralLink });
		}

		const updatedProfile = await updateProfileInfo(profile._id, {
			province,
			country,
			contentToShare,
			marketingComms,
			insta,
			linkedIn,
			tiktok,
			youtube,
		});
		// const data = {
		// 	personalEmail: email,
		// 	province,
		// 	country,
		// 	firstName,
		// 	lastName,
		// };
		// await updateEmployee(existingProfileInfo?.empId, data);

		return res.status(200).json(updatedProfile);
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: "Internal Server Error",
			error: error.message,
		});
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
		console.error(error);
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
