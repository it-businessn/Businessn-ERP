const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
	{
		name: String,
		isActive: { type: Boolean, default: false },
		members: [{ type: Object, ref: "Employee" }],
		admin: [{ type: String, ref: "Employee" }],
		modules: [{ type: String, ref: "Module" }],
		companyName: { type: String, ref: "Company" },
		scheduleSettings: Array,
		yearSchedules: Array,
		scheduleFrequency: { type: String, default: "Biweekly" },
		payrollActivated: { type: Boolean, default: false },
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
