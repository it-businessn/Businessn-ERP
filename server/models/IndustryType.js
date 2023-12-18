const mongoose = require("mongoose");

const industryTypeSchema = new mongoose.Schema({
  name: String,
  date: { type: Date, default: Date.now },
});

const IndustryType = mongoose.model("IndustryType", industryTypeSchema);

module.exports = IndustryType;
