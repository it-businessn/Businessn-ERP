const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
	file: {
		data: Buffer,
		contentType: String,
		path: String,
	},
	fileType: String,
	originalname: String,
	uploadedBy: String,
	uploadedOn: { type: Date, default: Date.now },
});

const Resource = mongoose.model("Resource", resourceSchema);

module.exports = Resource;
