const mongoose = require("mongoose");

const empTypeSchema = new mongoose.Schema({
	name: String,
	description: String,
	createdOn: { type: Date, default: Date.now },
	employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
	companyName: { type: String, ref: "Company" },
});

const EmploymentType = mongoose.model("EmploymentType", empTypeSchema);

module.exports = EmploymentType;
