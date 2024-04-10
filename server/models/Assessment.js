const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema({
	result: String,
	category: String,
	score: Number,
	subject: String,
	createdOn: { type: Date, default: Date.now },
	empId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
});

const Assessment = mongoose.model("Assessment", assessmentSchema);

module.exports = Assessment;
