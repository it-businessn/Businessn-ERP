const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema({
	// 	clientName: String,
	// 	createdOn: Date,
	// 	dealAmount: Number,
	// 	name: String,
	// 	probability: Number,
	// 	stage: String,
	name: String,
	stage: String,
	amount: Number,
	closing_date: Date,
});

const Opportunity = mongoose.model("Opportunity", opportunitySchema);

module.exports = Opportunity;
