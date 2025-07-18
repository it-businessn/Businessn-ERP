const path = require("path");
const Company = require("../models/Company");
const Employee = require("../models/Employee");
const UserActivity = require("../models/UserActivity");
const UserPermissions = require("../models/permissions");

const { hashPassword, comparePassword, hashSyncPassword } = require("../services/passwordService");
const { getResetPasswordLink } = require("../services/tokenService");
const { sendEmail } = require("../services/emailService");
const {
	ADMIN_PERMISSION,
	CLIENT_ORG_ADMIN_PERMISSION,
	CLIENT_ORG_EMP_PERMISSION,
	ROLES,
} = require("../services/data");
const { generateAccessToken, generateRefreshToken, verifyToken } = require("../middleware/auth");
const { findPermission } = require("./permissionController");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");

const findCompany = async (key, value) => await Company.findOne({ [key]: value });

const getPayrollActiveEmployees = async (companyName, deptName, selectedPayGroupOption) => {
	let result = await EmployeeEmploymentInfo.find({
		payrollStatus: "Payroll Active",
		companyName,
		employmentRole: { $ne: ROLES.SHADOW_ADMIN },
	})
		.populate({
			path: "empId",
			model: "Employee",
			select: ["fullName", "email"],
		})
		.select("payrollStatus employeeNo positions employmentRole");

	result = result?.filter((a) => a.empId);

	if (selectedPayGroupOption) {
		result = result?.filter((emp) =>
			emp?.positions?.find((_) => _.employmentPayGroup === selectedPayGroupOption),
		);
	}
	if (deptName && deptName !== "null") {
		result = result?.filter((emp) => emp?.positions?.[0]?.employmentDepartment === deptName);
	}
	result?.sort((a, b) => {
		if (a.empId?.fullName < b.empId?.fullName) return -1;
		if (a.empId?.fullName > b.empId?.fullName) return 1;
		return a.createdOn - b.createdOn;
	});
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

const getPermissionsList = (role) => {
	const isEmployee = role === ROLES.EMPLOYEE;
	const isEnroller = role === ROLES.ENROLLER;
	const isShadowAdmin = role === ROLES.SHADOW_ADMIN;

	const permissionName = isEmployee
		? CLIENT_ORG_EMP_PERMISSION
		: isShadowAdmin
		? ADMIN_PERMISSION
		: CLIENT_ORG_ADMIN_PERMISSION;

	const permissionType = [];

	if (isEmployee) {
		permissionName.forEach((_) => {
			permissionType.push({
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
	} else if (isEnroller) {
	} else {
		permissionName.forEach((_) => {
			permissionType.push({
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
	}
	return permissionType;
};

const setInitialPermissions = async (empId, role, companyName) => {
	try {
		const permissionExists = await findPermission({
			empId,
			companyName,
		});
		const newPermissions = getPermissionsList(role);
		if (permissionExists) {
			await UserPermissions.findByIdAndUpdate(permissionExists._id, {
				permissionType: newPermissions,
			});
		} else {
			await UserPermissions.create({
				empId,
				companyName,
				permissionType: newPermissions,
			});
		}
	} catch (error) {
		console.log(error);
	}
};

const refreshToken = async (req, res) => {
	const { refreshToken } = req.body;
	try {
		if (!refreshToken) {
			return res
				.status(401)
				.json({ error: "Refresh token is required", message: "Refresh token is required" });
		}
		const user = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);

		const newAccessToken = generateAccessToken({
			id: user._id,
			username: user.username,
		});
		res.json({ accessToken: newAccessToken });
	} catch (error) {
		if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
			return res.status(403).json({ error: "Invalid or expired refresh token" });
		}
		console.error("Error verifying refresh token:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

const login = async (req, res) => {
	const { email, password, companyId } = req.body;

	try {
		const user = await Employee.findOne({ email }).select(
			"firstName lastName middleName fullName email password phoneNumber primaryAddress manager",
		);
		// if (!user.companyId) {
		// 	user.companyId = [];
		// user.companyId.push("669c3a69b52384bab5035425");
		// await user.save();
		// const existingCompany = await Company.findById("669c3a69b52384bab5035425");
		// existingCompany.employees.push(user._id);
		// await existingCompany.save();
		// }
		if (!user) {
			return res.status(500).json({ error: "User does not exist" });
		}
		const { _id, firstName, lastName, middleName, fullName, phoneNumber, primaryAddress, manager } =
			user;

		const existingCompanyUser = await Company.findOne({
			registration_number: companyId,
			employees: user._id,
		}).select("name registration_number address");
		if (!existingCompanyUser) {
			return res.status(500).json({ error: "User does not exist for the company" });
		}
		const existingCompany = await findCompany("registration_number", companyId);

		const empInfo = await EmployeeEmploymentInfo.findOne({
			companyName: existingCompany.name,
			empId: user._id,
		}).select("positions employeeNo payrollStatus employmentRole");

		const existingProfileInfo = await EmployeeProfileInfo.findOne({
			password,
			companyName: existingCompanyUser.name,
		});

		const profilePwdMatch = password === existingProfileInfo?.password;
		const match = await comparePassword(password, user?.password);

		if (match || profilePwdMatch) {
			const accessToken = generateAccessToken({ id: _id, fullName });
			const refreshToken = generateRefreshToken({ id: _id, fullName });

			logUserLoginActivity(_id);
			return res.json({
				message: "Logged in successfully",
				user: {
					_id,
					firstName,
					lastName,
					middleName,
					fullName,
					email,
					role: empInfo?.employmentRole,
					department: empInfo?.positions?.[0]?.employmentDepartment,
					phoneNumber,
					primaryAddress,
					employmentType: empInfo?.employmentRole,
					manager,
					employeeId: empInfo?.employeeNo,
					payrollStatus: empInfo?.payrollStatus,
				},
				existingCompanyUser,
				accessToken,
				refreshToken,
			});
		}
		return res.status(401).json({ error: "Invalid credentials. Please reset your password!" });
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
		const user = await Employee.findOne({ email }).sort({
			createdOn: -1,
		});
		if (!user) {
			return res.status(404).json({
				error: "Please enter the email you used to register.",
			});
		}

		const resetLink = getResetPasswordLink({ _id: user._id });
		if (resetLink)
			await sendEmail(
				user.email,
				"Reset Password for Businessᴺ",
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
				Reset Password
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
      <p style="margin: 5px 0">Hello ${user.firstName},</p>
      <p>You requested a password reset.</p>
	  <p>If you would still like to reset your password, please click the following link. </p>
      <p><a href="${resetLink}" target="_blank">Reset Password</a></p>
      <p>If you did not request this, you can safely ignore this email.</p>
      <p>Kind Regards,</p>
	   <p>Administrator
	  <br>Businessᴺ</p>
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

		return res.status(200).json({
			message: "Please check your email inbox for a link to reset your password.",
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
		await EmployeeProfileInfo.updateMany({ empId: user._id }, { $set: { password } });
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
