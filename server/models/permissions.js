const mongoose = require("mongoose");

const { Schema } = mongoose;
const userPermissionsSchema = new Schema(
	{
		empId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Employee",
		},
		canViewPayroll: Boolean,
		canEditPayroll: Boolean,
		canApprovePayroll: Boolean,
		canViewEmployeeData: Boolean,
		canEditEmployeeData: Boolean,
		canAddEmployee: Boolean,
		canDeleteEmployee: Boolean,
		canViewSalary: Boolean,
		canProcessPayroll: Boolean,
		canGenerateReports: Boolean,
		permissionType: {
			type: Array,
			default: [],
		},

		companyName: String,
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

module.exports = mongoose.model("UserPermissions", userPermissionsSchema);
