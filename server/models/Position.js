const mongoose = require("mongoose");

const positionSchema = new mongoose.Schema({
	name: String,
	empId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
	employmentInfoId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "EmployeeEmploymentInfo",
	},
	employeeName: String,
	timeManagementBadgeID: String,
	companyName: { type: String, ref: "Company" },
	employmentPayGroup: { type: String, ref: "Group" },
	employmentCostCenter: { type: String, ref: "CostCenter" },
	employmentDepartment: { type: String, ref: "Department" },
	createdOn: { type: Date, default: Date.now },
});

const Position = mongoose.model("Position", positionSchema);

module.exports = Position;
