/**
 * AUD-028: server-side role checks (middleware/rbac.js).
 *
 * The matrix mirrors the rules the React client already applies
 * (client/src/utils/index.js hasPayrollSubmitAccess / isAdminLevelRole /
 * isNotEnrollerOrEmployee and constant.js ROLE_ACCESS). A caller's role in a
 * company is EmployeeEmploymentInfo.employmentRole, exactly as login derives it.
 *
 * Models and the VoPay controller (which would call the network) are mocked;
 * routing, middleware and the other controllers are real. "Allowed" cases only
 * assert that the request got past the role check (the mocked handlers may
 * still answer 4xx/5xx for their own reasons).
 */
const request = require("supertest");

jest.mock("../models/Company");
jest.mock("../models/Employee");
jest.mock("../models/EmployeeEmploymentInfo");
jest.mock("../models/Group");
jest.mock("../models/Crew");
jest.mock("../models/CostCenter");
jest.mock("../models/Department");
jest.mock("../models/EmployeeRole");
jest.mock("../models/EmploymentPositionRole");
jest.mock("../models/Module");
jest.mock("../models/Setup");
jest.mock("../models/permissions");
jest.mock("../controllers/vopayController", () => {
	const handler = jest.fn((req, res) => res.status(200).json({ ok: true }));
	const names = [
		"createPartnerEmployerAccount",
		"createClientAccountEmployee",
		"getClientAccountWallets",
		"getPartnerEmployerAccounts",
		"getVopayAccountOnboardingUrl",
		"submitEmployerInfo",
		"getEmployeeBankEmbedUrl",
		"fundEmployerWallet",
		"createClientAccountWallet",
		"getClientAccountWallet",
		"getClientDefaultBankAccount",
		"fundBankAccount",
		"setBankAccount",
		"getLinkedBankAccounts",
		"transferWithdraw",
		"getTransactions",
		"getAccountBalance",
		"getAccountWebHooks",
		"partnerAccountTransfer",
	];
	const mod = { handler, vopayFundTransfer: jest.fn(), generateVopaySignature: jest.fn() };
	for (const n of names) mod[n] = handler;
	mod.receiveWebhook = () => handler;
	return mod;
});

const Company = require("../models/Company");
const Employee = require("../models/Employee");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const Group = require("../models/Group");
const CostCenter = require("../models/CostCenter");
const vopay = require("../controllers/vopayController");
const { clearMembershipCache } = require("../middleware/authorize");
const { USER_ID, OTHER_ID, auth, query, buildTestApp } = require("./helpers");

const ACME_ID = "65b000000000000000000001";
const GROUP_ID = "65c000000000000000000001";
const CC_ID = "65d000000000000000000001";
const BUSINESSN = "BusinessN Corporate";

// roles["<empId>|<companyName>"] = employmentRole
let roles;
const setRole = (role, company = "Acme", empId = USER_ID) => {
	roles[`${empId}|${company}`] = role;
};

const passedRbac = (res) =>
	res.status !== 403 && !["ROLE_FORBIDDEN", "COMPANY_REQUIRED"].includes(res.body?.code);

const expectForbidden = (res) => {
	expect(res.status).toBe(403);
	expect(res.body.code).toBe("ROLE_FORBIDDEN");
};

let app;
const ORIGINAL_MODE = process.env.RBAC_MODE;
beforeAll(() => {
	app = buildTestApp();
});
beforeEach(() => {
	jest.clearAllMocks();
	clearMembershipCache();
	delete process.env.RBAC_MODE;
	roles = {};
	// USER_ID and OTHER_ID belong to Acme only
	Company.find.mockImplementation(() => query([{ name: "Acme", _id: ACME_ID }]));
	EmployeeEmploymentInfo.findOne.mockImplementation((filter = {}) => {
		const role = roles[`${filter.empId}|${filter.companyName}`];
		return query(role === undefined ? null : { employmentRole: role, empId: filter.empId });
	});
	Group.findById.mockImplementation(() => query({ _id: GROUP_ID, companyName: "Acme" }));
	CostCenter.findById.mockImplementation(() => query({ _id: CC_ID, companyName: "Acme" }));
});
afterAll(() => {
	if (ORIGINAL_MODE === undefined) delete process.env.RBAC_MODE;
	else process.env.RBAC_MODE = ORIGINAL_MODE;
});

describe("AUD-028 payroll submit (moves money) -> Authorizing Admin / Shadow Admin / Super Admin", () => {
	const submit = () =>
		request(app)
			.put(`/api/payroll/report/submit/${GROUP_ID}`)
			.set(auth())
			.send({ companyName: "Acme" });

	test.each(["Authorizing Admin", "Shadow Admin", "Super Admin"])(
		"T-RBAC-01 %s may submit payroll",
		async (role) => {
			setRole(role);
			const res = await submit();
			expect(passedRbac(res)).toBe(true);
			expect(Group.findByIdAndUpdate).toHaveBeenCalled();
		},
	);

	test.each(["Administrator", "Manager", "Employee", "Enroller"])(
		"T-RBAC-02 %s may not submit payroll -> 403 ROLE_FORBIDDEN, nothing written",
		async (role) => {
			setRole(role);
			const res = await submit();
			expectForbidden(res);
			expect(Group.findByIdAndUpdate).not.toHaveBeenCalled();
		},
	);

	test("T-RBAC-32 (RBAC-REPORT-01) report mode never lets a request act on another company's document", async () => {
		process.env.RBAC_MODE = "report";
		setRole("Authorizing Admin", "Acme");
		Group.findById.mockImplementation(() => query({ _id: GROUP_ID, companyName: "Globex" }));
		const res = await submit();
		expect(res.status).toBe(403);
		expect(res.body.code).toBe("COMPANY_ACCESS_DENIED");
		expect(Group.findByIdAndUpdate).not.toHaveBeenCalled();
	});

	test("T-RBAC-03 company is taken from the pay group, not only from the body", async () => {
		setRole("Authorizing Admin", "Acme");
		Group.findById.mockImplementation(() => query({ _id: GROUP_ID, companyName: "Globex" }));
		const res = await submit();
		expect(res.status).toBe(403);
		expect(Group.findByIdAndUpdate).not.toHaveBeenCalled();
	});

	test("T-RBAC-04 unknown pay group and no company in the request -> 404 (not a misleading 400)", async () => {
		setRole("Authorizing Admin");
		Group.findById.mockImplementation(() => query(null));
		const res = await request(app).put(`/api/payroll/report/submit/${GROUP_ID}`).set(auth()).send({});
		expect(res.status).toBe(404);
	});
});

describe("AUD-028 VoPay writes -> Authorizing Admin / Shadow Admin / Super Admin", () => {
	test("T-RBAC-05 Authorizing Admin may call a VoPay POST", async () => {
		setRole("Authorizing Admin");
		const res = await request(app)
			.post("/api/vopay/eft/fund")
			.set(auth())
			.send({ companyName: "Acme", Amount: 1 });
		expect(res.status).toBe(200);
		expect(vopay.handler).toHaveBeenCalled();
	});

	test.each([
		"/api/vopay/partner/account",
		"/api/vopay/partner/account/transfer",
		"/api/vopay/account/client-accounts/wallets/create",
		"/api/vopay/account/client-accounts/individual",
		"/api/vopay/account/fund-my-account",
		"/api/vopay/bank-account/set-my-bank-account",
		"/api/vopay/eft/fund",
		"/api/vopay/transfer-withdraw",
	])("T-RBAC-06 Administrator POST %s -> 403", async (path) => {
		setRole("Administrator");
		const res = await request(app).post(path).set(auth()).send({ companyName: "Acme" });
		expectForbidden(res);
		expect(vopay.handler).not.toHaveBeenCalled();
	});

	test("T-RBAC-07 VoPay POST without any company -> 400 COMPANY_REQUIRED", async () => {
		setRole("Authorizing Admin");
		const res = await request(app).post("/api/vopay/eft/fund").set(auth()).send({ Amount: 1 });
		expect(res.status).toBe(400);
		expect(res.body.code).toBe("COMPANY_REQUIRED");
	});

	test("T-RBAC-08 VoPay GET reads are unchanged (Employee, no company)", async () => {
		setRole("Employee");
		const res = await request(app).get("/api/vopay/account/balance").set(auth());
		expect(res.status).toBe(200);
	});
});

describe("AUD-028 payroll processing -> Manager and above (client lets Managers run Payrun Setup)", () => {
	const process_ = () =>
		request(app).post("/api/payroll/process").set(auth()).send({ companyName: "Acme" });

	test.each(["Manager", "Administrator", "Authorizing Admin", "Shadow Admin", "Super Admin"])(
		"T-RBAC-09 %s passes the role check",
		async (role) => {
			setRole(role);
			expect(passedRbac(await process_())).toBe(true);
		},
	);

	test.each(["Employee", "Enroller"])("T-RBAC-10 %s -> 403", async (role) => {
		setRole(role);
		expectForbidden(await process_());
	});

	test("T-RBAC-11 caller without an employment role in the company -> 403", async () => {
		expectForbidden(await process_());
	});
});

describe("AUD-028 setup / configuration writes", () => {
	test("T-RBAC-12 admin-level write (POST /setup/roles): Administrator allowed, Manager denied", async () => {
		setRole("Administrator");
		const ok = await request(app)
			.post("/api/setup/roles")
			.set(auth())
			.send({ name: "x", companyName: "Acme" });
		expect(passedRbac(ok)).toBe(true);

		clearMembershipCache();
		setRole("Manager");
		const denied = await request(app)
			.post("/api/setup/roles")
			.set(auth())
			.send({ name: "x", companyName: "Acme" });
		expectForbidden(denied);
	});

	test("T-RBAC-13 DELETE /setup/cost-centers/:id derives the company from the cost centre", async () => {
		setRole("Administrator");
		const ok = await request(app).delete(`/api/setup/cost-centers/${CC_ID}`).set(auth());
		expect(passedRbac(ok)).toBe(true);
		expect(CostCenter.findByIdAndDelete).toHaveBeenCalled();

		jest.clearAllMocks();
		clearMembershipCache();
		setRole("Manager");
		const denied = await request(app).delete(`/api/setup/cost-centers/${CC_ID}`).set(auth());
		expectForbidden(denied);
		expect(CostCenter.findByIdAndDelete).not.toHaveBeenCalled();
	});

	test("T-RBAC-14 manager-level write (PUT /setup/groups/:id, used by Payroll Workview): Manager allowed, Employee denied", async () => {
		setRole("Manager");
		const ok = await request(app).put(`/api/setup/groups/${GROUP_ID}`).set(auth()).send({});
		expect(passedRbac(ok)).toBe(true);

		clearMembershipCache();
		setRole("Employee");
		const denied = await request(app).put(`/api/setup/groups/${GROUP_ID}`).set(auth()).send({});
		expectForbidden(denied);
	});

	test("T-RBAC-15 manager-level write (POST /setup/position-roles): Manager allowed, Employee denied", async () => {
		setRole("Manager");
		const ok = await request(app)
			.post("/api/setup/position-roles")
			.set(auth())
			.send({ name: "Cook", companyName: "Acme" });
		expect(passedRbac(ok)).toBe(true);

		clearMembershipCache();
		setRole("Employee");
		const denied = await request(app)
			.post("/api/setup/position-roles")
			.set(auth())
			.send({ name: "Cook", companyName: "Acme" });
		expectForbidden(denied);
	});

	test("T-RBAC-16 setup reads and the company-less global rule (POST /setup) are unchanged", async () => {
		setRole("Employee");
		const read = await request(app).get("/api/setup/roles/Acme").set(auth());
		expect(passedRbac(read)).toBe(true);
		const globalRule = await request(app)
			.post("/api/setup")
			.set(auth())
			.send({ isIdleLeadReassignment: "Disable" });
		expect(passedRbac(globalRule)).toBe(true);
	});
});

describe("AUD-028 permission writes -> admin level", () => {
	test("T-RBAC-17 Administrator may POST / PUT permissions", async () => {
		setRole("Administrator");
		const a = await request(app)
			.post("/api/permissions")
			.set(auth())
			.send({ empId: OTHER_ID, companyName: "Acme", name: "Payroll", accessName: "canViewModule" });
		const b = await request(app)
			.put(`/api/permissions/${OTHER_ID}`)
			.set(auth())
			.send({ companyName: "Acme", name: "Payroll", accessName: "canViewModule" });
		expect([passedRbac(a), passedRbac(b)]).toEqual([true, true]);
	});

	test("T-RBAC-18 Manager may not POST / PUT permissions; GET is unchanged", async () => {
		setRole("Manager");
		const a = await request(app)
			.post("/api/permissions")
			.set(auth())
			.send({ empId: OTHER_ID, companyName: "Acme", name: "Payroll", accessName: "canViewModule" });
		const b = await request(app)
			.put(`/api/permissions/${OTHER_ID}`)
			.set(auth())
			.send({ companyName: "Acme", name: "Payroll", accessName: "canViewModule" });
		expectForbidden(a);
		expectForbidden(b);
		const read = await request(app).get(`/api/permissions/${USER_ID}/Acme`).set(auth());
		expect(passedRbac(read)).toBe(true);
	});
});

describe("AUD-028 company info edit -> Manager and above", () => {
	test("T-RBAC-19 Manager may edit company info", async () => {
		setRole("Manager");
		const res = await request(app).put(`/api/company/${ACME_ID}`).set(auth()).send({ revenue: "1" });
		expect(passedRbac(res)).toBe(true);
		expect(Company.findByIdAndUpdate).toHaveBeenCalled();
	});

	test.each(["Employee", "Enroller"])("T-RBAC-20 %s may not edit company info", async (role) => {
		setRole(role);
		const res = await request(app).put(`/api/company/${ACME_ID}`).set(auth()).send({ revenue: "1" });
		expectForbidden(res);
		expect(Company.findByIdAndUpdate).not.toHaveBeenCalled();
	});
});

describe("AUD-028 role assignment follows ROLE_ACCESS", () => {
	beforeEach(() => {
		Company.findOne.mockResolvedValue(null);
		Employee.findByIdAndUpdate.mockResolvedValue({ _id: OTHER_ID });
	});

	test("T-RBAC-21 Manager assigning Administrator through PUT /api/user/:id -> 403, nothing written", async () => {
		setRole("Manager");
		setRole("Employee", "Acme", OTHER_ID);
		const res = await request(app)
			.put("/api/user/" + OTHER_ID)
			.set(auth())
			.send({ assignedCompanies: ["Acme"], role: "Administrator" });
		expectForbidden(res);
		expect(Company.findOne).not.toHaveBeenCalled();
		expect(Employee.findByIdAndUpdate).not.toHaveBeenCalled();
	});

	test("T-RBAC-22 Manager assigning Employee is allowed; unchanged role is not an escalation", async () => {
		setRole("Manager");
		setRole("Administrator", "Acme", OTHER_ID);
		const a = await request(app)
			.put("/api/user/" + OTHER_ID)
			.set(auth())
			.send({ assignedCompanies: ["Acme"], role: "Employee" });
		const b = await request(app)
			.put("/api/user/" + OTHER_ID)
			.set(auth())
			.send({ companyId: { name: "Acme" }, role: "Administrator" });
		expect([a.status, b.status]).toEqual([201, 201]);
	});

	test("T-RBAC-23 own profile edit without role / companies is unaffected (Employee caller)", async () => {
		setRole("Employee");
		Employee.findByIdAndUpdate.mockResolvedValue({ _id: USER_ID, firstName: "A" });
		const res = await request(app).put("/api/user/" + USER_ID).set(auth()).send({ firstName: "A" });
		expect(res.status).toBe(201);
	});

	test("T-RBAC-24 PUT /payroll/employmentInfo/:id: Manager raising a user to Administrator -> 403", async () => {
		setRole("Manager");
		setRole("Employee", "Acme", OTHER_ID);
		const res = await request(app)
			.put("/api/payroll/employmentInfo/x1")
			.set(auth())
			.send({ empId: OTHER_ID, companyName: "Acme", employmentRole: "Administrator" });
		expectForbidden(res);
		expect(EmployeeEmploymentInfo.findByIdAndUpdate).not.toHaveBeenCalled();
	});

	test("T-RBAC-25 employment info: allowed role and unchanged role both pass", async () => {
		setRole("Manager");
		setRole("Administrator", "Acme", OTHER_ID);
		const unchanged = await request(app)
			.put("/api/payroll/employmentInfo/x1")
			.set(auth())
			.send({ empId: OTHER_ID, companyName: "Acme", employmentRole: "Administrator" });
		expect(passedRbac(unchanged)).toBe(true);
		const lowered = await request(app)
			.post("/api/payroll/employmentInfo")
			.set(auth())
			.send({ empId: OTHER_ID, companyName: "Acme", employmentRole: "Employee" });
		expect(passedRbac(lowered)).toBe(true);
	});

	test("T-RBAC-26 POST /payroll/employmentInfo: Employee creating a Manager record -> 403", async () => {
		setRole("Employee");
		const res = await request(app)
			.post("/api/payroll/employmentInfo")
			.set(auth())
			.send({ empId: OTHER_ID, companyName: "Acme", employmentRole: "Manager" });
		expectForbidden(res);
	});
});

describe("AUD-028 RBAC_MODE, caching and BusinessN shadow admins", () => {
	test("T-RBAC-27 RBAC_MODE=report logs the would-be denial and lets the request through", async () => {
		process.env.RBAC_MODE = "report";
		setRole("Employee");
		const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
		const res = await request(app)
			.post("/api/permissions")
			.set(auth())
			.send({ empId: OTHER_ID, companyName: "Acme", name: "Payroll", accessName: "canViewModule" });
		expect(passedRbac(res)).toBe(true);
		const call = warn.mock.calls.find(([msg]) => /RBAC/.test(String(msg)));
		expect(call).toBeDefined();
		expect(call[1]).toMatchObject({
			userId: USER_ID,
			company: "Acme",
			role: "Employee",
			method: "POST",
			path: "/api/permissions",
		});
		warn.mockRestore();
	});

	test("T-RBAC-28 unknown RBAC_MODE value falls back to enforce", async () => {
		process.env.RBAC_MODE = "off";
		setRole("Employee");
		expectForbidden(
			await request(app).post("/api/payroll/process").set(auth()).send({ companyName: "Acme" }),
		);
	});

	test("T-RBAC-29 role is cached per (user, company) and cleared by clearMembershipCache", async () => {
		setRole("Employee");
		const call = () =>
			request(app).post("/api/payroll/process").set(auth()).send({ companyName: "Acme" });
		expectForbidden(await call());
		const lookups = EmployeeEmploymentInfo.findOne.mock.calls.length;
		setRole("Manager"); // promoted in the DB, but the cached role is still Employee
		expectForbidden(await call());
		expect(EmployeeEmploymentInfo.findOne.mock.calls.length).toBe(lookups);

		clearMembershipCache(USER_ID);
		expect(passedRbac(await call())).toBe(true);
		expect(EmployeeEmploymentInfo.findOne.mock.calls.length).toBeGreaterThan(lookups);
	});

	test("T-RBAC-30 Shadow Admin of BusinessN Corporate keeps access in a member company without an employment record", async () => {
		setRole("Shadow Admin", BUSINESSN);
		const res = await request(app)
			.put(`/api/payroll/report/submit/${GROUP_ID}`)
			.set(auth())
			.send({ companyName: "Acme" });
		expect(passedRbac(res)).toBe(true);
	});

	test("T-RBAC-31 403 body is { message, code: ROLE_FORBIDDEN } (client does not treat it as a token error)", async () => {
		setRole("Employee");
		const res = await request(app).post("/api/payroll/process").set(auth()).send({ companyName: "Acme" });
		expect(res.status).toBe(403);
		expect(res.body).toEqual({ message: expect.any(String), code: "ROLE_FORBIDDEN" });
	});
});
