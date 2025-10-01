const mongoose = require("mongoose");

const holidaySchema = new mongoose.Schema(
	{
		name: String,
		date: Date,
		companyName: { type: String, ref: "Company" },
		year: Date,
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const Holiday = mongoose.model("Holiday", holidaySchema);

module.exports = Holiday;
