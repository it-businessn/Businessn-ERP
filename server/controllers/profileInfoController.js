const Employee = require("../models/Employee");
const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");
const { addEmployee } = require("./appController");
const { deleteAlerts } = require("./payrollController");
const { addStatHolidayDefaultTimesheet } = require("./timesheetContoller");

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

const addEmployeeProfileInfo = async (req, res) => {
	const {
		empId,
		companyName,
		payrollStatus,
		employeeNo,
		timeManagementBadgeID,
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
	} = req.body;
	try {
		if (!empId && (firstName, companyName, lastName, birthDate)) {
			const existingProfileInfo = await EmployeeProfileInfo.findOne({
				firstName,
				companyName,
				lastName,
				birthDate,
			});

			if (existingProfileInfo) {
				const updatedProfileInfo = await updateProfileInfo(
					existingProfileInfo._id,
					{
						streetAddress: `${streetAddressSuite} ${streetAddress}`,
						city,
						province,
						postalCode,
						country,
						payrollStatus,
						personalEmail,
						personalPhoneNum,
						employeeNo,
						timeManagementBadgeID,
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
					},
				);
				return res.status(201).json(updatedProfileInfo);
			}
			const newEmployee = await addEmployee(companyName, {
				firstName,
				middleName,
				lastName,
				role: "Employee",
				email: Math.random(),
				fullName: `${firstName} ${middleName} ${lastName}`,
			});
			if (newEmployee) {
				const newProfileInfo = await EmployeeProfileInfo.create({
					companyName,
					firstName,
					middleName,
					lastName,
					birthDate,
				});
				return res.status(201).json(newProfileInfo);
			}
		}
		const existingProfileInfo = await findEmployeeProfileInfo(
			empId,
			companyName,
		);

		if (SIN !== "") {
			await deleteAlerts(empId);
		}

		if (payrollStatus === "Payroll Active") {
			addStatHolidayDefaultTimesheet(empId, companyName);
		}

		const employee = await Employee.findById(empId);

		if (employee?.payrollStatus !== payrollStatus) {
			employee.payrollStatus = payrollStatus;
		}
		if (personalEmail) {
			employee.email = personalEmail;
		}
		if (employeeNo) {
			employee.employeeNo = employeeNo;
		}
		if (streetAddressSuite || streetAddress) {
			employee.primaryAddress = {
				streetNumber: `${streetAddressSuite} ${streetAddress}`,
				city,
				state: province,
				postalCode,
				country,
			};
		}

		await employee.save();

		if (existingProfileInfo) {
			const updatedProfileInfo = await updateProfileInfo(
				existingProfileInfo._id,
				req.body,
			);
			return res.status(201).json(updatedProfileInfo);
		}
		const newProfileInfo = await EmployeeProfileInfo.create({
			empId,
			companyName,
			payrollStatus,
			employeeNo,
			timeManagementBadgeID,
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
