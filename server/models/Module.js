const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({
	name: String,
	description: String,
	createdOn: { type: Date, default: Date.now },
	isActive: { type: Boolean, default: false },
	members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
	admin: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
	companyName: { type: String, ref: "Company" },
});

const Module = mongoose.model("Module", moduleSchema);

module.exports = Module;
