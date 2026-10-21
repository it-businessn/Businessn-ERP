const mongoose = require("mongoose");

const employeeProfileInfoSchema = new mongoose.Schema(
	{
		empId: { type: String, ref: "Employee" },
		companyName: { type: String, ref: "Company" },
		manager: { type: String, ref: "Employee" },
		firstName: String,
		middleName: String,
		lastName: String,
		gender: String,
		emergencyFirstName: String,
		emergencyLastName: String,
		birthDate: Date,
		SIN: String,
		SINIv: String,
		maritalStatus: String,
		citizenship: String,
		workPermitNo: String,
		workPermitExpiryNo: String,
		userEmail: String,
		personalEmail: String,
		personalPhoneNum: { type: String, ref: "Employee" },
		businessEmail: String,
		businessPhoneNum: String,
		emergencyPersonalEmail: String,
		emergencyPersonalPhoneNum: String,
		emergencyContactRelationship: String,
		streetAddress: String,
		streetAddressSuite: String,
		city: String,
		province: String,
		country: String,
		postalCode: String,
		password: String,
		isAffiliate: Boolean,
		contentToShare: String,
		marketingComms: Boolean,
		insta: String,
		linkedIn: String,
		tiktok: String,
		youtube: String,
		// FIX (AUD-014): `unique` without `sparse` indexes missing values as null, so
		// the second profile created without an affiliate code fails with E11000.
		// Requires dropping the old index once: see docs/CHANGES.md.
		affiliateCode: { type: String, unique: true, sparse: true },
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

// Performance (F-04): indexes for the query shapes used by the controllers.
// Fields are unchanged; Mongoose builds these in the background on startup.
employeeProfileInfoSchema.index({ companyName: 1, empId: 1 });

const EmployeeProfileInfo = mongoose.model("EmployeeProfileInfo", employeeProfileInfoSchema);

module.exports = EmployeeProfileInfo;
