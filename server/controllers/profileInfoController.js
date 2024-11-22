const Employee = require("../models/Employee");
const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");
const { addEmployee, hashedPassword } = require("./appController");
const { deleteAlerts } = require("./payrollController");
// const { addStatHolidayDefaultTimesheet } = require("./timesheetContoller");

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
		const result = await findEmployeeProfileInfo(empId, companyName);
		res.status(200).json(result);
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
	const employee = await Employee.findById(empId);

	if (password && password !== "") {
		employee.password = await hashedPassword(password);
	}
	if (personalEmail && personalEmail !== "") {
		employee.email = personalEmail;
	}

	const streetNumber = `${streetAddressSuite ?? ""} ${streetAddress ?? ""}`;
	if (streetNumber && streetNumber !== "") {
		employee.primaryAddress = {
			streetNumber,
			city,
			state: province,
			postalCode,
			country,
		};
	}

	await employee.save();
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
		};
		if (!empId && (firstName, companyName, lastName, birthDate)) {
			const existingProfileInfo = await EmployeeProfileInfo.findOne({
				firstName,
				companyName,
				lastName,
				birthDate,
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
				});
				await updateEmployee(existingProfileInfo?.empId, data);
				return res.status(201).json(updatedProfileInfo);
			}
			const newRecord = {
				firstName,
				middleName,
				lastName,
				role: "Employee",
				email: `${firstName}${Math.random().toFixed(2)}@mail.com`,
				fullName: `${firstName} ${middleName} ${lastName}`,
			};
			if (password) {
				newRecord.password = await hashedPassword(password);
			}
			const newEmployee = await addEmployee(companyName, newRecord);
			if (newEmployee) {
				const newProfileInfo = await EmployeeProfileInfo.create({
					companyName,
					firstName,
					middleName,
					lastName,
					birthDate,
					empId: newEmployee._id,
				});
				return res.status(201).json(newProfileInfo);
			}
		}
		const existingProfileInfo = await findEmployeeProfileInfo(empId, companyName);

		if (SIN !== "") {
			await deleteAlerts(empId);
		}

		await updateEmployee(empId, data);

		if (existingProfileInfo) {
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
};
