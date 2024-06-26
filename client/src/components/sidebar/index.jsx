import { Flex, Stack } from "@chakra-ui/react";
import MenuItem from "../ui/menu/MenuItem";
import MobileSidebar from "./MobileSidebar";

const Sidebar = ({
	activeMenu,
	handleMenuItemClick,
	isMobile,
	isOpen,
	onClose,
}) => {
	const menuList = activeMenu?.children?.filter((item) => item.permissions);
	return isMobile ? (
		<MobileSidebar
			isOpen={isOpen}
			onClose={onClose}
			activeMenu={activeMenu ? activeMenu : { name: "CRM Dashboard" }}
			handleMenuItemClick={handleMenuItemClick}
		/>
	) : (
		<Flex
			boxShadow="md"
			maxW={{ md: "24vw", lg: "18vw", xl: "15vw" }}
			p={2}
			minW={{ md: "24vw", lg: "18vw", xl: "15vw" }}
			mt="6.7em"
			maxHeight={`calc(100vh - 6.7em)`}
			overflowY="auto"
		>
			<Stack justify="start" width="full" my={0} spacing={0}>
				{menuList?.map((menu) => (
					<MenuItem key={menu.path} menu={menu} parent={activeMenu.id} />
				))}
			</Stack>
		</Flex>
	);
};

export default Sidebar;
