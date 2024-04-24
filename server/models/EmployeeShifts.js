const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema({
	color: String,
	duration: Number,
	end_time: Date,
	id: String,
	start_time: Date,
	title: String, // employee name
	createdOn: { type: Date, default: Date.now },
	group: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
});

const EmployeeShift = mongoose.model("EmployeeShift", shiftSchema);

module.exports = EmployeeShift;
