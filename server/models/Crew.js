const mongoose = require("mongoose");

const crewSchema = new mongoose.Schema(
	{
		name: String,
		createdBy: String,
		config: Object,
		companyName: { type: String, ref: "Company" },
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const Crew = mongoose.model("Crew", crewSchema);

module.exports = Crew;
