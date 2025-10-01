const mongoose = require("mongoose");

const empTypeSchema = new mongoose.Schema(
	{
		name: String,
		description: String,
		employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
		companyName: { type: String, ref: "Company" },
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const EmploymentType = mongoose.model("EmploymentType", empTypeSchema);

module.exports = EmploymentType;
