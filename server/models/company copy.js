const mongoose = require("mongoose");
const { Address } = require("./additionalDetail");

const { Schema } = mongoose;
const companySchema = new Schema(
    {
        companyId: {
            type: String,
            required: true,
        },
        company_name: { type: String, required: true },
        registration_number: { type: String, required: true },
        address: Address,
        founded_date: { type: Date, required: true },
        industry: { type: String, required: true },
        revenue: { type: String, required: true },
        employees: { type: Number, required: true },
    },
    { timestamps: true },
    { collection: "Company" }
);

module.exports = mongoose.model("Company", companySchema);
