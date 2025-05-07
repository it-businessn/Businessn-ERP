const mongoose = require("mongoose");

const crewSchema = new mongoose.Schema({
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
	name: String,
	createdBy: String,
	config: Object,
	createdOn: { type: Date, default: Date.now },
	companyName: { type: String, ref: "Company" },
});

const Crew = mongoose.model("Crew", crewSchema);

module.exports = Crew;
