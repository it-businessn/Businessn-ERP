const mongoose = require("mongoose");

const { Schema } = mongoose;
const incomeTaxDeductionSchema = new Schema(
  {
    deductionType: [
      {
        type: Object,
      },
    ],
    categoryName: String,
    minimumAmount: Number,
    maximumAmount: Number,
    taxRate: Number,
    taxConstant: Number,
    taxCreditsTD1Form: String,
    totalClaimAmount: Number,
    additionalBonus: Number,
    hasTaxableBenefits: Object,
    additionalTaxCredit: Object,
  },
  { timestamps: true },
  { collection: "IncomeTaxDeduction" }
);

module.exports = mongoose.model("IncomeTaxDeduction", incomeTaxDeductionSchema);
