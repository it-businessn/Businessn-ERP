const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema({
  name: String,
  clientName: String,
  stage: String,
  probability: Number,
  dealAmount: Number,
  createdOn: Date,
});

const Opportunity = mongoose.model("Opportunity", opportunitySchema);

module.exports = Opportunity;
