/**
 * ACCESS-01: GET /api/permissions/my-role/:companyName returns the signed-in
 * user's CURRENT role (the client used the role saved at sign-in, so a changed
 * System Access Level only applied after signing in again).
 */
const request = require("supertest");

jest.mock("../models/Company");
jest.mock("../models/EmployeeEmploymentInfo");

const Company = require("../models/Company");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const { COMPANIES } = require("../constants/constant");
const { ROLES } = require("../constants/roles.constants");
const { clearMembershipCache } = require("../middleware/authorize");
const { auth, query, buildTestApp } = require("./helpers");

const BN = COMPANIES.BUSINESSN_ORG;
const CLIENT = "Client Co";
const enc = encodeURIComponent;

describe("my role (ACCESS-01)", () => {
	let app;
	let roles;
	beforeAll(() => {
		app = buildTestApp();
	});
	beforeEach(() => {
		jest.resetAllMocks();
		clearMembershipCache();
		roles = { [BN]: ROLES.ADMINISTRATOR, [CLIENT]: ROLES.ADMINISTRATOR };
		Company.find.mockImplementation(() =>
			query([
				{ name: BN, _id: "65b000000000000000000001" },
				{ name: CLIENT, _id: "65b000000000000000000002" },
			]),
		);
		EmployeeEmploymentInfo.findOne.mockImplementation(({ companyName }) =>
			query({ employmentRole: roles[companyName] }),
		);
	});
	const myRole = (company) => request(app).get(`/api/permissions/my-role/${enc(company)}`).set(auth());

	test("MR-01 returns the role stored now, not the one from sign-in", async () => {
		expect((await myRole(BN)).body).toEqual({ role: ROLES.ADMINISTRATOR, employmentRole: ROLES.ADMINISTRATOR });
		roles[BN] = ROLES.SHADOW_ADMIN; // access level changed after sign-in
		clearMembershipCache(); // done by the employment-info save
		expect((await myRole(BN)).body.role).toBe(ROLES.SHADOW_ADMIN);
	});

	test("MR-02 a BusinessN Corporate Shadow Admin is Shadow Admin in their other companies (as the server checks)", async () => {
		roles[BN] = ROLES.SHADOW_ADMIN;
		const res = await myRole(CLIENT);
		expect(res.body).toEqual({ role: ROLES.SHADOW_ADMIN, employmentRole: ROLES.ADMINISTRATOR });
	});

	test("MR-03 a company the user does not belong to is refused", async () => {
		const res = await myRole("Someone Else Inc");
		expect(res.status).toBe(403);
	});
});
