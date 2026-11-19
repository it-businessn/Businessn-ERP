import { Flex, IconButton, Stack } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import ThemePicker from "components/ui/theme/ThemePicker";
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
	modules,
	onModuleClick,
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
			modules={modules}
			onModuleClick={onModuleClick}
			quickLinks={[
				...(ticketAccess
					? [{ path: "tickets", name: "Tickets", children: [], icon: <IoDocumentTextOutline />, navigatePath: "/tickets" }]
					: []),
				...(ticketAccess && consoleAccess
					? [{ path: adminConsolePath, name: "Admin Console", children: [], icon: <IoSettingsOutline />, navigatePath: adminConsolePath }]
					: []),
			]}
		/>
	) : (
		<Flex
			boxShadow="md"
			// UI-01: rem-based so labels fit at every desktop width (14vw was 179px at 1280px)
			maxW={isCollapsed ? "4rem" : { md: "24vw", lg: "15rem", "2xl": "16rem" }}
			p={0}
			minW={isCollapsed ? "4rem" : { md: "24vw", lg: "15rem", "2xl": "16rem" }}
			mt="6em"
			// THEMES-01: full height so the theme picker sits at the bottom left
			h={`calc(var(--custom_height))`}
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
				aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
				position="absolute"
				right="-12px"
				top="1rem"
				size="sm"
				borderRadius="50%"
				bg="var(--surface)"
				boxShadow="md"
				zIndex="1"
				_hover={{ bg: "gray.100" }}
			/>
			<Stack justify="start" width="full" minH="100%" my={0} spacing={0}>
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
				{/* THEMES-01 */}
				<ThemePicker
					compact={isCollapsed}
					mt="auto"
					pt={6}
					pb={4}
					px={isCollapsed ? 0 : 4}
					alignSelf={isCollapsed ? "center" : "stretch"}
				/>
			</Stack>
		</Flex>
	);
};

export default Sidebar;
