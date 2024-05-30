// const User = require("../models/User");
const bcrypt = require("bcrypt");
const Employee = require("../models/Employee");
const Company = require("../models/Company");
const Group = require("../models/Group");
const jwt = require("jsonwebtoken");
const Lead = require("../models/Lead");
const mongoose = require("mongoose");
const sendEmail = require("../emailService/sendEmail");
const Task = require("../models/Task");

const createToken = (_id) => {
	return jwt.sign({ _id }, process.env.JWT_SECRET_KEY, { expiresIn: "3d" });
};

const getAllUsers = () => async (req, res) => {
	try {
		// const users = (await User.find()).sort((a, b) => b.createdOn - a.createdOn);
		const users = await Employee.find({});
		res.status(200).json(users);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getAllEmployeesByRole = () => async (req, res) => {
	try {
		const tasksByEmployee = await Task.aggregate([
			{
				$group: {
					_id: "$selectedAssignees",
					tasks: {
						$push: {
							taskName: "$taskName",
						},
					},
				},
			},
		]);
		const users = await Employee.aggregate([
			{
				$group: {
					_id: "$role",
					employees: {
						$push: {
							fullName: "$fullName",
							id: "$_id",
							tasks: {
								$reduce: {
									input: tasksByEmployee,
									initialValue: [],
									in: {
										$cond: {
											if: { $in: ["$fullName", "$$this._id"] }, // if employee name is in the selectedAssignees of the task
											then: { $concatArrays: ["$$value", "$$this.tasks"] }, // Merge tasks arrays
											else: "$$value", // default value
										},
									},
								},
							},
						},
					},
				},
			},
		]);
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

const getAllSalesAgents = () => async (req, res) => {
	try {
		const users = await Employee.find({
			role: {
				$not: {
					$regex: /manager|administrator/i,
				},
			},
		});
		res.status(200).json(users);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const loginUser = () => async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await Employee.findOne({ email }).populate({
			path: "companyId",
			model: "Company",
			select: "name",
		});

		if (!user) {
			return res.status(500).json({ error: "User does not exist" });
		}
		// return res.json({ message: "Login successful", user });
		const match = await bcrypt.compare(password, user.password);
		return match
			? res.json({ message: "Login successful", user })
			: res.status(401).json({ error: "Invalid password" });
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

	// const updatedData = { companyId: "6646b03e96dcdc0583fb5dca" };for fd
	// const updatedLeads = await Employee.updateMany({}, { $set: updatedData });
	// console.log(updatedLeads);

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

		const existingCompany = await Company.findById(company);
		existingCompany.employees.push(employee._id);
		await existingCompany.save();

		res.status(201).json(employee);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const forgotPassword = () => async (req, res) => {
	const { email } = req.body;
	try {
		const user = await Employee.findOne({ email });
		if (!user) {
			return res.status(404).json({
				error: "Email not found! Please enter your registered email address.",
			});
		}
		const token = createToken(user._id);

		const link = `${process.env.BASE_URL_LIVE}/api/reset-password/${user._id}/${token}`;

		await sendEmail(user.email, "Reset Password", link);

		return res.status(200).json({
			message: "A password reset link has been sent to your email account",
		});
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const resetPassword = async (req, res) => {
	const { id } = req.params;
	try {
		const user = await Employee.findById(id);
		if (!user) {
			return res.status(404).json({ error: "User does not exist" });
		}
		res.render("index", {
			email: user.email,
			status: "Not verified ",
		});
	} catch (error) {
		res.status(500).json({ message: "User not Verified!" });
	}
};

const setNewPassword = async (req, res) => {
	const { id } = req.params;
	const { password } = req.body;

	const user = await Employee.findOne({ _id: id });
	if (!user) {
		return res.status(400).json({ status: "User Not Exist!" });
	}

	try {
		const hash = await bcrypt.hash(password, 10);
		await Employee.findByIdAndUpdate(
			{ _id: id },
			{
				$set: { password: hash },
			},
		);
		res.render("index", { email: user.email, status: "verified" });
	} catch (error) {
		res.status(500).json({ message: "Something Went Wrong" });
	}
};
const changePassword = () => async (req, res) => {
	const { newPassword } = req.body;
	const { id } = req.params;
	// const user = req.user;
	try {
		if (!newPassword) {
			throw new Error("New password is required");
		}
		const hashedPassword = bcrypt.hashSync(newPassword, 10);
		// user.password = hashedPassword;
		const updatedUser = await Employee.findByIdAndUpdate(
			// user[0]._id,
			id,
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
	getAllEmployeesByRole,
	getAllSalesAgents,
	forgotPassword,
	resetPassword,
	setNewPassword,
};
