const fs = require("fs");
const path = require("path");

const Resource = require("../models/CompanyResource");

const { filePath, fileContentType } = require("../services/fileService");

const getResources = async (req, res) => {
	try {
		const resources = await Resource.find();
		return res.status(200).json(resources);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getResourcesByCompany = () => async (req, res) => {
	const { companyName } = req.params;
	try {
		const resources = await Resource.find({ companyName });
		return res.status(200).json(resources);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getCompanyResources = async (req, res) => {
	const { fileType, companyName } = req.params;

	try {
		const files = await Resource.find({ fileType, companyName }).sort({
			uploadedOn: -1,
		});
		return res.status(200).json(files);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getResource = async (req, res) => {
	const { fileType } = req.params;

	try {
		const files = await Resource.find({ fileType }).sort({
			uploadedOn: -1,
		});
		return res.status(200).json(files);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};
const updateResourceCover = () => async (req, res) => {
	// const { fileType, uploadedBy } = req.body;
	// const fileData = req.file;
	// const { mimetype, originalname, path } = fileData;
	// try {
	// 	const resource = await Resource.findByIdAndUpdate(id,  $set:{req.body}, {
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
	// 	return 	res.status(201).json({ file, message: "File uploaded successfully!" });
	// } catch (error) {
	// 	return res.status(500).json({ message: "Internal Server Error", error });
	// }
};
const updateResource = async (req, res) => {
	const { fileName } = req.body;
	const { id } = req.params;

	try {
		const name = fileName.includes(".pdf") ? fileName : `${fileName}.pdf`;
		const resource = await Resource.findByIdAndUpdate(
			id,
			{
				$set: {
					originalname: name,
				},
			},
			{
				new: true,
			},
		);

		return res.status(201).json(resource);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const createResource = async (req, res) => {
	const { fileType, uploadedBy, company } = req.body;

	const fileData = req.file;
	if (!fileData) {
		return res.status(400).json({ message: "A file is required" });
	}

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
			companyName: company,
		});
		const file = await newResource.save();
		return res.status(201).json({ file, message: "File uploaded successfully!" });
	} catch (error) {
		console.error("createResource error:", error.message);
		return res.status(500).json({ message: "Internal Server Error" });
	} finally {
		// The bytes live in MongoDB; the multer temp file is no longer needed (REV-006).
		fs.unlink(path, () => {});
	}
};

const downloadResource = async (req, res) => {
	try {
		const { filename } = req.params;
		// FIX: Model.find() returns an array, so `!resource` was never true and a
		// missing file crashed with a TypeError (500) instead of a 404.
		const resource = await Resource.findOne({ originalname: filename });
		if (!resource?.file?.data) {
			return res.status(404).json({ message: "Resource not found" });
		}
		// Unique temp name: two concurrent downloads of the same resource must not
		// unlink each other's file mid-stream (REV-007).
		const file = filePath(`${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}-${filename}`);
		fs.writeFileSync(file, resource.file.data);

		res.setHeader("Content-Type", fileContentType(file));

		res.download(file, path.basename(filePath(filename)), (err) => {
			try {
				fs.unlinkSync(file);
			} catch (_) {
				/* already removed */
			}
			if (err && !res.headersSent) {
				console.error("Error downloading file:", err);
				return res.status(404).json({ message: "File not found" });
			}
		});
	} catch (error) {
		console.error("downloadResource error:", error.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

const deleteResource = async (req, res) => {
	const { id } = req.params;
	try {
		const resource = await Resource.findByIdAndDelete({
			_id: id,
		});
		if (resource) {
			return res.status(200).json(`Resource with id ${id} deleted successfully.`);
		} else {
			return res.status(404).json({ message: "Resource Details not found." });
		}
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

module.exports = {
	createResource,
	downloadResource,
	getResource,
	getResources,
	deleteResource,
	updateResource,
	getResourcesByCompany,
	getCompanyResources,
};
