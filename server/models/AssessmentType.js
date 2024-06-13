const mongoose = require("mongoose");

const assessmentTypeSchema = new mongoose.Schema({
	name: String,
	hasAward: { type: String, default: "No" },
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
	companyName: { type: String, ref: "Company" },
});

const AssessmentType = mongoose.model("AssessmentType", assessmentTypeSchema);

module.exports = AssessmentType;
