const jwt = require("jsonwebtoken");
const Company = require("../models/Company");
const Employee = require("../models/Employee");
const UserActivity = require("../models/UserActivity");
const UserPermissions = require("../models/permissions");

const { hashPassword, comparePassword, hashSyncPassword } = require("../services/passwordService");
const { getResetPasswordLink } = require("../services/tokenService");
const { sendEmail } = require("../services/emailService");
const {
	CLIENT_ORG_ADMIN_PERMISSION,
	CLIENT_ORG_EMP_PERMISSION,
	BUSINESSN_ORG,
	ROLES,
} = require("../services/data");
const { generateAccessToken, generateRefreshToken } = require("../middleware/auth");
const { findPermission } = require("./permissionController");

const findCompany = async (key, value) => await Company.findOne({ [key]: value });

const getPayrollActiveEmployees = async (companyName) => {
	const existingCompany = await findCompany("name", companyName);
	let result = await Employee.find({
		payrollStatus: "Payroll Active",
		companyId: existingCompany._id,
	})
		.select([
			"fullName",
			"payrollStatus",
			"employeeNo",
			"timeManagementBadgeID",
			"department",
			"email",
		])
		.sort({
			fullName: 1,
		});
	if (companyName !== BUSINESSN_ORG) {
		result = result?.filter(() => emp?.role !== ROLES.SHADOW_ADMIN);
	}
	return result;
};

const addEmployee = async (name, data) => {
	const existingCompany = await findCompany("name", name);
	data.companyId = existingCompany._id;
	const newEmployee = await Employee.create(data);

	if (newEmployee && existingCompany) {
		existingCompany.employees.push(newEmployee._id);
		await existingCompany.save();
	}
	return newEmployee;
};

const hashedPassword = async (pwd) => await hashPassword(pwd);

const signUp = async (req, res) => {
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
		baseModule,
		manager,
		phoneNumber,
		primaryAddress,
		employmentType,
	} = req.body;
	const { streetNumber, city, state, postalCode, country } = primaryAddress;

	// const updatedData = { companyId: "6646b03e96dcdc0583fb5dca" };for fd
	// const updatedLeads = await Employee.updateMany({}, { $set: updatedData });
	// console.log(updatedLeads);

	try {
		const employee = await addEmployee(company, {
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
			password: await hashedPassword(password),
			fullName: `${firstName} ${middleName} ${lastName}`,
		});

		res.status(201).json(employee);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const setInitialPermissions = async (empId, isManager, companyName) => {
	const permissionName = isManager ? CLIENT_ORG_ADMIN_PERMISSION : CLIENT_ORG_EMP_PERMISSION;
	try {
		const permissionExists = await findPermission({
			empId,
			companyName,
		});
		if (!permissionExists) {
			const userPermission = new UserPermissions({
				empId,
				companyName,
			});
			userPermission.permissionType = [];

			if (isManager) {
				const permissionObj = {
					canAccessModule: true,
					canAccessUserData: true,
					canAccessGroupData: true,
					canAccessRegionData: true,
					canAccessAllData: true,
					canViewModule: true,
					canEditModule: true,
					canDeleteModule: true,
				};
				permissionName.forEach((_) => {
					permissionObj.name = _.name;
					userPermission.permissionType.push(permissionObj);
				});
			} else {
				const permissionObj = {
					canAccessModule: true,
					canAccessUserData: true,
					canAccessGroupData: false,
					canAccessRegionData: false,
					canAccessAllData: false,
					canViewModule: true,
					canEditModule: true,
					canDeleteModule: false,
				};
				permissionName.forEach((_) => {
					permissionObj.name = _.name;
					userPermission.permissionType.push(permissionObj);
				});
			}
			await userPermission.save();
		}
	} catch (error) {
		console.log(error);
	}
};

const refreshToken = async (req, res) => {
	const { refreshToken } = req.body;
	try {
		if (!refreshToken) {
			return res.status(401).json({ message: "Refresh token is required" });
		}
		jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
			if (err) {
				return res.status(403).json({ error: "Invalid or expired refresh token" });
			}
			const newAccessToken = generateAccessToken({
				id: user._id,
				username: user.username,
			});
			res.json({ accessToken: newAccessToken });
		});
	} catch (error) {
		console.error("Error checking password:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

const login = async (req, res) => {
	const { email, password, companyId } = req.body;

	try {
		const user = await Employee.findOne({ email }).select(
			"firstName lastName middleName fullName email password role department phoneNumber primaryAddress employmentType manager employeeId payrollStatus",
		);
		// if (!user.companyId) {
		// 	user.companyId = [];
		// user.companyId.push("669c3a69b52384bab5035425");
		// await user.save();
		// const existingCompany = await Company.findById("669c3a69b52384bab5035425");
		// existingCompany.employees.push(user._id);
		// await existingCompany.save();
		// }

		// console.log(user);
		if (!user) {
			return res.status(500).json({ error: "User does not exist" });
		}

		const {
			_id,
			firstName,
			lastName,
			middleName,
			fullName,
			role,
			department,
			phoneNumber,
			primaryAddress,
			employmentType,
			manager,
			employeeId,
			payrollStatus,
		} = user;

		const isShadowAdmin = user?.role === ROLES.SHADOW_ADMIN;

		const filterCompanyData = isShadowAdmin
			? {
					registration_number: companyId,
			  }
			: {
					registration_number: companyId,
					employees: user._id,
			  };
		const existingCompanyUser = await Company.findOne(filterCompanyData).select(
			"name registration_number address",
		);

		if (!existingCompanyUser) {
			return res.status(500).json({ error: "User does not exist for the company" });
		}
		const match = await comparePassword(password, user.password);
		if (match) {
			const accessToken = generateAccessToken({ id: _id, fullName });
			const refreshToken = generateRefreshToken({ id: _id, fullName });

			logUserLoginActivity(_id);
			return res.json({
				message: "Logged in successfully",
				user: {
					isShadowAdmin,
					_id,
					firstName,
					lastName,
					middleName,
					fullName,
					email,
					role,
					department,
					phoneNumber,
					primaryAddress,
					employmentType,
					manager,
					employeeId,
					payrollStatus,
				},
				existingCompanyUser,
				accessToken,
				refreshToken,
			});
		}
		return res.status(401).json({ error: "Invalid credentials" });
	} catch (error) {
		console.error("Error checking password:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

const logUserLoginActivity = async (userID) => {
	try {
		const loginTime = new Date();
		const activity = new UserActivity({
			userID,
			loginTime,
		});
		await activity.save();
	} catch (error) {
		console.error("Error in login activity:", error);
	}
};

const logOut = async (req, res) => {
	const { id } = req.params;

	try {
		for (const cookieName in req.cookies) {
			if (req.cookies.hasOwnProperty(cookieName)) {
				res.clearCookie(cookieName, {
					httpOnly: true,
					secure: true,
					sameSite: "None",
					path: "/",
				});
			}
		}
		const logoutTime = new Date();
		const activity = await UserActivity.findOne({
			userID: id,
			logoutTime: null,
		});

		if (activity) {
			activity.logoutTime = logoutTime;
			await activity.save();
			console.log(`User ${id} logged out at ${logoutTime}`);
		} else {
			console.log(`User ${id} is not logged in.`);
		}
		return res.json({ message: "Logged out successfully", activity });
	} catch (error) {
		return res.status(500).json({ error: "Internal server error" });
	}
};

const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await Employee.findOne({ email });
		if (!user) {
			return res.status(404).json({
				error: "Email not found! Please enter your registered email address.",
			});
		}

		const emailURL = getResetPasswordLink(user._id);
		await sendEmail(user.email, "Reset Password", emailURL);

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
			status: "Not verified",
		});
	} catch (error) {
		res.status(500).json({ message: "User not verified!" });
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
		const hashedPassword = await hashPassword(password);
		await Employee.findByIdAndUpdate(
			{ _id: id },
			{
				$set: { password: hashedPassword },
			},
		);
		res.render("index", { email: user.email, status: "Verified" });
	} catch (error) {
		res.status(500).json({ message: "Something Went Wrong" });
	}
};

const changePassword = async (req, res) => {
	const { newPassword } = req.body;
	const { id } = req.params;
	try {
		if (!newPassword) {
			throw new Error("New password is required");
		}
		const hashedPassword = await hashSyncPassword(newPassword);
		const result = await Employee.findByIdAndUpdate(
			id,
			{ password: hashedPassword },
			{
				new: true,
			},
		);
		res.status(201).json({
			message: "Password changed successfully",
			result,
		});
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = {
	signUp,
	login,
	logOut,
	resetPassword,
	forgotPassword,
	setNewPassword,
	changePassword,
	setInitialPermissions,
	addEmployee,
	findCompany,
	hashedPassword,
	getPayrollActiveEmployees,
	refreshToken,
};
