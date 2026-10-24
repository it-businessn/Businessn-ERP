import { ChakraProvider } from "@chakra-ui/react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SignInForm from "./SignInForm";
import LoginService from "services/LoginService";

jest.mock("services/LoginService", () => ({ signIn: jest.fn() }));
jest.mock("utils/common", () => ({ buildUserInfo: (u) => u, storeUser: jest.fn() }));

const setup = () => {
	render(
		<ChakraProvider>
			<MemoryRouter>
				<SignInForm title="Sign in" />
			</MemoryRouter>
		</ChakraProvider>,
	);
	fireEvent.change(screen.getByLabelText(/company id/i), { target: { value: " 1234 " } });
	fireEvent.change(screen.getByLabelText(/email/i), { target: { value: " a@b.co " } });
	fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: " p a s s " } });
	// Submit the form directly: while loading, Chakra's Button swaps its label for a
	// spinner, so a role/name query would not find the same element twice.
	// eslint-disable-next-line testing-library/no-node-access
	return { submit: () => fireEvent.submit(screen.getByLabelText(/company id/i).closest("form")) };
};

describe("SignInForm (AUD-017 / REV-010)", () => {
	beforeEach(() => jest.clearAllMocks());

	test("C-LOGIN-05 identifiers are trimmed, the password is sent exactly as typed", async () => {
		LoginService.signIn.mockReturnValue(new Promise(() => {})); // pending
		const { submit } = setup();
		submit();
		await waitFor(() => expect(LoginService.signIn).toHaveBeenCalledTimes(1));
		expect(LoginService.signIn).toHaveBeenCalledWith({ companyId: "1234", email: "a@b.co", password: " p a s s " });
	});

	test("C-LOGIN-06 double click sends one request", async () => {
		LoginService.signIn.mockReturnValue(new Promise(() => {}));
		const { submit } = setup();
		submit();
		submit();
		await waitFor(() => expect(LoginService.signIn).toHaveBeenCalledTimes(1));
	});

	test("C-LOGIN-07 server 401 message is shown and the button is re-enabled", async () => {
		LoginService.signIn.mockRejectedValue({ response: { status: 401, data: { message: "Invalid credentials. Please reset your password!" } } });
		const { submit } = setup();
		submit();
		expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
		await waitFor(() => expect(screen.getByRole("button", { name: /^sign in$/i })).not.toBeDisabled());
	});

	test("C-LOGIN-08 network failure shows a connectivity message", async () => {
		LoginService.signIn.mockRejectedValue({ message: "Network Error" });
		const { submit } = setup();
		submit();
		expect(await screen.findByText(/unable to reach the server/i)).toBeInTheDocument();
	});
});
