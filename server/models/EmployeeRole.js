const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
	{
		name: String,
		description: String,
		employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
		companyName: { type: String, ref: "Company" },
		inactive: Boolean,
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const EmployeeRole = mongoose.model("EmployeeRole", roleSchema);

module.exports = EmployeeRole;
