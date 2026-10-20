module.exports = {
	testEnvironment: "node",
	setupFiles: ["<rootDir>/tests/setupEnv.js"],
	testMatch: ["<rootDir>/tests/**/*.test.js"],
	testTimeout: 15000,
	// Mongoose keeps a buffering timer alive; tests never open a connection.
	forceExit: true,
};
