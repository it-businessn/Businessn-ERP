import { Flex, Stack } from "@chakra-ui/react";
import MenuItem from "../ui/menu/MenuItem";
import MobileSidebar from "./MobileSidebar";

const Sidebar = ({ activeMenu, handleMenuItemClick, isMobile, isOpen, onClose }) => {
	const menuList = activeMenu?.children?.filter((item) => item.permissions);
	return isMobile ? (
		<MobileSidebar
			isOpen={isOpen}
			onClose={onClose}
			activeMenu={activeMenu}
			handleMenuItemClick={handleMenuItemClick}
			menuList={menuList}
		/>
	) : (
		<Flex
			boxShadow="md"
			maxW={{ md: "24vw", lg: "18vw", xl: "15vw" }}
			p={2}
			minW={{ md: "24vw", lg: "18vw", xl: "15vw" }}
			mt="6.7em"
			maxHeight={`calc(var(--custom_height))`}
			overflowY="auto"
		>
			<Stack justify="start" width="full" my={0} spacing={0}>
				{menuList?.map(
					(menu) =>
						menu?.permissions?.canAccessModule && (
							<MenuItem key={menu.path} menu={menu} parent={activeMenu.id} />
						),
				)}
			</Stack>
		</Flex>
	);
};

export default Sidebar;
