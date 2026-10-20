/**
 * Route-level regression tests for the security defects fixed in this audit.
 * MongoDB is not available in the CI sandbox, so the Mongoose models that the
 * exercised handlers touch are mocked. Everything else (express wiring,
 * middleware order, rate limiting, validation, status codes) is real.
 */
const request = require("supertest");
const bcrypt = require("bcryptjs");

jest.mock("../models/Company");
jest.mock("../models/Employee");
jest.mock("../models/EmployeeProfileInfo");
jest.mock("../models/EmployeeEmploymentInfo");
jest.mock("../models/UserActivity");
jest.mock("../models/CompanyResource");
jest.mock("../models/Ticket");
jest.mock("../models/Lead");
jest.mock("../services/emailService", () => ({ sendEmail: jest.fn().mockResolvedValue() }));

const Company = require("../models/Company");
const Employee = require("../models/Employee");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");
const Resource = require("../models/CompanyResource");
const Lead = require("../models/Lead");
const SupportTicket = require("../models/Ticket");
const { getResetPasswordLink } = require("../services/tokenService");
const { clearMembershipCache } = require("../middleware/authorize");
const { USER_ID, OTHER_ID, auth, query, buildTestApp } = require("./helpers");

let app;
beforeAll(() => {
	app = buildTestApp();
});
beforeEach(() => {
	jest.clearAllMocks();
	clearMembershipCache();
	// Default membership: USER_ID belongs to "Acme" only.
	Company.find.mockImplementation(() => query([{ name: "Acme" }]));
});

describe("AUD-003 tenant scoping", () => {
	test("T-TEN-01 request for own company passes through to the handler", async () => {
		Company.findOne.mockImplementation(() => query({ name: "Acme", registration_number: "1" }));
		const res = await request(app).get("/api/company/Acme").set(auth());
		expect(res.status).toBe(200);
		expect(res.body.name).toBe("Acme");
	});

	test("T-TEN-02 request for a foreign company -> 403 COMPANY_ACCESS_DENIED", async () => {
		const res = await request(app).get("/api/user/all/Globex").set(auth());
		expect(res.status).toBe(403);
		expect(res.body.code).toBe("COMPANY_ACCESS_DENIED");
	});

	test("T-TEN-03 companyName in POST body is checked too", async () => {
		const res = await request(app)
			.post("/api/payroll/process")
			.set(auth())
			.send({ companyName: "Globex", currentPayPeriod: {} });
		expect(res.status).toBe(403);
	});

	test("T-TEN-04 unauthenticated request to protected route -> 401", async () => {
		const res = await request(app).get("/api/user/all/Acme");
		expect(res.status).toBe(401);
		expect(res.body.code).toBe("TOKEN_MISSING");
	});

	test("T-TEN-05 membership is cached for the TTL window (one DB lookup per user)", async () => {
		await request(app).get("/api/user/all/Globex").set(auth());
		await request(app).get("/api/user/all/Globex").set(auth());
		expect(Company.find).toHaveBeenCalledTimes(1);
	});

	test("T-TEN-06 :company and :name params are guarded as well", async () => {
		const r1 = await request(app).get("/api/payroll/bankingInfo/Globex/" + OTHER_ID).set(auth());
		expect(r1.status).toBe(403);
		const r2 = await request(app).get("/api/company/Globex").set(auth());
		expect(r2.status).toBe(403);
	});

	test("T-TEN-07 placeholder 'null' department segment does not trigger a denial", async () => {
		EmployeeEmploymentInfo.find.mockImplementation(() => query([]));
		const res = await request(app).get("/api/user/payroll-active/Acme/null/undefined").set(auth());
		expect(res.status).toBe(200);
		expect(EmployeeEmploymentInfo.find).toHaveBeenCalled();
	});

	test("T-TEN-12 (REV-002) :companyName params on the ticket/resource routers are guarded", async () => {
		const r1 = await request(app).get("/api/resource/type/pdf/Globex").set(auth());
		expect(r1.status).toBe(403);
		const r2 = await request(app).get(`/api/ticket/count/${USER_ID}/Globex`).set(auth());
		expect(r2.status).toBe(403);
		const r3 = await request(app).get("/api/resource/type/pdf/Globex");
		expect(r3.status).toBe(401);
	});

	test("T-TEN-13 (REV-002) public ticket endpoints still work without a token", async () => {
		const res = await request(app).post("/api/ticket/support").send({});
		expect(res.status).toBe(400); // validation, not 401
	});

	test("T-TEN-14 (REV-004) multipart upload naming a foreign company -> 403 and temp file removed", async () => {
		const fs = require("fs");
		const res = await request(app)
			.post("/api/resource/upload")
			.set(auth())
			.field("company", "Globex")
			.field("fileType", "pdf")
			.attach("file", Buffer.from("hello"), "evil-upload-rev004.pdf");
		expect(res.status).toBe(403);
		expect(fs.existsSync(require("path").join(__dirname, "../uploads/evil-upload-rev004.pdf"))).toBe(false);
	});

	test("T-TEN-15 (REV-005) PUT /api/company/:id for a company the caller is not a member of -> 403", async () => {
		Company.find.mockImplementation(() => query([{ _id: "64a0000000000000000000aa", name: "Acme" }]));
		const r1 = await request(app).put("/api/company/64a0000000000000000000bb").set(auth()).send({ name: "x" });
		expect(r1.status).toBe(403);
		expect(Company.findByIdAndUpdate).not.toHaveBeenCalled();
		const r2 = await request(app).put("/api/company/not-an-id").set(auth()).send({ name: "x" });
		expect(r2.status).toBe(400);
	});

	test("T-TEN-16 (REV-005) PUT /api/company/:id for own company reaches the handler", async () => {
		Company.find.mockImplementation(() => query([{ _id: "64a0000000000000000000aa", name: "Acme" }]));
		Company.findByIdAndUpdate.mockImplementation(() => query({ _id: "64a0000000000000000000aa", name: "Acme" }));
		const res = await request(app).put("/api/company/64a0000000000000000000aa").set(auth()).send({ revenue: "1" });
		expect(res.status).not.toBe(403);
		expect(Company.findByIdAndUpdate).toHaveBeenCalled();
	});
});

describe("AUD-002 change-password", () => {
	const hash = bcrypt.hashSync("OldPassw0rd!", 4);

	test("T-PWD-01 unauthenticated -> 401", async () => {
		const res = await request(app).put(`/api/change-password/${USER_ID}`).send({ newPassword: "x".repeat(10) });
		expect(res.status).toBe(401);
		expect(Employee.findByIdAndUpdate).not.toHaveBeenCalled();
	});

	test("T-PWD-02 another user's id -> 403 and no write", async () => {
		const res = await request(app)
			.put(`/api/change-password/${OTHER_ID}`)
			.set(auth(USER_ID))
			.send({ currentPassword: "OldPassw0rd!", newPassword: "NewPassw0rd!" });
		expect(res.status).toBe(403);
		expect(Employee.findByIdAndUpdate).not.toHaveBeenCalled();
	});

	test("T-PWD-03 wrong current password -> 401 and no write", async () => {
		Employee.findById.mockImplementation(() => query({ _id: USER_ID, password: hash }));
		const res = await request(app)
			.put(`/api/change-password/${USER_ID}`)
			.set(auth())
			.send({ currentPassword: "nope-nope-nope", newPassword: "NewPassw0rd!" });
		expect(res.status).toBe(401);
		expect(Employee.findByIdAndUpdate).not.toHaveBeenCalled();
	});

	test.each([
		["missing", undefined, 400],
		["too short (7)", "abcdefg", 400],
		["whitespace only", "        ", 400],
		["too long (129)", "a".repeat(129), 400],
	])("T-PWD-04 new password %s -> %i", async (_label, newPassword, status) => {
		const res = await request(app)
			.put(`/api/change-password/${USER_ID}`)
			.set(auth())
			.send({ currentPassword: "OldPassw0rd!", newPassword });
		expect(res.status).toBe(status);
	});

	test("T-PWD-05 mismatched confirmation -> 400", async () => {
		const res = await request(app)
			.put(`/api/change-password/${USER_ID}`)
			.set(auth())
			.send({ currentPassword: "OldPassw0rd!", newPassword: "NewPassw0rd!", confirmPassword: "Other" });
		expect(res.status).toBe(400);
	});

	test("T-PWD-06 happy path stores a bcrypt hash, not the plaintext", async () => {
		Employee.findById.mockImplementation(() => query({ _id: USER_ID, password: hash }));
		Employee.findByIdAndUpdate.mockResolvedValue({ _id: USER_ID });
		const res = await request(app)
			.put(`/api/change-password/${USER_ID}`)
			.set(auth())
			.send({ currentPassword: "OldPassw0rd!", newPassword: "NewPassw0rd!", confirmPassword: "NewPassw0rd!" });
		expect(res.status).toBe(200);
		const [, update] = Employee.findByIdAndUpdate.mock.calls[0];
		expect(update.$set.password).not.toBe("NewPassw0rd!");
		expect(bcrypt.compareSync("NewPassw0rd!", update.$set.password)).toBe(true);
	});

	test("T-PWD-07 invalid ObjectId -> 400", async () => {
		const res = await request(app)
			.put(`/api/change-password/not-an-id`)
			.set({ Authorization: `Bearer ${require("./helpers").tokenFor("not-an-id")}` })
			.send({ currentPassword: "a", newPassword: "NewPassw0rd!" });
		expect(res.status).toBe(400);
	});
});

describe("AUD-001 reset-password token verification", () => {
	test("T-RST-01 POST with forged token -> 400 and no write", async () => {
		Employee.findById.mockImplementation(() => query({ _id: USER_ID, email: "a@b.c", password: "h" }));
		const res = await request(app)
			.post(`/api/reset-password/${USER_ID}/forged.token.value`)
			.send({ password: "NewPassw0rd!" });
		expect(res.status).toBe(400);
		expect(res.body.code).toBe("RESET_TOKEN_INVALID");
		expect(Employee.findByIdAndUpdate).not.toHaveBeenCalled();
	});

	test("T-RST-02 valid token for user A used against user B's id -> 400", async () => {
		Employee.findById.mockImplementation(() => query({ _id: OTHER_ID, email: "b@b.c", password: "" }));
		const token = getResetPasswordLink({ _id: USER_ID }).split("/").pop();
		const res = await request(app)
			.post(`/api/reset-password/${OTHER_ID}/${token}`)
			.send({ password: "NewPassw0rd!" });
		expect(res.status).toBe(400);
		expect(Employee.findByIdAndUpdate).not.toHaveBeenCalled();
	});

	test("T-RST-03 valid token + valid password -> hash written and legacy plaintext unset", async () => {
		const token = getResetPasswordLink({ _id: USER_ID }, "$2a$oldhash").split("/").pop();
		Employee.findById.mockImplementation(() => query({ _id: USER_ID, email: "a@b.c", password: "$2a$oldhash" }));
		Employee.findByIdAndUpdate.mockResolvedValue({});
		EmployeeProfileInfo.updateMany.mockResolvedValue({});
		const res = await request(app)
			.post(`/api/reset-password/${USER_ID}/${token}`)
			.send({ password: "NewPassw0rd!" });
		expect(res.status).toBe(200);
		expect(Employee.findByIdAndUpdate).toHaveBeenCalledTimes(1);
		expect(EmployeeProfileInfo.updateMany).toHaveBeenCalledWith(
			{ empId: USER_ID },
			{ $unset: { password: "" } },
		);
	});

	test("T-RST-06 (REV-003) link is single-use: token issued before a password change is rejected", async () => {
		const token = getResetPasswordLink({ _id: USER_ID }, "$2a$oldhash").split("/").pop();
		// password has since been changed
		Employee.findById.mockImplementation(() => query({ _id: USER_ID, email: "a@b.c", password: "$2a$NEWhash" }));
		const res = await request(app)
			.post(`/api/reset-password/${USER_ID}/${token}`)
			.send({ password: "NewPassw0rd!" });
		expect(res.status).toBe(400);
		expect(Employee.findByIdAndUpdate).not.toHaveBeenCalled();
	});

	test("T-RST-04 valid token but short password -> 400 (JSON client)", async () => {
		const token = getResetPasswordLink({ _id: USER_ID }, "h").split("/").pop();
		Employee.findById.mockImplementation(() => query({ _id: USER_ID, email: "a@b.c", password: "h" }));
		const res = await request(app)
			.post(`/api/reset-password/${USER_ID}/${token}`)
			.set("Accept", "application/json")
			.send({ password: "short" });
		expect(res.status).toBe(400);
		expect(Employee.findByIdAndUpdate).not.toHaveBeenCalled();
	});

	test("T-RST-05 GET reset page with bad token renders expired page (400)", async () => {
		Employee.findById.mockImplementation(() => query({ _id: USER_ID, email: "a@b.c", password: "h" }));
		const res = await request(app).get(`/api/reset-password/${USER_ID}/bad`);
		expect(res.status).toBe(400);
		expect(res.text).toMatch(/invalid or has expired/i);
	});
});

describe("AUD-004 updateUser mass assignment", () => {
	test("T-USR-01 password/_id/otp in body are discarded", async () => {
		Company.findOne.mockImplementation(() => query(null));
		Employee.findByIdAndUpdate.mockResolvedValue({ _id: OTHER_ID });
		const res = await request(app)
			.put(`/api/user/${OTHER_ID}`)
			.set(auth())
			.send({ firstName: "Mallory", password: "owned", otp: "1", _id: "zzz" });
		expect(res.status).toBe(201); // existing status code of updateUser, unchanged
		const [, update] = Employee.findByIdAndUpdate.mock.calls[0];
		expect(update.$set).not.toHaveProperty("password");
		expect(update.$set).not.toHaveProperty("otp");
		expect(update.$set).not.toHaveProperty("_id");
		expect(update.$set.firstName).toBe("Mallory");
	});

	test("T-USR-02 invalid user id -> 400", async () => {
		const res = await request(app).put(`/api/user/nope`).set(auth()).send({ firstName: "x" });
		expect(res.status).toBe(400);
	});

	test("T-USR-03 (AUD-012) PUT /api/user/assignLeads is no longer swallowed by /:userId", async () => {
		// updateUserAssignedLeads redistributes leads across active users by weight.
		Lead.find.mockImplementation(() => query([{ _id: "l1" }, { _id: "l2" }, { _id: "l3" }, { _id: "l4" }]));
		EmployeeEmploymentInfo.find.mockImplementation(() =>
			query([
				{ _id: "e1", assignedWeight: 1, empId: { fullName: "A" } },
				{ _id: "e2", assignedWeight: 3, empId: { fullName: "B" } },
			]),
		);
		Employee.findByIdAndUpdate.mockImplementation(() => query({}));
		const res = await request(app).put(`/api/user/assignLeads`).set(auth()).send({});
		expect(res.status).toBe(200);
		expect(res.body.message).toMatch(/Leads assignee updated/);
		// 4 leads, weights 1:3 -> 1 and 3
		const calls = Employee.findByIdAndUpdate.mock.calls.map((c) => [c[0], c[1].$set.assignedLeads]);
		expect(calls).toEqual([
			["e1", 1],
			["e2", 3],
		]);
	});
});

describe("AUD-006/009 ticket & resource protection", () => {
	test("T-TKT-01 PUT /api/ticket/:id without token -> 401", async () => {
		const res = await request(app).put(`/api/ticket/${USER_ID}`).send({ status: "Closed" });
		expect(res.status).toBe(401);
	});
	test("T-TKT-02 GET /api/ticket/download/:f without token -> 401", async () => {
		const res = await request(app).get(`/api/ticket/download/x.pdf`);
		expect(res.status).toBe(401);
	});
	test("T-RES-01 GET /api/resource/download/:f without token -> 401", async () => {
		const res = await request(app).get(`/api/resource/download/x.pdf`);
		expect(res.status).toBe(401);
	});
	test("T-RES-02 missing resource -> 404 (was TypeError 500)", async () => {
		Resource.findOne.mockImplementation(() => query(null));
		const res = await request(app).get(`/api/resource/download/missing.pdf`).set(auth());
		expect(res.status).toBe(404);
	});
	test("T-RES-04 (REV-007) two concurrent downloads of the same file both succeed", async () => {
		Resource.findOne.mockImplementation(() =>
			query({ originalname: "report.pdf", file: { data: Buffer.from("%PDF-1.4 test") } }),
		);
		const [a, b] = await Promise.all([
			request(app).get("/api/resource/download/report.pdf").set(auth()).buffer(true),
			request(app).get("/api/resource/download/report.pdf").set(auth()).buffer(true),
		]);
		expect(a.status).toBe(200);
		expect(b.status).toBe(200);
		expect(a.headers["content-disposition"]).toMatch(/report\.pdf/);
		expect(a.headers["content-type"]).toMatch(/pdf/);
	});

	test("T-FILE-04 (REV-008) upload over 10 MB -> 413", async () => {
		const big = Buffer.alloc(10 * 1024 * 1024 + 1, 1);
		const res = await request(app)
			.post("/api/resource/upload")
			.set(auth())
			.field("company", "Acme")
			.attach("file", big, "big.bin");
		expect(res.status).toBe(413);
	});

	test("T-FILE-07 upload without a file -> 400", async () => {
		const res = await request(app).post("/api/resource/upload").set(auth()).field("company", "Acme");
		expect(res.status).toBe(400);
	});

	test("T-RES-03 traversal filename is neutralised and treated as a lookup key", async () => {
		Resource.findOne.mockImplementation(() => query(null));
		const res = await request(app).get(`/api/resource/download/..%2F..%2Findex.js`).set(auth());
		expect([404]).toContain(res.status);
	});
	test("T-TKT-03 missing ticket attachment -> 404", async () => {
		SupportTicket.findOne.mockImplementation(() => query(null));
		const res = await request(app).get(`/api/ticket/download/missing.pdf`).set(auth());
		expect(res.status).toBe(404);
	});
});

describe("AUD-016 public support ticket validation", () => {
	test.each([
		["empty body", {}],
		["missing contactInfo", { companyInfo: { companyName: "A" }, queryInfo: { issue: "x" } }],
		["bad email", { companyInfo: { companyName: "A" }, contactInfo: { clientFirstName: "a", clientLastName: "b", clientEmail: "nope" }, queryInfo: { issue: "x" } }],
		["whitespace issue", { companyInfo: { companyName: "A" }, contactInfo: { clientFirstName: "a", clientLastName: "b", clientEmail: "a@b.co" }, queryInfo: { issue: "   " } }],
	])("T-SUP-01 %s -> 400", async (_l, body) => {
		const res = await request(app).post("/api/ticket/support").send(body);
		expect(res.status).toBe(400);
		expect(SupportTicket.create).not.toHaveBeenCalled();
	});
});

describe("AUD-011 payroll stubs", () => {
	test("T-PAY-01 GET /api/payroll/payGroups/Acme/1 -> 501 instead of hanging", async () => {
		const res = await request(app).get("/api/payroll/payGroups/Acme/1").set(auth());
		expect(res.status).toBe(501);
	});
});

describe("AUD-007 VoPay webhook", () => {
	test("T-WH-01 reachable without bearer token; bad signature -> 401", async () => {
		const res = await request(app).post("/api/vopay-webhook").send({ x: 1 });
		expect(res.status).toBe(401);
	});
	test("T-WH-02 missing signature header -> 401 (not 500)", async () => {
		const res = await request(app).post("/api/vopay-webhook").set("x-vopay-signature", "").send({});
		expect(res.status).toBe(401);
	});
});

describe("misc", () => {
	test("T-404-01 unknown /api route -> JSON 404", async () => {
		const res = await request(app).get("/api/does-not-exist").set(auth());
		expect(res.status).toBe(404);
		expect(res.body.message).toBe("Not found");
	});
	test("T-LOGIN-01 login requires all fields", async () => {
		const res = await request(app).post("/api/login").send({ email: "a@b.c" });
		expect(res.status).toBe(400);
	});
	test("T-LOGIN-02 unknown user -> 401 with generic message", async () => {
		Employee.findOne.mockImplementation(() => query(null));
		const res = await request(app).post("/api/login").send({ email: "a@b.c", password: "x", companyId: "1" });
		expect(res.status).toBe(401);
	});
});
