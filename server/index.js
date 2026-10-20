console.log("NODE_ENV", process.env.NODE_ENV);

if (process.env.NODE_ENV === "development") {
	require("dotenv").config({ path: ".env.local" });
	console.log("Using .env.local file");
} else {
	require("dotenv").config();
}

const http = require("http");
const mongoose = require("mongoose");
const socketio = require("socket.io");

const CONFIG = require("./config/app.config");
const { buildApp } = require("./app");
const runStatHolidayJob = require("./jobs/statHoliday");

// FIX: Attach http server so Socket.io actually receives connections.
const httpServer = http.createServer();
const io = socketio(httpServer, {
	cors: {
		origin: CONFIG.corsOptions.origin,
		methods: CONFIG.corsOptions.methods,
	},
});

const app = buildApp(io);
httpServer.on("request", app);

const PORT = CONFIG.PORT;
const MONGO_URI = CONFIG.MONGO_URI;

// Scheduler job
runStatHolidayJob();

// Connect to MongoDB. The returned promise must be handled: an unreachable
// database otherwise surfaces as an unhandled rejection and kills the process.
mongoose.connect(MONGO_URI).catch((err) => {
	console.error("MongoDB initial connection failed:", err.message);
});

const db = mongoose.connection;
db.once("open", () => {
	console.log("Connected to MongoDB");
});
db.on("error", (err) => {
	console.error("MongoDB connection error:", err.message);
});

// FIX: Use httpServer.listen() so Socket.io actually receives connections.
httpServer.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
