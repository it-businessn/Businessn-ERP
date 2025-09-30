const mongoose = require("mongoose");

const costCenterSchema = new mongoose.Schema({
	name: String,
	description: String,
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
	companyName: { type: String, ref: "Company" },
	departments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Department" }],
});

const CostCenter = mongoose.model("CostCenter", costCenterSchema);

module.exports = CostCenter;
