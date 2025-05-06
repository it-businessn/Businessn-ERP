import { useDisclosure, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { redirectLogin } from "api";
import Navbar from "components/header";
import Sidebar from "components/sidebar";
import { ROLES } from "constant";
import useCompany from "hooks/useCompany";
import useSidebarMenu from "hooks/useSidebarMenu";
import RootLayout from "layouts/RootLayout";
import { useNavigate } from "react-router-dom";
import { payrollEmpDashboardPath } from "routes";
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

	const toast = useToast();
	const [refresh, setRefresh] = useState(false);
	const { activeMenu, setActiveMenu } = useSidebarMenu(
		user?._id,
		company,
		isManager(user?.role),
		user?.role === ROLES.SHADOW_ADMIN,
	);

	useEffect(() => {
		setSelectedCompany(user?.companyId?.name);
		if (user?.role === ROLES.ENROLLER) {
			toast({
				title: "Kindly contact administrator to provide erp access.",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
			redirectLogin();
		}
		if (user && Object.keys(user).length > 0) {
			const dashboard = activeMenu?.children?.find((_) => _.permissions?.canAccessModule);
			if (activeMenu?.path) {
				navigate(isMobile ? payrollEmpDashboardPath : `/${activeMenu?.path}/${dashboard?.path}`);
			}
		} else {
			redirectLogin();
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
