const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  primaryContactAddress: String,
  companyName: String,
  industryType: String,
  companyAddress: String,
  revenue: String,
  employees: Number,
  date: { type: Date, default: Date.now },
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
