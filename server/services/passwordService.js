const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
	try {
		return await bcrypt.hash(password, 10);
	} catch (error) {
		throw new Error("Password hashing failed");
	}
};

const hashSyncPassword = async (newPassword) => {
	try {
		return bcrypt.hashSync(newPassword, 10);
	} catch (error) {
		throw new Error("Password hashing failed");
	}
};

const comparePassword = async (password1, password2) => {
	try {
		return await bcrypt.compare(password1, password2);
	} catch (error) {
		throw new Error("Password hashing failed");
	}
};

module.exports = {
	hashPassword,
	hashSyncPassword,
	comparePassword,
};
