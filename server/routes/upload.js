const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const Resource = require("../models/Resource");
const router = express.Router();

const storage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, "uploads/");
	},
	filename(req, file, cb) {
		const uniqueFileName = file.originalname;

		cb(null, uniqueFileName);
	},
});
const upload = multer({ storage });

router.get("/", async (req, res) => {
	try {
		const resources = await Resource.find();
		res.status(200).json(resources);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
});

router.get("/:fileType", async (req, res) => {
	const { fileType } = req.params;
	try {
		const files = (await Resource.find({ fileType })).sort(
			(a, b) => b.uploadedOn - a.uploadedOn,
		);
		res.status(200).json(files);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
});

router.post("/upload", upload.single("file"), async (req, res) => {
	const { uploadedBy, fileType } = req.body;
	const fileData = req.file;
	const { originalname, path, mimetype } = fileData;

	try {
		const newResource = new Resource({
			file: {
				data: fs.readFileSync(path),
				contentType: mimetype,
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
});

router.get("/download/:filename", async (req, res) => {
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
});

module.exports = router;
