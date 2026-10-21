/**
 * VoPay integration regression tests (stream B): NEW-04 (Cornerstone transfer
 * signature, per-call credentials, visible transfer outcome), CHANGES.md API #3 (handlers
 * that never responded), NEW-15 / CHANGES.md API #16 (undefined TECHCORP_CREDS, webhook
 * broadcast to every socket). apiFetch is mocked: no network calls are made.
 */
const request = require("supertest");

jest.mock("../helpers/apiFetch", () => ({ apiFetch: jest.fn() }));
jest.mock("../models/Company");
jest.mock("../models/FundingTotalsPay");
jest.mock("../models/EmployeePayStub");
jest.mock("../models/Group");
jest.mock("../models/EmployeeEmploymentInfo");

const { apiFetch } = require("../helpers/apiFetch");
const Company = require("../models/Company");
const FundingTotalsPay = require("../models/FundingTotalsPay");
const EmployeePayStub = require("../models/EmployeePayStub");
const Group = require("../models/Group");
const { generateVopaySignature } = require("../services/encryptDataService");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const { clearMembershipCache } = require("../middleware/authorize");
const { COMPANIES } = require("../constants/constant");
const vopay = require("../controllers/vopayController");
const { USER_ID, auth, tokenFor, query, buildTestApp } = require("./helpers");

const env = (k) => process.env[k];
const CORNERSTONE = {
	AccountID: env("CORNERSTONE_ACCOUNT_ID"),
	Key: env("CORNERSTONE_SHARED_KEY"),
	Signature: () =>
		generateVopaySignature(env("CORNERSTONE_SHARED_KEY"), env("CORNERSTONE_SHARED_SECRET")),
};
const STAGING = {
	AccountID: env("VOPAY_PARTNER_ACCOUNT_ID"),
	Key: env("VOPAY_API_KEY_STAGING"),
	Signature: () =>
		generateVopaySignature(env("VOPAY_API_KEY_STAGING"), env("VOPAY_SHARED_SECRET_STAGING")),
};

const CS = COMPANIES.CORNERSTONE;
const CS_EMP = "67c1360568f8bcf1d10d240b"; // an employee in the Cornerstone account map
const FUND_TOTALS = { _id: "65d000000000000000000001", totalEmpPaymentRemitCost: 1234.5 };
let fundState = null;
const STUBS = [{ empId: CS_EMP, currentNetPay: 1234.5 }];

const fakeRes = () => {
	const res = {};
	res.status = jest.fn(() => res);
	res.json = jest.fn(() => res);
	res.send = jest.fn(() => res);
	return res;
};
const lastCallData = () => apiFetch.mock.calls[apiFetch.mock.calls.length - 1][1].data;

let app;
beforeAll(() => {
	app = buildTestApp();
});
beforeEach(() => {
	jest.clearAllMocks();
	clearMembershipCache();
	apiFetch.mockResolvedValue({ Success: true });
	// AUD-028 (stream C): payroll/VoPay routes are role-gated; the caller is an
	// Authorizing Admin here so these tests keep exercising the handlers.
	EmployeeEmploymentInfo.findOne.mockImplementation(() => query({ employmentRole: "Authorizing Admin" }));
	Company.find.mockImplementation(() => query([{ name: CS, _id: "65b000000000000000000001" }]));
	jest.spyOn(console, "error").mockImplementation(() => {});
	jest.spyOn(console, "warn").mockImplementation(() => {});
	jest.spyOn(console, "log").mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());

describe("NEW-04 Cornerstone fund transfer credentials", () => {
	test("T-VOPAY-01 Cornerstone transfer sends Cornerstone AccountID/Key with the matching Cornerstone signature", async () => {
		await vopay.vopayFundTransfer(CS, FUND_TOTALS, STUBS);
		expect(apiFetch).toHaveBeenCalledTimes(1);
		const [url, opts] = apiFetch.mock.calls[0];
		expect(url).toMatch(/account\/client-accounts\/fund-transfer-withdraw$/);
		expect(opts.method).toBe("POST");
		expect(opts.data.AccountID).toBe(CORNERSTONE.AccountID);
		expect(opts.data.Key).toBe(CORNERSTONE.Key);
		expect(opts.data.Signature).toBe(CORNERSTONE.Signature());
		expect(opts.data.Signature).not.toBe(STAGING.Signature());
	});

	test("T-VOPAY-02 default handlers keep the default (staging) Key/Signature pair", async () => {
		const res = fakeRes();
		await vopay.getAccountBalance({}, res);
		expect(lastCallData()).toMatchObject({
			AccountID: STAGING.AccountID,
			Key: STAGING.Key,
			Signature: STAGING.Signature(),
		});
		expect(res.status).toHaveBeenCalledWith(200);
	});

	test("T-VOPAY-03 environment is per call: Cornerstone transfer then default calls do not leak Cornerstone credentials", async () => {
		await vopay.vopayFundTransfer(CS, FUND_TOTALS, STUBS);
		expect(lastCallData().Key).toBe(CORNERSTONE.Key);

		// handlers that used to reassign the module-level currentEnv
		await vopay.fundEmployerWallet({ body: { Amount: 1 } }, fakeRes());
		await vopay.createClientAccountEmployee({ body: { FirstName: "A" } }, fakeRes());

		for (const handler of [
			vopay.getAccountBalance,
			vopay.getClientAccountWallets,
			vopay.getPartnerEmployerAccounts,
		]) {
			await handler({ params: {}, body: {} }, fakeRes());
			const data = lastCallData();
			expect(data.Key).toBe(STAGING.Key);
			expect(data.AccountID).toBe(STAGING.AccountID);
			expect(data.Signature).toBe(STAGING.Signature());
		}
		// and a second Cornerstone transfer still uses Cornerstone's pair
		await vopay.vopayFundTransfer(CS, FUND_TOTALS, STUBS);
		expect(lastCallData()).toMatchObject({ Key: CORNERSTONE.Key, Signature: CORNERSTONE.Signature() });
	});

	test("T-VOPAY-04 every outbound call sends a Key/Signature pair computed from the same account", async () => {
		const sigFor = {
			[STAGING.Key]: STAGING.Signature(),
			[CORNERSTONE.Key]: CORNERSTONE.Signature(),
		};
		const req = { params: { clientAccountId: "c1", accountId: "a1", vopayAccountId: "v1" }, body: {} };
		const handlers = Object.entries(vopay).filter(
			([name, fn]) =>
				typeof fn === "function" &&
				!["generateVopaySignature", "receiveWebhook", "vopayFundTransfer", "emitVopayEvent"].includes(name),
		);
		for (const [, fn] of handlers) await fn(req, fakeRes());
		await vopay.vopayFundTransfer(CS, FUND_TOTALS, STUBS);
		expect(apiFetch.mock.calls.length).toBeGreaterThan(10);
		for (const [url, opts] of apiFetch.mock.calls) {
			const { Key, Signature } = opts.data;
			expect({ url, Signature }).toEqual({ url, Signature: sigFor[Key] });
		}
	});
});

describe("NEW-04 transfer outcome is reported", () => {
	test("T-VOPAY-05 vopayFundTransfer returns sent / failed / skipped", async () => {
		expect(await vopay.vopayFundTransfer(CS, FUND_TOTALS, STUBS)).toEqual({ status: "sent" });

		apiFetch.mockRejectedValueOnce(new Error("POST http://vopay.invalid/x failed (400): bad signature"));
		const failed = await vopay.vopayFundTransfer(CS, FUND_TOTALS, STUBS);
		expect(failed.status).toBe("failed");
		expect(failed.error).toMatch(/bad signature/);

		expect((await vopay.vopayFundTransfer("Acme", FUND_TOTALS, STUBS)).status).toBe("skipped");
		expect(
			(await vopay.vopayFundTransfer(CS, { totalEmpPaymentRemitCost: 0 }, STUBS)).status,
		).toBe("skipped");
		expect(apiFetch).toHaveBeenCalledTimes(2);
	});

	const submit = () =>
		request(app)
			.put("/api/payroll/report/submit/65c000000000000000000001")
			.set(auth())
			.send({
				companyName: CS,
				yearSchedules: [],
				currentPayPeriod: { payPeriod: 1, frequency: "bi-weekly", payPeriodPayDate: "2026-10-23" },
			});

	beforeEach(() => {
		Group.findByIdAndUpdate.mockResolvedValue({ _id: "g" });
		FundingTotalsPay.findOne.mockImplementation(() => query(FUND_TOTALS));
		EmployeePayStub.find.mockImplementation(() => query(STUBS));
		// SUBMIT-01: the run is claimed atomically before the transfer
		fundState = null;
		FundingTotalsPay.findOneAndUpdate.mockImplementation(async (filter, update) => {
			if (["in_progress", "sent"].includes(fundState)) return null;
			fundState = update.$set.fundTransferStatus;
			return { ...FUND_TOTALS, fundTransferStatus: fundState };
		});
		FundingTotalsPay.updateOne.mockImplementation(async (filter, update) => {
			fundState = update.$set.fundTransferStatus;
			return { acknowledged: true };
		});
		FundingTotalsPay.findById.mockImplementation(() => query({ fundTransferStatus: fundState }));
	});

	test("T-VOPAY-06 submit returns 200 with fundTransfer.status=failed when the VoPay call rejects", async () => {
		apiFetch.mockRejectedValue(new Error("POST http://vopay.invalid/x failed (401): Invalid signature"));
		const res = await submit();
		expect(res.status).toBe(200);
		expect(res.body.fundTransfer).toMatchObject({ status: "failed" });
		expect(res.body.fundTransfer.error).toMatch(/Invalid signature/);
		// existing response shape is preserved
		expect(res.body.employeePayStubs).toHaveLength(1);
		expect(res.body.fundTotalsReport).toMatchObject(FUND_TOTALS);
	});

	test("T-VOPAY-19 (SUBMIT-01) a second submit of the same run does not transfer again", async () => {
		const first = await submit();
		expect(first.body.fundTransfer).toEqual({ status: "sent" });
		const second = await submit();
		expect(second.status).toBe(200);
		expect(second.body.fundTransfer).toEqual({ status: "skipped", reason: "ALREADY_SENT" });
		expect(apiFetch).toHaveBeenCalledTimes(1);
	});

	test("T-VOPAY-20 (SUBMIT-01) concurrent submits: exactly one transfer", async () => {
		apiFetch.mockImplementation(() => new Promise((r) => setTimeout(() => r({ Success: true }), 50)));
		const [a, b] = await Promise.all([submit(), submit()]);
		const statuses = [a.body.fundTransfer.status, b.body.fundTransfer.status].sort();
		expect(statuses).toEqual(["sent", "skipped"]);
		expect(apiFetch).toHaveBeenCalledTimes(1);
	});

	test("T-VOPAY-21 (SUBMIT-01) a failed transfer can be retried", async () => {
		apiFetch.mockRejectedValueOnce(new Error("timeout"));
		const first = await submit();
		expect(first.body.fundTransfer.status).toBe("failed");
		const retry = await submit();
		expect(retry.body.fundTransfer).toEqual({ status: "sent" });
		expect(apiFetch).toHaveBeenCalledTimes(2);
	});

	test("T-VOPAY-22 (SUBMIT-01) funding totals matched by the whole pay day, not the exact timestamp", async () => {
		await submit();
		const filter = FundingTotalsPay.findOne.mock.calls[0][0];
		expect(filter.payPeriodPayDate).toEqual({ $gte: expect.any(Date), $lt: expect.any(Date) });
		expect(filter.payPeriodPayDate.$lt - filter.payPeriodPayDate.$gte).toBe(24 * 3600 * 1000);
	});

	test("T-VOPAY-07 submit reports sent on success and skipped without fund totals", async () => {
		let res = await submit();
		expect(res.status).toBe(200);
		expect(res.body.fundTransfer).toEqual({ status: "sent" });

		FundingTotalsPay.findOne.mockImplementation(() => query(null));
		res = await submit();
		expect(res.status).toBe(200);
		expect(res.body.fundTransfer.status).toBe("skipped");
	});
});

describe("CHANGES.md API #3 / NEW-15 handlers always respond", () => {
	test("T-VOPAY-08 transferWithdraw responds 501 instead of hanging", async () => {
		const res = fakeRes();
		await vopay.transferWithdraw({ body: { company: CS, Amount: 1 } }, res);
		expect(res.status).toHaveBeenCalledWith(501);
		expect(res.json.mock.calls[0][0].code).toBe("NOT_IMPLEMENTED");
		expect(apiFetch).not.toHaveBeenCalled();
	});

	test("T-VOPAY-09 partnerAccountTransfer responds 501 instead of hanging", async () => {
		const res = fakeRes();
		await vopay.partnerAccountTransfer({ body: {} }, res);
		expect(res.status).toHaveBeenCalledWith(501);
		expect(apiFetch).not.toHaveBeenCalled();
	});

	test("T-VOPAY-10 createClientAccountWallet responds 501 (no ReferenceError, no VoPay call)", async () => {
		const res = fakeRes();
		await vopay.createClientAccountWallet({ body: { ClientAccountID: "x" } }, res);
		expect(res.status).toHaveBeenCalledWith(501);
		expect(apiFetch).not.toHaveBeenCalled();
	});

	test("T-VOPAY-11 POST /api/vopay/transfer-withdraw over HTTP answers 501", async () => {
		const res = await request(app)
			.post("/api/vopay/transfer-withdraw")
			.set(auth())
			.timeout(3000)
			.send({ company: CS, Amount: 1 });
		expect(res.status).toBe(501);
	});
});

describe("NEW-15 / CHANGES.md API #16 webhook events go to the company room only", () => {
	const fakeIo = () => {
		const roomEmit = jest.fn();
		return { emit: jest.fn(), to: jest.fn(() => ({ emit: roomEmit })), roomEmit };
	};

	test("T-VOPAY-12 Cornerstone event is emitted to the Cornerstone room only", () => {
		const io = fakeIo();
		const event = { ClientAccountID: env("CORNERSTONE_CLIENTACCOUNTID"), Status: "successful" };
		expect(vopay.emitVopayEvent(io, event)).toBe(CS);
		expect(io.to).toHaveBeenCalledWith(`company:${CS}`);
		expect(io.roomEmit).toHaveBeenCalledWith("vopay-event", event);
		expect(io.emit).not.toHaveBeenCalled();

		const io2 = fakeIo();
		vopay.emitVopayEvent(io2, { AccountID: env("CORNERSTONE_ACCOUNT_ID") });
		expect(io2.to).toHaveBeenCalledWith(`company:${CS}`);
	});

	test("T-VOPAY-13 unmapped event is emitted to nobody", () => {
		const io = fakeIo();
		expect(vopay.emitVopayEvent(io, { ClientAccountID: "someone-else" })).toBeNull();
		expect(vopay.emitVopayEvent(io, undefined)).toBeNull();
		expect(io.to).not.toHaveBeenCalled();
		expect(io.emit).not.toHaveBeenCalled();
	});

	test("T-VOPAY-14 receiveWebhook with a valid signature does not broadcast", () => {
		const io = fakeIo();
		const res = fakeRes();
		const req = { headers: { "x-vopay-signature": STAGING.Signature() }, body: { ClientAccountID: "x" } };
		vopay.receiveWebhook(io)(req, res);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(io.emit).not.toHaveBeenCalled();
	});
});

describe("NEW-15 / CHANGES.md API #16 socket.io handshake authentication", () => {
	const load = () => require("../helpers/socketAuth");
	const fakeSocket = (auth) => ({ handshake: { auth }, data: {}, join: jest.fn() });
	const run = async (socket) => {
		const next = jest.fn();
		await load().socketAuthMiddleware(socket, next);
		return next.mock.calls[0][0];
	};

	test("T-VOPAY-15 missing or invalid token is rejected", async () => {
		expect(await run(fakeSocket({}))).toBeInstanceOf(Error);
		expect(await run(fakeSocket({ token: "not-a-jwt" }))).toBeInstanceOf(Error);
		expect(await run(fakeSocket(undefined))).toBeInstanceOf(Error);
	});

	test("T-VOPAY-16 member company is joined; non-member company is rejected", async () => {
		const ok = fakeSocket({ token: tokenFor(USER_ID), companyName: CS });
		expect(await run(ok)).toBeUndefined();
		expect(ok.data.companyRooms).toEqual([`company:${CS}`]);
		load().joinCompanyRooms(ok);
		expect(ok.join).toHaveBeenCalledWith([`company:${CS}`]);

		const denied = fakeSocket({ token: tokenFor(USER_ID), companyName: "Globex" });
		expect(await run(denied)).toBeInstanceOf(Error);
		expect(denied.data.companyRooms).toBeUndefined();
	});

	test("T-VOPAY-17 without companyName the socket joins all of the user's companies", async () => {
		Company.find.mockImplementation(() =>
			query([
				{ name: CS, _id: "65b000000000000000000001" },
				{ name: "Acme", _id: "65b000000000000000000002" },
			]),
		);
		const s = fakeSocket({ token: tokenFor(USER_ID) });
		expect(await run(s)).toBeUndefined();
		expect(s.data.companyRooms.sort()).toEqual([`company:${CS}`, "company:Acme"].sort());
	});

	test("T-VOPAY-18 attachSocketAuth registers io.use and a connection handler", () => {
		const io = { use: jest.fn(), on: jest.fn() };
		load().attachSocketAuth(io);
		expect(io.use).toHaveBeenCalledWith(load().socketAuthMiddleware);
		expect(io.on).toHaveBeenCalledWith("connection", load().joinCompanyRooms);
	});
});
