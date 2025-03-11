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
import ErrorBoundary from "./ErrorBoundary";
import Loader from "./Loader";

const Home = () => {
	const navigate = useNavigate();
	const { company, setSelectedCompany } = useCompany(
		LocalStorageService.getItem("selectedCompany"),
	);

	const [user, setUser] = useState(LocalStorageService.getItem("user"));

	const { isMobile } = useBreakpointValue();

	const { isOpen, onOpen, onClose } = useDisclosure();

	const [refresh, setRefresh] = useState(false);
	const { activeMenu, setActiveMenu } = useSidebarMenu(user?._id, company, isManager(user?.role));

	useEffect(() => {
		setSelectedCompany(user?.companyId?.name);
		if (user && Object.keys(user).length > 0) {
			const dashboard = activeMenu?.children.find((_) => _.permissions?.canAccessModule);
			if (activeMenu?.path) {
				navigate(`/${activeMenu?.path}/${dashboard?.path}`);
			}
		} else {
			navigate(ROUTE_PATH.LOGIN);
		}
	}, [user, activeMenu]);

	useEffect(() => {
		if (activeMenu) {
			setRefresh(true);
		}
	}, [activeMenu]);

	return (
		<ErrorBoundary>
			{user && Object.keys(user).length && (
				<Navbar
					handleClick={(menu) => {
						setActiveMenu(menu);
						onOpen();
					}}
					onOpen={onOpen}
					user={user}
					setUser={setUser}
					isMobile={isMobile}
					companyName={company}
					companyId={user?.companyId?.registration_number}
				/>
			)}
			{!activeMenu && <Loader />}
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
		</ErrorBoundary>
	);
};

export default Home;
