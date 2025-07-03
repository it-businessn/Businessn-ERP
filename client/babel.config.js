module.exports = {
	presets: ["react-app"],
	plugins: process.env.NODE_ENV === "production" ? ["transform-remove-console"] : [],
};
