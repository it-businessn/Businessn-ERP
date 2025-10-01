const mongoose = require("mongoose");

const employmentPositionRoleSchema = new mongoose.Schema(
	{
		name: String,
		description: String,
		employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
		companyName: { type: String, ref: "Company" },
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const EmploymentPositionRole = mongoose.model(
	"EmploymentPositionRole",
	employmentPositionRoleSchema,
);

module.exports = EmploymentPositionRole;
