import {
	Box,
	Button,
	Flex,
	HStack,
	IconButton,
	Stack,
	VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ROUTE_PATH } from "routes";

const MenuItem = ({ menu, parent, textTransform, handleMenuItemClick }) => {
	const location = useLocation();
	const navigate = useNavigate();
	const [view, setView] = useState(null);
	// const [isOpen, setIsOpen] = useState(true);

	// const handleToggle = () => {
	// 	setIsOpen(!isOpen);
	// };
	const path = `/${parent}/${menu.path}`;

	return (
		<VStack align="stretch" spacing={0}>
			<HStack
				spacing={0}
				cursor="pointer"
				// onClick={menu?.children ? handleToggle : undefined}
			>
				<Flex align="center" w={"100%"}>
					<NavLink
						to={path}
						onClick={() => {
							if (handleMenuItemClick) {
								handleMenuItemClick();
							}
						}}
						className="sidebarMenu"
						activeclassname={"active"}
					>
						<IconButton
							variant="ghost"
							icon={menu?.icon ?? ""}
							color="var(--nav_color)"
							size="xs"
						/>

						<Button
							justifyContent={"space-between"}
							p={0}
							variant="ghost"
							color="var(--menu_item_color)"
							fontSize="xs"
							textTransform={textTransform}
						>
							{menu?.name}
						</Button>
					</NavLink>
				</Flex>
			</HStack>
			{location.pathname.includes(ROUTE_PATH.EMPLOYEES) && (
				<Stack justify="start" width="full" my={0} spacing={0}>
					{menu?.children?.map((menu) => (
						<Box
							key={menu.path}
							onClick={() => {
								setView(menu.path);
								navigate(`/${parent}/${menu.path}`);
							}}
							className={view === menu.path ? "isSubChild active" : ""}
						>
							<IconButton
								variant="ghost"
								icon={menu?.icon ?? ""}
								color="var(--nav_color)"
								size="xs"
							/>

							<Button
								className={path.includes(menu?.name) ? "isActive" : "notActive"}
								justifyContent={"space-between"}
								p={0}
								variant="ghost"
								color="var(--menu_item_color)"
								fontSize="xs"
								textTransform={textTransform}
							>
								{menu?.name}
							</Button>
						</Box>
					))}
				</Stack>
			)}
		</VStack>
	);
};
export default MenuItem;
