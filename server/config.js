// Allow only specific domains
const corsOptions = {
	origin: [
		"https://businessn-erp.com",
		"https:businessn-nwg.ddns.net",
		"http:businessn-nwg.ddns.net",
		"http://10.0.0.79:3000",
		"http://localhost:3000",
		"http://localhost:3001",
		"https://businessn-erp.onrender.com",
	],
	methods: ["GET", "POST", "PUT", "DELETE"],
	credentials: true, // Allow cookies to be sent
};

module.exports = corsOptions;
