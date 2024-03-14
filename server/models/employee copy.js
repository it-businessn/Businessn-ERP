const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const otpGenerator = require("otp-generator");

const {
	EmergencyContact,
	ModeOfPayment,
	Address,
} = require("./additionalDetail");
const BankDetail = require("./bankDetail");

const { Schema } = mongoose;

const employeeSchema = new Schema(
	{
		companyId: {
			type: String,
			required: true,
			default: "BN-1034",
			// ref: "Company",
		},
		firstName: {
			type: String,
			required: true,
		},
		middleName: String,
		lastName: String,
		fullName: String,
		email: { type: String, unique: true, required: true },
		password: {
			type: String,
			required: true,
		},
		role: { type: String, required: true, ref: "EmployeeRole" },
		department: {
			type: String,
			required: true,
		},
		manager: {
			type: String,
			required: true,
		},
		lastActive: String,
		leaveBalance: Number,
		onProbation: Boolean,
		employmentType: { type: String, required: true },
		leaveUsed: Number,
		totalAvailableLeave: Number,
		emailVerified: Boolean,
		dateOfJoining: {
			type: Date,
			required: true,
		},
		phoneNumber: {
			type: String,
			required: true,
		},
		address: {
			type: Address,
			required: true,
		},
		emergencyContact: {
			type: EmergencyContact,
			required: false,
		},
		preferredModeOfPayment: {
			type: ModeOfPayment,
			required: false,
		},
		bankDetails: BankDetail,
		annualSalary: Number,
		payslipHistory: [],
		otp: String,
	},
	{ timestamps: true },
	{ collection: "Employee" },
);

//static login method
employeeSchema.statics.login = async function (email, password) {
	if (!email || !password) {
		throw Error("All fields must be filled");
	}

	const employee = await this.findOne({ email });
	if (!employee) {
		throw Error("Incorrect email");
	}

	const match = await bcrypt.compare(password, employee.password);
	if (!match) {
		throw Error("Incorrect password");
	}

	return employee;
};

//static signup method
employeeSchema.statics.signUp = async function (data) {
	const {
		companyId,
		firstName,
		lastName,
		email,
		role,
		department,
		manager,
		password,
		dateOfJoining,
		phoneNumber,
		postalCode,
		streetNumber,
		country,
		city,
		state,
		currency,
		employmentType,
	} = data;

	//validation
	if (!email || !password) {
		throw Error("All fields must be filled");
	}

	if (!validator.isEmail(email)) {
		throw Error("Email not valid");
	}

	if (!validator.isStrongPassword(password)) {
		throw Error("Password not strong enough!");
	}

	const exists = await this.findOne({ email });
	if (exists) {
		throw Error("Email already in use");
	}

	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);

	const otpGenerated = otpGenerator.generate(6, {
		upperCaseAlphabets: false,
		specialChars: false,
	});

	const employee = await this.create({
		companyId,
		firstName,
		lastName,
		email,
		role,
		department,
		employmentType,
		manager,
		password: hash,
		otp: otpGenerated,
		dateOfJoining,
		phoneNumber,
		address: {
			postalCode,
			streetNumber,
			country,
			city,
			state,
		},
		bankDetails: { currency },
	});

	return employee;
};

module.exports = mongoose.model("Employee", employeeSchema);
