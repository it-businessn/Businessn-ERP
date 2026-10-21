const CONFIG = require("../config/app.config");
const { verifyToken } = require("../middleware/auth");
const { getUserCompanyNames } = require("../middleware/authorize");

/**
 * NEW-15 / CHANGES.md API #16: socket.io connections were unauthenticated and the VoPay
 * webhook broadcast every payload to every connected socket. A socket must now
 * present a valid access JWT in the handshake (`auth: { token, companyName? }`)
 * and only joins rooms of companies the user belongs to (same membership rule
 * as the HTTP API, middleware/authorize.js). Events are emitted per company room.
 */
const companyRoom = (companyName) => `company:${companyName}`;

const socketAuthMiddleware = async (socket, next) => {
	try {
		const { token, companyName } = socket.handshake?.auth || {};
		if (typeof token !== "string" || !token) return next(new Error("TOKEN_MISSING"));

		let user;
		try {
			user = verifyToken(token, CONFIG.ACCESS_TOKEN_SECRET);
		} catch (error) {
			return next(new Error("TOKEN_INVALID"));
		}
		if (!user || !user.id) return next(new Error("TOKEN_INVALID"));

		const allowed = await getUserCompanyNames(String(user.id));
		let companies;
		if (companyName === undefined || companyName === null || companyName === "") {
			companies = [...allowed];
		} else if (typeof companyName === "string" && allowed.has(companyName)) {
			companies = [companyName];
		} else {
			return next(new Error("COMPANY_ACCESS_DENIED"));
		}

		socket.data.user = { id: user.id };
		socket.data.companyRooms = companies.map(companyRoom);
		return next();
	} catch (error) {
		console.error("socket auth failed:", error.message);
		return next(new Error("SOCKET_AUTH_FAILED"));
	}
};

const joinCompanyRooms = (socket) => {
	const rooms = socket.data?.companyRooms || [];
	if (rooms.length) socket.join(rooms);
};

const attachSocketAuth = (io) => {
	io.use(socketAuthMiddleware);
	io.on("connection", joinCompanyRooms);
};

const emitToCompany = (io, companyName, eventName, payload) => {
	if (typeof companyName !== "string" || !companyName) return false;
	io.to(companyRoom(companyName)).emit(eventName, payload);
	return true;
};

module.exports = {
	companyRoom,
	socketAuthMiddleware,
	joinCompanyRooms,
	attachSocketAuth,
	emitToCompany,
};
