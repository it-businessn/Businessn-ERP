const mongoose = require("mongoose");

const questionnaireSchema = new mongoose.Schema(
	{
		correctAnswer: String,
		explanation: String,
		options: Object,
		question: String,
		subject: { type: String, ref: "AssessmentType" },
		companyName: { type: String, ref: "Company" },
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const Questionnaire = mongoose.model("Questionnaire", questionnaireSchema);

module.exports = Questionnaire;
