const request = require("supertest");
jest.mock("../models/Employee");
jest.mock("../models/Company");
jest.mock("../models/EmployeeEmploymentInfo");
const Employee = require("../models/Employee");
const Company = require("../models/Company");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const { query, buildTestApp, auth } = require("./helpers");

describe("AUD-005 credential endpoint rate limiting", () => {
	test("T-RL-01 21st login attempt within 15 minutes -> 429", async () => {
		const app = buildTestApp();
		Employee.findOne.mockImplementation(() => query(null));
		let last;
		for (let i = 0; i < 21; i++) {
			last = await request(app).post("/api/login").send({ email: "a@b.c", password: "x", companyId: "1" });
			if (i < 20) expect(last.status).toBe(401);
		}
		expect(last.status).toBe(429);
		expect(last.body.code).toBe("RATE_LIMITED");
	});

	test("T-RL-02 forgot-password shares the strict limiter", async () => {
		const app = buildTestApp();
		Employee.findOne.mockImplementation(() => query(null));
		let last;
		for (let i = 0; i < 21; i++) {
			last = await request(app).post("/api/forgot-password").send({ email: "a@b.c" });
		}
		expect(last.status).toBe(429);
	});
});

describe("REV-001 rate limiter behind a reverse proxy", () => {
	const OLD = process.env.TRUST_PROXY;
	afterEach(() => {
		if (OLD === undefined) delete process.env.TRUST_PROXY;
		else process.env.TRUST_PROXY = OLD;
	});

	test("T-RL-03 TRUST_PROXY unset: X-Forwarded-For is ignored (one shared bucket per upstream IP+email)", async () => {
		delete process.env.TRUST_PROXY;
		const app = buildTestApp();
		Employee.findOne.mockImplementation(() => query(null));
		let last;
		for (let i = 0; i < 21; i++) {
			last = await request(app)
				.post("/api/login")
				.set("X-Forwarded-For", `10.0.0.${i}`)
				.send({ email: "victim@b.c", password: "x", companyId: "1" });
		}
		expect(last.status).toBe(429);
	});

	test("T-RL-04 TRUST_PROXY=1: each forwarded client IP gets its own bucket", async () => {
		process.env.TRUST_PROXY = "1";
		const app = buildTestApp();
		Employee.findOne.mockImplementation(() => query(null));
		let last;
		for (let i = 0; i < 25; i++) {
			last = await request(app)
				.post("/api/login")
				.set("X-Forwarded-For", `10.0.0.${i}`)
				.send({ email: "victim@b.c", password: "x", companyId: "1" });
			expect(last.status).toBe(401);
		}
	});

	test("T-RL-05 limiter is keyed by e-mail too: 20 failures for alice do not block bob from the same IP", async () => {
		const app = buildTestApp();
		Employee.findOne.mockImplementation(() => query(null));
		for (let i = 0; i < 21; i++) {
			await request(app).post("/api/login").send({ email: "alice@b.c", password: "x", companyId: "1" });
		}
		const bob = await request(app).post("/api/login").send({ email: "bob@b.c", password: "x", companyId: "1" });
		expect(bob.status).toBe(401);
		const alice = await request(app).post("/api/login").send({ email: "ALICE@b.c ", password: "x", companyId: "1" });
		expect(alice.status).toBe(429); // case/whitespace-insensitive key
	});
});

describe("AUD-015 payroll process validation", () => {
	test.each([
		["no body", {}],
		["missing currentPayPeriod", { companyName: "Acme" }],
		["missing dates", { companyName: "Acme", currentPayPeriod: {} }],
		["extra run without selectedEmp", { companyName: "Acme", currentPayPeriod: { payPeriodStartDate: "2026-01-01", payPeriodEndDate: "2026-01-14", isExtraRun: true } }],
	])("T-PAY-02 %s -> 400", async (_l, body) => {
		const app = buildTestApp();
		Company.find.mockImplementation(() => query([{ name: "Acme" }]));
		// AUD-028: POST /payroll/process now needs Manager or above in the company
		EmployeeEmploymentInfo.findOne.mockImplementation(() => query({ employmentRole: "Manager" }));
		const res = await request(app).post("/api/payroll/process").set(auth()).send(body);
		expect(res.status).toBe(400);
	});
});
