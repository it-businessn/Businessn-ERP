import { ChakraProvider } from "@chakra-ui/react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import PayrollService from "services/PayrollService";
import GovernmentInfo from "./GovernmentInfo";

// one object (the component re-reads it when it changes)
const SAVED = {
	_id: "g1",
	empId: "e1",
	federalTax: "Canada",
	regionalTax: "British Columbia",
	federalTaxCredit: "0", // the old screen default
	regionalTaxCredit: "0",
	isCPPExempt: false,
	isEIExempt: false,
};
jest.mock("hooks/useEmployeeGovernment", () => () => SAVED);
jest.mock("services/PayrollService", () => ({
	__esModule: true,
	default: {
		updateEmployeeGovernmentInfo: jest.fn(async (d) => ({ data: d })),
		addEmployeeGovernmentInfo: jest.fn(),
	},
}));

test("C-TD1-01 a saved 0 shows as blank (basic personal amount); claim code 0 disables the amounts and is saved", async () => {
	render(
		<ChakraProvider>
			<GovernmentInfo company="Acme" userId="e1" />
		</ChakraProvider>,
	);
	fireEvent.click(screen.getAllByText("Income Tax")[0]); // the Income Tax step
	const inputs = await screen.findAllByPlaceholderText("Basic personal amount");
	expect(inputs).toHaveLength(2);
	expect(inputs[0]).toHaveValue(null); // blank number input
	expect(screen.getByText(/TD1\. Leave blank for the basic personal amount/)).toBeInTheDocument();

	fireEvent.click(screen.getByText(/Claim code 0/));
	expect(inputs[0]).toBeDisabled();
	expect(inputs[1]).toBeDisabled();

	fireEvent.click(screen.getByRole("button", { name: "Save" }));
	await waitFor(() => expect(PayrollService.updateEmployeeGovernmentInfo).toHaveBeenCalled());
	expect(PayrollService.updateEmployeeGovernmentInfo.mock.calls[0][0]).toMatchObject({ isTD1ClaimCodeZero: true });
});
