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
const runPayStubEmailJob = require("./jobs/payStubEmail");
const { attachSocketAuth } = require("./helpers/socketAuth");

// FIX: Attach http server so Socket.io actually receives connections.
const httpServer = http.createServer();
const io = socketio(httpServer, {
	cors: {
		origin: CONFIG.corsOptions.origin,
		methods: CONFIG.corsOptions.methods,
	},
});
// NEW-15 / CHANGES.md API #16: sockets must authenticate (auth.token = access JWT) and
// only join rooms of their own companies; VoPay events are emitted per room.
attachSocketAuth(io);

const app = buildApp(io);
// socket.io hooks the server before this listener is added, so its own
// /socket.io/ requests would also reach Express, which then tried to answer
// an already-answered request (ERR_HTTP_HEADERS_SENT). Leave them to socket.io.
httpServer.on("request", (req, res) => {
	if (req.url && req.url.startsWith("/socket.io/")) return;
	app(req, res);
});

const PORT = CONFIG.PORT;
const MONGO_URI = CONFIG.MONGO_URI;

// NEW-03: several controllers still start un-awaited async work (e.g. the
// time-card mapping loop, fire-and-forget T4 generation). On Node >= 15 an
// unhandled rejection from that work terminates the process; log it instead
// so one bad record cannot take the API down for every tenant.
process.on("unhandledRejection", (reason) => {
	console.error("Unhandled promise rejection:", reason instanceof Error ? reason.stack : reason);
});

// Scheduler job
runStatHolidayJob();
// PAYSTUB-EMAIL: e-mail pay stubs on the pay date (only when PAYSTUB_EMAIL_ENABLED=true)
runPayStubEmailJob();

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
