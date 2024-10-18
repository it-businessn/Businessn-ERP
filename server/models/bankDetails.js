const mongoose = require("mongoose");

const { Schema } = mongoose;
const bankDetailsSchema = new Schema(
	{
		employeeId: {
			type: String,
			ref: "Employee",
		},
		accountNumber: {
			type: String,
		},
		bankName: String,
		institutionNumber: {
			type: String,
		},
		branchTransitNumber: {
			type: String,
		},
		isApproved: Boolean,
	},
	{ timestamps: true },
	{ collection: "BankDetails" },
);

module.exports = mongoose.model("BankDetails", bankDetailsSchema);
