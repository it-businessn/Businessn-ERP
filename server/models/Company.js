const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
	{
		name: String,
		founding_year: String,
		registration_number: String,
		cra_business_number: String,
		address: {
			type: Object,
			streetNumber: String,
			city: String,
			state: String,
			postalCode: String,
			country: String,
		},
		departments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Department",
			},
		],
		employees: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Employee",
			},
		],
		industry_type: String,
		revenue: String,
		leads: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Lead",
			},
		],
		notifications: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Notification",
			},
		],
		opportunities: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Opportunity",
			},
		],
		projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
		company_resources: [{ type: mongoose.Schema.Types.ObjectId, ref: "CompanyResource" }],
		config_rules: {
			types: [String],
		},
		updatedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Employee",
		},
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

// Performance (F-04): indexes for the query shapes used by the controllers.
// Fields are unchanged; Mongoose builds these in the background on startup.
companySchema.index({ employees: 1 });
companySchema.index({ registration_number: 1 });

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
