const mongoose = require("mongoose");

const assessmentTypeSchema = new mongoose.Schema({
	name: String,
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
});

const AssessmentType = mongoose.model("AssessmentType", assessmentTypeSchema);

module.exports = AssessmentType;
