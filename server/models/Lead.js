const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
	abbreviation: String,
	address: {
		type: Object,
		streetNumber: String,
		city: String,
		state: String,
		postalCode: String,
		country: String,
	},
	companyName: String,
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
	disbursedTo: String,
	email: String,
	industry: String,
	isDisbursed: { type: Boolean, default: false },
	isDisbursedConfirmed: { type: Boolean, default: false },
	opportunityName: String,
	phone: String,
	primaryAssignee: Object,
	productService: Object,
	region: String,
	source: String,
	stage: String,
	supervisorAssignee: Object,
});

const Lead = mongoose.model("Lead", leadSchema);

module.exports = Lead;
