import { Flex, Stack } from "@chakra-ui/react";
import MenuItem from "../ui/MenuItem";
import MobileSidebar from "./MobileSidebar";

const Sidebar = ({
	activeMenu,
	isMobile,
	isOpen,
	onClose,
	handleMenuItemClick,
}) => {
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
			{activeMenu && (
				<Stack justify="start" width="full" my={0} spacing={0}>
					{activeMenu?.children
						?.filter((item) => item.permissions)
						?.map((menu) => (
							<MenuItem key={menu} menu={menu} parent={activeMenu.id} />
						))}
				</Stack>
			)}
		</Flex>
	);
};

export default Sidebar;
