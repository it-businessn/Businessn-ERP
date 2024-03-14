const mongoose = require("mongoose");

const { Schema } = mongoose;
const commissionDeductionSchema = new Schema(
  {
    deductionId: String,
    deductionType: Object,
    categoryName: {
      type: String,
      ref: "TerritorialTaxDeduction",
      required: true,
    },
    totalAnnualRemuneration: Number,
    totalAnnualCommissionExpenses: Number,
    otherContributions: Number,
    commissionIncomePerPayPeriod: Number,
    daysSinceLastPayment: Number,
    hasTaxableBenefits: Boolean,
    pensionableMonths: Number,
    pensionableEarningsYTD: Number,
  },
  { timestamps: true },
  { collection: "CommissionDeduction" }
);

module.exports = mongoose.model(
  "CommissionDeduction",
  commissionDeductionSchema
);
