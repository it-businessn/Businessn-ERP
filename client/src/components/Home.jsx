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
	const { company, setSelectedCompany } = useCompany(
		LocalStorageService.getItem("selectedCompany"),
	);

	const [user, setUser] = useState(LocalStorageService.getItem("user"));

	const { isMobile } = useBreakpointValue();

	const { isOpen, onOpen, onClose } = useDisclosure();

	const [refresh, setRefresh] = useState(false);

	useEffect(() => {
		setSelectedCompany(user?.companyId?.name);
		if (user && Object.keys(user).length > 0) {
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

	return (
		<>
			{user && Object.keys(user).length && (
				<Navbar
					handleClick={(menu) => setActiveMenu(menu)}
					onOpen={onOpen}
					user={user}
					setUser={setUser}
					isMobile={isMobile}
					companyName={company}
					companyId={user?.companyId?.registration_number}
				/>
			)}
			{user && (activeMenu || refresh) ? (
				<RootLayout>
					<Sidebar
						activeMenu={activeMenu}
						handleMenuItemClick={onClose}
						isOpen={isOpen}
						onClose={onClose}
						isMobile={isMobile}
					/>
				</RootLayout>
			) : null}
		</>
	);
};

export default Home;
