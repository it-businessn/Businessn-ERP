import { ChakraProvider } from "@chakra-ui/react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./index";

jest.mock("services/LoginService", () => ({ signOut: jest.fn() }));

const menuList = [
	{ name: "Payroll", path: "payroll", permissions: { canAccessModule: true } },
	{ name: "Sales", path: "sales", permissions: { canAccessModule: true } },
];

const renderNavbar = (props) =>
	render(
		<ChakraProvider>
			<MemoryRouter>
				<Navbar
					user={{ _id: "u1", fullName: "Test User" }}
					setUser={jest.fn()}
					companyName="Acme"
					companyId="123"
					menuList={menuList}
					handleClick={jest.fn()}
					consoleAccess={false}
					{...props}
				/>
			</MemoryRouter>
		</ChakraProvider>,
	);

describe("Navbar (F-02 mobile navigation)", () => {
	test("C-NAV-01 phone: hamburger shown, opens drawer, module tabs hidden", () => {
		const onOpen = jest.fn();
		renderNavbar({ isMobile: true, onOpen });
		const burger = screen.getByLabelText("Open navigation menu");
		fireEvent.click(burger);
		expect(onOpen).toHaveBeenCalledTimes(1);
		expect(screen.queryByText("Payroll")).not.toBeInTheDocument();
	});

	test("C-NAV-02 desktop: module tabs shown, no hamburger", () => {
		renderNavbar({ isMobile: false, onOpen: jest.fn() });
		expect(screen.queryByLabelText("Open navigation menu")).not.toBeInTheDocument();
		expect(screen.getByText("Payroll")).toBeInTheDocument();
		expect(screen.getByText("Sales")).toBeInTheDocument();
	});
});
