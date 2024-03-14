const mongoose = require("mongoose");

const { Schema } = mongoose;
const taxDetailsSchema = new Schema(
    {
        companyId: {
            type: String,
            required: true,
            ref: "Company",
        },
        taxYear: {
            type: Number,
            required: true,
        },
        federalTaxRate: {
            type: Number,
            required: true,
        },
        stateTaxRate: {
            type: Number,
            required: true,
        },
        localTaxRate: {
            type: Number,
            required: true,
        },
        socialSecurityRate: {
            type: Number,
            required: true,
        },
        medicareTax: {
            type: Number,
            required: true,
        },
        taxDue: {
            type: Number,
            required: true,
        },
        taxPaid: {
            type: Number,
            required: true,
        },
        datePaid: Date,
        taxMonth: {
            type: Number,
            required: true,
        },
        totalIncome: {
            type: Number,
            required: true,
        },
        totalTaxes: {
            type: Number,
            required: true,
        },
        filingStatus: {
            type: String,
            required: true,
        },
        totalDeductions: [
            {
                type: String,
            },
        ],
        allowances: {
            type: Number,
            required: true,
        },
        taxType: {
            type: String,
            required: true,
        },
        federalTaxId: {
            type: String,
            required: true,
            unique: true,
        },
        stateTaxId: {
            type: String,
            required: true,
            unique: true,
        },
        localTaxId: {
            type: String,
            required: true,
            unique: true,
        },
        additionalTaxes: [
            {
                taxName: {
                    type: String,
                    required: true,
                },
                taxRate: {
                    type: Number,
                    required: true,
                },
            },
        ],
    },
    { timestamps: true },
    { collection: "TaxDetail" }
);

module.exports = mongoose.model("TaxDetail", taxDetailsSchema);
