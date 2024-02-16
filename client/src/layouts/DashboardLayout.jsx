import {
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	Flex,
	useBreakpointValue,
	useDisclosure,
} from "@chakra-ui/react";
import { TOP_NAV_MENU_LIST } from "constant";
import Navbar from "features/home/Navbar";
import Sidebar from "features/sidebar";
import MobileSidebar from "features/sidebar/MobileSidebar";
import { useState } from "react";

const DashboardLayout = ({ children, user, handleLogout }) => {
	const isMobile = useBreakpointValue({ base: true, sm: false });

	const { isOpen, onOpen, onClose } = useDisclosure();

	const [activeMenu, setActiveMenu] = useState(TOP_NAV_MENU_LIST[0]);

	const handleClick = (menu) => setActiveMenu(menu);

	const handleMenuItemClick = () => onClose();

	return (
		<>
			<Navbar
				user={user}
				handleClick={handleClick}
				handleLogout={handleLogout}
				onOpen={onOpen}
			/>
			<Flex minH={"100vh"} as="section">
				{isMobile ? (
					<Drawer isOpen={isOpen} placement="left" onClose={onClose}>
						<DrawerContent
							bg="linear-gradient(0deg, rgb(228 235 255) 0%, rgb(240 245 255) 100%)"
							maxHeight={"100vh"}
							overflowY="auto"
						>
							<DrawerCloseButton />
							<DrawerBody>
								<MobileSidebar
									activeMenu={
										activeMenu ? activeMenu : { name: "CRM Dashboard" }
									}
									handleMenuItemClick={handleMenuItemClick}
								/>
							</DrawerBody>
						</DrawerContent>
					</Drawer>
				) : (
					<Sidebar
						activeMenu={activeMenu ? activeMenu : { name: "CRM Dashboard" }}
					/>
				)}
				{children}
			</Flex>
		</>
	);
};

export default DashboardLayout;
