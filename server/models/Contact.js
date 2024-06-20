const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
	notes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note", default: [] }],
	activities: [
		{ type: mongoose.Schema.Types.ObjectId, ref: "LogActivity", default: [] },
	],
	meetings: [
		{ type: mongoose.Schema.Types.ObjectId, ref: "Meeting", default: [] },
	],
	tasks: [
		{ type: mongoose.Schema.Types.ObjectId, ref: "LogTask", default: [] },
	],
	// forms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Form", default: [] }],
	leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
	companyName: { type: String, ref: "Company" },

	// companyAddress: String,
	// companyName: String,
	// date: { type: Date, default: Date.now },
	// email: String,
	// employees: Number,
	// firstName: String,
	// industryType: String,
	// lastName: String,
	// phone: String,
	// primaryContactAddress: String,
	// revenue: String,
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
