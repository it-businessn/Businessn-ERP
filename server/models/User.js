const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // companyId: {
  //   type: String,
  //   required: true,
  //   default: "BN-1034",
  //   // ref: "Company",
  // },
  companyId: String,
  firstName: String,
  middleName: String,
  lastName: String,
  fullName: String,
  email: { type: String, unique: true, required: true },
  password: {
    type: String,
    required: true,
  },
  role: { type: String, required: true },
  department: String,
  manager: {
    type: String,
    required: true,
  },
  phoneNumber: String,
  address: String,
  date: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
