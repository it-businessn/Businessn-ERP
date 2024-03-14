const mongoose = require("mongoose");

// const User = require("../models/User");
const Employee = require("../models/Employee");
const EmployeeRole = require("../models/EmployeeRole");
const Department = require("../models/Department");
const EmploymentType = require("../models/EmploymentType");
const Company = require("../models/Company");
const bcrypt = require("bcrypt");

const getAllUsers = () => async (req, res) => {
	try {
		// const users = (await User.find()).sort((a, b) => b.createdOn - a.createdOn);
		const users = await User.find();
		res.status(200).json(users);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const loginUser = () => async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await Employee.findOne({ email });
		if (!user) {
			res.status(404).json({ error: "User does not exist" });
			return;
		}

		//check password pending
		// const match = await bcrypt.compare(password, password);
		// if (!match) {
		// 	res.status(404).json({ error: "Incorrect password" });
		// 	return;
		// }
		res.status(200).json(user);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const createEmployee = () => async (req, res) => {
	const {
		companyId,
		firstName,
		middleName,
		lastName,
		email,
		password,
		role,
		department,
		manager,
		phoneNumber,
		primaryAddress,
		employmentType,
	} = req.body;

	const { streetNumber, city, state, postalCode, country } = primaryAddress;

	try {
		const company = await Company.create({ name: "ABC Company" });

		const employeeRole = await EmployeeRole.create({ name: role });

		const newDepartment = await Department.create({ name: department });

		const newEmploymentType = await EmploymentType.create({
			name: employmentType,
		});

		const hashedPassword = await bcrypt.hash(password, 10);
		const employee = await Employee.create({
			employeeId: companyId,
			firstName,
			middleName,
			lastName,
			email,
			role,
			department,
			manager,
			phoneNumber,
			primaryAddress: { streetNumber, city, state, postalCode, country },
			employmentType,
			password: hashedPassword,
			fullName: `${firstName} ${middleName} ${lastName}`,
			// role: employeeRole._id,
			// department: department._id,
			// employmentType: employmentType._id,
		});
		employee.companyId = company._id;
		employee.save();
		res.status(201).json(employee);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const changePassword = () => async (req, res) => {
	const { newPassword } = req.body;
	const user = req.user;
	try {
		if (!newPassword) {
			throw new Error("New password is required");
		}
		const hashedPassword = bcrypt.hashSync(newPassword, 10);
		user.password = hashedPassword;
		const updatedUser = await User.findByIdAndUpdate(
			user[0]._id,
			{ password: hashedPassword },
			{
				new: true,
			},
		);
		res
			.status(201)
			.json({ message: "Password changed successfully", updatedUser });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateUser = () => async (req, res) => {
	const userId = req.params.id;
	try {
		const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
			new: true,
		});
		res.status(201).json(updatedUser);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateUserAssignedLeads = async (req, res) => {
	try {
		const leads = await Lead.find({ isDisbursed: true });
		const totalRecords = leads.length;
		const activeUsers = await User.find({ isActive: true });
		const totalWeight = activeUsers.reduce(
			(sum, item) => sum + item.assignedWeight,
			0,
		);
		for (const user of activeUsers) {
			const assignedLeads = Math.round(
				(user.assignedWeight / totalWeight) * totalRecords,
			);
			await User.findByIdAndUpdate(
				user._id,
				{ $set: { assignedLeads } },
				{ new: true },
			);
		}
		res.status(200).json({ message: "Updated successfully" });
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

module.exports = {
	changePassword,
	createEmployee,
	getAllUsers,
	loginUser,
	updateUser,
	updateUserAssignedLeads,
};
