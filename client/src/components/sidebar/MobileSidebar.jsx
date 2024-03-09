import {
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	Flex,
	Stack,
} from "@chakra-ui/react";
import MenuItem from "../ui/MenuItem";

const MobileSidebar = ({
	isOpen,
	onClose,
	activeMenu,
	handleMenuItemClick,
}) => {
	return (
		<Drawer isOpen={isOpen} placement="left" onClose={onClose}>
			<DrawerContent
				bg="linear-gradient(0deg, rgb(228 235 255) 0%, rgb(240 245 255) 100%)"
				maxHeight={"100vh"}
				overflowY="auto"
			>
				<DrawerCloseButton />
				<DrawerBody>
					<Flex p={2} color="brand.nav_color">
						<Stack justify="start" width="90%" my={0} spacing={0}>
							{activeMenu?.children?.length &&
								activeMenu?.children?.map((menu) => (
									<MenuItem
										handleMenuItemClick={handleMenuItemClick}
										key={crypto.randomUUID()}
										menu={menu}
									/>
								))}
						</Stack>
					</Flex>
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	);
};

export default MobileSidebar;
