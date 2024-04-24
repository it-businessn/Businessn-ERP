import { Flex, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Loader from "components/Loader";
import Navbar from "components/header";
import Sidebar from "components/sidebar";
import { SIDEBAR_MENU } from "components/sidebar/data";
import { useData } from "context/DataContext";
import { useBreakpointValue } from "services/Breakpoint";
import LocalStorageService from "services/LocalStorageService";
import UserService from "services/UserService";

const RootLayout = () => {
	const [user, setUser] = useState(LocalStorageService.getItem("user"));

	const navigate = useNavigate();

	const { permissionData } = useData();

	useEffect(() => {
		const fetchUserPermissions = async () => {
			try {
				const response = await UserService.getUserPermission(user?._id);

				if (response.data) {
					SIDEBAR_MENU.forEach((data, index) => {
						const menu = response.data.permissionType.find(
							(item) => item.name === data.name,
						);
						if (menu) {
							SIDEBAR_MENU[index].permissions = menu;
						}
						data?.children?.forEach((child, cIndex) => {
							const childMenu = response.data.permissionType.find(
								(item) => item.name === `${data.name} ${child.name}`,
							);
							if (menu) {
								SIDEBAR_MENU[index].children[cIndex].permissions = childMenu;
							}
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
			navigate("/sales");
			// navigate("/scheduling/workview");
		} else {
			navigate("/login");
		}
	}, [user]);

	const handleLogout = () => {
		setUser(LocalStorageService.removeItem("user"));
	};

	const { isMobile } = useBreakpointValue();

	const { isOpen, onOpen, onClose } = useDisclosure();

	const [activeMenu, setActiveMenu] = useState(null);

	const handleClick = (menu) => setActiveMenu(menu);

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

		setActiveMenu(permissionData?.find((menu) => menu.id === "sales"));
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
			{user && ((activeMenu && permissionData) || refresh) && (
				<>
					<Navbar
						tabs={permissionData}
						company={selectedCompany}
						setSelectedCompany={setSelectedCompany}
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
