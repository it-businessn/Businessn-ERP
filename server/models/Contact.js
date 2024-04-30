const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
	notes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
	activities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }],
	meetings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Meeting" }],
	events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
	forms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Form" }],
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
