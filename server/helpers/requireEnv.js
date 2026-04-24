const requireEnv = (key) => {
	if (!key || typeof key !== "string") {
		throw new Error("Environment variable key must be a valid string");
	}

	const value = process.env[key];

	if (value === undefined || value === null || value === "") {
		throw new Error(`Missing required environment variable: ${key}`);
	}

	return value;
};

module.exports = requireEnv;
