const moment = require("moment");

const Employee = require("../models/Employee");
const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");

const { decryptData, encryptData } = require("../services/encryptDataService");
const { ALERTS_TYPE } = require("../services/data");
const {
	addNewUser,
	addUserEmploymentInfo,
	addUserPayInfo,
	addUserGovtInfo,
	addUserBenefitInfo,
	addUserBankInfo,
} = require("./empDataController");
const { findCompany, addEmployee } = require("../helpers/userHelper");
const { deleteAlerts } = require("./alertsController");

const getAllProfileInfo = async (req, res) => {
	const { companyName } = req.params;
	try {
		const result = await EmployeeProfileInfo.find({
			companyName,
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
		if (result) {
			if (!result?.SIN?.includes("*") && result?.SINIv && isNaN(Number(result?.SIN))) {
				result.SIN = decryptData(result?.SIN, sin_key, result?.SINIv);
			}
			result.SIN = result.SIN?.replace(/.(?=.{3})/g, "*") || "";
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
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const findEmployeeProfileInfo = async (empId, companyName) =>
	await EmployeeProfileInfo.findOne({
		empId,
		companyName,
	});

const updateProfileInfo = async (id, data) =>
	await EmployeeProfileInfo.findByIdAndUpdate(
		id,
		{ $set: data },
		{
			new: true,
		},
	);

const updateEmployee = async (empId, data) => {
	const {
		userEmail,
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
		manager,
		phoneNumber,
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
	const empEmail = personalEmail || userEmail || businessEmail;
	const newEmail = empEmail && empEmail !== "" ? empEmail : employee?.email;

	const updatedObj = {
		primaryAddress,
		firstName,
		middleName,
		lastName,
		fullName: `${firstName} ${middleName} ${lastName}`,
		manager,
		phoneNumber,
	};
	if (newEmail !== employee?.email) {
		updatedObj.email = newEmail;
	}
	await Employee.findByIdAndUpdate(
		empId,
		{ $set: updatedObj },
		{
			new: true,
		},
	);
	const existingCompany = await findCompany("name", companyName);
	if (!existingCompany.employees.includes(empId)) existingCompany.employees.push(empId);
	await existingCompany.save();
};

const addEmployeeProfileInfo = async (req, res) => {
	const {
		companyName,
		firstName,
		middleName,
		lastName,
		emergencyFirstName,
		emergencyLastName,
		birthDate,
		SIN,
		maritalStatus,
		citizenship,
		workPermitNo,
		workPermitExpiryNo,
		userEmail,
		personalEmail,
		personalPhoneNum,
		businessEmail,
		businessPhoneNum,
		emergencyPersonalEmail,
		emergencyPersonalPhoneNum,
		streetAddress,
		streetAddressSuite,
		city,
		province,
		country,
		postalCode,
		manager,
	} = req.body;
	try {
		const data = {
			userEmail,
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
			manager,
			phoneNumber: personalPhoneNum,
		};
		const existingProfileInfo = await EmployeeProfileInfo.findOne({
			firstName,
			companyName,
			lastName,
			userEmail,
		});
		const updatedData = {
			streetAddress: `${streetAddressSuite ?? ""} ${streetAddress}`,
			city,
			manager,
			province,
			postalCode,
			country,
			emergencyFirstName,
			emergencyLastName,
			birthDate,
			maritalStatus,
			citizenship,
			workPermitNo,
			workPermitExpiryNo,
			userEmail,
			personalEmail,
			personalPhoneNum,
			businessEmail,
			businessPhoneNum,
			emergencyPersonalEmail,
			emergencyPersonalPhoneNum,
			firstName,
			middleName,
			lastName,
		};
		if (SIN && !SIN.includes("*")) {
			const ENCRYPTION_KEY = Buffer.from(process.env.SIN_ENCRYPTION_KEY, "hex");
			const sinEncrypted = encryptData(SIN, ENCRYPTION_KEY);
			updatedData.SIN = sinEncrypted.encryptedData;
			updatedData.SINIv = sinEncrypted.iv;
		}
		if (existingProfileInfo) {
			const updatedProfileInfo = await updateProfileInfo(existingProfileInfo._id, updatedData);
			await updateEmployee(existingProfileInfo?.empId, data);
			return res.status(201).json(updatedProfileInfo);
		}
		const existingEmp = await Employee.findOne({
			firstName,
			middleName,
			lastName,
			email: personalEmail || userEmail || businessEmail,
		});
		let profileInfoEmpId = existingEmp?._id;
		if (!existingEmp) {
			const newRecord = {
				firstName,
				middleName,
				lastName,
				email: personalEmail || userEmail || businessEmail,
				fullName: `${firstName} ${middleName} ${lastName}`,
				manager,
				phoneNumber: personalPhoneNum,
			};
			const newEmployee = await addEmployee(companyName, newRecord);
			profileInfoEmpId = newEmployee._id;
		}
		updatedData.empId = profileInfoEmpId;
		const newProfileInfo = await EmployeeProfileInfo.create(updatedData);
		return res.status(201).json(newProfileInfo);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const onBoardNewUser = async (req, res) => {
	const {
		companyName,
		bankingInfo,
		benefitsInfo,
		contactInfo,
		emergencyContact,
		employmentInfo,
		governmentInfo,
		payInfo,
		personalInfo,
	} = req.body;
	try {
		const newUserID = await addNewUser(
			companyName,
			personalInfo,
			contactInfo,
			emergencyContact,
			req.body?.isAffiliate,
		);
		const newEmpPosition = await addUserEmploymentInfo(newUserID, companyName, employmentInfo);
		const newPayInfo = await addUserPayInfo(newUserID, companyName, payInfo, newEmpPosition);
		const newGovtContributionInfo = await addUserGovtInfo(newUserID, companyName, governmentInfo);
		const newBenefitContributionInfo = await addUserBenefitInfo(
			newUserID,
			companyName,
			benefitsInfo,
		);
		const newUserBankingInfo = await addUserBankInfo(newUserID, companyName, bankingInfo);

		return res.status(201).json({
			newUserID,
			newEmpPosition,
			newPayInfo,
			newGovtContributionInfo,
			newBenefitContributionInfo,
			newUserBankingInfo,
		});
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
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
			userEmail,
			personalEmail,
			businessEmail,
			streetAddress,
			streetAddressSuite,
			city,
			province,
			country,
			postalCode,
			manager,
			personalPhoneNum,
		} = req.body;

		const data = {
			userEmail,
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
			manager,
			phoneNumber: personalPhoneNum,
		};

		const existingProfileInfo = await EmployeeProfileInfo.findById(id);
		if (SIN && SIN !== "") {
			await deleteAlerts(empId, ALERTS_TYPE.SIN);
		}
		await updateEmployee(empId, data);
		if (existingProfileInfo) {
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
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

module.exports = {
	getAllProfileInfo,
	getEmployeeProfileInfo,
	addEmployeeProfileInfo,
	onBoardNewUser,
	updateEmployeeProfileInfo,
	findEmployeeProfileInfo,
	updateProfileInfo,
};
