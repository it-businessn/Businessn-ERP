const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema({
	result: String,
	category: String,
	score: Number,
	total: Number,
	subject: String,
	createdOn: { type: Date, default: Date.now },
	empId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
	companyName: { type: String, ref: "Company" },
});

const Assessment = mongoose.model("Assessment", assessmentSchema);

module.exports = Assessment;
