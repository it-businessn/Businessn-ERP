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
	SALES_ASSOCIATE_PERMISSION,
} = require("../services/data");

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
	const isManager =
		role?.includes("Administrators") ||
		role?.includes("Technical Administrator");

	// const updatedData = { companyId: "6646b03e96dcdc0583fb5dca" };for fd
	// const updatedLeads = await Employee.updateMany({}, { $set: updatedData });
	// console.log(updatedLeads);

	try {
		const hashedPassword = await hashPassword(password);

		const existingCompany = await Company.findOne({ name: company });
		const employee = await Employee.create({
			companyId: existingCompany._id,
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

		setInitialPermissions(employee._id, isManager, company);
		// setCompanyEmployee(employee._id, existingCompany);

		existingCompany.employees.push(employee._id);
		await existingCompany.save();

		res.status(201).json(employee);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// const setCompanyEmployee = async (empId, existingCompany) => {
// 	existingCompany.employees.push(empId);
// 	await existingCompany.save();
// };

const setInitialPermissions = async (empId, isManager, companyName) => {
	try {
		const userPermission = new UserPermissions({
			empId,
			companyName,
		});
		if (isManager) {
			ADMIN_PERMISSION.forEach((_) => {
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
			SALES_ASSOCIATE_PERMISSION.forEach((_) => {
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
	const { email, password } = req.body;

	try {
		const user = await Employee.findOne({ email }).populate({
			path: "companyId",
			model: "Company",
			select: "name",
		});

		// user.companyId.push("6667917cd1855c4803b54574");
		// await user.save();
		// const existingCompany = await Company.findById("6667917cd1855c4803b54574");
		// existingCompany.employees.push(user._id);
		// await existingCompany.save();

		if (!user) {
			return res.status(500).json({ error: "User does not exist" });
		}
		logUserLoginActivity(user._id);

		// return res.json({ message: "Login successful", user });

		const match = await comparePassword(password, user.password);
		return match
			? res.json({ message: "Login successful", user })
			: res.status(401).json({ error: "Invalid password" });
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
		const hashedPassword = hashSyncPassword(newPassword);
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
};
