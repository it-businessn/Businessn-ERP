const mongoose = require("mongoose");

const leadCompany = new mongoose.Schema({
	name: String,
	created_at: { type: Date, default: Date.now },
	companyName: { type: String, ref: "Company" },
});

const LeadCompany = mongoose.model("LeadCompany", leadCompany);

module.exports = LeadCompany;
