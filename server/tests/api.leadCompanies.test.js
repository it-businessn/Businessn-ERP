/**
 * BUG-LEAD-02: an opportunity saved without a company created a lead company
 * with a blank name, shown as an empty line in the company dropdowns.
 */
const request = require("supertest");

jest.mock("../models/Company");
jest.mock("../models/LeadCompany");

const Company = require("../models/Company");
const LeadCompany = require("../models/LeadCompany");
const { clearMembershipCache } = require("../middleware/authorize");
const { auth, query, buildTestApp } = require("./helpers");

const CO = "Acme Co";
describe("lead companies (BUG-LEAD-02)", () => {
	let app;
	beforeAll(() => {
		app = buildTestApp();
	});
	beforeEach(() => {
		jest.resetAllMocks();
		clearMembershipCache();
		Company.find.mockImplementation(() => query([{ name: CO, _id: "65b000000000000000000001" }]));
		LeadCompany.find.mockImplementation(() => query([]));
		LeadCompany.findOne.mockResolvedValue(null);
		LeadCompany.create.mockImplementation(async (doc) => doc);
	});

	test("LC-01 the list leaves out companies with a blank name", async () => {
		await request(app).get(`/api/leads/companies/${encodeURIComponent(CO)}`).set(auth());
		const filter = LeadCompany.find.mock.calls[0][0];
		expect(filter.companyName).toBe(CO);
		expect(filter.name.test("Romero PLC Ltd.")).toBe(true);
		expect(filter.name.test("")).toBe(false);
		expect(filter.name.test("   ")).toBe(false);
	});

	test("LC-02 a blank company name is refused; a name is saved trimmed", async () => {
		const blank = await request(app).post("/api/leads/companies").set(auth()).send({ name: "  ", companyName: CO });
		expect(blank.status).toBe(400);
		expect(LeadCompany.create).not.toHaveBeenCalled();
		const ok = await request(app).post("/api/leads/companies").set(auth()).send({ name: " ABC Store ", companyName: CO });
		expect(ok.status).toBe(201);
		expect(LeadCompany.create).toHaveBeenCalledWith({ name: "ABC Store", companyName: CO });
	});
});
