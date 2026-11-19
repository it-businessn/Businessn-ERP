/**
 * ORDERS-01: payroll submit creates BusinessN Corporate's order for the run (once)
 * and records the VoPay transfer on it; the VoPay webhook updates it. The
 * submit's VoPay transfer and its answer are unchanged.
 */
const request = require("supertest");

jest.mock("../models/Company");
jest.mock("../models/Group");
jest.mock("../models/EmployeePayStub");
jest.mock("../models/FundingTotalsPay");
jest.mock("../models/EmployeeEmploymentInfo");
jest.mock("../models/Order");
jest.mock("../helpers/apiFetch", () => ({ apiFetch: jest.fn() }));
jest.mock("../services/encryptDataService", () => ({
	...jest.requireActual("../services/encryptDataService"),
	generateVopaySignature: () => "test-signature",
}));

const Company = require("../models/Company");
const Group = require("../models/Group");
const EmployeePayStub = require("../models/EmployeePayStub");
const FundingTotalsPay = require("../models/FundingTotalsPay");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const Order = require("../models/Order");
const { apiFetch } = require("../helpers/apiFetch");
const { COMPANIES } = require("../constants/constant");
const { clearMembershipCache } = require("../middleware/authorize");
const { auth, query, buildTestApp } = require("./helpers");

const CS = COMPANIES.CORNERSTONE;
const A = "67c1360568f8bcf1d10d240b"; // Cornerstone employees with VoPay accounts
const B = "6a28906efcc68f0aad5eab3a";

describe("payroll orders (ORDERS-01)", () => {
	let app;
	let funding;
	let orders;
	beforeAll(() => {
		app = buildTestApp();
	});
	beforeEach(() => {
		jest.resetAllMocks();
		clearMembershipCache();
		jest.spyOn(console, "log").mockImplementation(() => {});
		funding = { _id: "f1", payPeriodNum: 7, totalEmpPaymentRemitCost: 2500, fundTransferStatus: null };
		orders = [];
		const asDoc = (o) => Object.assign(o, { save: jest.fn(async () => o) });
		Company.find.mockImplementation(() => query([{ name: CS, _id: "65b000000000000000000001" }]));
		EmployeeEmploymentInfo.findOne.mockImplementation(() => query({ employmentRole: "Authorizing Admin" }));
		EmployeeEmploymentInfo.find.mockImplementation(() => query([]));
		Group.findByIdAndUpdate.mockResolvedValue({ _id: "g1" });
		Group.findOneAndUpdate.mockResolvedValue({ _id: "g1" });
		FundingTotalsPay.findOne.mockImplementation(() => query(funding));
		FundingTotalsPay.findOneAndUpdate.mockImplementation(async (f, update) => {
			if (["in_progress", "sent"].includes(funding.fundTransferStatus)) return null;
			Object.assign(funding, update.$set);
			return funding;
		});
		FundingTotalsPay.findById.mockImplementation(() => query(funding));
		FundingTotalsPay.updateOne.mockImplementation(async (f, update) => Object.assign(funding, update.$set));
		EmployeePayStub.find.mockImplementation(() =>
			query([
				{ empId: A, currentNetPay: 1500 },
				{ empId: B, currentNetPay: 1000 },
			]),
		);
		Order.find.mockImplementation(() => query([{ orderNumber: "BE10069" }, { orderNumber: "BE10068" }]));
		Order.findOne.mockImplementation(async (filter) => {
			const [key, value] = Object.entries(filter)[0];
			return orders.find((o) => o[key] === value) || null;
		});
		Order.create.mockImplementation(async (doc) => {
			const order = asDoc({
				fundsReceivedStatus: "Unsettled",
				empEFTSentStatus: "Unsettled",
				empEFTDepositedStatus: "Unsettled",
				craSentStatus: "Unsettled",
				craDepositedStatus: "Unsettled",
				fulfillmentStatus: "Unsettled",
				...doc,
			});
			orders.push(order);
			return order;
		});
	});
	const submit = () =>
		request(app)
			.put("/api/payroll/report/submit/g1")
			.set(auth())
			.send({
				companyName: CS,
				yearSchedules: [],
				currentPayPeriod: { payPeriod: 7, payPeriodPayDate: "2026-10-30", frequency: "bi-weekly", isExtraRun: false },
			});
	const webhook = (body) =>
		request(app).post("/api/vopay-webhook").set("x-vopay-signature", "test-signature").send(body);

	test("PO-01 submit: transfer and answer unchanged; one order created for BusinessN Corporate with the transfer recorded", async () => {
		apiFetch.mockResolvedValue({ Success: true, TransactionID: "987654" });
		const res = await submit();
		expect(res.status).toBe(200);
		expect(res.body.fundTransfer).toEqual({ status: "sent", transactionId: "987654" });
		expect(apiFetch).toHaveBeenCalledTimes(1);
		expect(funding).toMatchObject({ fundTransferStatus: "sent", fundTransferTransactionId: "987654" }); // ORDERS-02
		expect(orders).toHaveLength(1);
		expect(orders[0]).toMatchObject({
			companyName: COMPANIES.BUSINESSN_ORG,
			orderNumber: "BE10070",
			fundingTotalsId: "f1",
			customer: CS,
			totalRecipients: 2,
			empEFTSentStatus: "Settled",
			empEFTDepositedStatus: "Unsettled",
			vopayTransactionId: "987654",
			vopayStatus: "sent",
			fulfillmentStatus: "Unsettled",
		});
	});

	test("PO-02 a failed transfer is recorded; the retry reuses the same order", async () => {
		apiFetch.mockResolvedValueOnce({ Success: false, ErrorMessage: "Insufficient balance" });
		await submit();
		expect(orders[0]).toMatchObject({ vopayStatus: "failed", vopayFailureReason: "Insufficient balance", empEFTSentStatus: "Unsettled" });
		expect(funding.fundTransferTransactionId).toBeUndefined(); // no id when VoPay refused
		apiFetch.mockResolvedValueOnce({ Success: true, TransactionID: "1" });
		await submit();
		expect(orders).toHaveLength(1);
		expect(orders[0]).toMatchObject({ vopayStatus: "sent", vopayTransactionId: "1", empEFTSentStatus: "Settled", vopayFailureReason: null });
	});

	test("PO-03 an order failure never changes the submit or the transfer", async () => {
		apiFetch.mockResolvedValue({ Success: true, TransactionID: "5" });
		Order.findOne.mockRejectedValue(new Error("db down"));
		const errorLog = jest.spyOn(console, "error").mockImplementation(() => {});
		const res = await submit();
		expect(res.status).toBe(200);
		expect(res.body.fundTransfer.status).toBe("sent");
		expect(funding.fundTransferStatus).toBe("sent");
		// ORDERS-02: the transaction id is kept on the run and logged, so it is not lost
		expect(funding.fundTransferTransactionId).toBe("5");
		expect(errorLog).toHaveBeenCalledWith(
			"Payroll order not recorded",
			expect.objectContaining({ transactionId: "5", fundingTotalsId: "f1" }),
		);
	});

	test("PO-04 webhook: 'successful' settles both employee EFT statuses; 'failed' unsettles them with the reason", async () => {
		apiFetch.mockResolvedValue({ Success: true, TransactionID: "777" });
		await submit();
		expect((await webhook({ TransactionID: "777", Status: "successful" })).status).toBe(200);
		await new Promise((r) => setImmediate(r));
		expect(orders[0]).toMatchObject({ empEFTSentStatus: "Settled", empEFTDepositedStatus: "Settled", vopayStatus: "successful" });
		await webhook({ TransactionID: "777", Status: "failed", FailureReason: "Account closed" });
		await new Promise((r) => setImmediate(r));
		expect(orders[0]).toMatchObject({ empEFTDepositedStatus: "Unsettled", vopayStatus: "failed", vopayFailureReason: "Account closed" });
	});

	test("PO-05 fulfillment becomes Settled only when every status is Settled", async () => {
		apiFetch.mockResolvedValue({ Success: true, TransactionID: "9" });
		await submit();
		Object.assign(orders[0], { fundsReceivedStatus: "Settled", craSentStatus: "Settled", craDepositedStatus: "Settled" });
		await webhook({ TransactionID: "9", Status: "successful" });
		await new Promise((r) => setImmediate(r));
		expect(orders[0].fulfillmentStatus).toBe("Settled");
	});

	test("PO-06 webhook: unknown transaction or bad signature changes nothing", async () => {
		expect((await webhook({ TransactionID: "nope", Status: "successful" })).status).toBe(200);
		const bad = await request(app).post("/api/vopay-webhook").set("x-vopay-signature", "wrong").send({ TransactionID: "x" });
		expect(bad.status).toBe(401);
		expect(Order.create).not.toHaveBeenCalled();
	});
});
