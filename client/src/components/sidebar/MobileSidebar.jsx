import {
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	Flex,
	Stack,
} from "@chakra-ui/react";
import MenuItem from "../ui/menu/MenuItem";

const MobileSidebar = ({ isOpen, onClose, activeMenu, menuList, handleMenuItemClick }) => {
	return (
		<Drawer isOpen={isOpen} placement="left" onClose={onClose}>
			<DrawerContent
				bg="linear-gradient(0deg, rgb(228 235 255) 0%, rgb(240 245 255) 100%)"
				maxHeight={"100vh"}
				overflowY="auto"
			>
				<DrawerCloseButton />
				<DrawerBody>
					<Flex p={2} color="var(--nav_color)">
						<Stack justify="start" width="90%" my={0} spacing={0}>
							{menuList?.map(
								(menu) =>
									menu?.permissions?.canAccessModule && (
										<MenuItem
											handleMenuItemClick={handleMenuItemClick}
											key={menu.path}
											menu={menu}
											parent={activeMenu.id}
										/>
									),
							)}
						</Stack>
					</Flex>
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	);
};

export default MobileSidebar;
