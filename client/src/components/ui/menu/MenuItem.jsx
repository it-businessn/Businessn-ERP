import { Box, Button, Flex, HStack, IconButton, Stack, VStack } from "@chakra-ui/react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { payrollEmployeePath, payrollReportPath } from "routes";

const MenuItem = ({
	menu,
	parent,
	textTransform,
	handleMenuItemClick,
	navigatePath = `/${parent}/${menu.path}`,
}) => {
	const location = useLocation();
	const navigate = useNavigate();

	const empPath =
		location.pathname.includes(payrollEmployeePath) ||
		location.pathname.includes(payrollReportPath);

	// const [isOpen, setIsOpen] = useState(true);

	// const handleToggle = () => {
	// 	setIsOpen(!isOpen);
	// };
	return (
		<VStack align="stretch" spacing={0}>
			<HStack
				spacing={0}
				cursor="pointer"
				// onClick={menu?.children ? handleToggle : undefined}
			>
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
						<IconButton variant="ghost" icon={menu?.icon ?? ""} color="var(--nav_color)" />

						<Button
							justifyContent={"space-between"}
							p={0}
							variant="ghost"
							color="var(--menu_item_color)"
							textTransform={textTransform}
						>
							{menu?.name === "Approvals" ? "Attendance" : menu?.name}
						</Button>
					</NavLink>
				</Flex>
			</HStack>
			{empPath && (
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
									<IconButton variant="ghost" icon={menu?.icon ?? ""} color="var(--nav_color)" />

									<Button
										className={navigatePath.includes(menu?.name) ? "isActive" : "notActive"}
										justifyContent={"space-between"}
										p={0}
										variant="ghost"
										color="var(--banner_bg)"
										textTransform={textTransform}
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
