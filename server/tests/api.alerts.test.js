/**
 * ALERTS-01: alerts and violations are one row per problem (company,
 * employee, type), updated on every inputs review and removed once fixed. They
 * used to be stored once per pay period while the list ignored the period, so
 * an unfixed problem was listed once for every pay run.
 */
const request = require("supertest");

jest.mock("../models/Company");
jest.mock("../models/EmployeeAlertsViolationInfo");
jest.mock("../models/EmployeeBankingInfo");
jest.mock("../models/EmployeeEmploymentInfo");
jest.mock("../models/EmployeePayInfo");
jest.mock("../models/EmployeeProfileInfo");

const Company = require("../models/Company");
const Alert = require("../models/EmployeeAlertsViolationInfo");
const EmployeeBankingInfo = require("../models/EmployeeBankingInfo");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const EmployeePayInfo = require("../models/EmployeePayInfo");
const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");
const { minimumWageOn, meetsMinimumWage } = require("../constants/minimumWage.constants");
const { deleteAlerts } = require("../controllers/alertsController");
const { clearMembershipCache } = require("../middleware/authorize");
const { auth, query, buildTestApp } = require("./helpers");

const JULIE = "65e0000000000000000000a1";
const ERWAN = "65e0000000000000000000b2";

// in-memory alerts collection
let rows;
let nextId;
const matches = (row, filter) =>
	Object.entries(filter).every(([k, v]) => {
		if (v && typeof v === "object" && "$ne" in v) return String(row[k]) !== String(v.$ne);
		if (v && typeof v === "object" && "$in" in v) return v.$in.map(String).includes(String(row[k]));
		return String(row[k]) === String(v);
	});

let employees; // { empId: { bank, SIN, payRate } }
let app;
beforeAll(() => {
	app = buildTestApp();
});
beforeEach(() => {
	jest.resetAllMocks();
	clearMembershipCache();
	rows = [];
	nextId = 1;
	employees = {
		[JULIE]: { bank: { bankNum: "1", transitNum: "2", accountNum: "3" }, SIN: "123", payRate: 16 },
		[ERWAN]: { bank: null, SIN: "", payRate: 15 },
	};
	Company.find.mockImplementation(() => query([{ name: "Acme", _id: "65b000000000000000000001" }]));
	EmployeeEmploymentInfo.findOne.mockImplementation(() => query({ employmentRole: "Administrator" }));
	EmployeeEmploymentInfo.find.mockImplementation(() =>
		query([JULIE, ERWAN].map((empId) => ({ empId, positions: [{ employmentPayGroup: "G1" }] }))),
	);
	EmployeeBankingInfo.findOne.mockImplementation(({ empId }) => query(employees[empId]?.bank));
	EmployeeProfileInfo.findOne.mockImplementation(({ empId }) => query({ SIN: employees[empId]?.SIN }));
	EmployeePayInfo.findOne.mockImplementation(({ empId }) =>
		query({ roles: [{ payRate: employees[empId]?.payRate }] }),
	);
	Alert.findOneAndUpdate.mockImplementation(async (filter, update) => {
		const hits = rows.filter((r) => matches(r, filter)).sort((a, b) => b.createdOn - a.createdOn);
		if (hits[0]) return Object.assign(hits[0], update.$set);
		const row = { _id: `a${nextId}`, createdOn: nextId++, ...update.$set };
		rows.push(row);
		return row;
	});
	Alert.deleteMany.mockImplementation(async (filter) => {
		const before = rows.length;
		rows = rows.filter((r) => !matches(r, filter));
		return { deletedCount: before - rows.length };
	});
	Alert.find.mockImplementation((filter) =>
		query(rows.filter((r) => matches(r, filter)).sort((a, b) => b.createdOn - a.createdOn)),
	);
});

const review = (payPeriodNum) =>
	request(app)
		.post("/api/alert")
		.set(auth())
		.send({ companyName: "Acme", inputsReviewData: [JULIE, ERWAN].map((empId) => ({ empId, payPeriodNum })) });
const list = () => request(app).get("/api/alert/detail/Acme/3/G1").set(auth());
const summary = (r) => `${r.empId} ${r.type} ${r.description}`;

test("T-ALERT-01 the same problems seen in three pay runs are listed once each", async () => {
	for (const period of ["1", "2", "3"]) expect((await review(period)).status).toBe(200);
	const wage = `Minimum wage is below $${minimumWageOn().toFixed(2)}.`;
	expect(rows.map(summary).sort()).toEqual(
		[
			`${JULIE} wage ${wage}`,
			`${ERWAN} bank Banking information missing`,
			`${ERWAN} wage ${wage}`,
			`${ERWAN} SIN SIN missing`,
		].sort(),
	);
	expect(rows.every((r) => r.payPeriodNum === "3")).toBe(true); // last seen
	const res = await list();
	expect(res.body).toHaveLength(4);
});

test("T-ALERT-02 a problem fixed before the next review disappears from the list", async () => {
	await review("1");
	employees[ERWAN].bank = { bankNum: "1", transitNum: "2", accountNum: "3" };
	employees[JULIE].payRate = minimumWageOn();
	await review("2");
	expect(rows.map((r) => `${r.empId} ${r.type}`).sort()).toEqual([`${ERWAN} SIN`, `${ERWAN} wage`].sort());
});

test("T-ALERT-03 legacy per-period copies are cleaned up by the next review and hidden until then", async () => {
	// what older versions stored: one copy per pay period
	for (const [i, period] of ["1", "2", "3"].entries()) {
		rows.push({ _id: `old${i}`, createdOn: -10 + i, companyName: "Acme", empId: JULIE, type: "wage", description: "Minimum wage is below $17.85.", payPeriodNum: period });
	}
	const before = await list();
	expect(before.body.filter((a) => a.empId === JULIE)).toHaveLength(1); // hidden on read
	employees[ERWAN] = { bank: { bankNum: "1", transitNum: "2", accountNum: "3" }, SIN: "9", payRate: 30 };
	await review("4");
	expect(rows.filter((r) => r.empId === JULIE)).toHaveLength(1); // cleaned up
	expect(rows.find((r) => r.empId === JULIE).description).toBe(`Minimum wage is below $${minimumWageOn().toFixed(2)}.`);
});

test("T-ALERT-04 one review listing an employee twice still makes one alert per problem", async () => {
	await request(app)
		.post("/api/alert")
		.set(auth())
		.send({ companyName: "Acme", inputsReviewData: [{ empId: JULIE }, { empId: { _id: JULIE } }] });
	expect(rows).toHaveLength(1);
});

test("T-ALERT-05 BC minimum wage by date: $17.85 from June 1, 2025, $18.25 from June 1, 2026; equal meets it", () => {
	expect(minimumWageOn("2025-12-31")).toBe(17.85);
	expect(minimumWageOn("2026-05-31")).toBe(17.85);
	expect(minimumWageOn("2026-06-01")).toBe(18.25);
	expect(meetsMinimumWage(18.25, "2026-07-01")).toBe(true);
	expect(meetsMinimumWage(18.24, "2026-07-01")).toBe(false);
	// before: alert below 17.85 but cleared only above 17.85, so 17.85 exactly never cleared
	expect(meetsMinimumWage(17.85, "2026-01-15")).toBe(true);
});

test("T-ALERT-06 clearing an alert after a fix only touches that company", async () => {
	await deleteAlerts(JULIE, "wage", "Acme");
	expect(Alert.deleteMany).toHaveBeenCalledWith({ empId: JULIE, type: "wage", companyName: "Acme" });
});

test("T-ALERT-07 no pay rate is reported as 'Pay rate missing.', not as below minimum wage", async () => {
	EmployeePayInfo.findOne.mockImplementation(() => query({ roles: [] }));
	await request(app).post("/api/alert").set(auth()).send({ companyName: "Acme", inputsReviewData: [{ empId: JULIE }] });
	expect(rows.find((r) => r.type === "wage").description).toBe("Pay rate missing.");
});
