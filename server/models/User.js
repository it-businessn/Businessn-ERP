const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		firstName: String,
		middleName: String,
		lastName: String,
		fullName: String,
		email: { type: String, unique: true, required: true },
		phoneNumber: String,
		password: String,
		address: {
			type: String,
			streetNumber: String,
			city: String,
			state: String,
			postalCode: String,
			country: String,
		},
		updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
