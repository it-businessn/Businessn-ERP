const requireEnv = require("../helpers/requireEnv");

const toHexBuffer = (keyName) => {
	const value = requireEnv(keyName);

	if (!/^[0-9a-fA-F]+$/.test(value)) {
		throw new Error(`Invalid HEX format for environment variable: ${keyName}`);
	}

	return Buffer.from(value, "hex");
};

const CONFIG = {
	corsOptions: {
		origin: [
			"https://businessn.com",
			"https://businessn-erp.com",
			"http://businessn-nwg.ddns.net",
			"https://www.businessn.com",
			"http://10.0.0.79:3000",
			"http://localhost:3000",
			"http://localhost:3001",
			"https://businessn-erp.onrender.com",
			"http://localhost:5001",
			"https://crm-backend-874t.onrender.com",
			"https://test-crm-staging.netlify.app",
		],
		methods: ["GET", "POST", "PUT", "DELETE"],
		credentials: true, // Allow cookies to be sent
	},
	PORT: requireEnv("PORT"),
	ACCESS_TOKEN_SECRET: requireEnv("ACCESS_TOKEN_SECRET"),
	REFRESH_TOKEN_SECRET: requireEnv("REFRESH_TOKEN_SECRET"),
	MONGO_URI: requireEnv("DB_CONNECTION_URL_STAGING_CRM"),
	BASE_URL_LIVE: requireEnv("BASE_URL_LIVE"),
	SIN_KEY: toHexBuffer("SIN_ENCRYPTION_KEY"),
	BANKING_KEY: toHexBuffer("BANKING_ENCRYPTION_KEY"),
	XML_ENCRYPTION_KEY: toHexBuffer("XML_ENCRYPTION_KEY"),
};

module.exports = CONFIG;
