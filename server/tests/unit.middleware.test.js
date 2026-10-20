const moment = require("moment");
const jwt = require("jwt-simple");
const {
	authenticateToken,
	generateAccessToken,
	verifyToken,
	errorHandler,
} = require("../middleware/auth");
const { requireSelf, extractCompanyNames } = require("../middleware/authorize");
const { sanitizeFilename, filePath } = require("../services/fileService");
const { verifyResetPasswordToken, getResetPasswordLink } = require("../services/tokenService");

const mockRes = () => {
	const res = { headersSent: false };
	res.status = jest.fn(() => res);
	res.json = jest.fn(() => res);
	return res;
};

describe("authenticateToken", () => {
	test("T-AUTH-01 missing header -> 401 TOKEN_MISSING", async () => {
		const res = mockRes();
		const next = jest.fn();
		await authenticateToken({ headers: {} }, res, next);
		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ code: "TOKEN_MISSING" }));
		expect(next).not.toHaveBeenCalled();
	});

	test("T-AUTH-02 expired token -> 403 TOKEN_INVALID", async () => {
		const expired = jwt.encode(
			{ id: "64a000000000000000000001", exp: moment().subtract(1, "minute").unix() },
			process.env.ACCESS_TOKEN_SECRET,
		);
		const res = mockRes();
		await authenticateToken({ headers: { authorization: `Bearer ${expired}` } }, res, jest.fn());
		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ code: "TOKEN_INVALID" }));
	});

	test("T-AUTH-03 token signed with wrong secret -> 403", async () => {
		const forged = jwt.encode(
			{ id: "64a000000000000000000001", exp: moment().add(1, "hour").unix() },
			"wrong-secret",
		);
		const res = mockRes();
		await authenticateToken({ headers: { authorization: `Bearer ${forged}` } }, res, jest.fn());
		expect(res.status).toHaveBeenCalledWith(403);
	});

	test("T-AUTH-04 valid token -> req.user populated and next() called", async () => {
		const token = generateAccessToken({ id: "64a000000000000000000001", fullName: "A" });
		const req = { headers: { authorization: `Bearer ${token}` } };
		const next = jest.fn();
		await authenticateToken(req, mockRes(), next);
		expect(next).toHaveBeenCalled();
		expect(req.user.id).toBe("64a000000000000000000001");
	});

	test("T-AUTH-05 verifyToken rejects token without exp in the future", () => {
		const t = jwt.encode({ id: "x", exp: moment().subtract(1, "s").unix() }, process.env.ACCESS_TOKEN_SECRET);
		expect(() => verifyToken(t, process.env.ACCESS_TOKEN_SECRET)).toThrow();
	});
});

describe("requireSelf", () => {
	test("T-AUTHZ-01 denies acting on another user's id", () => {
		const res = mockRes();
		const next = jest.fn();
		requireSelf("id")({ user: { id: "a" }, params: { id: "b" } }, res, next);
		expect(res.status).toHaveBeenCalledWith(403);
		expect(next).not.toHaveBeenCalled();
	});
	test("T-AUTHZ-02 allows own id", () => {
		const next = jest.fn();
		requireSelf("id")({ user: { id: "a" }, params: { id: "a" } }, mockRes(), next);
		expect(next).toHaveBeenCalled();
	});
});

describe("extractCompanyNames", () => {
	test("T-AUTHZ-03 collects names from params/body/query and ignores placeholders", () => {
		const names = extractCompanyNames({
			params: { companyName: "Acme", name: "null" },
			body: { companyName: " Beta " },
			query: { companyName: "undefined" },
		});
		expect(names.sort()).toEqual(["Acme", "Beta"]);
	});
	test("T-AUTHZ-04 ignores non-string body values", () => {
		expect(extractCompanyNames({ params: {}, body: { companyName: { $ne: "" } }, query: {} })).toEqual([]);
	});
});

describe("sanitizeFilename / filePath", () => {
	test("T-FILE-01 strips traversal segments", () => {
		expect(sanitizeFilename("../../index.js")).toBe("index.js");
		expect(sanitizeFilename("..\\..\\win.ini")).toBe("win.ini");
		expect(sanitizeFilename("../.hidden")).toBe("hidden");
	});
	test("T-FILE-02 replaces unsafe characters and caps length", () => {
		expect(sanitizeFilename("re:port?.pdf")).toBe("re_port_.pdf");
		expect(sanitizeFilename("a".repeat(300) + ".pdf").length).toBe(200);
	});
	test("T-FILE-03 filePath never escapes the uploads dir", () => {
		expect(filePath("../../etc/passwd")).toMatch(/[\\/]uploads[\\/]passwd$/);
		expect(() => filePath("")).toThrow();
		expect(() => filePath(null)).toThrow();
	});
});

describe("reset-password token", () => {
	test("T-RESET-01 link token verifies and carries the user id", () => {
		const link = getResetPasswordLink({ _id: "64a000000000000000000001" }, "$2a$hash");
		const token = link.split("/").pop();
		expect(verifyResetPasswordToken(token, "$2a$hash")._id).toBe("64a000000000000000000001");
	});
	test("T-RESET-04 token issued for the previous password hash is rejected (single use)", () => {
		const token = getResetPasswordLink({ _id: "64a000000000000000000001" }, "oldhash").split("/").pop();
		expect(() => verifyResetPasswordToken(token, "newhash")).toThrow();
	});
	test("T-RESET-05 token for a user with no password yet verifies with empty hash only", () => {
		const token = getResetPasswordLink({ _id: "64a000000000000000000001" }).split("/").pop();
		expect(verifyResetPasswordToken(token, undefined)._id).toBe("64a000000000000000000001");
		expect(() => verifyResetPasswordToken(token, "somehash")).toThrow();
	});
	test("T-RESET-02 expired token rejected", () => {
		// reset tokens are signed with `${ACCESS_TOKEN_SECRET}:${passwordHash}`
		const t = jwt.encode({ _id: "x", exp: moment().subtract(1, "s").unix() }, `${process.env.ACCESS_TOKEN_SECRET}:`);
		expect(() => verifyResetPasswordToken(t)).toThrow(/expired/);
	});
	test("T-RESET-03 garbage token rejected", () => {
		expect(() => verifyResetPasswordToken("not-a-token")).toThrow();
		expect(() => verifyResetPasswordToken(undefined)).toThrow();
	});
});

describe("errorHandler", () => {
	test("T-ERR-03 multer size limit -> 413, other multer errors -> 400", () => {
		const multer = require("multer");
		const res = mockRes();
		errorHandler(new multer.MulterError("LIMIT_FILE_SIZE"), { path: "/u", method: "POST" }, res, jest.fn());
		expect(res.status).toHaveBeenCalledWith(413);
		const res2 = mockRes();
		errorHandler(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), { path: "/u", method: "POST" }, res2, jest.fn());
		expect(res2.status).toHaveBeenCalledWith(400);
	});
	test("T-ERR-01 5xx errors never leak internal messages", () => {
		const res = mockRes();
		errorHandler(new Error("secret internals"), { path: "/x", method: "GET" }, res, jest.fn());
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
	});
	test("T-ERR-02 4xx errors keep their status and message", () => {
		const res = mockRes();
		const err = new Error("request entity too large");
		err.status = 413;
		errorHandler(err, { path: "/x", method: "POST" }, res, jest.fn());
		expect(res.status).toHaveBeenCalledWith(413);
	});
});
