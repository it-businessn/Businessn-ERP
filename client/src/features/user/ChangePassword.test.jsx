import { ChakraProvider } from "@chakra-ui/react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ChangePassword from "./ChangePassword";
import PasswordService from "services/PasswordService";

jest.mock("services/PasswordService", () => ({ updateUserPassword: jest.fn() }));
jest.mock("services/LocalStorageService", () => ({
	getItem: () => ({ _id: "64a000000000000000000001" }),
}));

const setup = () => {
	const setPasswordMode = jest.fn();
	const setError = jest.fn();
	render(
		<ChakraProvider>
			<ChangePassword setPasswordMode={setPasswordMode} setError={setError} />
		</ChakraProvider>,
	);
	const fill = (current, next, confirm) => {
		fireEvent.change(screen.getByLabelText(/current password/i), { target: { value: current } });
		fireEvent.change(screen.getByLabelText(/^new password/i), { target: { value: next } });
		fireEvent.change(screen.getByLabelText(/confirm new password/i), { target: { value: confirm } });
	};
	return { setPasswordMode, setError, fill, submit: () => fireEvent.click(screen.getByRole("button", { name: /sav(e|ing)/i })) };
};

describe("ChangePassword form (AUD-018)", () => {
	beforeEach(() => jest.clearAllMocks());

	test("C-PWD-01 empty form -> validation error, no API call", async () => {
		const { submit } = setup();
		submit();
		expect(await screen.findByText(/current password is required/i)).toBeInTheDocument();
		expect(PasswordService.updateUserPassword).not.toHaveBeenCalled();
	});

	test("C-PWD-02 mismatched confirmation -> error, no API call", async () => {
		const { fill, submit } = setup();
		fill("OldPassw0rd!", "NewPassw0rd!", "Different1!");
		submit();
		expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
		expect(PasswordService.updateUserPassword).not.toHaveBeenCalled();
	});

	test("C-PWD-03 7-char password -> min-length error", async () => {
		const { fill, submit } = setup();
		fill("OldPassw0rd!", "abcdefg", "abcdefg");
		submit();
		expect(await screen.findByText(/at least 8 characters/i)).toBeInTheDocument();
	});

	test("C-PWD-04 valid form -> API called once and password mode closed", async () => {
		PasswordService.updateUserPassword.mockResolvedValue({ data: { message: "Password changed successfully" } });
		const { fill, submit, setPasswordMode } = setup();
		fill("OldPassw0rd!", "NewPassw0rd!", "NewPassw0rd!");
		submit();
		submit(); // double click must not fire twice
		await waitFor(() => expect(setPasswordMode).toHaveBeenCalledWith(false));
		expect(PasswordService.updateUserPassword).toHaveBeenCalledTimes(1);
		expect(PasswordService.updateUserPassword).toHaveBeenCalledWith(
			{ currentPassword: "OldPassw0rd!", newPassword: "NewPassw0rd!", confirmPassword: "NewPassw0rd!" },
			"64a000000000000000000001",
		);
	});

	test("C-PWD-05 server rejects current password -> message shown", async () => {
		PasswordService.updateUserPassword.mockRejectedValue({
			response: { status: 401, data: { message: "Current password is incorrect" } },
		});
		const { fill, submit, setPasswordMode } = setup();
		fill("wrong", "NewPassw0rd!", "NewPassw0rd!");
		submit();
		expect(await screen.findByText(/current password is incorrect/i)).toBeInTheDocument();
		expect(setPasswordMode).not.toHaveBeenCalled();
	});
});
