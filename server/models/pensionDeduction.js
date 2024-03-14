const mongoose = require("mongoose");

const { Schema } = mongoose;
const pensionDeductionSchema = new Schema(
  {
    deductionId: String,
    deductionType: Object,
    categoryName: {
      type: String,
      ref: "TerritorialTaxDeduction",
      required: true,
    },
    pensionIncomePerPayPeriod: Number,
  },
  { timestamps: true },
  { collection: "PensionDeduction" }
);

module.exports = mongoose.model("PensionDeduction", pensionDeductionSchema);
