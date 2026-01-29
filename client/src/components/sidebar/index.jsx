import { Flex, IconButton, Stack } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import { useState } from "react";
import { IoDocumentTextOutline, IoSettingsOutline } from "react-icons/io5";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { adminConsolePath } from "routes";
import MenuItem from "../ui/menu/MenuItem";
import MobileSidebar from "./MobileSidebar";

const Sidebar = ({
	activeMenu,
	handleMenuItemClick,
	isMobile,
	isOpen,
	onClose,
	consoleAccess,
	ticketAccess,
}) => {
	const menuList = activeMenu?.children?.filter((item) => item?.permissions);
	const [isCollapsed, setIsCollapsed] = useState(false);

	const handleToggleCollapse = () => {
		setIsCollapsed(!isCollapsed);
	};

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
			maxW={isCollapsed ? "4rem" : { md: "24vw", lg: "18vw", xl: "14vw" }}
			p={0}
			minW={isCollapsed ? "4rem" : { md: "24vw", lg: "18vw", xl: "14vw" }}
			mt="6em"
			maxHeight={`calc(var(--custom_height))`}
			overflowY="auto"
			overflowX="hidden"
			position="relative"
			transition="all 0.3s ease"
		>
			<IconButton
				icon={
					isCollapsed ? (
						<MdKeyboardArrowRight color="var(--primary_button_bg)" />
					) : (
						<MdKeyboardArrowLeft color="var(--primary_button_bg)" />
					)
				}
				onClick={handleToggleCollapse}
				position="absolute"
				right="-12px"
				top="1rem"
				size="sm"
				borderRadius="50%"
				bg="white"
				boxShadow="md"
				zIndex="1"
				_hover={{ bg: "gray.100" }}
			/>
			<Stack justify="start" width="full" my={0} spacing={0}>
				{menuList?.map(
					(menu, index) =>
						menu?.permissions?.canAccessModule && (
							<MenuItem
								key={`${menu.path}_${index}`}
								menu={menu}
								parent={activeMenu.id}
								isCollapsed={isCollapsed}
							/>
						),
				)}
				{ticketAccess && (
					<>
						{!isCollapsed && (
							<TextTitle
								mt={"3em"}
								title="Quick Access"
								color="var(--primary_button_bg)"
								p="0 1em"
							/>
						)}
						<MenuItem
							navigatePath={"/tickets"}
							menu={{
								path: "tickets",
								name: "Tickets",
								children: [],
								icon: <IoDocumentTextOutline />,
							}}
							isCollapsed={isCollapsed}
						/>
						{consoleAccess && (
							<MenuItem
								navigatePath={adminConsolePath}
								menu={{
									path: adminConsolePath,
									name: "Admin Console",
									children: [],
									icon: <IoSettingsOutline />,
								}}
								isCollapsed={isCollapsed}
							/>
						)}{" "}
					</>
				)}
			</Stack>
		</Flex>
	);
};

export default Sidebar;
