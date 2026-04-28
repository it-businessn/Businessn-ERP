const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 10;
const hashPassword = async (password) => {
	if (!password || typeof password !== "string") {
		throw new Error("Invalid password input");
	}
	try {
		return await bcrypt.hash(password, SALT_ROUNDS);
	} catch (error) {
		throw new Error(`Password hashing failed: ${error.message}`);
	}
};

const hashSyncPassword = async (password) => {
	if (!password || typeof password !== "string") {
		throw new Error("Invalid password input");
	}
	try {
		return bcrypt.hashSync(password, SALT_ROUNDS);
	} catch (error) {
		throw new Error(`Password hashing sync failed: ${error.message}`);
	}
};

const comparePassword = async (plainPassword, hashedPassword) => {
	if (typeof plainPassword !== "string" || typeof hashedPassword !== "string") {
		return false;
	}
	if (!plainPassword || !hashedPassword) {
		throw new Error("Both passwords are required for comparison");
	}
	try {
		return await bcrypt.compare(plainPassword, hashedPassword);
	} catch (error) {
		throw new Error(`Password comparison failed: ${error.message}`);
		return false;
	}
};

module.exports = {
	hashPassword,
	hashSyncPassword,
	comparePassword,
};
