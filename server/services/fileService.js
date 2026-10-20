const multer = require("multer");
const path = require("path");
const fs = require("fs");

const UPLOADS_DIR = path.join(__dirname, "../", "uploads");
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * FIX (AUD-008): user-supplied file names were written to disk verbatim and
 * later joined into a path for download, allowing traversal ("../../index.js").
 * Keep only the base name and strip any character that is not safe for a path.
 */
const sanitizeFilename = (name) => {
	if (typeof name !== "string") return "";
	const base = path.basename(name.replace(/\\/g, "/")).trim();
	const cleaned = base.replace(/[^A-Za-z0-9._ \-()]/g, "_").replace(/^\.+/, "");
	return cleaned.slice(0, 200);
};

const storage = multer.diskStorage({
	destination(req, file, cb) {
		fs.mkdirSync(UPLOADS_DIR, { recursive: true });
		cb(null, UPLOADS_DIR);
	},
	filename(req, file, cb) {
		const safe = sanitizeFilename(file.originalname);
		if (!safe) return cb(new Error("Invalid file name"));
		cb(null, safe);
	},
});

const storageSpace = multer({ storage, limits: { fileSize: MAX_UPLOAD_BYTES, files: 1 } });

const filePath = (filename) => {
	const safe = sanitizeFilename(filename);
	if (!safe) throw new Error("Invalid file name");
	const resolved = path.resolve(UPLOADS_DIR, safe);
	if (!resolved.startsWith(UPLOADS_DIR + path.sep)) throw new Error("Invalid file name");
	return resolved;
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

module.exports = {
	storageSpace,
	filePath,
	fileContentType,
	saveKeyToEnv,
	sanitizeFilename,
	MAX_UPLOAD_BYTES,
};
