const mongoose = require("mongoose");

const { Schema } = mongoose;
const payrollEmployeeSchema = new Schema(
	{
		employeeId: {
			type: String,
			ref: "Employee",
		},
		employeeName: {
			type: String,
		},
		employeeDepartment: {
			type: String,
			required: false,
		},
		employerName: {
			type: String,
			// ref: "Company",
			required: false,
		},
		// isClergyMember: Boolean,
		// provinceOfEmployment: String,
		// paymentDate: Date,
		// payPeriodFrequency: String,
		grossIncomePerPayPeriod: Number,
		totalDeductions: {
			type: Number,
		},
		// grossIncomeVacationPay: Number,
		netPay: {
			type: Number,
		},
		paymentDate: {
			type: Number,
			default: Date.now(),
		},
		payrollPeriodStartDate: Date,
		payrollPeriodEndDate: Date,
		// paymentMethod: {
		//   type: String,
		//   required: true,
		// },
		// payrollPaid: Boolean,
		// nextPayDate: {
		//     type: Date,
		//     required: true,
		// },
		// basicSalary: {
		//   type: Number,
		//   required: true,
		// },
		// deductions: [
		//   {
		//     type: Object,
		//   },
		// ],
		// totalEarnings: {
		//   type: Number,
		//   required: true,
		// },
	},
	{ timestamps: true },
	{ collection: "Payroll" },
);

module.exports = mongoose.model("Payroll", payrollEmployeeSchema);
