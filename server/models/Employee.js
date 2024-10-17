const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
	employeeId: {
		type: String,
		default: "20240001",
		ref: "Company",
	},
	employeeNo: String,
	primaryAddress: {
		type: Object,
		streetNumber: String,
		city: String,
		state: String,
		postalCode: String,
		country: String,
	},
	secondaryAddress: {
		type: Object,
		streetNumber: String,
		city: String,
		state: String,
		postalCode: String,
		country: String,
	},
	firstName: {
		type: String,
		required: true,
	},
	middleName: String,
	lastName: String,
	fullName: String,
	email: { type: String, unique: true },
	password: {
		type: String,
	},
	role: { type: String, ref: "EmployeeRole" },

	isActive: Boolean,
	lastLogin: String,
	employmentType: { type: String, ref: "EmploymentType" },
	dateOfJoining: Date,
	emailVerified: Boolean,
	phoneNumber: {
		type: String,
	},
	emergencyContact: {
		firstName: String,
		middleName: String,
		lastName: String,
		relationShip: String,
		emergencyContactNumber: String,
	},
	otp: String,
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	manager: String,
	managerId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
	assignedLeads: { type: Number, default: 0 },
	leads: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lead" }],
	assignedWeight: { type: Number, default: 0 },
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
	updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
	companyId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }],
	baseModule: [{ type: String, ref: "Module" }],
	department: [{ type: String, ref: "Department" }],
	payrollStatus: { type: String, ref: "EmployeeProfileInfo" },
	timeManagementBadgeID: String,
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;

// assignedLeads: Number,
// assignedAreas: Object,
// assignedProducts: Object,
// assignedWeight: Number,
// leaveBalance: Number,
// onProbation: Boolean,
// leaveUsed: Number,
// totalAvailableLeave: Number,
// bankDetails: BankDetail,
// annualSalary: Number,
// payslipHistory: [],
// preferredModeOfPayment: {
// 	type: ModeOfPayment,
// 	required: false,
// },
// bankDetails: BankDetail,
// annualSalary: Number,
// payslipHistory: [],
