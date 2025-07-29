import { Box, Button, Flex, HStack, IconButton, Stack, Tooltip, VStack } from "@chakra-ui/react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { payrollAffiliatePath, payrollEmployeePath, payrollReportPath } from "routes";

const MenuItem = ({
	menu,
	parent,
	textTransform,
	handleMenuItemClick,
	navigatePath = `/${parent}/${menu.path}`,
	isCollapsed = false,
}) => {
	const location = useLocation();
	const navigate = useNavigate();

	const empPath =
		location.pathname.includes(payrollEmployeePath) ||
		location.pathname.includes(payrollAffiliatePath) ||
		location.pathname.includes(payrollReportPath);

	return (
		<VStack align="stretch" spacing={0}>
			<HStack spacing={0} cursor="pointer">
				<Flex align="center" w={"100%"}>
					<NavLink
						to={navigatePath}
						onClick={() => {
							if (handleMenuItemClick) {
								handleMenuItemClick();
							}
						}}
						className="sidebarMenu"
						activeclassname="active"
					>
						<Tooltip label={isCollapsed ? menu?.name : ""} placement="right" hasArrow>
							<IconButton
								variant="ghost"
								icon={menu?.icon ?? ""}
								color="var(--primary_button_bg)"
								aria-label={menu?.name}
								fontSize={isCollapsed ? "24px" : "16px"}
								p={isCollapsed ? "1.5rem" : "0.5rem"}
								_hover={{
									bg: "rgba(0, 0, 0, 0.04)",
									p: isCollapsed ? "1.5rem" : "0.5rem",
									m: 0,
								}}
								_active={{
									bg: "var(--banner_bg)",
									color: "var(--main_color)",
								}}
							/>
						</Tooltip>

						{!isCollapsed && (
							<Button
								justifyContent={"space-between"}
								p={0}
								variant="ghost"
								color="var(--menu_item_color)"
								textTransform={textTransform}
								_hover={{
									bg: "rgba(0, 0, 0, 0.04)",
									p: 0,
									m: 0,
								}}
							>
								{menu?.name === "Approvals" ? "Attendance" : menu?.name}
							</Button>
						)}
					</NavLink>
				</Flex>
			</HStack>
			{empPath && !isCollapsed && (
				<Stack justify="start" width="full" my={0} spacing={0}>
					{menu?.children?.map(
						(menu) =>
							location.pathname.includes(navigatePath) && (
								<Box
									key={menu.path}
									onClick={() => {
										navigate(`/${parent}/${menu.path}`);
									}}
									className={location.pathname.endsWith(menu.path) ? "isSubChild active" : ""}
								>
									<IconButton
										variant="ghost"
										icon={menu?.icon ?? ""}
										color="var(--nav_color)"
										aria-label={menu?.name}
										_hover={{
											bg: "rgba(0, 0, 0, 0.04)",
											p: 0,
											m: 0,
										}}
									/>

									<Button
										className={navigatePath.includes(menu?.name) ? "isActive" : "notActive"}
										justifyContent={"space-between"}
										p={0}
										variant="ghost"
										color="var(--banner_bg)"
										textTransform={textTransform}
										_hover={{
											bg: "rgba(0, 0, 0, 0.04)",
											p: 0,
											m: 0,
										}}
									>
										{menu?.name}
									</Button>
								</Box>
							),
					)}
				</Stack>
			)}
		</VStack>
	);
};

export default MenuItem;
