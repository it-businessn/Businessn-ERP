const mongoose = require("mongoose");

const { Schema } = mongoose;
const federalTaxDeductionSchema = new Schema(
	{
		deductionType: {
			type: Object,
			ref: "IncomeTaxDeduction",
			required: true,
		},
		categoryName: String,
	},
	{ timestamps: true },
	{ collection: "FederalTaxDeduction" },
);

module.exports = mongoose.model(
	"FederalTaxDeduction",
	federalTaxDeductionSchema,
);
