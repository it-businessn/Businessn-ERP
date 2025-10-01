const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema(
	{
		result: String,
		category: String,
		score: Number,
		total: Number,
		subject: String,
		empId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
		companyName: { type: String, ref: "Company" },
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const Assessment = mongoose.model("Assessment", assessmentSchema);

module.exports = Assessment;
