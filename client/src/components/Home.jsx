import { useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import Navbar from "components/header";
import Sidebar from "components/sidebar";
import useCompany from "hooks/useCompany";
import useSidebarMenu from "hooks/useSidebarMenu";
import RootLayout from "layouts/RootLayout";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATH } from "routes";
import { useBreakpointValue } from "services/Breakpoint";
import LocalStorageService from "services/LocalStorageService";
import { isManager } from "utils";

const Home = () => {
	const navigate = useNavigate();
	const [user, setUser] = useState(LocalStorageService.getItem("user"));

	const { company } = useCompany("Fractional Departments Inc.");

	const { isMobile } = useBreakpointValue();

	const { isOpen, onOpen, onClose } = useDisclosure();

	const [refresh, setRefresh] = useState(false);

	useEffect(() => {
		if (user) {
			navigate(ROUTE_PATH.SALES);
			// navigate(`${ROUTE_PATH.SALES}${ROUTE_PATH.CUSTOMERS}`);
			// navigate(`${ROUTE_PATH.PROJECT}${ROUTE_PATH.WORKVIEW}`);
		} else {
			navigate(ROUTE_PATH.LOGIN);
		}
	}, [user]);

	const { activeMenu, setActiveMenu } = useSidebarMenu(
		user?._id,
		company,
		isManager(user?.role),
	);

	useEffect(() => {
		if (activeMenu) {
			setRefresh(true);
		}
	}, [activeMenu]);

	return user && (activeMenu || refresh) ? (
		<>
			<Navbar
				handleClick={(menu) => setActiveMenu(menu)}
				onOpen={onOpen}
				user={user}
				setUser={setUser}
				isMobile={isMobile}
			/>
			<RootLayout>
				<Sidebar
					activeMenu={activeMenu}
					handleMenuItemClick={onClose}
					isOpen={isOpen}
					onClose={onClose}
					isMobile={isMobile}
				/>
			</RootLayout>
		</>
	) : null;
};

export default Home;
