const multer = require("multer");
const path = require("path");
const fs = require("fs");

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

const newEncryptionKey = () => crypto.randomBytes(16);

const saveKeyToEnv = (name, key) => {
	const envFilePath = path.join(__dirname, "../", ".env");

	try {
		const envContent = `${name}=${key}\n`;
		if (fs.existsSync(envFilePath)) {
			fs.appendFileSync(envFilePath, envContent, { mode: 0o600 });
		} else {
			fs.writeFileSync(envFilePath, envContent, { mode: 0o600 });
		}
	} catch (error) {
		console.error("Error saving encryption key:", error.message);
	}
};

module.exports = { storageSpace, filePath, fileContentType, saveKeyToEnv, newEncryptionKey };
