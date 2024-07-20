const mongoose = require("mongoose");

const employeeBalanceInfoSchema = new mongoose.Schema({
	empId: { type: String, ref: "Employee" },
	companyName: { type: String, ref: "Company" },
	vacationAvailableBalance: Number,
	availableStartOFYear: Number,
	accruedBalance: Number,
	usedBalance: Number,
	regPayHoursYTD: Number,
	overTimePayHoursYTD: Number,
	dblOverTimePayHoursYTD: Number,
	statWorkPayHoursYTD: Number,
	statPayHoursYTD: Number,
	sickPayHoursYTD: Number,
	vacationPayHoursYTD: Number,
	regPayDollarsYTD: Number,
	overTimePayDollarsYTD: Number,
	dblOverTimePayDollarsYTD: Number,
	statWorkPayDollarsYTD: Number,
	statPayDollarsYTD: Number,
	sickPayDollarsYTD: Number,
	vacationDollarsYTD: Number,
	longTermDisabilityEE_YTD: Number,
	dentalEE_YTD: Number,
	extendedHealthEE_YTD: Number,
	unionDuesYTD: Number,
	longTermDisabilityER_YTD: Number,
	dentalER_YTD: Number,
	extendedHealthER_YTD: Number,
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
});

const EmployeeBalanceInfo = mongoose.model(
	"EmployeeBalanceInfo",
	employeeBalanceInfoSchema,
);

module.exports = EmployeeBalanceInfo;
