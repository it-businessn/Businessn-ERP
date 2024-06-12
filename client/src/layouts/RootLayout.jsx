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
import { isManager } from "utils";

const RootLayout = () => {
	const [user, setUser] = useState(LocalStorageService.getItem("user"));

	const navigate = useNavigate();
	const [company, setCompany] = useState("Fractional Departments Inc.");

	useEffect(() => {
		const handleSelectedCompanyChange = (event) => setCompany(event.detail);

		document.addEventListener(
			"selectedCompanyChanged",
			handleSelectedCompanyChange,
		);

		return () => {
			document.removeEventListener(
				"selectedCompanyChanged",
				handleSelectedCompanyChange,
			);
		};
	}, []);
	useEffect(() => {
		const fetchUserPermissions = async () => {
			try {
				const response = await UserService.getUserPermission({
					userId: user?._id,
					company,
				});

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
							if (childMenu?.name?.includes("Setup")) {
								SIDEBAR_MENU[index].children[cIndex].permissions = isManager(
									user.role,
								)
									? childMenu
									: null;
							} else {
								SIDEBAR_MENU[index].children[cIndex].permissions = childMenu
									? childMenu
									: null;
							}
						});
					});
					setActiveMenu(SIDEBAR_MENU[0]);
				}
			} catch (error) {
				console.error(error);
			}
		};
		if (user) {
			fetchUserPermissions();
		}
	}, [company]);

	useEffect(() => {
		if (user) {
			navigate(ROUTE_PATH.SALES);
			// navigate(`${ROUTE_PATH.SALES}${ROUTE_PATH.CUSTOMERS}`);
			// navigate(`${ROUTE_PATH.PROJECT}${ROUTE_PATH.WORKVIEW}`);
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

	const [refresh, setRefresh] = useState(false);

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
						handleClick={(menu) => setActiveMenu(menu)}
						handleLogout={handleLogout}
						onOpen={onOpen}
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
