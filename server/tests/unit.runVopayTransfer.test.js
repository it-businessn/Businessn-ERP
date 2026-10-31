/**
 * scripts/run-vopay-transfer.js: reaches vopayFundTransfer for a processed pay
 * period without processing payroll and without writing anything.
 */
jest.mock("../models/FundingTotalsPay");
jest.mock("../models/EmployeePayStub");
jest.mock("../helpers/apiFetch", () => ({ apiFetch: jest.fn() }));

const FundingTotalsPay = require("../models/FundingTotalsPay");
const EmployeePayStub = require("../models/EmployeePayStub");
const { apiFetch } = require("../helpers/apiFetch");
const { COMPANIES } = require("../constants/constant");
const { run } = require("../scripts/run-vopay-transfer");
const { query } = require("./helpers");

const A = "67c1360568f8bcf1d10d240b";
let funding;
beforeEach(() => {
	jest.resetAllMocks();
	funding = { _id: "f22", payPeriodNum: 22, totalEmpPaymentRemitCost: 1500, fundTransferStatus: null };
	FundingTotalsPay.findOne.mockImplementation(() => query(funding));
	EmployeePayStub.find.mockImplementation(() =>
		query([
			{ empId: A, currentNetPay: 1500 },
			{ empId: "zero", currentNetPay: 0 },
		]),
	);
});
const opts = { connect: false, log: () => {} };
const noWrites = () => {
	for (const m of [FundingTotalsPay, EmployeePayStub]) {
		for (const fn of ["updateOne", "updateMany", "findOneAndUpdate", "findByIdAndUpdate", "create", "deleteMany"]) {
			expect(m[fn]).not.toHaveBeenCalled();
		}
	}
};

test("T-RVT-01 dry run (default): reads period 22 like updatePayrollProcess, sends nothing", async () => {
	const res = await run(["--period", "22", "--year", "2026"], opts);
	expect(res.status).toBe("dry_run");
	expect(res.employeesWithNetPay).toBe(1);
	expect(FundingTotalsPay.findOne.mock.calls[0][0]).toMatchObject({ companyName: COMPANIES.CORNERSTONE, payPeriodNum: 22, isExtraRun: false, scheduleFrequency: "Biweekly" });
	expect(EmployeePayStub.find.mock.calls[0][0]).toMatchObject({ payPeriodNum: 22, isProcessed: true });
	expect(apiFetch).not.toHaveBeenCalled();
	noWrites();
});

test("T-RVT-02 --send calls vopayFundTransfer (VoPay is hit) with the run's amount; still writes nothing", async () => {
	apiFetch.mockResolvedValue({ Success: true, TransactionID: "55" });
	const res = await run(["--period", "22", "--send"], opts);
	expect(res).toMatchObject({ status: "called", outcome: { status: "sent" } });
	expect(apiFetch).toHaveBeenCalledTimes(1);
	const sent = apiFetch.mock.calls[0][1].data;
	expect(apiFetch.mock.calls[0][0]).toMatch(/fund-transfer-withdraw$/);
	expect(sent.Amount).toBe("1500.00");
	expect(JSON.parse(sent.RecipientClientAccountIDSplit)).toHaveLength(1);
	noWrites();
});

test("T-RVT-03 VoPay rejects: the outcome says failed with VoPay's message", async () => {
	apiFetch.mockResolvedValue({ Success: false, ErrorMessage: "Invalid signature" });
	const res = await run(["--period", "22", "--send"], opts);
	expect(res.outcome).toMatchObject({ status: "failed", error: "Invalid signature" });
	noWrites();
});

test("T-RVT-04 refuses a run already sent / in progress (would pay twice) unless --force", async () => {
	funding.fundTransferStatus = "sent";
	expect((await run(["--period", "22", "--send"], opts)).status).toBe("refused");
	expect(apiFetch).not.toHaveBeenCalled();
	apiFetch.mockResolvedValue({ Success: true });
	expect((await run(["--period", "22", "--send", "--force"], opts)).status).toBe("called");
	noWrites();
});

test("T-RVT-05 no funding totals or no period: nothing called", async () => {
	funding = null;
	expect((await run(["--period", "22", "--send"], opts)).status).toBe("not_found");
	expect((await run([], opts)).status).toBe("usage");
	expect(apiFetch).not.toHaveBeenCalled();
});
