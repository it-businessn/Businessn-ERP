import { Flex, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import Navbar from "components/header";
import Sidebar from "components/sidebar";
import { SIDEBAR_MENU } from "components/sidebar/data";
import { useBreakpointValue } from "services/Breakpoint";
import LocalStorageService from "services/LocalStorageService";

const RootLayout = () => {
	const [user, setUser] = useState(LocalStorageService.getItem("user"));

	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		if (!user || location.pathname === "/") {
			if (user) {
				navigate("/sales");
			} else {
				navigate("/login");
			}
		}
	}, [user, navigate, location.pathname]);

	const handleLogout = () => {
		setUser(LocalStorageService.removeItem("user"));
	};

	const { isMobile } = useBreakpointValue();

	const { isOpen, onOpen, onClose } = useDisclosure();

	const [activeMenu, setActiveMenu] = useState(null);

	const handleClick = (menu) => setActiveMenu(menu);

	const handleMenuItemClick = () => onClose();

	const [company, selectedCompany] = useState("FD");

	const handleCompany = (company = "FD") => {
		// if (company === "FD") {
		// 	setActiveMenu(FD_SIDEBAR_MENU.find((menu) => menu.id === "sales"));
		// } else {
		// 	setActiveMenu(BUSINESSN_SIDEBAR_MENU.find((menu) => menu.id === "sales"));
		// }

		setActiveMenu(SIDEBAR_MENU.find((menu) => menu.id === "sales"));
	};

	useEffect(() => {
		handleCompany(company);
	}, [company]);

	return (
		<>
			{user && (
				<>
					<Navbar
						company={company}
						selectedCompany={selectedCompany}
						user={user}
						handleClick={handleClick}
						handleLogout={handleLogout}
						onOpen={onOpen}
						handleCompany={handleCompany}
					/>
					<Flex minH={"100vh"} as="section">
						<Sidebar
							isMobile={isMobile}
							activeMenu={activeMenu}
							isOpen={isOpen}
							onClose={onClose}
							handleMenuItemClick={handleMenuItemClick}
						/>
						<main className="main_content">
							<Outlet />
						</main>
					</Flex>
				</>
			)}
		</>
	);
};

export default RootLayout;
