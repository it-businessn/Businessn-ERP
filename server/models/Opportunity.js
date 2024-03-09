const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema(
	{
		clientName: String,
		createdOn: Date,
		dealAmount: Number,
		name: String,
		probability: Number,
		stage: String,
	},
	{ collection: "Opportunities" },
);

const Opportunity = mongoose.model("Opportunities", opportunitySchema);

module.exports = Opportunity;
