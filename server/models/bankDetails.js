const mongoose = require("mongoose");

const { Schema } = mongoose;
const bankDetailsSchema = new Schema(
  {
    employeeId: {
      type: String,
      ref: "Employee",
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
    },
    bankName: String,
    institutionNumber: {
      type: String,
      required: true,
    },
    branchTransitNumber: {
      type: String,
      required: true,
    },
    isApproved: Boolean,
  },
  { timestamps: true },
  { collection: "BankDetails" }
);

module.exports = mongoose.model("BankDetails", bankDetailsSchema);
