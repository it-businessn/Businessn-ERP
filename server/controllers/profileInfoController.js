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
const CONFIG = require("../config");

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
		console.error("❌ getAllProfileInfo fetch error:", {
			message: error.message,
			stack: error.stack,
			companyName,
		});

		return res.status(500).json({
			message: "Internal server error",
		});
	}
};

const getEmployeeProfileInfo = async (req, res) => {
	try {
		const { companyName, empId } = req.params;

		const result = await findEmployeeProfileInfo(empId, companyName);
		if (result) {
			const isEncrypted = result?.SINIv && result?.SIN && !result.SIN.includes("*");

			if (isEncrypted) {
				result.SIN = decryptData(result?.SIN, CONFIG.SIN_KEY, result?.SINIv);
			}
			// optional masking (recommended for API responses)
			// if (result.SIN) {
			// 	result.SIN = result.SIN.replace(/.(?=.{4})/g, "*");
			// }
			return res.status(200).json(result);
		} else {
			const user = await Employee.findById(empId)
				.select("firstName middleName lastName email phoneNumber")
				.sort({
					createdOn: -1,
				});
			return res.status(200).json(user);
		}
	} catch (error) {
		console.error("❌ getEmployeeProfileInfo Employee SIN fetch error:", {
			message: error.message,
			stack: error.stack,
			empId,
			companyName,
		});

		return res.status(500).json({
			message: "Internal server error",
		});
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
	try {
		const employee = await Employee.findById(empId);
		if (!employee) {
			throw new Error("Employee not found");
		}
		const streetNumber = [streetAddressSuite, streetAddress].filter(Boolean).join(" ").trim();
		const primaryAddress = streetNumber
			? {
					streetNumber,
					city,
					state: province,
					postalCode,
					country,
				}
			: employee.primaryAddress;
		const empEmail = personalEmail || userEmail || businessEmail;

		const updatedObj = {
			primaryAddress,
			firstName,
			middleName,
			lastName,
			fullName: [firstName, middleName, lastName].filter(Boolean).join(" "),
			manager,
			phoneNumber,
		};
		if (empEmail && empEmail !== employee.email) {
			updatedObj.email = empEmail;
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
	} catch (error) {
		console.error("❌ Employee update error updateEmployee:", {
			message: error.message,
			stack: error.stack,
			empId,
			companyName,
		});
		throw error;
	}
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
		if (!companyName || !firstName || !lastName) {
			return res.status(400).json({
				message: "Missing required fields",
			});
		}
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
			streetAddress: [streetAddressSuite, streetAddress].filter(Boolean).join(" ").trim(),
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

		if (SIN && typeof SIN === "string" && !SIN.includes("*")) {
			const encrypted = encryptData(SIN, CONFIG.SIN_KEY);
			updatedData.SIN = encrypted.encryptedData;
			updatedData.SINIv = encrypted.iv;
		}

		if (existingProfileInfo) {
			const updatedProfileInfo = await updateProfileInfo(existingProfileInfo._id, updatedData);
			await updateEmployee(existingProfileInfo.empId, data);
			return res.status(200).json(updatedProfileInfo);
		}

		const email = personalEmail || userEmail || businessEmail;
		const existingEmp = await Employee.findOne({
			firstName,
			middleName,
			lastName,
			email,
		});

		let profileInfoEmpId = existingEmp?._id;

		if (!existingEmp) {
			const newEmployee = await addEmployee(companyName, {
				firstName,
				middleName,
				lastName,
				email,
				fullName: [firstName, middleName, lastName].filter(Boolean).join(" "),
				manager,
				phoneNumber: personalPhoneNum,
			});
			profileInfoEmpId = newEmployee._id;
		}

		updatedData.empId = profileInfoEmpId;
		const newProfileInfo = await EmployeeProfileInfo.create(updatedData);

		return res.status(201).json(newProfileInfo);
	} catch (error) {
		console.error("❌ addEmployeeProfileInfo Error:", {
			message: error.message,
			stack: error.stack,
			companyName,
			empId,
		});

		return res.status(500).json({
			message: "Internal server error",
		});
	}
};

const onBoardNewUser = async (req, res) => {
	try {
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
		if (!companyName || !personalInfo) {
			return res.status(400).json({
				message: "Missing required fields",
			});
		}

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
		console.error("❌ User creation onBoardNewUser failed:", {
			message: error.message,
			stack: error.stack,
			body: req.body,
		});

		return res.status(500).json({
			message: "Employee setup failed",
		});
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

		if (SIN && SIN !== "") {
			await deleteAlerts(empId, ALERTS_TYPE.SIN);
		}
		await updateEmployee(empId, data);

		const existingProfileInfo = await EmployeeProfileInfo.findById(id);
		if (!existingProfileInfo) {
			return res.status(404).json({
				message: "Profile not found",
			});
		}

		const { _id, ...updatedData } = req.body;

		if (SIN && typeof SIN === "string" && !SIN.includes("*")) {
			const encrypted = encryptData(SIN, CONFIG.SIN_KEY);
			updatedData.SIN = encrypted.encryptedData;
			updatedData.SINIv = encrypted.iv;
		}
		const updatedProfileInfo = await updateProfileInfo(existingProfileInfo._id, updatedData);
		return res.status(201).json(updatedProfileInfo);
	} catch (error) {
		console.error("❌ updateEmployeeProfileInfo error:", {
			message: error.message,
			stack: error.stack,
			id,
			empId,
			companyName,
		});

		return res.status(500).json({
			message: "Internal server error",
		});
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
