const mongoose = require("mongoose");

const { Schema } = mongoose;
const userRoleSchema = new Schema(
    {
        roleName: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        permissions: [
            {
                type: String,
                required: true,
            },
        ],
        approver: {
            type: String,
            required: true,
            ref: "User",
        },
    },
    { timestamps: true },
    { collection: "UserRole" }
);

module.exports = mongoose.model("UserRole", userRoleSchema);
