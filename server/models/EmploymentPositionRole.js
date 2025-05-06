const mongoose = require("mongoose");

const employmentPositionRoleSchema = new mongoose.Schema({
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
	name: String,
	description: String,
	createdOn: { type: Date, default: Date.now },
	employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
	companyName: { type: String, ref: "Company" },
});

const EmploymentPositionRole = mongoose.model(
	"EmploymentPositionRole",
	employmentPositionRoleSchema,
);

module.exports = EmploymentPositionRole;
