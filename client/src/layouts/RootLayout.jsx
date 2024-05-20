import { Flex, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Loader from "components/Loader";
import Navbar from "components/header";
import Sidebar from "components/sidebar";
import { SIDEBAR_MENU } from "components/sidebar/data";
import { ROUTE_PATH } from "routes";
import { useBreakpointValue } from "services/Breakpoint";
import LocalStorageService from "services/LocalStorageService";
import UserService from "services/UserService";

const RootLayout = () => {
	const [user, setUser] = useState(LocalStorageService.getItem("user"));

	const navigate = useNavigate();

	useEffect(() => {
		const fetchUserPermissions = async () => {
			try {
				const response = await UserService.getUserPermission(user?._id);

				if (response.data) {
					SIDEBAR_MENU.forEach((data, index) => {
						const menu = response.data.permissionType.find(
							(item) => item.name === data.name,
						);
						SIDEBAR_MENU[index].permissions = menu ? menu : null;
						data?.children?.forEach((child, cIndex) => {
							const childMenu = response.data.permissionType.find(
								(item) => item.name === `${data.name} ${child.name}`,
							);
							SIDEBAR_MENU[index].children[cIndex].permissions = childMenu
								? childMenu
								: null;
						});
					});
				}
			} catch (error) {
				console.error(error);
			}
		};
		if (user) {
			fetchUserPermissions();
		}
	}, []);

	useEffect(() => {
		if (user) {
			navigate(ROUTE_PATH.SALES);
			// navigate(`${ROUTE_PATH.PAYROLL}${ROUTE_PATH.TIMESHEETS}`);
		} else {
			navigate(ROUTE_PATH.LOGIN);
		}
	}, [user]);

	const handleLogout = () => {
		setUser(LocalStorageService.removeItem("user"));
	};

	const { isMobile } = useBreakpointValue();

	const { isOpen, onOpen, onClose } = useDisclosure();

	const [activeMenu, setActiveMenu] = useState(null);

	const handleMenuItemClick = () => onClose();

	const [selectedCompany, setSelectedCompany] = useState(null);

	const [refresh, setRefresh] = useState(false);

	const handleCompany = (company = "FD") => {
		// if (company === "FD") {
		// 	setActiveMenu(FD_SIDEBAR_MENU.find((menu) => menu.id === "sales"));
		// } else {
		// 	setActiveMenu(BUSINESSN_SIDEBAR_MENU.find((menu) => menu.id === "sales"));
		// }
		LocalStorageService.setItem("selectedCompany", selectedCompany);

		setActiveMenu(SIDEBAR_MENU[0]);
		// setActiveMenu(SIDEBAR_MENU?.find((menu) => menu.id === "sales"));
	};
	useEffect(() => {
		handleCompany(selectedCompany);
	}, [selectedCompany]);

	useEffect(() => {
		if (activeMenu) {
			setRefresh(true);
		}
	}, [activeMenu]);

	return (
		<>
			{!activeMenu && <Loader />}
			{user && ((activeMenu && SIDEBAR_MENU) || refresh) && (
				<>
					<Navbar
						// company={selectedCompany}
						handleClick={(menu) => setActiveMenu(menu)}
						// handleCompany={handleCompany}
						handleLogout={handleLogout}
						onOpen={onOpen}
						setSelectedCompany={setSelectedCompany}
						tabs={SIDEBAR_MENU}
						user={user}
					/>
					<Flex minH={"100vh"} as="section">
						<Sidebar
							activeMenu={activeMenu}
							handleMenuItemClick={handleMenuItemClick}
							isMobile={isMobile}
							isOpen={isOpen}
							onClose={onClose}
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
