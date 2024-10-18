const mongoose = require("mongoose");

const { Schema } = mongoose;
const employeePayslipSchema = new Schema(
	{
		employeeId: {
			type: String,
			ref: "User",
		},
		employeeName: {
			type: String,
			required: false,
		},
		employeeDepartment: {
			type: String,
			required: false,
		},
		month: {
			type: Date,
			required: false,
		},
		year: {
			type: Date,
			required: false,
		},
		paymentDate: {
			type: Date,
			required: false,
		},
		paySlipPeriodStartDate: Date,
		paySlipPeriodEndDate: Date,
		grossIncomePerPayPeriod: {
			type: Number,
			required: true,
		},
		allowances: {
			type: Number,
			required: false,
		},
		deductions: Number,
		totalEarnings: {
			type: Number,
			required: false,
		},
		netSalary: {
			type: Number,
			required: true,
		},
		createdAt: Date,
	},
	{ timestamps: true },
	{ collection: "Payslip" },
);

module.exports = mongoose.model("Payslip", employeePayslipSchema);
