const mongoose = require("mongoose");

const { Schema } = mongoose;
const cppEIDeductionSchema = new Schema(
  {
    deductionId: String,
    deductionType: Object,
    categoryName: {
      type: String,
      ref: "TerritorialTaxDeduction",
      required: true,
    },
    CPPPensionableEarnings: Number,
    EIInsurableEarnings: Number,
  },
  { timestamps: true },
  { collection: "CPP_EI_Deduction" }
);

module.exports = mongoose.model("CPP_EI_Deduction", cppEIDeductionSchema);
