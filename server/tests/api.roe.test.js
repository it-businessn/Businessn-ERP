/**
 * ROE-01: Record of Employment - block 15C earnings by pay period (final pay
 * period first), validation, SIN kept encrypted and sent masked, a submitted
 * ROE kept as issued, administrators only.
 */
const request = require("supertest");

jest.mock("../models/Company");
jest.mock("../models/EmployeeROE");
jest.mock("../models/EmployeePayStub");
jest.mock("../models/EmployeeProfileInfo");
jest.mock("../models/EmployeeEmploymentInfo");

const Company = require("../models/Company");
const EmployeeROE = require("../models/EmployeeROE");
const EmployeePayStub = require("../models/EmployeePayStub");
const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const CONFIG = require("../config/app.config");
const { encryptData, decryptData } = require("../services/encryptDataService");
const {
	insurablePeriods,
	finalPayPeriodFor,
	maskSIN,
	validateROE,
	payPeriodType,
} = require("../utils/roe.util");
const { clearMembershipCache } = require("../middleware/authorize");
const { auth, query, buildTestApp } = require("./helpers");

const EMP = "64e000000000000000000009";
const utc = (s) => new Date(`${s}T00:00:00.000Z`);
const stub = (num, end, gross, hours, extra = {}) => ({
	payPeriodNum: num,
	payPeriodStartDate: new Date(utc(end).getTime() - 13 * 86400000),
	payPeriodEndDate: utc(end),
	currentGrossPay: gross,
	totalRegHoursWorked: hours,
	scheduleFrequency: "Biweekly",
	isExtraRun: false,
	...extra,
});

const validBody = (over = {}) => ({
	empId: EMP,
	companyName: "Acme",
	payPeriodType: "Biweekly",
	empInfo: { firstName: "Jessica", lastName: "Glass", SIN: "XXX XX9 822" },
	employmentInfo: {
		employmentStartDate: "2025-04-16",
		employmentLeaveDate: "2025-08-24",
		finalPayPeriodEndDate: "2025-08-24",
		reasonCode: "E00 - Quit",
		expectedRecallDate: "U - Unknown",
		positions: [{ title: "Concierge" }],
		...over.employmentInfo,
	},
	employerInfo: {
		contactName: "Bruce Hurst",
		contactTelNumber: "(778) 834-9338",
		issuerName: "Bruce Hurst",
		preferredCommunication: "E",
		...over.employerInfo,
	},
	earningsInfo: { totalInsurableHours: 386, totalInsurableEarnings: 7615.35, earningsData: [] },
	comments: { message: "" },
	...over.root,
});

describe("ROE helpers", () => {
	test("T-ROE-01 block 15C: final pay period is ROE PP 1, going back; runs ending the same day are one period", () => {
		const stubs = [
			stub(5, "2025-06-29", 918.3, 47.5),
			stub(7, "2025-07-27", 1142.59, 59.23),
			stub(7, "2025-07-27", 100, 0, { isExtraRun: true, payPeriodNum: 8 }),
			stub(9, "2025-08-24", 1437.52, 66.75, { totalOvertimeHoursWorked: 2 }),
			stub(10, "2025-09-07", 999, 80), // after the final pay period
		];
		const r = insurablePeriods(stubs, { finalPayPeriodEndDate: "2025-08-24", frequency: "Biweekly" });
		expect(r.periods.map((p) => [p.roePP, p.payPeriodNum, p.payPeriodEndDate, p.currentGrossPay, p.insurableHours])).toEqual([
			[1, 9, "2025-08-24", 1437.52, 68.75],
			[2, 7, "2025-07-27", 1242.59, 59.23],
			[3, 5, "2025-06-29", 918.3, 47.5],
		]);
		expect(r.totalInsurableEarnings).toBe(3598.41);
		expect(r.totalInsurableHours).toBe(175.48);
		expect(r.payPeriodType).toEqual({ code: "B", name: "Bi-weekly", maxPeriods: 27 });
	});

	test("T-ROE-02 at most 27 bi-weekly / 13 monthly periods; none before the first day worked", () => {
		const many = Array.from({ length: 40 }, (_, i) =>
			stub(i + 1, new Date(utc("2024-01-14").getTime() + i * 14 * 86400000).toISOString().slice(0, 10), 100, 10),
		);
		expect(insurablePeriods(many, { frequency: "bi-weekly" }).periods).toHaveLength(27);
		expect(insurablePeriods(many, { frequency: "Monthly" }).periods).toHaveLength(13);
		const fromApril = insurablePeriods(many, { firstDayWorked: "2025-04-01", frequency: "Biweekly" });
		expect(fromApril.periods.every((p) => p.payPeriodEndDate >= "2025-04-01")).toBe(true);
		expect(payPeriodType("Semi-monthly").code).toBe("S");
		expect(payPeriodType("Weekly").maxPeriods).toBe(53);
	});

	test("T-ROE-03 final pay period = the one containing the last day worked; SIN masked as on the ROE", () => {
		const periods = [
			{ payPeriodStartDate: "2025-08-11", payPeriodEndDate: "2025-08-24" },
			{ payPeriodStartDate: "2025-08-25", payPeriodEndDate: "2025-09-07" },
		];
		expect(finalPayPeriodFor(periods, "2025-08-24").payPeriodEndDate).toBe("2025-08-24");
		expect(finalPayPeriodFor(periods, "2025-08-25").payPeriodEndDate).toBe("2025-09-07");
		expect(finalPayPeriodFor(periods, "2025-10-01")).toBeNull();
		expect(maskSIN("123-459-822")).toBe("XXX XX9 822");
		expect(maskSIN("")).toBe("");
	});

	test("T-ROE-04 validation: recall date only and always when a return date is expected", () => {
		expect(validateROE(validBody())).toEqual([]);
		const needsDate = validBody({ employmentInfo: { expectedRecallDate: "Y - Return Date" } });
		expect(validateROE(needsDate)).toContain("Recall date is required when a return date is expected");
		const before = validBody({ employmentInfo: { expectedRecallDate: "Y - Return Date", recallDate: "2025-08-01" } });
		expect(validateROE(before)).toContain("Recall date must be after the last day worked");
		const ok = validBody({ employmentInfo: { expectedRecallDate: "Y - Return Date", recallDate: "2025-10-01" } });
		expect(validateROE(ok)).toEqual([]);
		expect(validateROE(validBody({ employmentInfo: { reasonCode: "" } }))).toContain("Select a reason code");
		expect(validateROE(validBody({ employmentInfo: { reasonCode: "AOO - Shortage of Work" } }))).toEqual([]);
		expect(validateROE(validBody({ employmentInfo: { finalPayPeriodEndDate: "2025-08-10" } }))).toContain(
			"Final pay period end date must be on or after the last day worked",
		);
		expect(validateROE(validBody({ employerInfo: { contactName: "" } }))).toContain("Select a contact name");
	});
});

describe("ROE API", () => {
	let app;
	let saved;
	beforeAll(() => {
		app = buildTestApp();
	});
	beforeEach(() => {
		jest.resetAllMocks();
		clearMembershipCache();
		saved = [];
		Company.find.mockImplementation(() => query([{ name: "Acme", _id: "65b000000000000000000001" }]));
		Company.findOne.mockImplementation(() =>
			query({ name: "Acme", address: { city: "Surrey" }, cra_business_number: "126166701RP0001" }),
		);
		EmployeeEmploymentInfo.findOne.mockImplementation(() =>
			query({ _id: "ei1", employmentRole: "Administrator" }),
		);
		EmployeeEmploymentInfo.findByIdAndUpdate.mockResolvedValue({});
		const enc = encryptData("123459822", CONFIG.SIN_KEY);
		EmployeeProfileInfo.findOne.mockImplementation(() => query({ SIN: enc.encryptedData, SINIv: enc.iv }));
		EmployeeROE.findOne.mockImplementation(() => query(saved[saved.length - 1] || null));
		EmployeeROE.create.mockImplementation(async (d) => {
			const doc = { _id: `r${saved.length + 1}`, ...d };
			saved.push(doc);
			return doc;
		});
		EmployeeROE.findByIdAndUpdate.mockImplementation(async (id, u) => Object.assign(saved.find((d) => d._id === id), u.$set));
	});

	test("T-ROE-05 earnings: block 15C rows up to the final pay period, with totals and the paid periods", async () => {
		EmployeePayStub.find.mockImplementation(() =>
			query([stub(9, "2025-08-24", 1437.52, 66.75), stub(8, "2025-08-10", 0, 0), stub(10, "2025-09-07", 50, 2)]),
		);
		const res = await request(app)
			.get(`/api/payroll/roe/earnings/Acme/${EMP}`)
			.query({ finalPayPeriodEndDate: "2025-08-24" })
			.set(auth());
		expect(res.status).toBe(200);
		expect(res.body.periods.map((p) => [p.roePP, p.payPeriodNum, p.currentGrossPay])).toEqual([
			[1, 9, 1437.52],
			[2, 8, 0],
		]);
		expect(res.body.totalInsurableEarnings).toBe(1437.52);
		expect(res.body.paidPeriods).toHaveLength(3);
		expect(EmployeePayStub.find.mock.calls[0][0]).toMatchObject({ isProcessed: true, reportType: null });
	});

	test("T-ROE-06 save: invalid ROE is 422 with the reason; nothing saved", async () => {
		const res = await request(app)
			.post("/api/payroll/roe")
			.set(auth())
			.send(validBody({ employmentInfo: { expectedRecallDate: "Y - Return Date" } }));
		expect(res.status).toBe(422);
		expect(res.body.message).toBe("Recall date is required when a return date is expected");
		expect(EmployeeROE.create).not.toHaveBeenCalled();
	});

	test("T-ROE-07 SIN: taken from the profile and stored encrypted; the response has it masked", async () => {
		const res = await request(app).post("/api/payroll/roe").set(auth()).send(validBody());
		expect(res.status).toBe(201);
		const doc = saved[0];
		expect(doc.SIN).not.toContain("123459822");
		expect(decryptData(doc.SIN, CONFIG.SIN_KEY, doc.SINIv)).toBe("123459822");
		expect(res.body.SIN).toBe("XXX XX9 822");
		expect(res.body.SINIv).toBeUndefined();
		expect(doc.craBusinessNumber).toBe("126166701RP0001");
		expect(doc.status).toBeUndefined(); // draft (model default)
		const get = await request(app).get(`/api/payroll/roe/Acme/${EMP}`).set(auth());
		expect(get.body.SIN).toBe("XXX XX9 822");
	});

	test("T-ROE-08 submit: marks the ROE submitted and records the last day worked; a submitted ROE is never overwritten", async () => {
		await request(app).post("/api/payroll/roe").set(auth()).send(validBody());
		const sub = await request(app).post("/api/payroll/roe").set(auth()).send(validBody({ root: { submit: true } }));
		expect(sub.status).toBe(201);
		expect(saved).toHaveLength(1); // the draft became the submitted ROE
		expect(saved[0].status).toBe("Submitted");
		expect(saved[0].submittedOn).toBeInstanceOf(Date);
		expect(EmployeeEmploymentInfo.findByIdAndUpdate.mock.calls[0][1]).toMatchObject({
			$set: expect.objectContaining({ employmentLeaveDate: "2025-08-24" }),
		});
		await request(app).post("/api/payroll/roe").set(auth()).send(validBody());
		expect(saved).toHaveLength(2); // a new ROE, the submitted one is kept
		expect(saved[0].status).toBe("Submitted");
	});

	test("T-ROE-09 recall date is dropped unless a return date is expected", async () => {
		await request(app)
			.post("/api/payroll/roe")
			.set(auth())
			.send(validBody({ employmentInfo: { recallDate: "2025-10-01" } }));
		expect(saved[0].recallDate).toBeNull();
	});

	test("T-ROE-10 employer block: name, address, CRA payroll account number", async () => {
		const res = await request(app).get("/api/payroll/roe/employer/Acme").set(auth());
		expect(res.status).toBe(200);
		expect(res.body.cra_business_number).toBe("126166701RP0001");
	});

	test.each(["Employee", "Manager"])("T-ROE-11 %s may not read or issue ROEs (403)", async (role) => {
		EmployeeEmploymentInfo.findOne.mockImplementation(() => query({ employmentRole: role }));
		expect((await request(app).get(`/api/payroll/roe/Acme/${EMP}`).set(auth())).status).toBe(403);
		expect((await request(app).post("/api/payroll/roe").set(auth()).send(validBody())).status).toBe(403);
		expect(EmployeeROE.create).not.toHaveBeenCalled();
	});
});
