const mongoose = require("mongoose");

const questionnaireSchema = new mongoose.Schema({
	correctAnswer: String,
	explanation: String,
	options: Object,
	question: String,
	subject: { type: String, default: "Know your customer" },
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
});

const Questionnaire = mongoose.model("Questionnaire", questionnaireSchema);

module.exports = Questionnaire;
