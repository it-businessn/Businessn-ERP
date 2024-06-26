const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
	notes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note", default: [] }],
	activities: [
		{ type: mongoose.Schema.Types.ObjectId, ref: "Activity", default: [] },
	],
	meetings: [
		{ type: mongoose.Schema.Types.ObjectId, ref: "Meeting", default: [] },
	],
	tasks: [
		{ type: mongoose.Schema.Types.ObjectId, ref: "LogTask", default: [] },
	],
	// forms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Form", default: [] }],
	leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },

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
