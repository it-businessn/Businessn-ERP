/**
 * Authentication flow: login, refresh, forgot-password, logout.
 * Models are mocked (no MongoDB in CI); bcrypt, JWT signing, routing,
 * middleware order and validation are real.
 */
const request = require("supertest");
const bcrypt = require("bcryptjs");

jest.mock("../models/Company");
jest.mock("../models/Employee");
jest.mock("../models/EmployeeEmploymentInfo");
jest.mock("../models/EmployeeProfileInfo");
jest.mock("../models/UserActivity");
jest.mock("../services/emailService", () => ({ sendEmail: jest.fn().mockResolvedValue() }));

const Company = require("../models/Company");
const Employee = require("../models/Employee");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const UserActivity = require("../models/UserActivity");
const { sendEmail } = require("../services/emailService");
const { generateAccessToken, generateRefreshToken } = require("../middleware/auth");
const { clearMembershipCache } = require("../middleware/authorize");
const { USER_ID, query, buildTestApp } = require("./helpers");

const PASSWORD = "correct horse battery";
let HASH;
let app;

beforeAll(async () => {
	HASH = await bcrypt.hash(PASSWORD, 4);
	app = buildTestApp();
});

beforeEach(() => {
	jest.clearAllMocks();
	clearMembershipCache();
	Company.find.mockImplementation(() => query([{ name: "Acme" }]));
	UserActivity.updateMany.mockResolvedValue({});
	UserActivity.findOne.mockResolvedValue(null);
});

const user = () => ({
	_id: USER_ID,
	firstName: "Ada",
	lastName: "Lovelace",
	fullName: "Ada Lovelace",
	email: "ada@acme.test",
	password: HASH,
});

const mockLoginLookups = ({ found = true, member = true } = {}) => {
	Employee.findOne.mockImplementation(() => query(found ? user() : null));
	Company.findOne.mockImplementation(() =>
		query(member ? { name: "Acme", registration_number: "ACME-1" } : null),
	);
	EmployeeEmploymentInfo.findOne.mockImplementation(() =>
		query({ employmentRole: "Manager", employeeNo: "E-1", payrollStatus: "Payroll Active", positions: [] }),
	);
};

const login = (body) => request(app).post("/api/login").send(body);

describe("POST /api/login", () => {
	test("T-AUTH-10 valid credentials -> 200 with tokens and profile, never the password hash", async () => {
		mockLoginLookups();
		const res = await login({ email: "ada@acme.test", password: PASSWORD, companyId: "ACME-1" });
		expect(res.status).toBe(200);
		expect(typeof res.body.accessToken).toBe("string");
		expect(typeof res.body.refreshToken).toBe("string");
		expect(res.body.user).toMatchObject({ _id: USER_ID, email: "ada@acme.test", role: "Manager" });
		expect(JSON.stringify(res.body)).not.toContain(HASH);
		expect(res.body.existingCompanyUser.name).toBe("Acme");
	});

	test("T-AUTH-11 wrong password -> 401 generic message", async () => {
		mockLoginLookups();
		const res = await login({ email: "ada@acme.test", password: "nope-nope", companyId: "ACME-1" });
		expect(res.status).toBe(401);
		expect(res.body.accessToken).toBeUndefined();
	});

	test("T-AUTH-12 user is not a member of the company -> 401 (same message as bad password)", async () => {
		mockLoginLookups({ member: false });
		const bad = await login({ email: "ada@acme.test", password: PASSWORD, companyId: "OTHER" });
		mockLoginLookups();
		const wrongPw = await login({ email: "ada@acme.test", password: "x", companyId: "ACME-1" });
		expect(bad.status).toBe(401);
		expect(bad.body.message).toBe(wrongPw.body.message);
	});

	test("T-AUTH-13 (BUG-04) operator object in email/companyId -> 400, no DB lookup", async () => {
		mockLoginLookups();
		const r1 = await login({ email: { $ne: null }, password: PASSWORD, companyId: "ACME-1" });
		const r2 = await login({ email: "ada@acme.test", password: PASSWORD, companyId: { $gt: "" } });
		const r3 = await login({ email: "ada@acme.test", password: ["x"], companyId: "ACME-1" });
		expect([r1.status, r2.status, r3.status]).toEqual([400, 400, 400]);
		expect(Employee.findOne).not.toHaveBeenCalled();
	});

	test("T-AUTH-14 the returned access token opens a protected route", async () => {
		mockLoginLookups();
		const res = await login({ email: "ada@acme.test", password: PASSWORD, companyId: "ACME-1" });
		const r = await request(app)
			.get("/api/logout/" + USER_ID)
			.set("Authorization", `Bearer ${res.body.accessToken}`);
		expect(r.status).toBe(200);
	});
});

describe("POST /api/refresh-token", () => {
	test("T-AUTH-15 valid refresh token -> new access token that authenticates", async () => {
		const refreshToken = generateRefreshToken({ id: USER_ID, fullName: "Ada" });
		const res = await request(app).post("/api/refresh-token").send({ refreshToken });
		expect(res.status).toBe(200);
		const r = await request(app)
			.get("/api/logout/" + USER_ID)
			.set("Authorization", `Bearer ${res.body.accessToken}`);
		expect(r.status).toBe(200);
	});

	test("T-AUTH-16 missing refresh token -> 401", async () => {
		const res = await request(app).post("/api/refresh-token").send({});
		expect(res.status).toBe(401);
	});

	test("T-AUTH-17 an access token is not accepted as a refresh token (different secret) -> 403", async () => {
		const res = await request(app)
			.post("/api/refresh-token")
			.send({ refreshToken: generateAccessToken({ id: USER_ID }) });
		expect(res.status).toBe(403);
	});

	test("T-AUTH-18 a refresh token is not accepted as a bearer access token -> 403 TOKEN_INVALID", async () => {
		const res = await request(app)
			.get("/api/logout/" + USER_ID)
			.set("Authorization", `Bearer ${generateRefreshToken({ id: USER_ID })}`);
		expect(res.status).toBe(403);
		expect(res.body.code).toBe("TOKEN_INVALID");
	});
});

describe("POST /api/forgot-password", () => {
	test("T-AUTH-19 unknown e-mail -> 200 with the neutral message and no e-mail sent", async () => {
		Employee.findOne.mockResolvedValue(null);
		const res = await request(app).post("/api/forgot-password").send({ email: "nobody@x.test" });
		expect(res.status).toBe(200);
		expect(res.body.message).toMatch(/If an account exists/);
		expect(sendEmail).not.toHaveBeenCalled();
	});

	test("T-AUTH-20 known e-mail -> reset link for that user is mailed to that user only", async () => {
		Employee.findOne.mockResolvedValue(user());
		const res = await request(app).post("/api/forgot-password").send({ email: "ada@acme.test" });
		expect(res.status).toBe(200);
		expect(sendEmail).toHaveBeenCalledTimes(1);
		const [to, , link] = sendEmail.mock.calls[0];
		expect(to).toBe("ada@acme.test");
		expect(link).toContain(`/reset-password/${USER_ID}/`);
	});

	test("T-AUTH-25 (API-12) known and unknown e-mails get the identical response", async () => {
		Employee.findOne.mockResolvedValue(null);
		const unknown = await request(app).post("/api/forgot-password").send({ email: "nobody@x.test" });
		Employee.findOne.mockResolvedValue(user());
		const known = await request(app).post("/api/forgot-password").send({ email: "ada@acme.test" });
		expect(known.status).toBe(unknown.status);
		expect(known.body).toEqual(unknown.body);
	});

	test("T-AUTH-21 (BUG-04) operator object as e-mail -> 400, no lookup, no e-mail", async () => {
		const res = await request(app).post("/api/forgot-password").send({ email: { $ne: null } });
		expect(res.status).toBe(400);
		expect(Employee.findOne).not.toHaveBeenCalled();
		expect(sendEmail).not.toHaveBeenCalled();
	});

	test("T-AUTH-22 missing e-mail -> 400", async () => {
		const res = await request(app).post("/api/forgot-password").send({});
		expect(res.status).toBe(400);
	});
});

describe("GET /api/logout/:id", () => {
	test("T-AUTH-23 requires a token", async () => {
		const res = await request(app).get("/api/logout/" + USER_ID);
		expect(res.status).toBe(401);
	});

	test("T-AUTH-24 closes the open activity record", async () => {
		const activity = { logoutTime: null, save: jest.fn().mockResolvedValue() };
		UserActivity.findOne.mockResolvedValue(activity);
		const res = await request(app)
			.get("/api/logout/" + USER_ID)
			.set("Authorization", `Bearer ${generateAccessToken({ id: USER_ID })}`);
		expect(res.status).toBe(200);
		expect(activity.logoutTime).toBeInstanceOf(Date);
		expect(activity.save).toHaveBeenCalled();
	});
});

describe("POST /api/signup", () => {
	test("T-AUTH-26 (SIGNUP-01) the 201 response never contains the password hash or otp", async () => {
		Employee.findOne.mockResolvedValue(null);
		Company.findOne.mockResolvedValue({ _id: "c1", employees: [], save: jest.fn() });
		Employee.findOneAndUpdate.mockImplementation(async (filter, update) => ({
			toObject: () => ({ _id: USER_ID, ...update.$set, otp: "123456" }),
			_id: USER_ID,
		}));
		const res = await request(app)
			.post("/api/signup")
			.send({ company: "Acme", email: "new@acme.test", password: "longenough1", firstName: "N" });
		expect(res.status).toBe(201);
		expect(res.body.email).toBe("new@acme.test");
		expect(res.body.password).toBeUndefined();
		expect(res.body.otp).toBeUndefined();
	});

	test("T-AUTH-27 (SIGNUP-01) operator object as e-mail -> 400, no lookup", async () => {
		const res = await request(app)
			.post("/api/signup")
			.send({ company: "Acme", email: { $ne: null }, password: "longenough1" });
		expect(res.status).toBe(400);
		expect(Employee.findOne).not.toHaveBeenCalled();
	});
});
