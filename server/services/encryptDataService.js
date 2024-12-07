const crypto = require("crypto");

const encryptData = (data, key) => {
	const algorithm = "aes-256-cbc";
	const iv = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv(algorithm, key, iv);
	let encrypted = cipher.update(data, "utf8", "hex");
	encrypted += cipher.final("hex");
	return { encryptedData: encrypted, iv: iv.toString("hex") };
};

const decryptData = (encryptedData, key, iv) => {
	const algorithm = "aes-256-cbc";
	const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, "hex"));
	let decrypted = decipher.update(encryptedData, "hex", "utf8");
	decrypted += decipher.final("utf8");
	return decrypted;
};

module.exports = { encryptData, decryptData };
