const path = require("path");

const Company = require("../models/Company");
const Employee = require("../models/Employee");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");
const Group = require("../models/Group");
const Lead = require("../models/Lead");
const UserActivity = require("../models/UserActivity");

const { ROLES } = require("../services/data");
const { sendEmail } = require("../services/emailService");
const { getResetPasswordLink } = require("../services/tokenService");
const {
	filterResultByPaygroupOption,
	filterResultByDepartment,
	findEmployee,
	findCompany,
	addEmployee,
	sortByEmpFullName,
	getUserEmploymentRoleInfo,
	getPayrollActiveEmployees,
	getShadowUserIds,
	getSalariedIds,
} = require("../helpers/userHelper");
const { findGroupEmployees } = require("./setUpController");
const { setInitialPermissions } = require("./permissionController");

const getPayrollInActiveEmployees = async (companyName, deptName, selectedPayGroupOption) => {
	let result = await findEmployee({
		payrollStatus: { $ne: "Payroll Active" },
		companyName,
		employmentRole: { $ne: ROLES.SHADOW_ADMIN },
		empId: { $exists: true },
	});
	if (selectedPayGroupOption) {
		result = filterResultByPaygroupOption(result, selectedPayGroupOption);
	}

	if (deptName && deptName !== "null") {
		result = filterResultByDepartment(result, deptName);
	}

	return result;
};

const getPayrollTerminatedEmployees = async (companyName, deptName, selectedPayGroupOption) => {
	let result = await findEmployee({
		payrollStatus: "Payroll Terminated",
		companyName,
		employmentRole: { $ne: ROLES.SHADOW_ADMIN },
		empId: { $exists: true },
	});

	if (selectedPayGroupOption) {
		result = filterResultByPaygroupOption(result, selectedPayGroupOption);
	}

	if (deptName && deptName !== "null") {
		result = filterResultByDepartment(result, deptName);
	}

	return result;
};

const getAllEmployees = async (req, res) => {
	try {
		const result = await findEmployee({
			empId: { $exists: true },
		}).sort({
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
		const result = await EmployeeEmploymentInfo.countDocuments({
			payrollStatus: "Payroll Active",
			companyName,
			employmentRole: { $ne: ROLES.SHADOW_ADMIN },
			empId: { $exists: true },
		});

		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getPayrollActiveCompanyEmployees = async (req, res) => {
	const { companyName, deptName, payGroup } = req.params;
	try {
		const result = await getPayrollActiveEmployees(companyName, deptName, payGroup);

		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getPayrollInActiveCompanyEmployees = async (req, res) => {
	const { companyName, deptName, payGroup } = req.params;
	try {
		const result = await getPayrollInActiveEmployees(companyName, deptName, payGroup);
		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getPayrollTerminatedCompanyEmployees = async (req, res) => {
	const { companyName, deptName, payGroup } = req.params;
	try {
		const result = await getPayrollTerminatedEmployees(companyName, deptName, payGroup);
		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getCompanyUsers = async (req, res) => {
	const { companyName } = req.params;
	try {
		const shadowEmpIds = await getShadowUserIds(companyName);

		const filter = {
			companyName,
			empId: { $exists: true },
			...(shadowEmpIds.length > 0 && { empId: { $nin: shadowEmpIds } }),
		};
		const result = await EmployeeProfileInfo.find(filter).populate({
			path: "empId",
			model: "Employee",
			select: ["empId", "fullName"],
		});
		res.status(200).json(sortByEmpFullName(result));
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getCompanyEmpEmployees = async (req, res) => {
	const { companyName } = req.params;
	try {
		const result = await getUserEmploymentRoleInfo(companyName);
		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getCompanyNonSalariedEmployees = async (req, res) => {
	const { companyName, deptName, payGroup } = req.params;
	try {
		const shadowEmpIds = await getShadowUserIds(companyName);
		const salariedIds = await getSalariedIds(companyName);

		const filter = {
			companyName,
			empId: { $exists: true },
			...((shadowEmpIds.length > 0 || salariedIds.length > 0) && {
				empId: { $nin: [...shadowEmpIds, ...salariedIds] },
			}),
		};
		const result = await EmployeeProfileInfo.find(filter).populate({
			path: "empId",
			model: "Employee",
			select: ["empId", "fullName"],
		});

		let updatedResult = await Promise.all(
			result.map(async (emp) => {
				const empInfo = await EmployeeEmploymentInfo.findOne({
					companyName,
					empId: emp?.empId?._id,
					payrollStatus: "Payroll Active",
				}).select("positions");

				return {
					empId: emp?.empId,
					positions: empInfo?.positions,
				};
			}),
		);

		if (payGroup) {
			updatedResult = filterResultByPaygroupOption(updatedResult, payGroup);
		}

		if (deptName && deptName !== "null") {
			updatedResult = filterResultByDepartment(updatedResult, deptName);
		}

		res.status(200).json(sortByEmpFullName(updatedResult));
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getCompanyEmployees = async (req, res) => {
	const { companyName, deptName, payGroup } = req.params;
	try {
		const result = await EmployeeProfileInfo.find({
			companyName,
			empId: { $exists: true },
		}).populate({
			path: "empId",
			model: "Employee",
			select: ["fullName", "email", "baseModule", "group"],
		});
		let updatedResult = await Promise.all(
			result.map(async (emp) => {
				const empInfo = await EmployeeEmploymentInfo.findOne({
					companyName,
					empId: emp?.empId?._id,
					employmentRole: { $ne: ROLES.SHADOW_ADMIN },
				}).select("employeeNo employmentRole payrollStatus positions");

				return {
					empId: emp?.empId,
					employeeNo: empInfo?.employeeNo,
					employmentRole: empInfo?.employmentRole,
					payrollStatus: empInfo?.payrollStatus,
					positions: empInfo?.positions,
				};
			}),
		);

		if (payGroup) {
			updatedResult = filterResultByPaygroupOption(updatedResult, payGroup);
		}

		if (deptName && deptName !== "null") {
			updatedResult = filterResultByDepartment(updatedResult, deptName);
		}

		res.status(200).json(sortByEmpFullName(updatedResult));
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getCompanyEmployeesCount = async (req, res) => {
	const { companyName } = req.params;
	try {
		const result = await EmployeeEmploymentInfo.countDocuments({
			companyName,
			employmentRole: { $ne: ROLES.SHADOW_ADMIN },
			empId: { $exists: true },
		});

		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const groupEmployeesByRole = async (req, res) => {
	const { companyName } = req.params;
	try {
		const result = await getUserEmploymentRoleInfo(companyName);

		const grouped = result.reduce((acc, item) => {
			const role = item.employmentRole;
			const name = item.empId.fullName;
			const empId = item.empId._id;

			if (!acc[role]) {
				acc[role] = [];
			}
			acc[role].push({ name, empId });
			return acc;
		}, {});
		res.status(200).json(grouped);
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
		let result = await findEmployee({
			companyName,
			empId: { $exists: true },
			employmentRole: {
				$in: [ROLES.AUTH_ADMINISTRATOR, ROLES.ADMINISTRATOR, ROLES.MANAGER],
			},
		});
		result = result?.filter((emp) => emp?.empId);

		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};
const getAllAdmin = async (req, res) => {
	const { companyName } = req.params;
	try {
		const result = await findEmployee({
			companyName,
			empId: { $exists: true },
			employmentRole: {
				$in: [ROLES.AUTH_ADMINISTRATOR, ROLES.ADMINISTRATOR],
			},
		});
		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};
const getAllManagers = async (req, res) => {
	const { companyName } = req.params;
	try {
		const result = await findEmployee({
			companyName,
			empId: { $exists: true },
			employmentRole: {
				$in: [ROLES.SHADOW_ADMIN, ROLES.AUTH_ADMINISTRATOR, ROLES.ADMINISTRATOR, ROLES.MANAGER],
			},
		});
		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getAllSalesAgentsList = async (req, res) => {
	const { companyName } = req.params;
	try {
		let result = await findEmployee({
			companyName,
			empId: { $exists: true },
			employmentRole: {
				$nin: [ROLES.SHADOW_ADMIN, ROLES.AUTH_ADMINISTRATOR, ROLES.ADMINISTRATOR, ROLES.MANAGER],
			},
		});
		result = result?.filter((emp) => emp?.empId);
		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getAllSalesAgents = async (req, res) => {
	const { companyName } = req.params;
	try {
		let result = await EmployeeEmploymentInfo.find({
			companyName,
			empId: { $exists: true },
			employmentRole: {
				$nin: [ROLES.SHADOW_ADMIN, ROLES.AUTH_ADMINISTRATOR, ROLES.ADMINISTRATOR, ROLES.MANAGER],
			},
		})
			.populate({
				path: "empId",
				model: "Employee",
				select: ["fullName", "email", "baseModule", "group", "primaryAddress"],
			})
			.select("payrollStatus employeeNo positions employmentRole");
		result = result.filter(({ empId }) => empId);
		res.status(200).json(sortByEmpFullName(result));
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const sendMailPaystub = async (req, res) => {
	const { employees } = req.body;

	try {
		for (const fullName of employees) {
			const user = await Employee.findOne({ fullName })
				.sort({
					createdOn: -1,
				})
				?.select("email fullName");
			if (user) {
				const { email, fullName } = user;

				await sendEmail(
					email,
					"View Your Recent Paystub",
					"",
					`<body style="margin: 0; font-family: Arial, Helvetica, sans-serif;height:'auto">
		<div class="container" style="
								background: #fdfdfd;
								color: #371f37;
								display: flex;
								flex-direction: column;
								align-items: self-start;
								padding: 2em 3em;
								gap: 1em;
								font-size: 14px;
							">
			<p> Dear ${fullName},
			</p>
			<p>
				Your most recent paystub is now available.</p>
			<p>
				Please log in to your employee portal to view or download your paystub:
			</p>
			<p><a class="button" href="https://businessn-erp.com/login" target="_blank">Login Here</a></p>
		</div>
		<div class="footer" style="
								background-color: #371f37;
								color: white;
									text-align: center;
								height: 150px;
								display: flex;
								align-items: center;
							">
			<img src="cid:footerLogo" style="margin: 0 auto;width:300px" alt="Footer Logo" />

		</div>
	</body>`,
					[
						{
							filename: "BusinessN_dark1.png",
							path: path.join(__dirname, "../", "assets/logos/BusinessN_dark1.png"),
							cid: "footerLogo",
						},
					],
				);
			}
		}
		res.status(201).json({ message: "Email sent successfully" });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const sendMailCreds = async (req, res) => {
	const { employees } = req.body;
	try {
		for (const fullName of employees) {
			const user = await Employee.findOne({ fullName })
				.sort({
					createdOn: -1,
				})
				?.select("email firstName fullName");
			if (user) {
				const { _id, email } = user;
				const resetLink = getResetPasswordLink({ _id });

				if (resetLink)
					await sendEmail(
						email,
						"Set Login Password",
						resetLink,
						`<body style="margin: 0; font-family: Arial, Helvetica, sans-serif;height:'auto">
						<div
							class="header"
							style="
								background-color: #371f37;
								color: white;
								text-align: center;
								height: 150px;
								display: flex;
								align-items: center;
							"
						>
							<div
								id="header_content"
								style="
									display: flex;
									flex-direction: column;
									align-items: self-start;
									background: #4c364b;
									border-radius: 10px;
									gap: 1em;
									width: 80%;
									margin: 0 auto;
									padding: 1.5em;
								"
							>
								<p
									class="topic"
									style="font-weight: bold; font-size: larger; margin: 5px 0"
								>
									Set Password
								</p>
							</div>
						</div><div
							class="container"
							style="
								background: #fdfdfd;
								color: #371f37;
								display: flex;
								flex-direction: column;
								align-items: self-start;
								padding: 2em 3em;
								gap: 1em;
								font-size: 14px;
							"
						>
				      <h2 style="margin: 5px 0">Hello ${user.firstName},</h2>
       <p>  Your account has been successfully created. For your security, please
        set your password by clicking the link below.</p> 
		<p>
	    This link will expire in 15 minutes. If it expires, you can request a
	    new one from the login screen.
	  </p>
				      <p><a class="button" href="${resetLink}" target="_blank">Set Your Password</a></p>
				   </div>
						<div
							class="footer"
							style="
								background-color: #371f37;
								color: white;
								text-align: center;
								height: 150px;
								display: flex;
								align-items: center;
							"
						>
				      <img src="cid:footerLogo"
								style="margin: 0 auto;width:300px" alt="Footer Logo"/>

						</div>
					</body> `,
						[
							{
								filename: "BusinessN_dark1.png",
								path: path.join(__dirname, "../", "assets/logos/BusinessN_dark1.png"),
								cid: "footerLogo",
							},
						],
					);
			}
		}

		res.status(201).json({ message: "Email sent successfully" });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const createMasterUser = async (req, res) => {
	const { personalInfo, moduleInfo } = req.body;
	const { company, firstName, middleName, lastName, email, phoneNumber, position, startDate } =
		personalInfo;
	const { selectedPermissions } = moduleInfo;
	try {
		const approvedModules = Object.keys(selectedPermissions)?.filter(
			(key) => selectedPermissions[key]["Section Access"] === true,
		);
		const employee = await addEmployee(company, {
			firstName,
			middleName,
			lastName,
			fullName: `${firstName} ${middleName || ""} ${lastName}`,
			email,
			phoneNumber,
			position,
			dateOfJoining: startDate,
			baseModule: approvedModules,
		});

		await EmployeeProfileInfo.create({
			companyName: company,
			firstName,
			middleName,
			lastName,
			empId: employee?._id,
			businessEmail: email,
			personalPhoneNum: phoneNumber,
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

const updateCompanyEmployee = async (companyName, userId, role) => {
	const existingCompany = await findCompany("name", companyName);
	if (!existingCompany) {
		return;
	}
	await setInitialPermissions(userId, role, companyName);

	if (existingCompany.employees.includes(userId)) {
		await EmployeeEmploymentInfo.findOneAndUpdate(
			{ empId: userId, companyName },
			{ employmentRole: role },
			{ upsert: true, new: true },
		);
	} else {
		await EmployeeEmploymentInfo.create({
			empId: userId,
			companyName,
			employmentRole: role,
		});
		existingCompany.employees.push(userId);
	}
	await existingCompany.save();
	return existingCompany._id;
};

const updateUser = async (req, res) => {
	const { userId } = req.params;
	const { role, companyId, assignedCompanies, unassignedCompanies } = req.body;

	try {
		const compArr = [];

		if (Array.isArray(assignedCompanies) && assignedCompanies.length > 0) {
			await Promise.all(
				assignedCompanies.map(async (name) => {
					const result = await updateCompanyEmployee(name, userId, role);
					compArr.push(result);
				}),
			);
		}

		if (Array.isArray(unassignedCompanies) && unassignedCompanies.length > 0) {
			await Promise.all(
				unassignedCompanies.map(async (id) => {
					const existingCompany = await Company.findById(id);
					if (!existingCompany) return;

					existingCompany.employees = existingCompany.employees.filter(
						(emp) => emp.toString() !== userId,
					);
					return existingCompany.save();
				}),
			);
		} else {
			const result = await updateCompanyEmployee(companyId.name, userId, role);
			compArr.push(result);
		}

		req.body.companyId = compArr;

		if (req.body?._id) delete req.body._id;
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
	const activeUsers = await findEmployee({ isActive: true, empId: { $exists: true } });
	const totalWeight = activeUsers.reduce((sum, item) => sum + item.assignedWeight, 0);
	return { totalLeadsDisbursed, totalWeight, activeUsers };
};

const getEmployeeId = async (empList) => {
	const list = [];
	for (const fullName of empList) {
		const employee = await Employee.findOne({ fullName });
		list.push({ empId: employee });
	}
	return list;
};

const fetchActiveEmployees = async (
	isExtraPayRun,
	groupId,
	payDate,
	companyName,
	deptName,
	selectedPayGroupOption,
) => {
	const employees = isExtraPayRun ? await findGroupEmployees(groupId, payDate) : null;

	return isExtraPayRun
		? await getEmployeeId(employees)
		: await getPayrollActiveEmployees(companyName, deptName, selectedPayGroupOption);
};

module.exports = {
	getAllEmployees,
	getUserActivity,
	getCompanyEmployees,
	getCompanyNonSalariedEmployees,
	getCompanyEmployeesCount,
	groupEmployeesByRole,
	getAllGroupMembers,
	getAllManagers,
	getAllAdmin,
	getAllSalesAgents,
	updateUser,
	updateUserAssignedLeads,
	getPayrollActiveCompanyEmployees,
	getPayrollActiveCompanyEmployeesCount,
	getPayrollInActiveCompanyEmployees,
	getPayrollTerminatedCompanyEmployees,
	getAllSalesAgentsList,
	sendMailCreds,
	sendMailPaystub,
	getAllCompManagers,
	getEmployeeId,
	fetchActiveEmployees,
	createMasterUser,
	updateMasterUser,
	getCompanyUsers,
	getCompanyEmpEmployees,
};
