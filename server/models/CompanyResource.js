const mongoose = require("mongoose");

const companyResourceSchema = new mongoose.Schema({
	file: {
		data: Buffer,
		contentType: String,
		path: String,
	},
	fileType: String,
	originalname: String,
	uploadedOn: { type: Date, default: Date.now },
	cover: {
		data: Buffer,
		contentType: String,
		name: String,
	},
	// uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
	companyName: { type: String, ref: "Company" },
});

const CompanyResource = mongoose.model(
	"CompanyResource",
	companyResourceSchema,
);

module.exports = CompanyResource;
