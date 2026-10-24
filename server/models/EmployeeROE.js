const mongoose = require("mongoose");

const employeeROESchema = new mongoose.Schema(
	{
		empId: { type: String, ref: "Employee" },
		companyName: { type: String, ref: "Company" },
		serialNoAmended: String,
		payrollReferenceNumber: String,
		payPeriodType: String,
		payPeriodId: String,
		firstName: String,
		middleName: String,
		lastName: String,
		SIN: String,
		SINIv: String,
		streetAddress: String,
		streetAddressSuite: String,
		city: String,
		province: String,
		country: String,
		postalCode: String,
		employmentStartDate: Date,
		employmentLeaveDate: Date,
		finalPayPeriodEndDate: Date,
		reasonCode: String,
		expectedRecallDate: String,
		recallDate: Date,
		contactExtNumber: String,
		contactName: String,
		contactTelNumber: String,
		issuerExtNumber: String,
		issuerName: String,
		issuerTelNumber: String,
		totalInsurableHours: String,
		totalInsurableEarnings: String,
		preferredCommunication: String,
		insurableHours: { type: Array, default: [] },
		insurableEarnings: { type: Array, default: [] },
		vacationPayCode: String,
		vacationPayStartDate: Date,
		vacationPayEndDate: Date,
		vacationPayAmount: String,
		statHolidayPay: { type: Array, default: [] },
		otherMoney: { type: Array, default: [] },
		reviewComments: String,
		specialPayments: { type: Array, default: [] },
		occupation: { type: Array, default: [] },
		// ROE-01: Draft until submitted; a submitted ROE is kept as issued
		status: { type: String, default: "Draft" },
		submittedOn: Date,
		craBusinessNumber: String,
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

employeeROESchema.index({ companyName: 1, empId: 1, createdOn: -1 });

const EmployeeROE = mongoose.model("EmployeeROE", employeeROESchema);

module.exports = EmployeeROE;
