const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
	{
		name: String,
		instruction: String,
		companyName: { type: String, ref: "Company" },
		inactive: Boolean,
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;
