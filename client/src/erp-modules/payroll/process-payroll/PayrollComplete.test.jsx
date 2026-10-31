import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { getFundTransferToast } from ".";
import PayrollComplete from "./PayrollComplete";

jest.mock("hooks/usePaygroup", () => () => ({}));

const show = (result) =>
	render(
		<ChakraProvider>
			<PayrollComplete result={result} />
		</ChakraProvider>,
	);

test("C-PC-01 before submission: ready to submit, not 'processed'", () => {
	show(null);
	expect(screen.getByText(/ready for final submission/)).toBeInTheDocument();
	expect(screen.queryByText("Payroll is processed for payrun.")).toBeNull();
});

test("C-PC-02 after submission: payroll processed and the VoPay transfer went through", () => {
	const transfer = getFundTransferToast({ status: "sent" }, { totalEmpPaymentRemitCost: 2500 });
	expect(transfer.status).toBe("success");
	show({ transfer });
	expect(screen.getByText("Payroll is processed for payrun.")).toBeInTheDocument();
	expect(screen.getByText("VoPay transfer sent.")).toBeInTheDocument();
	expect(screen.getByText("$2500.00 was sent to employees through VoPay.")).toBeInTheDocument();
});

test("C-PC-03 a failed transfer shows VoPay's reason and stays until closed", () => {
	const transfer = getFundTransferToast({ status: "failed", error: "Insufficient balance" }, {});
	expect(transfer).toMatchObject({ status: "error", duration: null });
	show({ transfer });
	expect(screen.getByText("Payroll saved, but the VoPay fund transfer failed.")).toBeInTheDocument();
	expect(screen.getByText(/Insufficient balance/)).toBeInTheDocument();
});

test("C-PC-04 skipped transfers say why", () => {
	expect(getFundTransferToast({ status: "skipped", reason: "ALREADY_SENT" }).title).toBe("VoPay transfer already sent.");
	expect(getFundTransferToast({ status: "skipped", reason: "COMPANY_NOT_ENABLED" }).description).toMatch(/not enabled/);
	expect(getFundTransferToast({ status: "skipped", reason: "NO_FUND_TOTALS" }).status).toBe("warning");
	expect(getFundTransferToast(undefined)).toBeNull();
});
