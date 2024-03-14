const mongoose = require("mongoose");

const { Schema } = mongoose;
const qppDeductionSchema = new Schema(
  {
    deductionId: String,
    deductionType: Object,
    categoryName: {
      type: String,
      ref: "TerritorialTaxDeduction",
      required: true,
    },
  },
  { timestamps: true },
  { collection: "QPPDeduction" }
);

module.exports = mongoose.model("QPPDeduction", qppDeductionSchema);
