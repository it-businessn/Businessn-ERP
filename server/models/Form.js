const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
	name: String,
	submitted_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	submission_date: { type: Date, default: Date.now },
});

const Form = mongoose.model("Form", formSchema);

module.exports = Form;
