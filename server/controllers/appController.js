const Company = require("../models/Company");
const Employee = require("../models/Employee");
const UserActivity = require("../models/UserActivity");
const UserPermissions = require("../models/permissions");

const {
	hashPassword,
	comparePassword,
	hashSyncPassword,
} = require("../services/passwordService");
const { getResetPasswordLink } = require("../services/tokenService");
const { sendEmail } = require("../services/emailService");
const {
	ADMIN_PERMISSION,
	EMPLOYEE_PERMISSION,
	isRoleManager,
	NW_ADMIN_PERMISSION,
	NW_EMPLOYEE_PERMISSION,
} = require("../services/data");

const findCompany = async (key, value) =>
	await Company.findOne({ [key]: value });

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
	const isManager = isRoleManager(role);

	// const updatedData = { companyId: "6646b03e96dcdc0583fb5dca" };for fd
	// const updatedLeads = await Employee.updateMany({}, { $set: updatedData });
	// console.log(updatedLeads);

	try {
		const hashedPassword = await hashPassword(password);

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
			password: hashedPassword,
			fullName: `${firstName} ${middleName} ${lastName}`,
		});

		await setInitialPermissions(employee._id, isManager, company);

		res.status(201).json(employee);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const setInitialPermissions = async (empId, isManager, companyName) => {
	const IS_NICO_WYND_ORG = companyName.includes("NW1378");
	const adminPermissionName = IS_NICO_WYND_ORG
		? NW_ADMIN_PERMISSION
		: ADMIN_PERMISSION;

	const empPermissionName = IS_NICO_WYND_ORG
		? NW_EMPLOYEE_PERMISSION
		: EMPLOYEE_PERMISSION;

	const permissionName = isManager ? adminPermissionName : empPermissionName;
	try {
		const userPermission = new UserPermissions({
			empId,
			companyName,
		});
		userPermission.permissionType = [];

		if (isManager) {
			permissionName.forEach((_) => {
				userPermission.permissionType.push({
					name: _.name,
					canAccessModule: true,
					canAccessUserData: true,
					canAccessGroupData: true,
					canAccessRegionData: true,
					canAccessAllData: true,
					canViewModule: true,
					canEditModule: true,
					canDeleteModule: true,
				});
			});
		} else {
			permissionName.forEach((_) => {
				userPermission.permissionType.push({
					name: _.name,
					canAccessModule: true,
					canAccessUserData: true,
					canAccessGroupData: false,
					canAccessRegionData: false,
					canAccessAllData: false,
					canViewModule: true,
					canEditModule: true,
					canDeleteModule: false,
				});
			});
		}
		await userPermission.save();
	} catch (error) {
		console.log(error);
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
		const existingCompanyUser = await Company.findOne({
			registration_number: companyId,
			employees: user._id,
		}).select("name registration_number");

		if (!existingCompanyUser) {
			return res
				.status(500)
				.json({ error: "User does not exist for the company" });
		}
		logUserLoginActivity(user._id);

		return res.json({ message: "Login successful", user, existingCompanyUser });

		// const match = await comparePassword(password, user.password);
		// return match
		// 	? res.json({ message: "Login successful", user, existingCompanyUser })
		// 	: res.status(401).json({ error: "Invalid password" });
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
		return res.json({ message: "Logout successful", activity });
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
		res.status(201).json({ message: "Password changed successfully", result });
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
};
