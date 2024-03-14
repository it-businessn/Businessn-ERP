const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	firstName: String,
	middleName: String,
	lastName: String,
	fullName: String,
	email: { type: String, unique: true, required: true },
	phoneNumber: String,
	password: String,
	createdOn: { type: Date, default: Date.now },
	address: {
		type: String,
		streetNumber: String,
		city: String,
		state: String,
		postalCode: String,
		country: String,
	},
	updatedOn: { type: Date, default: Date.now },
	updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
