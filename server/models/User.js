const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	// companyId: {
	//   type: String,
	//   required: true,
	//   default: "BN-1034",
	//   // ref: "Company",
	// },
	address: String,
	companyId: String,
	department: String,
	date: { type: Date, default: Date.now },
	email: { type: String, unique: true, required: true },
	firstName: String,
	fullName: String,
	lastName: String,
	manager: {
		type: String,
		required: true,
	},
	middleName: String,
	password: {
		type: String,
		required: true,
	},
	phoneNumber: String,
	role: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
