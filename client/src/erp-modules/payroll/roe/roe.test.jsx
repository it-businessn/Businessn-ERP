/* eslint-disable testing-library/no-container, testing-library/no-node-access -- the date inputs and code selects have no accessible label; they are found by their name attribute */
import { ChakraProvider } from "@chakra-ui/react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import PayrollService from "services/PayrollService";
import UserService from "services/UserService";
import ROE from ".";
import {
	COPY_NOTICE,
	dmy,
	finalPayPeriodFor,
	maskSIN,
	payPeriodOptions,
	splitColumns,
	stepErrors,
	toPayload,
} from "./roeUtils";

jest.mock("layouts/PageLayout", () => ({ children }) => <div>{children}</div>);
jest.mock("react-to-print", () => ({ useReactToPrint: () => jest.fn() }));
jest.mock("services/UserService", () => ({
	__esModule: true,
	default: { getCompanyUsers: jest.fn(), getAllAdmin: jest.fn() },
}));
jest.mock("services/PayrollService", () => ({
	__esModule: true,
	default: {
		getAllPaygroups: jest.fn(),
		getROEEmployerInfo: jest.fn(),
		getEmployeeROEEmploymentInfo: jest.fn(),
		getEmployeeProfileInfo: jest.fn(),
		getEmployeeEmploymentInfo: jest.fn(),
		getEmpEarningInfo: jest.fn(),
		addEmployeeROEEmploymentInfo: jest.fn(),
	},
}));

const PAY_GROUP = {
	name: "Bi-weekly",
	scheduleFrequency: "Biweekly",
	yearSchedules: [
		{
			year: 2025,
			payPeriods: [
				{ payPeriod: 6, payPeriodStartDate: "2025-03-10", payPeriodEndDate: "2025-03-23" },
				{ payPeriod: 17, payPeriodStartDate: "2025-08-11", payPeriodEndDate: "2025-08-24" },
				{ payPeriod: 18, payPeriodStartDate: "2025-08-25", payPeriodEndDate: "2025-09-07" },
			],
		},
	],
};
const PERIODS = [
	{ roePP: 1, payPeriodNum: 17, payPeriodEndDate: "2025-08-24", currentGrossPay: 1437.52, insurableHours: 66.75 },
	{ roePP: 2, payPeriodNum: 16, payPeriodEndDate: "2025-08-10", currentGrossPay: 956.36, insurableHours: 50.25 },
	{ roePP: 3, payPeriodNum: 6, payPeriodEndDate: "2025-03-23", currentGrossPay: 1142.59, insurableHours: 59.23 },
];

beforeEach(() => {
	jest.clearAllMocks();
	window.scrollTo = jest.fn(); // not in jsdom
	localStorage.setItem("selectedCompany", JSON.stringify("Acme"));
	localStorage.setItem("user", JSON.stringify({ fullName: "Bruce Hurst" }));
	UserService.getCompanyUsers.mockResolvedValue({
		data: [
			{ empId: { _id: "e1", fullName: "Jessica Glass" } }, // inactive employees are listed too
			{ empId: { _id: "e2", fullName: "Erwan Lee" } },
		],
	});
	UserService.getAllAdmin.mockResolvedValue({
		data: [{ empId: { fullName: "Bruce Hurst" } }, { empId: { fullName: "Ana Ruiz" } }],
	});
	PayrollService.getAllPaygroups.mockResolvedValue({ data: [PAY_GROUP] });
	PayrollService.getROEEmployerInfo.mockResolvedValue({
		data: { name: "Strata NW1378", address: { city: "Surrey", postalCode: "V4P 1J1" }, cra_business_number: "126166701RP0001" },
	});
	PayrollService.getEmployeeROEEmploymentInfo.mockResolvedValue({ data: null });
	PayrollService.getEmployeeProfileInfo.mockResolvedValue({
		data: { firstName: "Jessica", lastName: "Glass", SIN: "123459822", streetAddress: "2972 Chantrell Place", city: "Surrey", postalCode: "V4P 1V2", country: "CA", province: "BC" },
	});
	PayrollService.getEmployeeEmploymentInfo.mockResolvedValue({
		data: { employmentStartDate: "2025-04-16", positions: [{ title: "Concierge", employmentPayGroup: "Bi-weekly" }] },
	});
	PayrollService.getEmpEarningInfo.mockImplementation(async (company, empId, params) => ({
		data: params?.finalPayPeriodEndDate
			? { periods: PERIODS, totalInsurableHours: 176.23, totalInsurableEarnings: 3536.47, scheduleFrequency: "Biweekly" }
			: { paidPeriods: [], scheduleFrequency: "Biweekly" },
	}));
	PayrollService.addEmployeeROEEmploymentInfo.mockImplementation(async (d) => ({
		data: { ...d, submittedOn: "2025-08-29T00:00:00.000Z" },
	}));
});

const renderROE = () =>
	render(
		<ChakraProvider>
			<ROE />
		</ChakraProvider>,
	);

const tab = (name) => screen.getByRole("tab", { name });

test("C-ROE-01 helpers: final pay period from the last day worked, 15C columns, masked SIN, D/M/Y", () => {
	const options = payPeriodOptions(PAY_GROUP);
	expect(options.map((p) => p.payPeriodEndDate)).toEqual(["2025-09-07", "2025-08-24", "2025-03-23"]);
	expect(finalPayPeriodFor(options, "2025-08-24").payPeriodEndDate).toBe("2025-08-24");
	expect(finalPayPeriodFor(options, "2025-08-25").payPeriodEndDate).toBe("2025-09-07");
	expect(splitColumns(PERIODS).left.map((p) => p.roePP)).toEqual([1, 3]);
	expect(splitColumns(PERIODS).right.map((p) => p.roePP)).toEqual([2]);
	expect(maskSIN("123 459 822")).toBe("XXX XX9 822");
	expect(dmy("2025-08-24T00:00:00.000Z")).toEqual({ day: "24", month: "08", year: "2025" }); // month 1-12
	expect(
		stepErrors.employment({
			employmentInfo: { employmentLeaveDate: "2025-08-24", finalPayPeriodEndDate: "2025-08-24", reasonCode: "K00", expectedRecallDate: "Y - Return Date" },
		}),
	).toEqual(["Recall date"]);
	const payload = toPayload({ employmentInfo: { statHolidays: [{ date: "", amount: "" }], otherMonies: [{ code: "B05", amount: "5" }] } }, { submit: true });
	expect(payload.employmentInfo.statHolidays).toEqual([]);
	expect(payload.employmentInfo.otherMonies).toHaveLength(1);
	expect(payload.submit).toBe(true);
});

test("C-ROE-02 the whole flow: choose employee -> employment -> employer -> earnings -> review and submit", async () => {
	const { container } = renderROE();
	expect(tab("Employment Info")).toBeDisabled();

	// 1. choose employee (every employee) and confirm the selection
	const empSelect = await screen.findByRole("combobox", { name: "Select employee" });
	await waitFor(() => expect(within(empSelect).getAllByRole("option")).toHaveLength(3));
	fireEvent.change(empSelect, { target: { value: "e1" } });
	fireEvent.click(screen.getByRole("button", { name: "Confirm Selection" }));
	expect(await screen.findByDisplayValue("Jessica")).toBeInTheDocument();
	expect(screen.getByDisplayValue("XXX XX9 822")).toBeInTheDocument(); // SIN masked, read only
	fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

	// 2. employment: last day worked fills in the final pay period; recall defaults to Unknown
	await waitFor(() => expect(tab("Employment Info")).toHaveAttribute("aria-selected", "true"));
	expect(screen.getByText("Concierge")).toBeInTheDocument();
	fireEvent.change(container.querySelector('input[name="employmentLeaveDate"]'), { target: { value: "2025-08-24" } });
	const finalPP = screen.getByRole("combobox", { name: /Final Pay Period End Date/ });
	expect(finalPP).toHaveValue("2025-08-24");
	const recall = container.querySelector('select[name="expectedRecallDate"]');
	expect(recall).toHaveValue("U - Unknown");
	expect(container.querySelector('input[name="recallDate"]')).toBeNull();
	fireEvent.change(container.querySelector('select[name="reasonCode"]'), { target: { value: "K00 - Other" } });
	fireEvent.change(recall, { target: { value: "Y - Return Date" } });
	expect(container.querySelector('input[name="recallDate"]')).not.toBeNull(); // shown, and required
	fireEvent.click(screen.getByRole("button", { name: "Save" }));
	expect(await screen.findByText(/Recall date/)).toBeInTheDocument();
	expect(tab("Employer Info")).toBeDisabled();
	// a quit: no return date; the recall date disappears
	fireEvent.change(container.querySelector('select[name="reasonCode"]'), { target: { value: "E00 - Quit" } });
	expect(container.querySelector('select[name="expectedRecallDate"]')).toHaveValue("U - Unknown");
	expect(container.querySelector('input[name="recallDate"]')).toBeNull();
	fireEvent.click(screen.getByRole("button", { name: "Save" }));

	// 3. employer: read only details; contact and issuer default to the logged-in admin
	await waitFor(() => expect(tab("Employer Info")).toHaveAttribute("aria-selected", "true"));
	expect(screen.getByText("126166701RP0001")).toBeInTheDocument();
	expect(screen.getByRole("combobox", { name: /Contact Name/ })).toHaveValue("Bruce Hurst");
	expect(screen.getByRole("combobox", { name: /Issuer Name/ })).toHaveValue("Bruce Hurst");
	expect(screen.getByRole("radio", { name: "English" })).toBeChecked();
	fireEvent.click(screen.getByRole("button", { name: "Confirm Selection" }));
	expect(await screen.findByText(/Contact telephone number/)).toBeInTheDocument();
	fireEvent.change(container.querySelector('input[name="contactTelNumber"]'), { target: { value: "(778) 834-9338" } });
	fireEvent.click(screen.getByRole("button", { name: "Confirm Selection" }));

	// 4. earnings: final pay period first, odd / even columns, merge button
	await waitFor(() => expect(tab("Earnings Info")).toHaveAttribute("aria-selected", "true"));
	await waitFor(() =>
		expect(PayrollService.getEmpEarningInfo).toHaveBeenLastCalledWith("Acme", "e1", expect.objectContaining({ finalPayPeriodEndDate: "2025-08-24" })),
	);
	const odd = await screen.findByRole("table", { name: "Insurable earnings, odd pay periods" });
	expect(within(odd).getByText("Mar 23, 2025")).toBeInTheDocument(); // ROE PP 3, payroll PP 6
	expect(within(screen.getByRole("table", { name: "Insurable earnings, even pay periods" })).getByText("Aug 10, 2025")).toBeInTheDocument();
	fireEvent.click(screen.getByRole("button", { name: "Merge into one list" }));
	expect(within(screen.getByRole("table", { name: "Insurable earnings by pay period" })).getAllByRole("row")).toHaveLength(4);
	fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

	// 5. review: draft saved, then submitted; the copy says it was filed
	await waitFor(() => expect(tab("Review")).toHaveAttribute("aria-selected", "true"));
	expect(screen.getByText("DRAFT COPY")).toBeInTheDocument();
	await waitFor(() => expect(PayrollService.addEmployeeROEEmploymentInfo).toHaveBeenCalledTimes(1));
	fireEvent.change(screen.getByRole("textbox", { name: "Comments" }), { target: { value: "Final pay sent" } });
	fireEvent.click(screen.getByRole("button", { name: "Submit" }));
	await waitFor(() => expect(PayrollService.addEmployeeROEEmploymentInfo).toHaveBeenCalledTimes(2));
	const sent = PayrollService.addEmployeeROEEmploymentInfo.mock.calls[1][0];
	expect(sent).toMatchObject({
		submit: true,
		empId: "e1",
		comments: { message: "Final pay sent" },
		employmentInfo: { reasonCode: "E00 - Quit", expectedRecallDate: "U - Unknown", finalPayPeriodEndDate: "2025-08-24" },
		employerInfo: { contactName: "Bruce Hurst", contactTelNumber: "(778) 834-9338", preferredCommunication: "E" },
	});
	expect(sent.earningsInfo.earningsData).toHaveLength(3);
	expect((await screen.findAllByText(COPY_NOTICE)).length).toBeGreaterThan(0);
	expect(screen.queryByText("DRAFT COPY")).toBeNull();
	expect(screen.getByRole("button", { name: "Print copy" })).toBeInTheDocument();
});

test("C-ROE-03 an employee with a submitted ROE: view / print the copy, or start a new one", async () => {
	PayrollService.getEmployeeROEEmploymentInfo.mockResolvedValue({
		data: {
			empId: "e1",
			status: "Submitted",
			submittedOn: "2025-08-29T00:00:00.000Z",
			firstName: "Jessica",
			lastName: "Glass",
			SIN: "XXX XX9 822",
			reasonCode: "E00 - Quit",
			payPeriodType: "Biweekly",
			insurableEarnings: PERIODS,
		},
	});
	renderROE();
	const empSelect = await screen.findByRole("combobox", { name: "Select employee" });
	await waitFor(() => expect(within(empSelect).getAllByRole("option")).toHaveLength(3));
	fireEvent.change(empSelect, { target: { value: "e1" } });
	fireEvent.click(screen.getByRole("button", { name: "Confirm Selection" }));
	fireEvent.click(await screen.findByRole("button", { name: "View / print copy" }));
	await waitFor(() => expect(tab("Review")).toHaveAttribute("aria-selected", "true"));
	expect((await screen.findAllByText(COPY_NOTICE)).length).toBeGreaterThan(0);
	expect(screen.queryByRole("button", { name: "Submit" })).toBeNull();
	expect(screen.getByText("B - Bi-weekly")).toBeInTheDocument();
});
