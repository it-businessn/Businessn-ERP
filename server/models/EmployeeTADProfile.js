const mongoose = require("mongoose");

const employeeTADProfileInfoSchema = new mongoose.Schema(
	{
		empId: { type: String, ref: "Employee" },
		companyName: { type: String, ref: "Company" },
		firstName: String,
		middleName: String,
		lastName: String,
		cardNum: String,
		timeManagementBadgeID: String,
		tadDevice: String,
		isNewUser: { type: Boolean, default: true },
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const EmployeeTADProfileInfo = mongoose.model(
	"EmployeeTADProfileInfo",
	employeeTADProfileInfoSchema,
);

module.exports = EmployeeTADProfileInfo;
