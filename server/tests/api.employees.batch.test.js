/**
 * F-05 regression: employee listings must issue ONE EmployeeEmploymentInfo query
 * for the whole company instead of one `findOne` per employee, and must return
 * exactly the same shape/order as before.
 */
const request = require("supertest");

jest.mock("../models/Company");
jest.mock("../models/Employee");
jest.mock("../models/EmployeeProfileInfo");
jest.mock("../models/EmployeeEmploymentInfo");
jest.mock("../models/EmployeePayInfo");
jest.mock("../models/Crew");
jest.mock("../models/WorkShift");

const Company = require("../models/Company");
const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const EmployeePayInfo = require("../models/EmployeePayInfo");
const Crew = require("../models/Crew");
const WorkShift = require("../models/WorkShift");
const { clearMembershipCache } = require("../middleware/authorize");
const { USER_ID, auth, query, buildTestApp } = require("./helpers");

const COMPANY = "Acme";
const E1 = "64b000000000000000000001";
const E2 = "64b000000000000000000002";
const E3 = "64b000000000000000000003";

let app;
beforeAll(() => {
	app = buildTestApp();
});

beforeEach(() => {
	jest.clearAllMocks();
	clearMembershipCache();
	Company.find.mockReturnValue(query([{ _id: "c1", name: COMPANY }]));
});

describe("GET /api/user/:companyName/:deptName/:payGroup (getCompanyEmployees)", () => {
	test("T-EMP-01 one $in query, same output shape, missing info tolerated, name-sorted", async () => {
		// Shadow-admin lookup (first EmployeeEmploymentInfo.find call) returns none.
		EmployeeEmploymentInfo.find
			.mockReturnValueOnce(query([]))
			// Batched lookup: E2 has two docs -> first wins (findOne semantics); E3 has none.
			.mockReturnValueOnce(
				query([
					{ empId: E2, employeeNo: "20", employmentRole: "Employee", payrollStatus: "Payroll Active", positions: [{ title: "A" }] },
					{ empId: E2, employeeNo: "99", employmentRole: "Manager", payrollStatus: "x", positions: [] },
					{ empId: E1, employeeNo: "10", employmentRole: "Manager", payrollStatus: "Payroll Active", positions: [{ title: "B" }] },
				]),
			);
		EmployeeProfileInfo.find.mockReturnValue(
			query([
				{ empId: { _id: E3, fullName: "Zed" }, createdOn: 3 },
				{ empId: { _id: E1, fullName: "Bob" }, createdOn: 1 },
				{ empId: { _id: E2, fullName: "Amy" }, createdOn: 2 },
			]),
		);

		const res = await request(app)
			.get(`/api/user/${COMPANY}/null/undefined`)
			.set(auth(USER_ID));

		expect(res.status).toBe(200);
		// shadow-id query + ONE batched query, regardless of employee count
		expect(EmployeeEmploymentInfo.find).toHaveBeenCalledTimes(2);
		expect(EmployeeEmploymentInfo.findOne).not.toHaveBeenCalled();
		const batched = EmployeeEmploymentInfo.find.mock.calls[1][0];
		expect(batched.companyName).toBe(COMPANY);
		expect(batched.empId.$in.map(String).sort()).toEqual([E1, E2, E3].sort());

		expect(res.body.map((e) => e.empId.fullName)).toEqual(["Amy", "Bob", "Zed"]);
		expect(res.body[0]).toEqual({
			empId: { _id: E2, fullName: "Amy" },
			employeeNo: "20",
			employmentRole: "Employee",
			payrollStatus: "Payroll Active",
			positions: [{ title: "A" }],
		});
		// employee without employment info keeps the keys (undefined -> omitted in JSON)
		expect(res.body[2]).toEqual({ empId: { _id: E3, fullName: "Zed" } });
	});

	test("T-EMP-02 empty company issues no batched query", async () => {
		EmployeeEmploymentInfo.find.mockReturnValueOnce(query([]));
		EmployeeProfileInfo.find.mockReturnValue(query([]));
		const res = await request(app).get(`/api/user/${COMPANY}/null/undefined`).set(auth(USER_ID));
		expect(res.status).toBe(200);
		expect(res.body).toEqual([]);
		expect(EmployeeEmploymentInfo.find).toHaveBeenCalledTimes(1);
	});
});

describe("GET /api/schedule/work-week-shifts/:name/:date/:companyName (crew)", () => {
	test("T-EMP-03 crew pay info fetched with one $in query", async () => {
		Crew.findOne.mockResolvedValue({
			config: {
				employee: [
					{ _id: E1, fullName: "Bob", positions: [{ title: "Cook" }] },
					{ _id: E2, fullName: "Amy", positions: [] },
				],
			},
		});
		EmployeePayInfo.find.mockReturnValue(
			query([{ empId: { _id: E1, email: "bob@x" }, roles: [{ payRate: "12.5" }] }]),
		);
		WorkShift.aggregate.mockResolvedValue([]);

		const res = await request(app)
			.get(`/api/schedule/work-emp-shift/2026-01-05/${COMPANY}/Crew1`)
			.set(auth(USER_ID));

		expect(res.status).toBe(200);
		expect(EmployeePayInfo.find).toHaveBeenCalledTimes(1);
		expect(EmployeePayInfo.findOne).not.toHaveBeenCalled();
		expect(EmployeePayInfo.find.mock.calls[0][0].empId.$in).toEqual([E1, E2]);
		// name-sorted; the member with no pay info gets rate 0 / empty email, as before
		expect(res.body.map((r) => [r.name, r.payRate, r.email, r.role])).toEqual([
			["Amy", 0, "", undefined],
			["Bob", 12.5, "bob@x", "Cook"],
		]);
		expect(res.body[0].shifts).toHaveLength(7);
	});
});

describe("F-14: ':name' is only a tenant key on /api/company/:name", () => {
	const Company = require("../models/Company");
	test("T-TEN-18 GET /api/company/:name for a foreign company -> 403", async () => {
		const res = await request(app).get("/api/company/Globex").set(auth(USER_ID));
		expect(res.status).toBe(403);
		expect(res.body.code).toBe("COMPANY_ACCESS_DENIED");
	});
	test("T-TEN-19 GET /api/company/:name for own company -> reaches controller", async () => {
		Company.findOne.mockReturnValue(query({ name: COMPANY }));
		const res = await request(app).get(`/api/company/${COMPANY}`).set(auth(USER_ID));
		expect(res.status).not.toBe(403);
		expect(Company.findOne).toHaveBeenCalled();
	});
});
