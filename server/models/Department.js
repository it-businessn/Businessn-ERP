const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
	name: String,
	description: String,
	createdOn: { type: Date, default: Date.now },
	costCenter: [{ type: mongoose.Schema.Types.ObjectId, ref: "CostCenter" }],
	members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
	admin: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
	companyName: { type: String, ref: "Company" },
});

const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;
