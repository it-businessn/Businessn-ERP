const mongoose = require("mongoose");

const costCenterSchema = new mongoose.Schema(
	{
		name: String,
		description: String,
		companyName: { type: String, ref: "Company" },
		departments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Department" }],
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const CostCenter = mongoose.model("CostCenter", costCenterSchema);

module.exports = CostCenter;
