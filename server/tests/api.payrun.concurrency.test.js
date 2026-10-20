/**
 * Isolated in its own file: it mocks service modules and resets the module
 * registry, which would disturb the other suites.
 */
const request = require("supertest");
const { query } = require("./helpers");

describe("REV-009 concurrent pay runs", () => {
	test("T-PAY-05 second identical run while the first is in flight -> 409; runs afterwards -> accepted", async () => {
		jest.resetModules();
		jest.doMock("../services/userService", () => ({
			getPayrollActiveEmployees: jest.fn(
				() => new Promise((resolve) => setTimeout(() => resolve([]), 300)),
			),
			getUserEmploymentRoleInfo: jest.fn(),
			getShadowUserIds: jest.fn(),
			getSalariedIds: jest.fn(),
			findEmployee: jest.fn(),
			addEmployee: jest.fn(),
			findCompany: jest.fn(),
			sortByEmpFullName: (x) => x,
			filterResultByPaygroupOption: (x) => x,
			filterResultByDepartment: (x) => x,
		}));
		jest.doMock("../services/payrollService", () => ({
			calculateTimesheetApprovedHours: jest.fn().mockResolvedValue([]),
			findEmployeeBenefitInfo: jest.fn(),
		}));
		jest.doMock("../controllers/reportController", () => ({
			...jest.requireActual("../controllers/reportController"),
			buildFundingTotalsReport: jest.fn().mockResolvedValue({}),
		}));
		jest.doMock("../controllers/t4SlipController", () => ({
			...jest.requireActual("../controllers/t4SlipController"),
			generateT4Slip: jest.fn(),
		}));
		jest.doMock("../models/Company");
		const CompanyM = require("../models/Company");
		CompanyM.find.mockImplementation(() => query([{ name: "Acme" }]));
		const { buildApp } = require("../app");
		const app = buildApp({ emit: jest.fn() });
		const { generateAccessToken } = require("../middleware/auth");
		const hdr = { Authorization: `Bearer ${generateAccessToken({ id: "64a000000000000000000001" })}` };
		const body = {
			companyName: "Acme",
			currentPayPeriod: {
				payPeriod: 7,
				payPeriodStartDate: "2026-03-01",
				payPeriodEndDate: "2026-03-14",
				payPeriodPayDate: "2026-03-20",
				payPeriodProcessingDate: "2026-03-18",
				frequency: "bi-weekly",
				isExtraRun: false,
			},
		};
		const [a, b] = await Promise.all([
			request(app).post("/api/payroll/process").set(hdr).send(body),
			request(app).post("/api/payroll/process").set(hdr).send(body),
		]);
		const statuses = [a.status, b.status].sort();
		expect(statuses).toEqual([200, 409]);
		const blocked = a.status === 409 ? a : b;
		expect(blocked.body.code).toBe("PAYRUN_IN_PROGRESS");

		// a different period is not blocked, and the lock is released after completion
		const other = await request(app)
			.post("/api/payroll/process")
			.set(hdr)
			.send({ ...body, currentPayPeriod: { ...body.currentPayPeriod, payPeriod: 8 } });
		expect(other.status).toBe(200);
		const again = await request(app).post("/api/payroll/process").set(hdr).send(body);
		expect(again.status).toBe(200);
	});
});

