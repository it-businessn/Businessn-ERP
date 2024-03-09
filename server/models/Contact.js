const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
	companyAddress: String,
	companyName: String,
	date: { type: Date, default: Date.now },
	email: String,
	employees: Number,
	firstName: String,
	industryType: String,
	lastName: String,
	phone: String,
	primaryContactAddress: String,
	revenue: String,
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
