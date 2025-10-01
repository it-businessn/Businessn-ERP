const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema(
	{
		name: String,
		description: String,
		isActive: Boolean,
		members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
		admin: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
		companyName: { type: String, ref: "Company" },
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const Module = mongoose.model("Module", moduleSchema);

module.exports = Module;
