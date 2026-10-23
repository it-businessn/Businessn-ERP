const path = require("path");
const mongoose = require("mongoose");

const Company = require("../models/Company");
const Employee = require("../models/Employee");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");
const Group = require("../models/Group");
const Lead = require("../models/Lead");
const UserActivity = require("../models/UserActivity");
const { sendEmail } = require("../services/emailService");
// AUD-016: user-editable names are HTML-escaped in e-mail bodies.
const { escapeHtml } = require("../helpers/escapeHtml");
const { getResetPasswordLink } = require("../services/tokenService");
const { emailPayStub, findLatestPayStub, isPayable } = require("../services/payStubEmailService");

const { findGroupEmployees } = require("./setUpController");
const { setInitialPermissions } = require("./permissionController");
const {
	getUserCompanyNames,
	getUserCompanyIds,
	getScopedCompanyNames,
	companyScopeFilter,
} = require("../middleware/authorize");
const { findRoleAssignmentDenials, denyRoleAssignment } = require("../middleware/rbac");
const { COMPANIES } = require("../constants/constant");
const { ROLES } = require("../constants/roles.constants");
const {
	addEmployee,
	findCompany,
	findEmployee,
	findEmploymentInfoByEmpIds,
	filterResultByPaygroupOption,
	filterResultByDepartment,
	getShadowUserIds,
	getSalariedIds,
	getPayrollActiveEmployees,
	getPayrollInActiveEmployees,
	getPayrollTerminatedEmployees,
	getUserEmploymentRoleInfo,
	sortByEmpFullName,
} = require("../services/userService");

const getAllEmployees = async (req, res) => {
	try {
		// NEW-06: listed every tenant's employees. (It also called .sort() on the
		// Promise returned by findEmployee, so it always answered 500; findEmployee
		// already sorts by full name.)
		const result = await findEmployee({
			empId: { $exists: true },
			...(await companyScopeFilter(req)),
		});
		return res.status(200).json(result);
	} catch (err) {
		return res.status(500).json({ message: "Internal Server Error", error: err });
	}
};

const getUserActivity = async (req, res) => {
	const currentDate = new Date();

	// FIX: Build correct start/end of today range (was using same value for $gte and $lt)
	const startOfToday = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth(),
		currentDate.getDate(),
	);
	const startOfTomorrow = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth(),
		currentDate.getDate() + 1,
	);

	try {
		// NEW-06: returned every tenant's logins. UserActivity has no company field,
		// so restrict to members of the caller's companies.
		const companies = await Company.find({ name: { $in: await getScopedCompanyNames(req) } })
			.select("employees")
			.lean();
		const memberIds = [
			...new Set((companies || []).flatMap((c) => (c.employees || []).map(String))),
		];
		const result = await UserActivity.find({
			loginTime: {
				$gte: startOfToday,
				$lt: startOfTomorrow,
			},
			userID: { $in: memberIds },
		});
		return res.status(200).json(result);
	} catch (err) {
		return res.status(500).json({ message: "Internal Server Error", error: err });
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

		return res.status(200).json(result);
	} catch (err) {
		return res.status(500).json({ message: "Internal Server Error", error: err });
	}
};

const getPayrollActiveCompanyEmployees = async (req, res) => {
	const { companyName, deptName, payGroup } = req.params;
	try {
		const result = await getPayrollActiveEmployees(companyName, deptName, payGroup);
		return res.status(200).json(result);
	} catch (err) {
		return res.status(500).json({ message: "Internal Server Error", error: err });
	}
};

const getPayrollInActiveCompanyEmployees = async (req, res) => {
	const { companyName, deptName, payGroup } = req.params;
	try {
		const result = await getPayrollInActiveEmployees(companyName, deptName, payGroup);
		return res.status(200).json(result);
	} catch (err) {
		return res.status(500).json({ message: "Internal Server Error", error: err });
	}
};

const getPayrollTerminatedCompanyEmployees = async (req, res) => {
	const { companyName, deptName, payGroup } = req.params;
	try {
		const result = await getPayrollTerminatedEmployees(companyName, deptName, payGroup);
		return res.status(200).json(result);
	} catch (err) {
		return res.status(500).json({ message: "Internal Server Error", error: err });
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
		return res.status(200).json(sortByEmpFullName(result));
	} catch (err) {
		return res.status(500).json({ message: "Internal Server Error", error: err });
	}
};

const getCompanyEmpEmployees = async (req, res) => {
	const { companyName } = req.params;
	try {
		const result = await getUserEmploymentRoleInfo(companyName);
		return res.status(200).json(result);
	} catch (err) {
		return res.status(500).json({ message: "Internal Server Error", error: err });
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
		let result = await EmployeeProfileInfo.find(filter).populate({
			path: "empId",
			model: "Employee",
			select: ["empId", "fullName"],
		});

		result = result?.filter((_) => _?.empId);

		// F-05: one query for all employees instead of one per employee.
		const empInfoById = await findEmploymentInfoByEmpIds(
			companyName,
			result.map((emp) => emp?.empId?._id),
			{ payrollStatus: "Payroll Active" },
			"empId positions",
		);
		let updatedResult = result.map((emp) => {
			const empInfo = empInfoById.get(String(emp?.empId?._id));
			return {
				empId: emp?.empId,
				positions: empInfo?.positions,
			};
		});

		if (payGroup) {
			updatedResult = filterResultByPaygroupOption(updatedResult, payGroup);
		}

		if (deptName && deptName !== "null") {
			updatedResult = filterResultByDepartment(updatedResult, deptName);
		}
		return res.status(200).json(sortByEmpFullName(updatedResult));
	} catch (err) {
		return res.status(500).json({ message: "Internal Server Error", error: err });
	}
};

const getCompanyEmployees = async (req, res) => {
	const { companyName, deptName, payGroup } = req.params;
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
			select: ["fullName", "email", "baseModule", "group"],
		});
		// F-05: one query for all employees instead of one per employee.
		const empInfoById = await findEmploymentInfoByEmpIds(
			companyName,
			result.map((emp) => emp?.empId?._id),
			{},
			"empId employeeNo employmentRole payrollStatus positions",
		);
		let updatedResult = result.map((emp) => {
			const empInfo = empInfoById.get(String(emp?.empId?._id));
			return {
				empId: emp?.empId,
				employeeNo: empInfo?.employeeNo,
				employmentRole: empInfo?.employmentRole,
				payrollStatus: empInfo?.payrollStatus,
				positions: empInfo?.positions,
			};
		});

		if (companyName !== COMPANIES.BUSINESSN_ORG && shadowEmpIds?.length > 0 && payGroup) {
			updatedResult = filterResultByPaygroupOption(updatedResult, payGroup);
		}

		if (deptName && deptName !== "null") {
			updatedResult = filterResultByDepartment(updatedResult, deptName);
		}

		return res.status(200).json(sortByEmpFullName(updatedResult));
	} catch (err) {
		return res.status(500).json({ message: "Internal Server Error", error: err });
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

		return res.status(200).json(result);
	} catch (err) {
		return res.status(500).json({ message: "Internal Server Error", error: err });
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
		return res.status(200).json(grouped);
	} catch (err) {
		return res.status(500).json({ message: "Internal Server Error", error: err });
	}
};

const getAllGroupMembers = async (req, res) => {
	const { memberId, companyName } = req.params;
	try {
		const group = await Group.find({
			"members._id": memberId,
			companyName,
		}).select("name modules members");
		return res.status(200).json(group);
	} catch (err) {
		return res.status(500).json({ message: "Internal Server Error", error: err });
	}
};

const getAllCompManagers = async (req, res) => {
	const { companyName } = req.params;
	try {
		const result = await findEmployee({
			companyName,
			empId: { $exists: true },
			employmentRole: {
				$in: [ROLES.AUTH_ADMINISTRATOR, ROLES.ADMINISTRATOR, ROLES.MANAGER],
			},
		});

		return res.status(200).json(result);
	} catch (err) {
		return res.status(500).json({ message: "Internal Server Error", error: err });
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
		return res.status(200).json(result);
	} catch (err) {
		return res.status(500).json({ message: "Internal Server Error", error: err });
	}
};
const getAllManagers = async (req, res) => {
	const { companyName } = req.params;
	try {
		const result = await findEmployee({
			companyName,
			empId: { $exists: true },
			employmentRole: {
				$in: [ROLES.AUTH_ADMINISTRATOR, ROLES.ADMINISTRATOR, ROLES.MANAGER],
			},
		});
		return res.status(200).json(result);
	} catch (err) {
		return res.status(500).json({ message: "Internal Server Error", error: err });
	}
};

const getAllSalesAgentsList = async (req, res) => {
	const { companyName } = req.params;
	try {
		const result = await findEmployee({
			companyName,
			empId: { $exists: true },
			employmentRole: {
				$nin: [ROLES.AUTH_ADMINISTRATOR, ROLES.ADMINISTRATOR, ROLES.MANAGER],
			},
		});
		return res.status(200).json(result);
	} catch (err) {
		return res.status(500).json({ message: "Internal Server Error", error: err });
	}
};

const getAllSalesAgents = async (req, res) => {
	const { companyName } = req.params;
	try {
		let result = await EmployeeEmploymentInfo.find({
			companyName,
			empId: { $exists: true },
			employmentRole: {
				$nin: [ROLES.AUTH_ADMINISTRATOR, ROLES.ADMINISTRATOR, ROLES.MANAGER],
			},
		})
			.populate({
				path: "empId",
				model: "Employee",
				select: ["fullName", "email", "baseModule", "group", "primaryAddress"],
			})
			.select("payrollStatus employeeNo positions employmentRole");

		result = result?.filter((emp) => emp?.empId);
		return res.status(200).json(sortByEmpFullName(result));
	} catch (err) {
		return res.status(500).json({ message: "Internal Server Error", error: err });
	}
};

// NEW-05: full names are only unique within a company. Look-ups by name are
// restricted to the member ids (Company.employees) of the relevant companies.
const getCompanyMemberIds = async (companyNames) => {
	const companies = await Company.find({ name: { $in: companyNames } })
		.select("employees")
		.lean();
	return (companies || []).flatMap((c) => c?.employees || []);
};

const isCompanyNameValue = (v) =>
	typeof v === "string" && v.trim() !== "" && !["null", "undefined"].includes(v.trim());

// NEW-05: e-mail recipients are resolved by name inside body.companyName (already
// checked by authorizeCompanyAccess) or, when it is absent, inside the caller's
// own companies. Names that match no member are reported in `notFound`.
const resolveMailRecipients = async (req, select) => {
	const { employees, companyName } = req.body || {};
	if (!Array.isArray(employees) || employees.some((n) => typeof n !== "string")) {
		return { error: "employees must be a list of names" };
	}
	const companyNames = isCompanyNameValue(companyName)
		? [companyName.trim()]
		: [...(await getUserCompanyNames(String(req.user?.id)))];
	const memberIds = companyNames.length ? await getCompanyMemberIds(companyNames) : [];
	const users = [];
	const notFound = [];
	for (const fullName of employees) {
		const user = memberIds.length
			? await Employee.findOne({ fullName, _id: { $in: memberIds } })
					.sort({ createdOn: -1 })
					.select(select)
			: null;
		if (user) users.push(user);
		else notFound.push(fullName);
	}
	return { users, notFound, companyNames };
};

/**
 * POST /api/user/send-paystub {employees: [fullName], companyName}
 * E-mails each employee their latest processed pay stub, only when its net pay is above $0.00
 * (isPayable; $0.00 or negative net pay is never e-mailed). The e-mail is the pay stub e-mail
 * (views/emails/paystub.ejs) with the full earnings statement attached as a PDF
 * to download (services/payStubPdfService.js). Sends go through the pay stub
 * delivery log (PayStubEmailLog, triggeredBy MANUAL), so the automatic pay-date
 * e-mail does not send the same stub again.
 */
const sendMailPaystub = async (req, res) => {
	try {
		const { users, notFound, companyNames, error } = await resolveMailRecipients(req, "email fullName");
		if (error) return res.status(400).json({ message: error });
		const sent = [];
		const noPayStub = [];
		const notPayable = [];
		const failed = [];
		// sequential: keeps the SMTP provider within its rate limits
		for (const user of users) {
			const stub = await findLatestPayStub({ empId: user._id, companyNames });
			if (!stub) {
				noPayStub.push(user.fullName);
				continue;
			}
			if (!isPayable(stub)) {
				notPayable.push(user.fullName);
				continue;
			}
			// force: the administrator asked for it, so re-send even if already e-mailed
			const result = await emailPayStub(stub, { triggeredBy: "MANUAL", force: true });
			(result === "SENT" ? sent : failed).push(user.fullName);
		}
		const problems = [
			notFound.length && `not found: ${notFound.join(", ")}`,
			noPayStub.length && `no processed pay stub: ${noPayStub.join(", ")}`,
			notPayable.length && `net pay not above $0.00: ${notPayable.join(", ")}`,
			failed.length && `could not be sent: ${failed.join(", ")}`,
		].filter(Boolean);
		const message = problems.length
			? `Pay stub e-mailed to ${sent.length} of ${req.body.employees.length} employee(s); ${problems.join("; ")}`
			: "Email sent successfully";
		return res.status(sent.length || !problems.length ? 201 : 422).json({
			message,
			sent,
			notFound,
			noPayStub,
			notPayable,
			failed,
		});
	} catch (err) {
		console.error("send-paystub failed", { message: err?.message });
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

const sendMailCreds = async (req, res) => {
	try {
		const { users, notFound, error } = await resolveMailRecipients(
			req,
			"email firstName fullName password",
		);
		if (error) return res.status(400).json({ message: error });
		for (const user of users) {
			if (user) {
				const { _id, email } = user;
				const resetLink = getResetPasswordLink({ _id }, user.password);

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
				      <h2 style="margin: 5px 0">Hello ${escapeHtml(user.firstName)},</h2>
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

		return res.status(201).json({ message: "Email sent successfully", notFound });
	} catch (err) {
		return res.status(500).json({ message: "Internal Server Error", error: err });
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
		const existingUser = await Employee.findOne({ email });
		if (existingUser) {
			return res.status(409).json({ message: "User already exists" });
		}
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
		return res.status(201).json(employee);
	} catch (err) {
		return res.status(500).json({ message: "Internal Server Error", error: err });
	}
};

const updateMasterUser = async (req, res) => {
	const { userId } = req.params;
	try {
		const userExists = await Employee.findById(userId);
		if (userExists) {
			const updatedUser = await Employee.findByIdAndUpdate(
				userId,
				{ $set: { baseModule: req.body } },
				{
					new: true,
				},
			);
			return res.status(201).json(updatedUser);
		}
		// NEW-08: unknown user used to leave the request hanging.
		return res.status(404).json({ message: "User not found" });
	} catch (err) {
		return res.status(500).json({ message: "Internal Server Error", error: err });
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

// Fields that must never be set through the generic profile update endpoint.
// FIX (AUD-004): req.body was $set verbatim, so any authenticated user could
// overwrite another user's password hash (account takeover). Email stays editable
// because the admin "Edit user" screen legitimately changes it.
const PROTECTED_USER_FIELDS = ["password", "otp", "_id", "createdOn", "updatedOn"];

const updateUser = async (req, res) => {
	const { userId } = req.params;
	const { role, companyId, assignedCompanies, unassignedCompanies } = req.body || {};

	try {
		if (!mongoose.isValidObjectId(userId)) {
			return res.status(400).json({ message: "Invalid user id" });
		}
		// NEW-01: company (un)assignment names companies in arrays / nested
		// objects the tenant guard cannot see. Without this check any user could
		// add themselves (or anyone) to any company, or remove members from it.
		const unassignIds = Array.isArray(unassignedCompanies) ? unassignedCompanies : [];
		const assignNames = Array.isArray(assignedCompanies) ? [...assignedCompanies] : [];
		// mirrors the `else if (companyId?.name)` branch below
		if (unassignIds.length === 0 && companyId?.name) assignNames.push(companyId.name);
		if (assignNames.length || unassignIds.length) {
			const callerId = String(req.user?.id);
			const [allowedNames, allowedIds] = await Promise.all([
				getUserCompanyNames(callerId),
				getUserCompanyIds(callerId),
			]);
			const denied = [
				...assignNames.filter((n) => typeof n !== "string" || !allowedNames.has(n)),
				...unassignIds.filter((id) => !allowedIds.has(String(id))),
			];
			if (denied.length) {
				return res.status(403).json({
					message: "You do not have access to this company",
					code: "COMPANY_ACCESS_DENIED",
				});
			}
			// AUD-028: `role` becomes the user's employmentRole in every assigned
			// company; it must be one the caller may grant there (client ROLE_ACCESS).
			const roleDenials = await findRoleAssignmentDenials({
				callerId,
				targetUserId: userId,
				role,
				companyNames: assignNames,
			});
			if (roleDenials.length && denyRoleAssignment(req, res, roleDenials)) return;
		}
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
		} else if (companyId?.name) {
			const result = await updateCompanyEmployee(companyId.name, userId, role);
			compArr.push(result);
		}

		const updateData = { ...req.body };
		for (const field of PROTECTED_USER_FIELDS) delete updateData[field];
		// Preserved from the original implementation: companyId mirrors the companies
		// touched in this request (becomes [] on an unassign-only request). Whether that
		// should instead merge with existing memberships is an open business question
		// (docs/CHANGES.md AUD-019).
		updateData.companyId = compArr.filter(Boolean);
		const updatedUser = await Employee.findByIdAndUpdate(
			userId,
			{ $set: updateData },
			{
				new: true,
			},
		);

		return res.status(201).json(updatedUser);
	} catch (err) {
		return res.status(500).json({ message: "Internal Server Error", error: err });
	}
};

const updateUserAssignedLeads = async (req, res) => {
	try {
		const { totalLeadsDisbursed, totalWeight, activeUsers } = await getActiveUsers(req.user?.id);
		console.log(
			"updateUserAssignedLeads",
			req.params,
			totalLeadsDisbursed,
			totalWeight,
			activeUsers,
		);
		for (const user of activeUsers) {
			// NEW-10: a zero total weight used to give NaN.
			const assignedLeads =
				totalWeight > 0
					? Math.round(
							((Number(user.assignedWeight) || 0) / totalWeight) * totalLeadsDisbursed.length,
						)
					: 0;
			await Employee.findByIdAndUpdate(user._id, { $set: { assignedLeads } }, { new: true });
		}
		return res.status(200).json({ message: "Leads assignee updated successfully" });
	} catch (err) {
		return res.status(500).json({ message: "Internal Server Error", error: err });
	}
};

// NEW-10: isActive / assignedWeight / assignedLeads exist only on Employee. The
// query used to run against EmployeeEmploymentInfo (findEmployee), matched nothing
// and would have updated EmploymentInfo ids. It now reads Employee directly and is
// limited to the caller's companies (members and leads), like the other lead routes.
const getActiveUsers = async (userId) => {
	const companyNames = [...(await getUserCompanyNames(String(userId)))];
	const memberIds = companyNames.length ? await getCompanyMemberIds(companyNames) : [];
	const totalLeadsDisbursed = await Lead.find({
		isDisbursed: true,
		isDisbursedConfirmed: false,
		companyName: { $in: companyNames },
	})
		.select("_id")
		.lean();
	const activeUsers = await Employee.find({ isActive: true, _id: { $in: memberIds } })
		.select("_id assignedWeight")
		.lean();
	const totalWeight = (activeUsers || []).reduce(
		(sum, item) => sum + (Number(item.assignedWeight) || 0),
		0,
	);
	return { totalLeadsDisbursed: totalLeadsDisbursed || [], totalWeight, activeUsers: activeUsers || [] };
};

// NEW-05: extra pay runs store the selected employees by full name. Resolve each
// name only among the members of `companyName`; names that match no member are
// skipped (logged) instead of producing an entry without an employee id.
const getEmployeeId = async (empList, companyName) => {
	if (!isCompanyNameValue(companyName)) {
		throw new Error("getEmployeeId: companyName is required");
	}
	const names = (Array.isArray(empList) ? empList : []).filter((n) => typeof n === "string" && n);
	if (names.length === 0) return [];
	const memberIds = await getCompanyMemberIds([companyName]);
	const list = [];
	for (const fullName of names) {
		const employee = memberIds.length
			? await Employee.findOne({ fullName, _id: { $in: memberIds } })
			: null;
		if (!employee) {
			console.warn("NEW-05: extra-run employee not found in company", { companyName, fullName });
			continue;
		}
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
		? await getEmployeeId(employees, companyName)
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
