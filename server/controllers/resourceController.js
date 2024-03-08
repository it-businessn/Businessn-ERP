const fs = require("fs");
const path = require("path");

const Resource = require("../models/Resource");

const getResources = () => async (req, res) => {
	try {
		const resources = await Resource.find();
		res.status(200).json(resources);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getResourceByType = () => async (req, res) => {
	const { fileType } = req.params;

	try {
		const files = (await Resource.find({ fileType })).sort(
			(a, b) => b.uploadedOn - a.uploadedOn,
		);
		res.status(200).json(files);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const createResource = () => async (req, res) => {
	const { fileType, uploadedBy } = req.body;

	const fileData = req.file;

	const { mimetype, originalname, path } = fileData;

	try {
		const newResource = new Resource({
			file: {
				contentType: mimetype,
				data: fs.readFileSync(path),
				path,
			},
			fileType,
			originalname,
			uploadedBy,
		});
		const file = await newResource.save();
		res.status(201).json({ file, message: "File uploaded successfully!" });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
const downloadResource = () => async (req, res) => {
	try {
		const filename = req.params.filename;

		const filePath = path.join(__dirname, "../", "uploads", filename);

		const ext = path.extname(filePath).toLowerCase();

		let contentType = "application/octet-stream";

		if (ext === ".xlsx") {
			contentType =
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
		} else if (ext === ".docx") {
			contentType =
				"application/vnd.openxmlformats-officedocument.wordprocessingml.document";
		} else if (ext === ".pdf") {
			contentType = "application/pdf";
		} else if ([".jpg", ".jpeg", ".png", ".gif", ".bmp"].includes(ext)) {
			contentType = `image/${ext.substr(1)}`;
		}

		res.setHeader("Content-Type", contentType);

		res.download(filePath, filename, (err) => {
			if (err) {
				res.status(404).json({ error: "File not found" });
			}
		});
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

module.exports = {
	createResource,
	downloadResource,
	getResourceByType,
	getResources,
};
