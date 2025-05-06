const fs = require("fs");
const path = require("path");

const version = new Date().toISOString();
const filePath = path.join(__dirname, "../public/version.json");

fs.writeFileSync(filePath, JSON.stringify({ version }, null, 2));
console.log(`✅ Version file written: ${version}`);
