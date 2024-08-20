// const User = require("../models/User");
const Employee = require("../models/Employee");
const Company = require("../models/Company");
const Group = require("../models/Group");
const Lead = require("../models/Lead");
const Task = require("../models/Task");
const UserActivity = require("../models/UserActivity");
const { isRoleManager } = require("../services/data");
const { setInitialPermissions } = require("./appController");

const getAllEmployees = () => async (req, res) => {
	try {
		const result = await Employee.find({}).sort({
			firstName: 1,
		});
		res.status(200).json(result);
	} catch (err) {
		res.status(404).json({ error: err.message });
	}
};

const getUserActivity = () => async (req, res) => {
	const currentDate = new Date();

	const today = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth(),
		currentDate.getDate() + 1,
	);

	try {
		const result = await UserActivity.find({
			loginTime: {
				$gte: today,
				$lt: today,
			},
		});
		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getCompanyEmployees = () => async (req, res) => {
	const { companyName } = req.params;
	try {
		const existingCompany = await findCompany("name", companyName);
		const result = await Employee.find({ companyId: existingCompany._id });

		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const groupEmployeesByRole = () => async (req, res) => {
	const { companyName } = req.params;
	try {
		const tasksByEmployee = await Task.aggregate([
			{
				$match: { companyName },
			},
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

		const existingCompany = await findCompany("name", companyName);

		const result = await Employee.aggregate([
			{
				$match: { companyId: existingCompany._id },
			},
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
		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getAllGroupMembers = () => async (req, res) => {
	const { memberId, companyName } = req.params;
	try {
		const group = await Group.find({
			"members._id": memberId,
			companyName,
		});
		res.status(200).json(group);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getAllManagers = () => async (req, res) => {
	const { companyName } = req.params;
	try {
		const existingCompany = await findCompany("name", companyName);
		const result = await Employee.find({
			companyId: existingCompany._id,
			role: { $regex: /manager|administrator/i },
		});
		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getAllSalesAgents = () => async (req, res) => {
	const { companyName } = req.params;
	try {
		const existingCompany = await findCompany("name", companyName);
		const result = await Employee.find({
			companyId: existingCompany._id,
			role: {
				$not: {
					$regex: /manager|administrator/i,
				},
			},
		});
		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};
const findCompany = async (key, value) =>
	await Company.findOne({ [key]: value });

const updateUser = () => async (req, res) => {
	const { userId } = req.params;
	const { role, companyId, companies } = req.body;
	const isManager = isRoleManager(role);

	try {
		const compArr = [];
		if (companies?.length) {
			for (const name of companies) {
				if (isManager) {
					const existingCompany = await findCompany("name", name);
					if (existingCompany) {
						setInitialPermissions(userId, isManager, name);
						compArr.push(existingCompany._id);
						existingCompany.employees.push(userId);
						await existingCompany.save();
					}
				}
			}
			req.body.companyId = compArr;
		} else if (isManager) {
			const existingCompany = await findCompany("_id", companyId);
			if (existingCompany) {
				setInitialPermissions(userId, isManager, existingCompany.name);
			}
		}
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
		const { totalLeadsDisbursed, totalWeight, activeUsers } =
			await getActiveUsers();
		console.log(
			"updateUserAssignedLeads",
			req.params,
			totalLeadsDisbursed,
			totalWeight,
			activeUsers,
		);
		for (const user of activeUsers) {
			const assignedLeads = Math.round(
				(user.assignedWeight / totalWeight) * totalLeadsDisbursed.length,
			);
			await Employee.findByIdAndUpdate(
				user._id,
				{ $set: { assignedLeads } },
				{ new: true },
			);
		}
		res.status(200).json({ message: "Leads assignee updated successfully" });
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getActiveUsers = async () => {
	const totalLeadsDisbursed = await Lead.find({
		isDisbursed: true,
		isDisbursedConfirmed: false,
	});
	const activeUsers = await Employee.find({ isActive: true });
	const totalWeight = activeUsers.reduce(
		(sum, item) => sum + item.assignedWeight,
		0,
	);
	return { totalLeadsDisbursed, totalWeight, activeUsers };
};

module.exports = {
	getAllEmployees,
	getUserActivity,
	getCompanyEmployees,
	groupEmployeesByRole,
	getAllGroupMembers,
	getAllManagers,
	getAllSalesAgents,
	updateUser,
	updateUserAssignedLeads,
	findCompany,
};
