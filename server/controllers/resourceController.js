const fs = require("fs");

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
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const downloadResource = async (req, res) => {
	try {
		const { filename } = req.params;
		const resource = await Resource.find({ originalname: filename });
		if (!resource) {
			return res.status(404).json({ message: "Resource not found" });
		}
		const file = filePath(filename);
		fs.writeFileSync(file, resource[0].file.data);

		res.setHeader("Content-Type", fileContentType(file));

		res.download(file, filename, (err) => {
			fs.unlinkSync(file);
			if (err) {
				console.error("Error downloading file:", err);
				return res.status(404).json({ message: "File not found" });
			}
		});
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
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
