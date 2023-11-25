const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
  field1: String,
  field2: String,
});

const Form = mongoose.model("Form", formSchema);

module.exports = Form;
