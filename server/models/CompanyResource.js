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
	// uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
	uploadedBy: String,
});

const CompanyResource = mongoose.model(
	"CompanyResource",
	companyResourceSchema,
);

module.exports = CompanyResource;
