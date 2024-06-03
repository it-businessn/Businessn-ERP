const fs = require("fs");
const path = require("path");

const Resource = require("../models/CompanyResource");

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
const updateResourceCover = () => async (req, res) => {
	// const { fileType, uploadedBy } = req.body;
	// const fileData = req.file;
	// const { mimetype, originalname, path } = fileData;
	// try {
	// 	const resource = await Resource.findByIdAndUpdate(id, req.body, {
	// 		new: true,
	// 	});
	// 	const newResource = new Resource({
	// 		file: {
	// 			contentType: mimetype,
	// 			data: fs.readFileSync(path),
	// 			path,
	// 		},
	// 		fileType,
	// 		originalname,
	// 		uploadedBy,
	// 	});
	// 	const file = await newResource.save();
	// 	res.status(201).json({ file, message: "File uploaded successfully!" });
	// } catch (error) {
	// 	res.status(400).json({ message: error.message });
	// }
};
const updateResource = () => async (req, res) => {
	const { fileName } = req.body;
	const { id } = req.params;

	try {
		const resource = await Resource.findByIdAndUpdate(
			id,
			{ originalname: `${fileName}.pdf` },
			{
				new: true,
			},
		);

		res.status(201).json(resource);
	} catch (error) {
		res.status(400).json({ message: error.message });
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
		const resource = await Resource.find({ originalname: filename });
		if (!resource) {
			return res.status(404).json({ error: "Resource not found" });
		}

		const filePath = path.join(__dirname, "../", "uploads", filename);

		fs.writeFileSync(filePath, resource[0].file.data);

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
			fs.unlinkSync(filePath);
			if (err) {
				console.error("Error downloading file:", err);
				res.status(404).json({ error: "File not found" });
			}
		});
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const deleteResource = async (req, res) => {
	const { id } = req.params;
	try {
		const resource = await Resource.findByIdAndDelete({
			_id: id,
		});
		if (resource) {
			res.status(200).json(`Resource with id ${id} deleted successfully.`);
		} else {
			res.status(200).json("Resource Details not found.");
		}
	} catch (error) {
		res.status(404).json({ error: "Error deleting Resource:", error });
	}
};

module.exports = {
	createResource,
	downloadResource,
	getResourceByType,
	getResources,
	deleteResource,
	updateResource,
};
