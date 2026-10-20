import {
	Box,
	Button,
	Divider,
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerHeader,
	Flex,
	HStack,
	Stack,
	Wrap,
	WrapItem,
} from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import MenuItem from "../ui/menu/MenuItem";

/**
 * Phone navigation drawer (F-02). Shows the module switcher (the tabs the
 * desktop header renders) on top, then the active module's sub-menu.
 * Quick-access links are forwarded so phones get the same destinations as desktop.
 */
const MobileSidebar = ({
	isOpen,
	onClose,
	activeMenu,
	menuList,
	handleMenuItemClick,
	modules = [],
	onModuleClick,
	quickLinks = [],
}) => {
	const accessibleModules = modules.filter((m) => m?.permissions?.canAccessModule);
	return (
		<Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
			<DrawerContent
				bg="linear-gradient(0deg, rgb(228 235 255) 0%, rgb(240 245 255) 100%)"
				maxHeight={"100vh"}
				overflowY="auto"
			>
				<DrawerCloseButton />
				{accessibleModules.length > 0 && (
					<DrawerHeader pb={2}>
						<TextTitle size="sm" title="Modules" color="var(--nav_color)" />
						<Wrap mt={2} spacing={2}>
							{accessibleModules.map((menu) => (
								<WrapItem key={menu.name}>
									<Button
										size="sm"
										variant={activeMenu?.name === menu.name ? "solid" : "outline"}
										bg={activeMenu?.name === menu.name ? "var(--banner_bg)" : "transparent"}
										color={activeMenu?.name === menu.name ? "var(--main_color)" : "var(--banner_bg)"}
										borderColor="var(--banner_bg)"
										_hover={{ opacity: 0.85 }}
										onClick={() => onModuleClick?.(menu)}
									>
										{menu.name}
									</Button>
								</WrapItem>
							))}
						</Wrap>
					</DrawerHeader>
				)}
				<DrawerBody pt={2}>
					<Divider mb={2} />
					<Flex p={2} color="var(--nav_color)">
						<Stack justify="start" width="100%" my={0} spacing={0}>
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
							{quickLinks.length > 0 && (
								<Box mt={4}>
									<TextTitle size="sm" title="Quick Access" color="var(--primary_button_bg)" />
									<HStack spacing={0} />
									{quickLinks.map((link) => (
										<MenuItem
											key={link.path}
											navigatePath={link.navigatePath}
											menu={link}
											handleMenuItemClick={handleMenuItemClick}
										/>
									))}
								</Box>
							)}
						</Stack>
					</Flex>
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	);
};

export default MobileSidebar;
