// const User = require("../models/User");
const Employee = require("../models/Employee");
const Group = require("../models/Group");
const Lead = require("../models/Lead");
const Task = require("../models/Task");
const UserActivity = require("../models/UserActivity");
const { isRoleManager, BUSINESSN_ORG, ROLES } = require("../services/data");
const {
	setInitialPermissions,
	findCompany,
	getPayrollActiveEmployees,
	addEmployee,
} = require("./appController");
const { findGroupEmployees } = require("./setUpController");

const getPayrollInActiveEmployees = async (companyName) => {
	const existingCompany = await findCompany("name", companyName);
	return await findEmployee({
		payrollStatus: { $ne: "Payroll Active" },
		companyId: existingCompany._id,
	});
};

const findEmployee = async (data) =>
	await Employee.find(data)
		.select([
			"fullName",
			"_id",
			"email",
			"baseModule",
			"group",
			"role",
			"payrollStatus",
			"employeeNo",
			"timeManagementBadgeID",
			"department",
		])
		.sort({
			fullName: 1,
		});

const getAllEmployees = async (req, res) => {
	try {
		const result = await findEmployee({}).sort({
			firstName: 1,
		});
		res.status(200).json(result);
	} catch (err) {
		res.status(404).json({ error: err.message });
	}
};

const getUserActivity = async (req, res) => {
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

const getPayrollActiveCompanyEmployeesCount = async (req, res) => {
	const { companyName } = req.params;
	try {
		const existingCompany = await findCompany("name", companyName);
		const result = await Employee.countDocuments({
			payrollStatus: { $ne: "Payroll Terminated" },
			companyId: existingCompany._id,
		});

		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getPayrollActiveCompanyEmployees = async (req, res) => {
	const { companyName } = req.params;
	try {
		let result = await getPayrollActiveEmployees(companyName);
		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getPayrollInActiveCompanyEmployees = async (req, res) => {
	const { companyName } = req.params;
	try {
		let result = await getPayrollInActiveEmployees(companyName);
		if (companyName !== BUSINESSN_ORG) {
			result = result?.filter((emp) => emp?.role !== ROLES.SHADOW_ADMIN);
		}
		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getCompanyEmployees = async (req, res) => {
	const { companyName } = req.params;
	try {
		const existingCompany = await findCompany("name", companyName);
		let result = await Employee.find({
			companyId: existingCompany._id,
		})
			.select(
				"fullName employeeId payrollStatus employeeNo timeManagementBadgeID department email role",
			)
			.sort({ fullName: 1 });
		if (companyName !== BUSINESSN_ORG) {
			result = result?.filter((emp) => emp?.role !== ROLES.SHADOW_ADMIN);
		}
		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getCompanyEmployeesCount = async (req, res) => {
	const { companyName } = req.params;
	try {
		const existingCompany = await findCompany("name", companyName);
		const result = await Employee.countDocuments({
			companyId: existingCompany._id,
		});

		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const groupEmployeesByRole = async (req, res) => {
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

const getAllGroupMembers = async (req, res) => {
	const { memberId, companyName } = req.params;
	try {
		const group = await Group.find({
			"members._id": memberId,
			companyName,
		}).select("name modules members");
		res.status(200).json(group);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getAllCompManagers = async (req, res) => {
	const { companyName } = req.params;
	try {
		const existingCompany = await findCompany("name", companyName);
		const result = await Employee.find({
			companyId: existingCompany._id,
			role: { $regex: /manager|administrator/i },
		})
			.select(["fullName"])
			.sort({
				fullName: 1,
			});

		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getAllManagers = async (req, res) => {
	const { companyName } = req.params;
	try {
		const existingCompany = await findCompany("name", companyName);
		const result = await findEmployee({
			companyId: existingCompany._id,
			role: { $regex: /manager|administrator/i },
		});
		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getAllSalesAgentsList = async (req, res) => {
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
		}).select("_id fullName");
		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getAllSalesAgents = async (req, res) => {
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

const createMasterUser = async (req, res) => {
	const { company, firstName, middleName, lastName, email, phoneNumber, position, startDate } =
		req.body;

	try {
		const employee = await addEmployee(company, {
			firstName,
			middleName,
			lastName,
			fullName: `${firstName} ${middleName} ${lastName}`,
			email,
			phoneNumber,
			position,
			dateOfJoining: startDate,
		});

		res.status(201).json(employee);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateMasterUser = async (req, res) => {
	const { userId } = req.params;
	try {
		const userExists = await Employee.findById(userId);
		if (userExists) {
			const updatedUser = await Employee.findByIdAndUpdate(
				userId,
				{ baseModule: req.body },
				{
					new: true,
				},
			);
			res.status(201).json(updatedUser);
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateUser = async (req, res) => {
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
						await setInitialPermissions(userId, role, name);
						compArr.push(existingCompany._id);
						existingCompany.employees.push(userId);
						await existingCompany.save();
					}
				}
			}
			req.body.companyId = compArr;
		} else {
			const existingCompany = await findCompany("name", companyId?.name);
			if (existingCompany) {
				await setInitialPermissions(userId, role, existingCompany.name);
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
		const { totalLeadsDisbursed, totalWeight, activeUsers } = await getActiveUsers();
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
			await Employee.findByIdAndUpdate(user._id, { $set: { assignedLeads } }, { new: true });
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
	const activeUsers = await findEmployee({ isActive: true });
	const totalWeight = activeUsers.reduce((sum, item) => sum + item.assignedWeight, 0);
	return { totalLeadsDisbursed, totalWeight, activeUsers };
};

const getEmployeeId = async (empList) => {
	const list = [];
	for (const fullName of empList) {
		const employee = await Employee.findOne({ fullName });
		list.push(employee);
	}
	return list;
};

const fetchActiveEmployees = async (isExtraPayRun, groupId, payDate, companyName) => {
	const employees = isExtraPayRun ? await findGroupEmployees(groupId, payDate) : null;

	return isExtraPayRun
		? await getEmployeeId(employees)
		: await getPayrollActiveEmployees(companyName);
};

module.exports = {
	getAllEmployees,
	getUserActivity,
	getCompanyEmployees,
	getCompanyEmployeesCount,
	groupEmployeesByRole,
	getAllGroupMembers,
	getAllManagers,
	getAllSalesAgents,
	updateUser,
	updateUserAssignedLeads,
	findCompany,
	findEmployee,
	getPayrollActiveCompanyEmployees,
	getPayrollActiveCompanyEmployeesCount,
	getPayrollInActiveCompanyEmployees,
	getAllSalesAgentsList,
	getAllCompManagers,
	getEmployeeId,
	fetchActiveEmployees,
	createMasterUser,
	updateMasterUser,
};
