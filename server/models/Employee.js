const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
	{
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
		firstName: String,
		middleName: String,
		lastName: String,
		fullName: String,
		email: { type: String, unique: true },
		password: String,
		position: String,
		isActive: Boolean,
		dateOfJoining: Date,
		phoneNumber: String,
		userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		manager: String,
		assignedLeads: { type: Number, default: 0 },
		leads: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lead" }],
		assignedWeight: { type: Number, default: 0 },
		companyId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }],
		baseModule: [{ type: String, ref: "Module" }],
		department: [{ type: String, ref: "Department" }],
		payrollStatus: { type: String, ref: "EmployeeProfileInfo" },
		timeManagementBadgeID: String,
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);
// SCHEMA-CLEANUP: removed fields that nothing reads or writes: secondaryAddress,
// lastLogin, employmentType (the role is EmployeeEmploymentInfo.employmentRole),
// emailVerified, emergencyContact (kept in EmployeeProfileInfo), otp, managerId,
// updatedBy. Values already stored are cleared by
// scripts/remove-unused-employee-fields.js.
const REMOVED_EMPLOYEE_FIELDS = [
	"secondaryAddress",
	"lastLogin",
	"employmentType",
	"emailVerified",
	"emergencyContact",
	"otp",
	"managerId",
	"updatedBy",
];

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
module.exports.REMOVED_EMPLOYEE_FIELDS = REMOVED_EMPLOYEE_FIELDS;

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
