const Company = require("../models/Company");
const Employee = require("../models/Employee");
const UserActivity = require("../models/UserActivity");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");

const { hashPassword, comparePassword } = require("../services/passwordService");
const { generateAccessToken, generateRefreshToken, verifyToken } = require("../middleware/auth");
const CONFIG = require("../config/app.config");
const { addEmployee, findCompany } = require("../services/userService");

const login = async (req, res) => {
	const { email, password, companyId } = req.body;

	try {
		const user = await Employee.findOne({ email }).select(
			"firstName lastName middleName fullName email password phoneNumber primaryAddress manager",
		);
		if (!user) {
			return res.status(404).json({ message: "User does not exist" });
		}
		const { _id, firstName, lastName, middleName, fullName, phoneNumber, primaryAddress, manager } =
			user;

		const existingCompanyUser = await Company.findOne({
			registration_number: companyId,
			employees: user._id,
		}).select("name registration_number address");

		if (!existingCompanyUser) {
			return res.status(404).json({ message: "User does not exist for the company" });
		}
		// const existingCompany = await findCompany("registration_number", companyId);

		const empInfo = await EmployeeEmploymentInfo.findOne({
			companyName: existingCompanyUser.name,
			empId: user._id,
		}).select("positions employeeNo payrollStatus employmentRole");

		const existingProfileInfo = await EmployeeProfileInfo.findOne({
			password,
			companyName: existingCompanyUser.name,
			$or: [{ useremail: email }, { businessEmail: email }, { businessemail: email }],
		});

		const profilePwdMatch = existingProfileInfo?.password
			? await comparePassword(password, user?.password)
			: false;

		const match = user?.password ? await comparePassword(password, user?.password) : false;

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
					employmentType: empInfo?.employmentRole,
					employeeId: empInfo?.employeeNo,
					payrollStatus: empInfo?.payrollStatus,
					phoneNumber,
					primaryAddress,
					manager,
				},
				existingCompanyUser,
				accessToken,
				refreshToken,
			});
		}
		return res.status(401).json({ message: "Invalid credentials. Please reset your password!" });
	} catch (error) {
		console.error("❌ Login error:", {
			message: error.message,
			stack: error.stack,
			body: req.body,
		});
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

const logOut = async (req, res) => {
	const { id } = req.params;

	try {
		if (!id) {
			return res.status(400).json({ message: "User ID is required" });
		}
		if (req.cookies) {
			for (const cookieName in req.cookies) {
				if (Object.prototype.hasOwnProperty.call(req.cookies, cookieName)) {
					res.clearCookie(cookieName, {
						httpOnly: true,
						secure: process.env.NODE_ENV === "production",
						sameSite: "None",
						path: "/",
					});
				}
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
		console.error("❌ Logout error:", {
			message: error.message,
			stack: error.stack,
		});
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

const logUserLoginActivity = async (userID) => {
	try {
		if (!userID) {
			console.warn("Missing userID in login activity");
			return;
		}
		// Close any previous open sessions
		await UserActivity.updateMany(
			{ userID, logoutTime: null },
			{ $set: { logoutTime: new Date() } },
		);
		const activity = new UserActivity({
			userID,
			loginTime: new Date(),
		});
		await activity.save();
	} catch (error) {
		console.error("Login activity error:", {
			message: error.message,
			stack: error.stack,
		});
	}
};

const refreshToken = async (req, res) => {
	const { refreshToken } = req.body;
	try {
		if (!refreshToken) {
			return res.status(401).json({ message: "Refresh token is required" });
		}
		const user = verifyToken(refreshToken, CONFIG.REFRESH_TOKEN_SECRET);
		if (!user || !user._id) {
			return res.status(403).json({ message: "Invalid refresh token payload" });
		}
		const newAccessToken = generateAccessToken({
			id: user?._id,
			username: user?.username,
		});
		return res.json({ accessToken: newAccessToken });
	} catch (error) {
		if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
			return res.status(403).json({ message: "Invalid or expired refresh token" });
		}
		console.error("Error verifying refresh token:", {
			message: error.message,
			stack: error.stack,
		});
		return res.status(500).json({ message: "Internal Server Error" });
	}
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
		department,
		baseModule,
		manager,
		phoneNumber,
		primaryAddress,
		employmentType,
	} = req.body;
	const { streetNumber, city, state, postalCode, country } = primaryAddress || {};

	// const updatedData = { companyId: "6646b03e96dcdc0583fb5dca" };for fd
	// const updatedLeads = await Employee.updateMany({}, { $set: updatedData });
	// console.log(updatedLeads);

	try {
		if (!email || !password) {
			return res.status(400).json({ message: "Email and password are required" });
		}
		const existingUser = await Employee.findOne({ email });
		if (existingUser) {
			return res.status(409).json({ message: "User already exists" });
		}
		const hashedPassword = await hashPassword(password);
		const data = {
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
			password: hashedPassword,
			fullName: [firstName, middleName, lastName].filter(Boolean).join(" "),
		};

		const employee = await addEmployee(company, data);
		return res.status(201).json(employee);
	} catch (error) {
		console.error("Create employee error:", {
			message: error.message,
			stack: error.stack,
		});
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

module.exports = {
	signUp,
	login,
	logOut,
	refreshToken,
};
