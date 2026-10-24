/**
 * STAT-HOLIDAYS: BC statutory holidays computed for any year and filled in
 * automatically for a company's empty year; year handling on edit; holidays
 * are matched on the Vancouver calendar day.
 */
const request = require("supertest");

jest.mock("../models/Company");
jest.mock("../models/Holiday");

const Company = require("../models/Company");
const Holiday = require("../models/Holiday");
const { bcStatHolidays, easterSunday, isBCCompany } = require("../utils/bcStatHolidays.util");
const { clearMembershipCache } = require("../middleware/authorize");
const { auth, query, buildTestApp } = require("./helpers");

const day = (d) => d.toISOString().slice(0, 10);
const list = (year) => bcStatHolidays(year).map((h) => `${day(h.date)} ${h.name}`);

describe("BC statutory holiday rules", () => {
	test("T-SH-01 2026 matches the published BC list (11 holidays)", () => {
		expect(list(2026)).toEqual([
			"2026-01-01 New Year's Day",
			"2026-02-16 Family Day",
			"2026-04-03 Good Friday",
			"2026-05-18 Victoria Day",
			"2026-07-01 Canada Day",
			"2026-08-03 B.C. Day",
			"2026-09-07 Labour Day",
			"2026-09-30 National Day for Truth and Reconciliation",
			"2026-10-12 Thanksgiving Day",
			"2026-11-11 Remembrance Day",
			"2026-12-25 Christmas Day",
		]);
	});

	test("T-SH-02 2027 by the same rules", () => {
		expect(list(2027)).toEqual([
			"2027-01-01 New Year's Day",
			"2027-02-15 Family Day",
			"2027-03-26 Good Friday",
			"2027-05-24 Victoria Day",
			"2027-07-01 Canada Day",
			"2027-08-02 B.C. Day",
			"2027-09-06 Labour Day",
			"2027-09-30 National Day for Truth and Reconciliation",
			"2027-10-11 Thanksgiving Day",
			"2027-11-11 Remembrance Day",
			"2027-12-25 Christmas Day",
		]);
	});

	test("T-SH-03 Easter for known years (Good Friday is 2 days before)", () => {
		const known = { 2019: "04-21", 2024: "03-31", 2025: "04-20", 2026: "04-05", 2027: "03-28", 2030: "04-21", 2038: "04-25" };
		for (const [year, md] of Object.entries(known)) expect(day(easterSunday(Number(year)))).toBe(`${year}-${md}`);
	});

	test("T-SH-04 rule changes over the years (past, present and future years all work)", () => {
		// Canada Day moves to July 2 when July 1 is a Sunday (2029)
		expect(list(2029)).toContain("2029-07-02 Canada Day");
		// Family Day: 2nd Monday of February until 2018, 3rd Monday from 2019
		expect(list(2018)).toContain("2018-02-12 Family Day");
		expect(list(2019)).toContain("2019-02-18 Family Day");
		expect(list(2012).some((h) => h.includes("Family Day"))).toBe(false);
		// Truth and Reconciliation is a BC stat from 2023
		expect(bcStatHolidays(2022)).toHaveLength(10);
		expect(bcStatHolidays(2023)).toHaveLength(11);
		// Victoria Day: always the Monday before May 25
		for (let y = 2020; y <= 2040; y++) {
			const v = bcStatHolidays(y).find((h) => h.name === "Victoria Day").date;
			expect(v.getUTCDay()).toBe(1);
			expect(v.getUTCDate()).toBeGreaterThanOrEqual(18);
			expect(v.getUTCDate()).toBeLessThanOrEqual(24);
		}
		// Easter Monday and Boxing Day are not BC stats
		expect(list(2026).some((h) => /Boxing|Easter Monday/.test(h))).toBe(false);
		expect(bcStatHolidays("abc")).toEqual([]);
	});

	test("T-SH-05 which companies follow BC rules", () => {
		expect(isBCCompany({ address: { state: "BC" } })).toBe(true);
		expect(isBCCompany({ address: { state: "British Columbia" } })).toBe(true);
		expect(isBCCompany({ address: { state: "b.c." } })).toBe(true);
		expect(isBCCompany({ address: {} })).toBe(true); // not set: payroll is BC-only
		expect(isBCCompany({ address: { state: "AB" } })).toBe(false);
	});
});

describe("holiday API", () => {
	let app;
	let rows;
	let company;
	beforeAll(() => {
		app = buildTestApp();
	});
	beforeEach(() => {
		jest.resetAllMocks();
		clearMembershipCache();
		rows = [];
		company = { name: "Acme", address: { state: "BC" } };
		// membership (tenant guard) and the company's address
		Company.find.mockImplementation(() => query([{ name: "Acme", _id: "65b000000000000000000001" }]));
		Company.findOne.mockImplementation(() => query(company));
		const yearOf = (y) => String(y);
		Holiday.countDocuments.mockImplementation(async (f) =>
			rows.filter((r) => r.companyName === f.companyName && r.year === yearOf(f.year)).length,
		);
		Holiday.updateOne.mockImplementation(async (f, u) => {
			const hit = rows.find((r) => r.companyName === f.companyName && r.year === f.year && r.name === f.name);
			if (!hit) rows.push({ ...u.$setOnInsert });
			return { acknowledged: true };
		});
		Holiday.find.mockImplementation((f) =>
			query(rows.filter((r) => r.companyName === f.companyName && r.year === yearOf(f.year))),
		);
	});

	test("T-SH-06 opening an empty year fills in the BC holidays (once), for past and future years", async () => {
		const res = await request(app).get("/api/holiday/Acme/2027").set(auth());
		expect(res.status).toBe(200);
		expect(res.body).toHaveLength(11);
		expect(res.body[0]).toMatchObject({ name: "New Year's Day", year: "2027", source: "BC_STATUTORY" });
		await request(app).get("/api/holiday/Acme/2027").set(auth());
		expect(rows).toHaveLength(11); // not filled in twice
		const past = await request(app).get("/api/holiday/Acme/2022").set(auth());
		expect(past.body).toHaveLength(10);
	});

	test("T-SH-07 a year the company already has is left as the company made it", async () => {
		rows.push({ companyName: "Acme", year: "2026", name: "Company Picnic", date: new Date("2026-06-12") });
		const res = await request(app).get("/api/holiday/Acme/2026").set(auth());
		expect(res.body.map((h) => h.name)).toEqual(["Company Picnic"]);
		expect(Holiday.updateOne).not.toHaveBeenCalled();
	});

	test("T-SH-08 a company outside BC is not given BC holidays; a bad year is 400", async () => {
		company = { name: "Acme", address: { state: "AB" } };
		const res = await request(app).get("/api/holiday/Acme/2027").set(auth());
		expect(res.body).toEqual([]);
		const bad = await request(app).get("/api/holiday/Acme/20x7").set(auth());
		expect(bad.status).toBe(400);
	});

	test("T-SH-09 editing a holiday to a date in another year moves it to that year", async () => {
		Holiday.findById.mockResolvedValue({ _id: "h1" });
		Holiday.findByIdAndUpdate.mockImplementation(async (id, u) => ({ _id: id, ...u.$set }));
		const res = await request(app)
			.put("/api/holiday/h1")
			.set(auth())
			.send({ name: "Christmas Day", date: "2027-12-25", company: "Acme", year: "2026" });
		expect(res.status).toBe(200);
		expect(Holiday.findByIdAndUpdate.mock.calls[0][1].$set).toMatchObject({ year: "2027", date: "2027-12-25" });
		const bad = await request(app).put("/api/holiday/h1").set(auth()).send({ date: "nope" });
		expect(bad.status).toBe(400);
	});

	test("T-SH-10 two fills at the same moment: an insert that collides (unique index) is not an error", async () => {
		let n = 0;
		Holiday.updateOne.mockImplementation(async (f, u) => {
			if (n++ % 2) {
				const e = new Error("E11000 duplicate key");
				e.code = 11000;
				throw e;
			}
			rows.push({ ...u.$setOnInsert });
			return { acknowledged: true };
		});
		const res = await request(app).get("/api/holiday/Acme/2027").set(auth());
		expect(res.status).toBe(200);
	});

	test("T-SH-11 adding or renaming to a name already used that year is 409, not 500", async () => {
		const dup = Object.assign(new Error("E11000 duplicate key"), { code: 11000 });
		Holiday.findOne.mockResolvedValue(null);
		Holiday.create.mockRejectedValue(dup);
		const add = await request(app).post("/api/holiday").set(auth()).send({ name: "Canada Day", date: "2027-07-01", company: "Acme" });
		expect(add.status).toBe(409);
		Holiday.findById.mockResolvedValue({ _id: "h1" });
		Holiday.findByIdAndUpdate.mockRejectedValue(dup);
		const rename = await request(app).put("/api/holiday/h1").set(auth()).send({ name: "Canada Day" });
		expect(rename.status).toBe(409);
	});
});

