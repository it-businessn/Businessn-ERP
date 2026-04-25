const crypto = require("crypto");

const newEncryptionKey = crypto.randomBytes(32);
const algorithm = "aes-256-cbc";

const encryptData = (data, encryption_key) => {
	const iv = crypto.randomBytes(16);

	const cipher = crypto.createCipheriv(algorithm, encryption_key, iv);
	let encrypted = cipher.update(data, "utf8", "hex");
	encrypted += cipher.final("hex");
	return { encryptedData: encrypted, iv: iv.toString("hex") };
};

const isValidHex = (value) =>
	typeof value === "string" && value.length % 2 === 0 && /^[0-9a-fA-F]+$/.test(value);

const shouldDecrypt = (value, iv) => {
	if (!value || !iv) return false;
	if (typeof value !== "string") return false;
	if (value.includes("*")) return false;
	if (!isValidHex(value)) return false;
	if (!isValidHex(iv)) return false;
	return true;
};

const decryptData = (encryptedData, encryption_key, iv) => {
	if (!isValidHex(encryptedData)) {
		throw new Error("Invalid encryptedData (not valid hex)");
	}

	if (!isValidHex(iv)) {
		throw new Error("Invalid IV (not valid hex)");
	}
	const decipher = crypto.createDecipheriv(algorithm, encryption_key, Buffer.from(iv, "hex"));

	let decrypted = decipher.update(encryptedData, "hex", "utf8");
	decrypted += decipher.final("utf8");
	return decrypted;
};

const generateVopaySignature = (key, secret_key) => {
	const date = new Date().toISOString().split("T")[0];
	const shasum = crypto.createHash("sha1");
	shasum.update(key + secret_key + date);
	const signature = shasum.digest("hex");
	return signature;
};

module.exports = {
	encryptData,
	decryptData,
	newEncryptionKey,
	generateVopaySignature,
	shouldDecrypt,
};
