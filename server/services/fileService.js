const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, "uploads/");
	},
	filename(req, file, cb) {
		const uniqueFileName = file.originalname;

		cb(null, uniqueFileName);
	},
});

const storageSpace = multer({ storage });

const filePath = (filename) => {
	return path.join(__dirname, "../", "uploads", filename);
};

const fileContentType = (file) => {
	const ext = path.extname(file).toLowerCase();

	if (ext === ".xlsx") {
		return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
	} else if (ext === ".docx") {
		return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
	} else if (ext === ".pdf") {
		return "application/pdf";
	} else if ([".jpg", ".jpeg", ".png", ".gif", ".bmp"].includes(ext)) {
		return `image/${ext.substr(1)}`;
	} else {
		return "application/octet-stream";
	}
};

module.exports = { storageSpace, filePath, fileContentType };
