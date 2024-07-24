const mongoose = require("mongoose");

const employeeBalanceInfoSchema = new mongoose.Schema({
	empId: { type: String, ref: "Employee" },
	companyName: { type: String, ref: "Company" },
	vacationAvailableBalance: String,
	availableStartOFYear: String,
	accruedBalance: String,
	usedBalance: String,
	regPayHoursYTD: String,
	overTimePayHoursYTD: String,
	dblOverTimePayHoursYTD: String,
	statWorkPayHoursYTD: String,
	statPayHoursYTD: String,
	sickPayHoursYTD: String,
	vacationPayHoursYTD: String,
	regPayDollarsYTD: String,
	overTimePayDollarsYTD: String,
	dblOverTimePayDollarsYTD: String,
	statWorkPayDollarsYTD: String,
	statPayDollarsYTD: String,
	sickPayDollarsYTD: String,
	vacationDollarsYTD: String,
	longTermDisabilityEE_YTD: String,
	dentalEE_YTD: String,
	extendedHealthEE_YTD: String,
	unionDuesYTD: String,
	longTermDisabilityER_YTD: String,
	dentalER_YTD: String,
	extendedHealthER_YTD: String,
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
});

const EmployeeBalanceInfo = mongoose.model(
	"EmployeeBalanceInfo",
	employeeBalanceInfoSchema,
);

module.exports = EmployeeBalanceInfo;
