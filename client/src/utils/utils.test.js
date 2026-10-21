import { BankingFormSchema } from "validation/BankDetails";
import { getAmount, convertDecimal, roundUpNumber } from "./convertAmt";
import { getFormattedAddress, payrunType, isEmptyOrNullOrUndefined } from "./common";
import {
	calcTotal,
	calculateProjectCompletion,
	calculateTaskCompletion,
	convertToNum,
	getPayNum,
	hasPayrollSubmitAccess,
	isAdminLevelRole,
	isExtraPay,
	isValidPhoneNumber,
	toCapitalize,
} from "./index";
import { addBusinessDays, formatDateBar, generatePayPeriodId, timeToDecimal } from "./convertDate";

describe("convertAmt", () => {
	test("C-UTIL-01 getAmount formats absolute value with 2 decimals", () => {
		expect(getAmount(12.5)).toBe("$12.50");
		expect(getAmount(-3)).toBe("$3.00");
		expect(getAmount(undefined)).toBe("$0.00");
	});
	test("C-UTIL-02 convertDecimal / roundUpNumber", () => {
		expect(convertDecimal("4.567")).toBe("4.57");
		expect(convertDecimal("")).toBe(0);
		expect(roundUpNumber("1")).toBe("1.00");
	});
});

describe("common", () => {
	test("C-UTIL-03 getFormattedAddress capitalises and tolerates missing parts", () => {
		expect(getFormattedAddress({ streetNumber: "12 main st", city: "surrey", state: "BC" })).toBe(
			"12 Main St Surrey, BC  ",
		);
		expect(getFormattedAddress(null)).toBe("");
	});
	test("C-UTIL-04 payrunType / isEmptyOrNullOrUndefined", () => {
		expect(payrunType({ isExtraRun: true })).toBe("Extra");
		expect(payrunType({})).toBe("Regular");
		expect(isEmptyOrNullOrUndefined("")).toBe(true);
		expect(isEmptyOrNullOrUndefined("x")).toBe(false);
	});
});

describe("utils/index", () => {
	test("C-UTIL-05 role helpers", () => {
		expect(hasPayrollSubmitAccess("Authorizing Admin")).toBe(true);
		expect(hasPayrollSubmitAccess("Shadow Admin")).toBe(true);
		expect(hasPayrollSubmitAccess("Manager")).toBe(false);
		expect(isAdminLevelRole("Administrator")).toBe(true);
		expect(isAdminLevelRole("Manager")).toBe(false);
		expect(isAdminLevelRole("Employee")).toBe(false);
	});

	test("C-UTIL-06 pay-period helpers", () => {
		expect(isExtraPay(5, true)).toBe("5E");
		expect(isExtraPay(5, false)).toBe(5);
		const stubs = [
			{ payPeriodNum: "5", isExtraRun: false, id: "reg" },
			{ payPeriodNum: "5", isExtraRun: true, id: "extra" },
		];
		expect(getPayNum("5", false, stubs).id).toBe("reg");
		expect(getPayNum(5, true, stubs).id).toBe("extra");
		expect(getPayNum("6", false, stubs)).toBeUndefined();
	});

	test("C-UTIL-07 numbers and text", () => {
		expect(convertToNum("34,456.5")).toBe(34456.5);
		expect(calcTotal([{ q: 2, p: 3 }, { q: 1, p: 4 }], "q", "p")).toBe(10);
		expect(calcTotal([{ q: 2 }, { q: 1 }], "q")).toBe(3);
		expect(toCapitalize("hello world")).toBe("Hello World");
		expect(isValidPhoneNumber("6045551234")).toBe(true);
		expect(isValidPhoneNumber("604-555-1234")).toBe(false);
	});

	test("C-UTIL-08 (BUG-02) task completion is a real percentage, not only 0 or 100", () => {
		const task = {
			activities: [
				{ timeToComplete: 1, isOpen: false },
				{ timeToComplete: 3, isOpen: true },
			],
			subtasks: [{ timeToComplete: 4, isOpen: false }],
		};
		expect(calculateTaskCompletion(task)).toEqual({
			totalTaskHours: 8,
			completedTaskHours: 5,
			completionPercentage: 62,
		});
		expect(calculateTaskCompletion({}).completionPercentage).toBe(0);
		expect(calculateProjectCompletion({ tasks: [task, { subtasks: [{ timeToComplete: 2, isOpen: true }] }] })).toBe(
			50,
		);
		expect(calculateProjectCompletion({ tasks: [] })).toBe(0);
	});
});

describe("convertDate", () => {
	test("C-UTIL-09 addBusinessDays skips weekends", () => {
		// Fri 2026-10-16 + 1 business day = Mon 2026-10-19
		expect(addBusinessDays("2026-10-16", 1).format("YYYY-MM-DD")).toBe("2026-10-19");
		expect(addBusinessDays("2026-10-19", 5).format("YYYY-MM-DD")).toBe("2026-10-26");
	});
	test("C-UTIL-10 pay-period id, date bar format, decimal hours", () => {
		expect(generatePayPeriodId("2026-10-05T00:00:00Z", "2026-10-18T00:00:00Z")).toBe(
			"2026-10-05_2026-10-18",
		);
		expect(formatDateBar("2026-11-06T00:00:00Z")).toBe("06/11/2026");
		expect(timeToDecimal(7, 30)).toBe("7.5");
	});
});

describe("validation/BankDetails", () => {
	test("C-VAL-01 valid Canadian banking details pass", async () => {
		await expect(
			BankingFormSchema.isValid({ bankNum: "001", transitNum: "12345", accountNum: "1234567" }),
		).resolves.toBe(true);
	});
	test("C-VAL-02 wrong lengths / non-digits / missing fields fail with the field's message", async () => {
		const err = (v) => BankingFormSchema.validate(v, { abortEarly: true }).catch((e) => e.message);
		expect(await err({ bankNum: "01", transitNum: "12345", accountNum: "1234567" })).toMatch(/3 digits/);
		expect(await err({ bankNum: "001", transitNum: "1234a", accountNum: "1234567" })).toMatch(/5 digits/);
		expect(await err({ bankNum: "001", transitNum: "12345", accountNum: "123" })).toMatch(/7 and 16/);
		expect(await err({ bankNum: "001", transitNum: "12345" })).toMatch(/required/);
	});
});
