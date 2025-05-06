const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
	name: String,
	instruction: String,
	createdOn: { type: Date, default: Date.now },
	companyName: { type: String, ref: "Company" },
	inactive: Boolean,
});

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;
