const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema(
  {
    name: String,
    clientName: String,
    stage: String,
    probability: Number,
    dealAmount: Number,
    createdOn: Date,
  },
  { collection: "Opportunities" }
);

const Opportunity = mongoose.model("Opportunities", opportunitySchema);

module.exports = Opportunity;
