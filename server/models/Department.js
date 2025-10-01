const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
	{
		name: String,
		description: String,
		costCenter: [{ type: mongoose.Schema.Types.ObjectId, ref: "CostCenter" }],
		members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
		admin: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
		companyName: { type: String, ref: "Company" },
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;
