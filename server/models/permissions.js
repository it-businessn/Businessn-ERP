const mongoose = require("mongoose");

const { Schema } = mongoose;
const userPermissionsSchema = new Schema(
    {
        userId: {
            type: String,
            ref: "User",
            required: true,
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
    },
    { timestamps: true },
    { collection: "UserPermissions" }
);

module.exports = mongoose.model("UserPermissions", userPermissionsSchema);
