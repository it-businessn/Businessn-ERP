const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema(
	{
		color: String,
		duration: Number,
		end_time: Date,
		id: String,
		start_time: Date,
		title: String, // employee name
		group: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
		companyName: { type: String, ref: "Company" },
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const EmployeeShift = mongoose.model("EmployeeShift", shiftSchema);

module.exports = EmployeeShift;
