const mongoose = require("mongoose");

const holidaySchema = new mongoose.Schema({
	name: String,
	date: Date,
	companyName: { type: String, ref: "Company" },
	year: Date,
	createdOn: { type: Date, default: Date.now },
});

const Holiday = mongoose.model("Holiday", holidaySchema);

module.exports = Holiday;
