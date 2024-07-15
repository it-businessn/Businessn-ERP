import { useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "components/header";
import Sidebar from "components/sidebar";
import { SIDEBAR_MENU } from "data";
import useCompany from "hooks/useCompany";
import usePermission from "hooks/usePermission";
import RootLayout from "layouts/RootLayout";
import { ROUTE_PATH } from "routes";
import { useBreakpointValue } from "services/Breakpoint";
import LocalStorageService from "services/LocalStorageService";
import LoginService from "services/LoginService";
import { isManager } from "utils";

const Home = () => {
	const navigate = useNavigate();
	const [user, setUser] = useState(LocalStorageService.getItem("user"));

	const company = useCompany();

	const { isMobile } = useBreakpointValue();

	const { isOpen, onOpen, onClose } = useDisclosure();

	const [refresh, setRefresh] = useState(false);

	const { activeMenu, setActiveMenu } = usePermission(
		user?._id,
		company,
		isManager(user?.role),
	);

	useEffect(() => {
		if (user) {
			navigate(ROUTE_PATH.SALES);
			// navigate(`${ROUTE_PATH.SALES}${ROUTE_PATH.CUSTOMERS}`);
			// navigate(`${ROUTE_PATH.PROJECT}${ROUTE_PATH.WORKVIEW}`);
		} else {
			navigate(ROUTE_PATH.LOGIN);
		}
	}, [user]);

	const handleLogout = async () => {
		try {
			await LoginService.signOut(user._id);
			LocalStorageService.removeItem("user");
			setUser(null);
		} catch (error) {
			console.log(error.response.data.error);
		}
	};

	const handleMenuItemClick = () => onClose();

	useEffect(() => {
		if (activeMenu) {
			setRefresh(true);
		}
	}, [activeMenu]);

	return user && (activeMenu || refresh) ? (
		<>
			<Navbar
				handleClick={(menu) => setActiveMenu(menu)}
				handleLogout={handleLogout}
				onOpen={onOpen}
				tabs={SIDEBAR_MENU}
				user={user}
			/>
			<RootLayout>
				<Sidebar
					activeMenu={activeMenu}
					handleMenuItemClick={handleMenuItemClick}
					isMobile={isMobile}
					isOpen={isOpen}
					onClose={onClose}
				/>
			</RootLayout>
		</>
	) : null;
};

export default Home;
