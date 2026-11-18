/**
 * BUG-SEARCH-02: Opportunities and Lead docket "Search here" did nothing.
 * `?search=` matches opportunity name, company or e-mail (case-insensitive),
 * escaped so it is never read as a regular expression.
 */
const request = require("supertest");

jest.mock("../models/Company");
jest.mock("../models/Lead");

const Company = require("../models/Company");
const Lead = require("../models/Lead");
const { clearMembershipCache } = require("../middleware/authorize");
const { auth, query, buildTestApp } = require("./helpers");

const CO = "Acme Co";
describe("lead search (BUG-SEARCH-02)", () => {
	let app;
	beforeAll(() => {
		app = buildTestApp();
	});
	beforeEach(() => {
		jest.resetAllMocks();
		clearMembershipCache();
		Company.find.mockImplementation(() => query([{ name: CO, _id: "65b000000000000000000001" }]));
		Lead.find.mockImplementation(() => query([]));
		Lead.countDocuments.mockResolvedValue(0);
	});
	const findFilter = () => Lead.find.mock.calls[0][0];

	test("LS-01 opportunities: search matches name, company or e-mail; count uses the same filter", async () => {
		const res = await request(app).get(`/api/leads/opportunities/${encodeURIComponent(CO)}/filter=null?page=1&limit=30&search=abc`).set(auth());
		expect(res.status).toBe(200);
		const f = findFilter();
		expect(f.companyName).toBe(CO);
		expect(f.$or.map((c) => Object.keys(c)[0])).toEqual(["opportunityName", "name", "email"]);
		expect(f.$or[0].opportunityName.test("ABC Store")).toBe(true);
		expect(Lead.countDocuments.mock.calls[0][0]).toEqual(f);
	});

	test("LS-02 lead docket: search keeps the not-disbursed rule; special characters are literal", async () => {
		await request(app).get(`/api/leads/not-disbursed/${encodeURIComponent(CO)}/filter=null?search=${encodeURIComponent("a.c(")}`).set(auth());
		const f = findFilter();
		expect(f.isDisbursed).toBe(false);
		const re = f.$or[0].opportunityName;
		expect(re.test("a.c(")).toBe(true);
		expect(re.test("abc(")).toBe(false); // "." is not a wildcard
	});

	test("LS-03 no search (or blank) lists everything as before", async () => {
		await request(app).get(`/api/leads/opportunities/${encodeURIComponent(CO)}/filter=null?search=%20%20`).set(auth());
		expect(findFilter()).toEqual({ companyName: CO });
	});
});
