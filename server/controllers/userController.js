const mongoose = require("mongoose");

// const User = require("../models/User");
const Employee = require("../models/Employee");
const EmployeeRole = require("../models/EmployeeRole");
const Department = require("../models/Department");
const EmploymentType = require("../models/EmploymentType");
const Company = require("../models/Company");
const bcrypt = require("bcrypt");
const Lead = require("../models/Lead");
const Group = require("../models/Group");

const getAllUsers = () => async (req, res) => {
	try {
		// const users = (await User.find()).sort((a, b) => b.createdOn - a.createdOn);
		const users = await Employee.find();
		res.status(200).json(users);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getAllMemberGroups = () => async (req, res) => {
	try {
		const group = await Group.find({
			"members._id": req.params.id,
		});

		res.status(200).json(group);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getAllManagers = () => async (req, res) => {
	try {
		const users = await Employee.find({
			role: { $regex: /manager|administrator/i },
		});
		res.status(200).json(users);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const loginUser = () => async (req, res) => {
	const { email, password } = req.body;
	const user = await Employee.findOne({ email });
	if (!user) {
		return res.status(500).json({ error: "User does not exist" });
	}
	try {
		// const match = await bcrypt.compare(password, user.password);
		// return match
		// 	? res.json({ message: "Login successful", user })
		// 	: res.status(401).json({ error: "Invalid password" });
		res.json({ message: "Login successful", user });
	} catch (error) {
		console.error("Error checking password:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

const createEmployee = () => async (req, res) => {
	const {
		company,
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
		baseModule,
	} = req.body;

	const { streetNumber, city, state, postalCode, country } = primaryAddress;

	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		const employee = await Employee.create({
			companyId: company,
			employeeId: companyId,
			firstName,
			middleName,
			lastName,
			email,
			role,
			department,
			baseModule,
			manager,
			phoneNumber,
			primaryAddress: { streetNumber, city, state, postalCode, country },
			employmentType,
			password: hashedPassword,
			fullName: `${firstName} ${middleName} ${lastName}`,
		});
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
		const updatedUser = await Employee.findByIdAndUpdate(userId, req.body, {
			new: true,
		});

		res.status(201).json(updatedUser);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateUserAssignedLeads = async (req, res) => {
	try {
		const leads = await Lead.find({
			isDisbursed: true,
			isDisbursedConfirmed: false,
		});
		const totalRecords = leads.length;
		const activeUsers = await Employee.find({ isActive: true });
		const totalWeight = activeUsers.reduce(
			(sum, item) => sum + item.assignedWeight,
			0,
		);
		for (const user of activeUsers) {
			const assignedLeads = Math.round(
				(user.assignedWeight / totalWeight) * totalRecords,
			);
			await Employee.findByIdAndUpdate(
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
	getAllManagers,
	loginUser,
	updateUser,
	updateUserAssignedLeads,
	getAllMemberGroups,
};
