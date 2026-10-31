/**
 * The payroll submit (PUT /api/payroll/report/submit/:id) sends the net pay to
 * employees through VoPay and only reports "sent" when VoPay answers
 * Success: true. VoPay answers most errors with HTTP 200 and
 * { Success: false }, which used to be recorded as sent.
 */
const request = require("supertest");

jest.mock("../models/Company");
jest.mock("../models/Group");
jest.mock("../models/EmployeePayStub");
jest.mock("../models/FundingTotalsPay");
jest.mock("../models/EmployeeEmploymentInfo");
jest.mock("../helpers/apiFetch", () => ({ apiFetch: jest.fn() }));

const Company = require("../models/Company");
const Group = require("../models/Group");
const EmployeePayStub = require("../models/EmployeePayStub");
const FundingTotalsPay = require("../models/FundingTotalsPay");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const { apiFetch } = require("../helpers/apiFetch");
const { COMPANIES } = require("../constants/constant");
const { clearMembershipCache } = require("../middleware/authorize");
const { auth, query, buildTestApp } = require("./helpers");

const CS = COMPANIES.CORNERSTONE;
// employees with a Cornerstone VoPay account (vopayController CORNERSTONE_RECIPIENT_ACCOUNTS)
const A = "67c1360568f8bcf1d10d240b";
const B = "6a28906efcc68f0aad5eab3a";

describe("payroll submit -> VoPay", () => {
	let app;
	let funding;
	let stubs;
	beforeAll(() => {
		app = buildTestApp();
	});
	beforeEach(() => {
		jest.resetAllMocks();
		clearMembershipCache();
		funding = { _id: "f1", payPeriodNum: 7, totalEmpPaymentRemitCost: 2500, fundTransferStatus: null };
		stubs = [
			{ empId: A, currentNetPay: 1500 },
			{ empId: B, currentNetPay: 1000 },
		];
		Company.find.mockImplementation(() => query([{ name: CS, _id: "65b000000000000000000001" }]));
		EmployeeEmploymentInfo.findOne.mockImplementation(() => query({ employmentRole: "Authorizing Admin" }));
		EmployeeEmploymentInfo.find.mockImplementation(() => query([]));
		Group.findByIdAndUpdate.mockResolvedValue({ _id: "g1" });
		Group.findOneAndUpdate.mockResolvedValue({ _id: "g1" });
		FundingTotalsPay.findOne.mockImplementation(() => query(funding));
		FundingTotalsPay.findOneAndUpdate.mockImplementation(async (filter, update) => {
			if (["in_progress", "sent"].includes(funding.fundTransferStatus)) return null;
			Object.assign(funding, update.$set);
			return funding;
		});
		FundingTotalsPay.findById.mockImplementation(() => query(funding));
		FundingTotalsPay.updateOne.mockImplementation(async (f, update) => Object.assign(funding, update.$set));
		EmployeePayStub.find.mockImplementation(() => query(stubs));
	});
	const submit = () =>
		request(app)
			.put("/api/payroll/report/submit/g1")
			.set(auth())
			.send({
				companyName: CS,
				yearSchedules: [],
				currentPayPeriod: {
					payPeriod: 7,
					payPeriodPayDate: "2026-10-30",
					frequency: "bi-weekly",
					isExtraRun: false,
				},
			});

	test("T-VP-03 VoPay answers Success: true -> sent", async () => {
		apiFetch.mockResolvedValue({ Success: true, TransactionID: "987654" });
		const res = await submit();
		expect(res.status).toBe(200);
		expect(res.body.fundTransfer).toEqual({ status: "sent", transactionId: "987654" }); // id kept to cancel it
		expect(funding.fundTransferStatus).toBe("sent");
	});

	test("T-VP-04 VoPay answers HTTP 200 with Success: false -> failed with VoPay's message (was recorded as sent)", async () => {
		apiFetch.mockResolvedValue({ Success: false, ErrorMessage: "Insufficient balance" });
		const res = await submit();
		expect(res.body.fundTransfer).toMatchObject({ status: "failed", error: "Insufficient balance" });
		expect(funding.fundTransferStatus).toBe("failed");
		apiFetch.mockResolvedValue({}); // no Success field at all
		funding.fundTransferStatus = "failed";
		expect((await submit()).body.fundTransfer).toMatchObject({ status: "failed", error: "VoPay did not confirm the transfer" });
	});

	test("T-VP-05 a failed transfer can be retried by submitting again; a sent one is never sent twice", async () => {
		apiFetch.mockResolvedValueOnce({ Success: false, ErrorMessage: "Invalid signature" });
		await submit();
		apiFetch.mockResolvedValueOnce({ Success: true, TransactionID: "1" });
		const retry = await submit();
		expect(retry.body.fundTransfer.status).toBe("sent");
		const again = await submit();
		expect(again.body.fundTransfer).toEqual({ status: "skipped", reason: "ALREADY_SENT" });
		expect(apiFetch).toHaveBeenCalledTimes(2);
	});

	test("T-VP-06 network / HTTP error -> failed, and the run is not left stuck in progress", async () => {
		apiFetch.mockRejectedValue(new Error("POST https://x/api?Key=SECRET failed (500): down"));
		const res = await submit();
		expect(res.body.fundTransfer.status).toBe("failed");
		expect(res.body.fundTransfer.error).not.toContain("SECRET"); // query string redacted
		expect(funding.fundTransferStatus).toBe("failed");
	});
});
