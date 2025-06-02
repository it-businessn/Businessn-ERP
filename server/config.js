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
		"http://localhost:5001",
		"https://crm-backend-874t.onrender.com",
		"https://test-crm-staging.netlify.app",
	],
	methods: ["GET", "POST", "PUT", "DELETE"],
	credentials: true, // Allow cookies to be sent
};

module.exports = corsOptions;
