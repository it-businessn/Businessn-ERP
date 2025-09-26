const Company = require("../models/Company");
const Employee = require("../models/Employee");
const UserActivity = require("../models/UserActivity");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");

const { hashPassword, comparePassword } = require("../services/passwordService");
const { findCompany, addEmployee } = require("../helpers/userHelper");
const { generateAccessToken, generateRefreshToken, verifyToken } = require("../middleware/auth");

const login = async (req, res) => {
	const { email, password, companyId } = req.body;

	try {
		const user = await Employee.findOne({ email }).select(
			"firstName lastName middleName fullName email password phoneNumber primaryAddress manager",
		);
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
		const hashedPassword = await hashPassword(password);
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
			password: hashedPassword,
			fullName: `${firstName} ${middleName} ${lastName}`,
		});

		res.status(201).json(employee);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = {
	signUp,
	login,
	logOut,
	refreshToken,
};
