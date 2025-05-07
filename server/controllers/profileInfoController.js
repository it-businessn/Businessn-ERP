const moment = require("moment");
const Employee = require("../models/Employee");
const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");
const { addEmployee, findCompany } = require("./appController");
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
		if (result) {
			if (!result?.SIN?.startsWith("*") && result?.SIN && result?.SINIv) {
				result.SIN = decryptData(result?.SIN, sin_key, result?.SINIv).replace(/.(?=.{3})/g, "*");
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
		password,
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
	const empEmail = businessEmail || personalEmail;
	const email = empEmail && empEmail !== "" ? empEmail : employee?.email;

	const empPassword = password && password !== "" ? password : employee?.password;
	const updatedObj = {
		password: empPassword,
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
			businessEmail,
			streetAddressSuite,
			streetAddress,
			city,
			province,
			postalCode,
			country,
			password,
			firstName,
			middleName,
			lastName,
			companyName,
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
					firstName,
					middleName,
					lastName,
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
					email: businessEmail || personalEmail,
					fullName: `${firstName} ${middleName} ${lastName}`,
				};
				if (password) {
					newRecord.password = password;
				}
				const newEmployee = await addEmployee(companyName, newRecord);
				profileInfoEmpId = newEmployee._id;
			}

			const newProfileInfo = await EmployeeProfileInfo.create({
				empId: profileInfoEmpId,
				companyName,
				firstName,
				middleName,
				lastName,
				emergencyFirstName,
				emergencyLastName,
				birthDate,
				SIN: req.body?.SIN || "",
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
		}
		const existingProfileInfo = await findEmployeeProfileInfo(empId, companyName);

		if (SIN && SIN !== "") {
			await deleteAlerts(empId);
		}
		await updateEmployee(empId, data);

		if (existingProfileInfo) {
			req.body.updatedOn = moment();

			if (SIN && SIN !== existingProfileInfo?.SIN) {
				const ENCRYPTION_KEY = Buffer.from(process.env.SIN_ENCRYPTION_KEY, "hex");
				const sinEncrypted = encryptData(SIN, ENCRYPTION_KEY);
				req.body.SIN = sinEncrypted.encryptedData;
				req.body.SINIv = sinEncrypted.iv;
			}
			if (req.body?._id) delete req.body._id;

			const updatedProfileInfo = await updateProfileInfo(existingProfileInfo._id, req.body);
			return res.status(201).json(updatedProfileInfo);
		}
		if (SIN) {
			const ENCRYPTION_KEY = Buffer.from(process.env.SIN_ENCRYPTION_KEY, "hex");
			const sinEncrypted = encryptData(SIN, ENCRYPTION_KEY);
			req.body.SIN = sinEncrypted.encryptedData;
			req.body.SINIv = sinEncrypted.iv;
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
			SIN: req.body?.SIN || "",
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
		if (req.body?._id) delete req.body._id;
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
