const moment = require("moment");
const Employee = require("../models/Employee");
const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");
const { addEmployee } = require("./appController");
const { deleteAlerts } = require("./payrollController");
const { decryptData, encryptData } = require("../services/encryptDataService");

const getAllProfileInfo = async (req, res) => {
	const { companyName } = req.params;
	try {
		const result = await EmployeeProfileInfo.find({
			companyName,
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
		const SIN =
			result?.SIN && result?.SINIv
				? decryptData(result?.SIN, sin_key, result?.SINIv).replace(/.(?=.{3})/g, "*")
				: "";

		result.SIN = SIN;
		if (!result || !sin_key) {
			const user = await Employee.findById(empId)
				.select("firstName middleName lastName email phoneNumber")
				.sort({
					createdOn: -1,
				});
			return res.status(200).json(user);
		}
		return res.status(200).json(result);
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
		personalEmail,
		streetAddressSuite,
		streetAddress,
		city,
		province,
		postalCode,
		country,
		password,
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
	const email = personalEmail && personalEmail !== "" ? personalEmail : employee?.email;
	const empPassword = password && password !== "" ? password : employee?.password;

	await Employee.findByIdAndUpdate(
		empId,
		{ password: empPassword, email, primaryAddress, updatedOn: moment() },
		{
			new: true,
		},
	);
};

const addEmployeeProfileInfo = async (req, res) => {
	const {
		empId,
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
		password,
	} = req.body;
	try {
		const data = {
			personalEmail,
			streetAddressSuite,
			streetAddress,
			city,
			province,
			postalCode,
			country,
			password,
			firstName,
			lastName,
		};
		if (!empId && firstName && companyName && lastName) {
			const existingProfileInfo = await EmployeeProfileInfo.findOne({
				firstName,
				companyName,
				lastName,
			});

			if (existingProfileInfo) {
				const updatedProfileInfo = await updateProfileInfo(existingProfileInfo._id, {
					streetAddress: `${streetAddressSuite ?? ""} ${streetAddress}`,
					city,
					province,
					postalCode,
					country,
					personalEmail,
					personalPhoneNum,
					emergencyFirstName,
					emergencyLastName,
					birthDate,
					SIN,
					maritalStatus,
					citizenship,
					workPermitNo,
					workPermitExpiryNo,
					personalEmail,
					personalPhoneNum,
					businessEmail,
					businessPhoneNum,
					emergencyPersonalEmail,
					emergencyPersonalPhoneNum,
					password,
				});
				await updateEmployee(existingProfileInfo?.empId, data);
				return res.status(201).json(updatedProfileInfo);
			}
			const existingEmp = await Employee.findOne({
				firstName,
				lastName,
			});
			let profileInfoEmpId = existingEmp?._id;
			if (!existingEmp) {
				const newRecord = {
					firstName,
					middleName,
					lastName,
					email: `${firstName}${Math.random().toFixed(2)}@mail.com`,
					fullName: `${firstName} ${middleName} ${lastName}`,
				};
				if (password) {
					newRecord.password = password;
				}
				const newEmployee = await addEmployee(companyName, newRecord);
				profileInfoEmpId = newEmployee._id;
			}

			const newProfileInfo = await EmployeeProfileInfo.create({
				companyName,
				firstName,
				middleName,
				lastName,
				birthDate,
				empId: profileInfoEmpId,
				password,
			});
			return res.status(201).json(newProfileInfo);
		}
		const existingProfileInfo = await findEmployeeProfileInfo(empId, companyName);

		if (SIN !== "") {
			await deleteAlerts(empId);
		}

		const ENCRYPTION_KEY = Buffer.from(process.env.SIN_ENCRYPTION_KEY, "hex");
		await updateEmployee(empId, data);

		if (existingProfileInfo) {
			req.body.updatedOn = moment();
			const sinEncrypted = encryptData(SIN, ENCRYPTION_KEY);
			req.body.SIN = sinEncrypted.encryptedData;
			req.body.SINIv = sinEncrypted.iv;
			const updatedProfileInfo = await updateProfileInfo(existingProfileInfo._id, req.body);
			return res.status(201).json(updatedProfileInfo);
		}
		const newProfileInfo = await EmployeeProfileInfo.create({
			empId,
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
			personalEmail,
			personalPhoneNum,
			businessEmail,
			businessPhoneNum,
			emergencyPersonalEmail,
			emergencyPersonalPhoneNum,
			streetAddress,
			city,
			province,
			country,
			postalCode,
			password,
		});
		return res.status(201).json(newProfileInfo);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateEmployeeProfileInfo = async (req, res) => {
	const { id } = req.params;
	try {
		const updatedInfo = await updateProfileInfo(id, req.body);
		res.status(201).json(updatedInfo);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = {
	getAllProfileInfo,
	getEmployeeProfileInfo,
	addEmployeeProfileInfo,
	updateEmployeeProfileInfo,
	findEmployeeProfileInfo,
};
