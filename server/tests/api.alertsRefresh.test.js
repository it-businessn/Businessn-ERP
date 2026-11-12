/**
 * ALERTS-02: saving banking, SIN or pay rate (add or update) removes the
 * matching alert as soon as the saved data no longer has the problem, using
 * the same rules as the inputs review. A new employee's bank numbers sent by
 * the Banking info screen are now saved (they were dropped).
 */
const request = require("supertest");

jest.mock("../models/Company");
jest.mock("../models/Employee");
jest.mock("../models/EmployeeAlertsViolationInfo");
jest.mock("../models/EmployeeBankingInfo");
jest.mock("../models/EmployeeEmploymentInfo");
jest.mock("../models/EmployeePayInfo");
jest.mock("../models/EmployeeProfileInfo");

const Company = require("../models/Company");
const Employee = require("../models/Employee");
const Alert = require("../models/EmployeeAlertsViolationInfo");
const EmployeeBankingInfo = require("../models/EmployeeBankingInfo");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const EmployeePayInfo = require("../models/EmployeePayInfo");
const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");
const { ALERTS_TYPE } = require("../constants/pay.constants");
const { clearMembershipCache } = require("../middleware/authorize");
const { auth, query, buildTestApp } = require("./helpers");

const EMP = "65e0000000000000000000b2";
const CO = "Acme";
// what is stored for the employee (the refresh re-reads it after the save)
let stored;
let alerts;

// left: which of bank / SIN / wage alerts remain
const alertTypesLeft = () =>
	alerts.map((a) => ({ bank: "BANK", SIN: "SIN", wage: "WAGE" })[a.type]).sort();

let app;
beforeAll(() => {
	app = buildTestApp();
});
beforeEach(() => {
	jest.resetAllMocks();
	clearMembershipCache();
	stored = { bank: null, profile: { SIN: "" }, payInfo: { roles: [{ payRate: 15 }] } };
	alerts = [ALERTS_TYPE.BANK, ALERTS_TYPE.SIN, ALERTS_TYPE.WAGE].map((type) => ({ companyName: CO, empId: EMP, type }));
	Company.find.mockImplementation(() => query([{ name: CO, _id: "65b000000000000000000001" }]));
	Company.findOne.mockImplementation(() => query({ name: CO, employees: [EMP], save: jest.fn() }));
	EmployeeEmploymentInfo.findOne.mockImplementation(() => query({ employmentRole: "Administrator" }));
	EmployeeEmploymentInfo.find.mockImplementation(() => query([]));
	Employee.findById.mockImplementation(() => query({ _id: EMP, save: jest.fn() }));
	Employee.findByIdAndUpdate.mockResolvedValue({ _id: EMP });
	Employee.findOne.mockImplementation(() => query({ _id: EMP }));
	Alert.deleteMany.mockImplementation(async (f) => {
		alerts = alerts.filter((a) => !(a.companyName === f.companyName && a.empId === f.empId && a.type === f.type));
		return {};
	});
	// banking
	EmployeeBankingInfo.findOne.mockImplementation(() => query(stored.bank));
	EmployeeBankingInfo.create.mockImplementation(async (d) => {
		stored.bank = d;
		return d;
	});
	EmployeeBankingInfo.findById.mockImplementation(async () => (stored.bank ? { _id: "b1", empId: EMP, companyName: CO, ...stored.bank } : null));
	EmployeeBankingInfo.findByIdAndUpdate.mockImplementation(async (id, u) => {
		stored.bank = { ...stored.bank, ...(u.$set || u) };
		return stored.bank;
	});
	// profile
	EmployeeProfileInfo.findOne.mockImplementation(() => query(stored.profile));
	EmployeeProfileInfo.findById.mockImplementation(async () => ({ _id: "p1", empId: EMP, companyName: CO, ...stored.profile }));
	EmployeeProfileInfo.findByIdAndUpdate.mockImplementation(async (id, u) => {
		stored.profile = { ...stored.profile, ...(u.$set || u) };
		return stored.profile;
	});
	// pay
	EmployeePayInfo.findOne.mockImplementation(() => query(stored.payInfo));
	EmployeePayInfo.findById.mockImplementation(async () => ({ _id: "r1", empId: EMP, companyName: CO, ...stored.payInfo }));
	EmployeePayInfo.findByIdAndUpdate.mockImplementation(async (id, u) => {
		stored.payInfo = { ...stored.payInfo, ...(u.$set || u) };
		return stored.payInfo;
	});
});

describe("banking", () => {
	test("T-AR-01 new employee: the bank numbers the screen sends are saved (encrypted) and the alert clears", async () => {
		const res = await request(app)
			.post("/api/payroll/bankingInfo")
			.set(auth())
			.send({ empId: EMP, companyName: CO, bankNum: "001", transitNum: "12345", accountNum: "1234567", directDeposit: "Yes" });
		expect(res.status).toBe(201);
		const saved = EmployeeBankingInfo.create.mock.calls[0][0];
		expect(saved.bankNum).toBeTruthy();
		expect(saved.bankNum).not.toBe("001"); // encrypted
		expect(saved.bankIv).toBeTruthy();
		expect(alertTypesLeft()).toEqual(["SIN", "WAGE"]);
	});

	test("T-AR-02 updating banking clears the alert; saving without bank numbers keeps it", async () => {
		stored.bank = { empId: EMP, companyName: CO };
		await request(app).put("/api/payroll/bankingInfo/b1").set(auth()).send({ empId: EMP, directDeposit: "Yes" });
		expect(alertTypesLeft()).toEqual(["BANK", "SIN", "WAGE"]);
		await request(app)
			.put("/api/payroll/bankingInfo/b1")
			.set(auth())
			.send({ empId: EMP, bankNum: "001", transitNum: "12345", accountNum: "1234567" });
		expect(alertTypesLeft()).toEqual(["SIN", "WAGE"]);
	});
});

describe("SIN", () => {
	test("T-AR-03 saving the SIN clears 'SIN missing'; other alerts stay", async () => {
		const res = await request(app)
			.put("/api/payroll/profileInfo/p1")
			.set(auth())
			.send({ empId: EMP, companyName: CO, firstName: "Erwan", lastName: "Dantier", SIN: "123456789" });
		expect(res.status).toBeLessThan(300);
		expect(alertTypesLeft()).toEqual(["BANK", "WAGE"]);
	});
});

describe("pay rate", () => {
	test("T-AR-04 a rate at or above the minimum clears the wage alert; below it stays", async () => {
		await request(app).put("/api/payroll/payInfo/r1").set(auth()).send({ empId: EMP, companyName: CO, roles: [{ payRate: "17" }] });
		expect(alertTypesLeft()).toEqual(["BANK", "SIN", "WAGE"]);
		await request(app).put("/api/payroll/payInfo/r1").set(auth()).send({ empId: EMP, companyName: CO, roles: [{ payRate: "20" }] });
		expect(alertTypesLeft()).toEqual(["BANK", "SIN"]);
	});
});

test("T-AR-05 a profile save that fails answers 500 (the error handler used to throw and the request hung)", async () => {
	EmployeeProfileInfo.findById.mockRejectedValue(new Error("db down"));
	const res = await request(app)
		.put("/api/payroll/profileInfo/p1")
		.set(auth())
		.send({ empId: EMP, companyName: CO, firstName: "Erwan", lastName: "Dantier", SIN: "123456789" });
	expect(res.status).toBe(500);
});
