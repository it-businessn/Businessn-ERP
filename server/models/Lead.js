const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
	opportunityName: String,
	abbreviation: String,
	email: String,
	stage: String,
	primaryAssignee: Object,
	supervisorAssignee: Object,
	createdOn: { type: Date, default: Date.now },
});

const Lead = mongoose.model("Lead", leadSchema);

module.exports = Lead;
