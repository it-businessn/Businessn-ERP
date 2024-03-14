const mongoose = require("mongoose");
const { Address } = require("./additionalDetail");

const { Schema } = mongoose;
const deductionSchema = new Schema(
  {
    deductionType: [
      {
        type: Object,
      },
    ],
    address: {
      type: Address,
      required: true,
    },
  },
  { timestamps: true },
  { collection: "Deduction" }
);

module.exports = mongoose.model("Deduction", deductionSchema);
