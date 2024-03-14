const mongoose = require("mongoose");

const { Schema } = mongoose;
const territorialTaxDeductionSchema = new Schema(
  {
    deductionType: {
      type: Object,
      ref: "IncomeTaxDeduction",
      required: true,
    },
    categoryName: String,
    taxDeductionsCreditAmount: Number,
    EIRate: Number,
    CPPContributionsYTD: Number,
    EIYTD: Number,
    CPPRate: Number,
  },
  { timestamps: true },
  { collection: "TerritorialTaxDeduction" }
);

module.exports = mongoose.model(
  "TerritorialTaxDeduction",
  territorialTaxDeductionSchema
);
