const Company = require("../models/Company");
const Employee = require("../models/Employee");
const UserActivity = require("../models/UserActivity");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");

const { hashPassword, comparePassword } = require("../services/passwordService");
const { generateAccessToken, generateRefreshToken, verifyToken } = require("../middleware/auth");
const CONFIG = require("../config/app.config");
const { addEmployee } = require("../services/userService");

const login = async (req, res) => {
	const { email, password, companyId } = req.body;

	if (!email || !password || !companyId) {
		return res.status(400).json({ message: "Email, password, and company ID are required" });
	}
	// BUG-04: a JSON body can carry objects such as { "$ne": null }, which
	// Mongoose passes through as query operators. Only plain strings are valid.
	if ([email, password, companyId].some((v) => typeof v !== "string")) {
		return res.status(400).json({ message: "Email, password, and company ID must be text" });
	}

	try {
		const user = await Employee.findOne({ email }).select(
			"firstName lastName middleName fullName email password phoneNumber primaryAddress manager",
		);
		if (!user) {
			// Consistent message to prevent user enumeration
			return res.status(401).json({ message: "Invalid credentials. Please reset your password!" });
		}

		const { _id, firstName, lastName, middleName, fullName, phoneNumber, primaryAddress, manager } =
			user;

		const existingCompanyUser = await Company.findOne({
			registration_number: companyId,
			employees: user._id,
		}).select("name registration_number address");

		if (!existingCompanyUser) {
			return res.status(401).json({ message: "Invalid credentials. Please reset your password!" });
		}

		const empInfo = await EmployeeEmploymentInfo.findOne({
			companyName: existingCompanyUser.name,
			empId: user._id,
		}).select("positions employeeNo payrollStatus employmentRole");

		// FIX: Compare password against Employee.password (hashed) only.
		// Previously the code also queried EmployeeProfileInfo by plaintext password
		// which stored unhashed passwords — a critical security vulnerability.
		if (!user.password) {
			return res.status(401).json({ message: "Invalid credentials. Please reset your password!" });
		}

		const match = await comparePassword(password, user.password);

		if (!match) {
			return res.status(401).json({ message: "Invalid credentials. Please reset your password!" });
		}

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
	} catch (error) {
		console.error("❌ Login error:", {
			message: error.message,
			stack: error.stack,
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
		// FIX: Token payload uses `id` key, not `_id`. Corrected check.
		const decoded = verifyToken(refreshToken, CONFIG.REFRESH_TOKEN_SECRET);
		if (!decoded || !decoded.id) {
			return res.status(403).json({ message: "Invalid refresh token payload" });
		}
		const newAccessToken = generateAccessToken({
			id: decoded.id,
			fullName: decoded.fullName,
		});
		return res.json({ accessToken: newAccessToken });
	} catch (error) {
		console.error("Error verifying refresh token:", {
			message: error.message,
			stack: error.stack,
		});
		return res.status(403).json({ message: "Invalid or expired refresh token" });
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

	try {
		if (!email || !password) {
			return res.status(400).json({ message: "Email and password are required" });
		}
		// SIGNUP-01: same rule as login (BUG-04): operator objects are not e-mails.
		if (typeof email !== "string" || typeof password !== "string") {
			return res.status(400).json({ message: "Email and password must be text" });
		}
		if (password.length < 8) {
			return res.status(400).json({ message: "Password must be at least 8 characters" });
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
		// SIGNUP-01: the 201 body used to include the bcrypt password hash (and otp).
		const body = typeof employee?.toObject === "function" ? employee.toObject() : { ...employee };
		delete body.password;
		delete body.otp;
		return res.status(201).json(body);
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
