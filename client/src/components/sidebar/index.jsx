import { Flex, Stack } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import { IoDocumentTextOutline } from "react-icons/io5";
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
			maxW={{ md: "24vw", lg: "18vw", xl: "12vw" }}
			p={0}
			minW={{ md: "24vw", lg: "18vw", xl: "12vw" }}
			mt="6.5em"
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
				<TextTitle mt={5} title="Tools" color="var(--primary_button_bg)" p="0 1em" />
				<MenuItem
					navigatePath={"/tickets"}
					menu={{
						path: "tickets",
						name: "Tickets",
						children: [],
						icon: <IoDocumentTextOutline />,
					}}
				/>
			</Stack>
		</Flex>
	);
};

export default Sidebar;
