const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
	name: String,
	description: String,
	createdOn: { type: Date, default: Date.now },
	employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
});

const EmployeeRole = mongoose.model("EmployeeRole", roleSchema);

module.exports = EmployeeRole;
