import {
	Button,
	Flex,
	HStack,
	IconButton,
	Stack,
	VStack,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

const MenuItem = ({
	menu,
	parent,
	textTransform,
	handleMenuItemClick,
	isSubChild,
}) => {
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
						className={isSubChild ? "isSubChild" : "sidebarMenu"}
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
			{menu?.children?.length && (
				<Stack justify="start" width="full" my={0} spacing={0}>
					{menu?.children?.map((menu) => (
						<MenuItem key={menu.path} menu={menu} parent={parent} isSubChild />
					))}
				</Stack>
			)}
		</VStack>
	);
};
export default MenuItem;
