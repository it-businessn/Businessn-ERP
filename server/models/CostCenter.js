const mongoose = require("mongoose");

const costCenterSchema = new mongoose.Schema({
	name: String,
	description: String,
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
	companyName: { type: String, ref: "Company" },
});

const CostCenter = mongoose.model("CostCenter", costCenterSchema);

module.exports = CostCenter;
