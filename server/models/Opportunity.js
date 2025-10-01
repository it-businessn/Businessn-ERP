const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema(
	{
		// 	clientName: String,
		// 	dealAmount: Number,
		// 	name: String,
		// 	probability: Number,
		// 	stage: String,
		name: String,
		stage: String,
		amount: Number,
		closing_date: Date,
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const Opportunity = mongoose.model("Opportunity", opportunitySchema);

module.exports = Opportunity;
