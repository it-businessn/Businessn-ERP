const mongoose = require("mongoose");

const assessmentTypeSchema = new mongoose.Schema(
	{
		name: String,
		hasAward: { type: String, default: "No" },
		companyName: { type: String, ref: "Company" },
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const AssessmentType = mongoose.model("AssessmentType", assessmentTypeSchema);

module.exports = AssessmentType;
