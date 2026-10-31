/**
 * Cancel a VoPay transaction by TransactionID: function, API route, script.
 * Cancelled only when VoPay answers Success: true; nothing is written.
 */
const request = require("supertest");

jest.mock("../models/Company");
jest.mock("../models/EmployeeEmploymentInfo");
jest.mock("../models/FundingTotalsPay");
jest.mock("../helpers/apiFetch", () => ({ apiFetch: jest.fn() }));

const Company = require("../models/Company");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const FundingTotalsPay = require("../models/FundingTotalsPay");
const { apiFetch } = require("../helpers/apiFetch");
const { COMPANIES } = require("../constants/constant");
const { cancelVopayTransaction } = require("../controllers/vopayController");
const { run } = require("../scripts/cancel-vopay-transfer");
const { clearMembershipCache } = require("../middleware/authorize");
const { auth, query, buildTestApp } = require("./helpers");

const CS = COMPANIES.CORNERSTONE;
let app;
beforeAll(() => {
	app = buildTestApp();
});
beforeEach(() => {
	jest.resetAllMocks();
	clearMembershipCache();
	Company.find.mockImplementation(() => query([{ name: CS, _id: "65b000000000000000000001" }]));
	EmployeeEmploymentInfo.findOne.mockImplementation(() => query({ employmentRole: "Authorizing Admin" }));
	EmployeeEmploymentInfo.find.mockImplementation(() => query([]));
});

test("T-VC-01 cancel: posts the TransactionID to VoPay's cancel endpoint with Cornerstone's own account", async () => {
	apiFetch.mockResolvedValue({ Success: true });
	const res = await cancelVopayTransaction(CS, 987654);
	expect(res).toEqual({ status: "cancelled", transactionId: "987654" });
	const [url, { method, data }] = apiFetch.mock.calls[0];
	expect(url).toMatch(/account\/transactions\/cancel$/);
	expect(method).toBe("POST");
	expect(data).toMatchObject({ TransactionID: "987654", AccountID: process.env.CORNERSTONE_ACCOUNT_ID, Key: process.env.CORNERSTONE_SHARED_KEY });
	expect(data.Signature).toMatch(/^[0-9a-f]{40}$/);
});

test("T-VC-02 VoPay refuses (e.g. already processed) or is unreachable: failed with the reason, secrets redacted", async () => {
	apiFetch.mockResolvedValueOnce({ Success: false, ErrorMessage: "Transaction cannot be cancelled" });
	expect(await cancelVopayTransaction(CS, "1")).toEqual({ status: "failed", transactionId: "1", error: "Transaction cannot be cancelled" });
	apiFetch.mockRejectedValueOnce(new Error("POST https://x/api?Key=SECRET failed (500): down"));
	const down = await cancelVopayTransaction(CS, "1");
	expect(down.status).toBe("failed");
	expect(down.error).not.toContain("SECRET");
	expect((await cancelVopayTransaction(CS, " ")).error).toBe("TransactionID is required");
});

test("T-VC-03 API: payroll-submit roles only; answers 200 cancelled / 422 refused / 400 no id; nothing written", async () => {
	apiFetch.mockResolvedValue({ Success: true });
	const ok = await request(app).post("/api/vopay/account/transactions/cancel").set(auth()).send({ companyName: CS, transactionId: "55" });
	expect(ok.status).toBe(200);
	expect(ok.body).toEqual({ status: "cancelled", transactionId: "55" });
	apiFetch.mockResolvedValue({ Success: false, ErrorMessage: "Already processed" });
	const refused = await request(app).post("/api/vopay/account/transactions/cancel").set(auth()).send({ companyName: CS, transactionId: "55" });
	expect(refused.status).toBe(422);
	const noId = await request(app).post("/api/vopay/account/transactions/cancel").set(auth()).send({ companyName: CS });
	expect(noId.status).toBe(400);
	EmployeeEmploymentInfo.findOne.mockImplementation(() => query({ employmentRole: "Employee" }));
	clearMembershipCache();
	const employee = await request(app).post("/api/vopay/account/transactions/cancel").set(auth()).send({ companyName: CS, transactionId: "55" });
	expect(employee.status).toBe(403);
	for (const fn of ["updateOne", "findOneAndUpdate", "findByIdAndUpdate"]) expect(FundingTotalsPay[fn]).not.toHaveBeenCalled();
});

test("T-VC-04 script: dry run by default; --yes cancels", async () => {
	const log = () => {};
	expect(await run(["--id", "77"], { log })).toEqual({ status: "dry_run", transactionId: "77" });
	expect(apiFetch).not.toHaveBeenCalled();
	apiFetch.mockResolvedValue({ Success: true });
	expect(await run(["--id", "77", "--yes"], { log })).toEqual({ status: "cancelled", transactionId: "77" });
	expect((await run([], { log })).status).toBe("usage");
});
