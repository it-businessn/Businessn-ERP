import { Button, Flex, HStack, IconButton, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const MenuItem = ({ menu, parent, textTransform, handleMenuItemClick }) => {
	const [isOpen, setIsOpen] = useState(true);

	const handleToggle = () => {
		setIsOpen(!isOpen);
	};

	return (
		<VStack align="stretch" spacing={0}>
			{menu?.permissions?.canAccessModule && (
				<HStack
					spacing={0}
					cursor="pointer"
					onClick={menu?.children ? handleToggle : undefined}
				>
					<Flex align="center" w={"100%"}>
						<NavLink
							to={`/${parent}/${menu.path}`}
							onClick={handleMenuItemClick}
							activeclassname="active"
						>
							<IconButton
								variant="ghost"
								icon={menu.icon}
								color="brand.nav_color"
								size="xs"
								aria-label="Calendar Icon"
							/>
							<Button
								justifyContent={"space-between"}
								p={0}
								variant="ghost"
								color="brand.200"
								fontSize="xs"
								textTransform={textTransform}
							>
								{menu?.name}
							</Button>
						</NavLink>
					</Flex>
				</HStack>
			)}
		</VStack>
	);
};
export default MenuItem;
