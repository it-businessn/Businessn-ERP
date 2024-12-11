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

const saveKeyToEnv = (keyName, newKey) => {
	const envFilePath = path.join(__dirname, "../", ".env");
	const keyString = newKey.toString("hex");
	try {
		let envContent = fs.readFileSync(envFilePath, "utf8");
		const keyRegex = new RegExp(`^${keyName}=.*`, "gm");
		if (keyRegex.test(envContent)) {
			envContent = envContent.replace(keyRegex, `${keyName}=${keyString}`);
			console.log(`${keyName} updated in .env file.`);
		} else {
			envContent += `${keyName}=${keyString}\n`;
			console.log(`${keyName} added to .env file.`);
		}

		fs.writeFileSync(envFilePath, envContent, { mode: 0o600 });
	} catch (error) {
		console.error("Error updating encryption key:", error.message);
	}
};

module.exports = { storageSpace, filePath, fileContentType, saveKeyToEnv };
