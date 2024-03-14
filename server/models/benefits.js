const mongoose = require("mongoose");

const { Schema } = mongoose;
const employeeBenefitsSchema = new Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        healthInsurance: {
            type: String,
            required: true,
        },
        dentalInsurance: {
            type: String,
            required: true,
        },
        visionInsurance: {
            type: String,
            required: true,
        },
        lifeInsurance: Boolean,
        retirementPlan: Boolean,
        vacationDays: {
            type: Number,
            required: true,
        },
        sickDays: {
            type: Number,
            required: true,
        },
        otherBenefits: [
            {
                type: String,
            },
        ],
    },
    { timestamps: true },
    { collection: "EmployeeBenefits" }
);

module.exports = mongoose.model("EmployeeBenefits", employeeBenefitsSchema);
