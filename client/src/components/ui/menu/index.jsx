import { Button, HStack, Icon, Stack } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import TextTitle from "../text/TextTitle";

const Menu = ({ icon, textTransform, handleClick, variant, menu }) => (
	<NavLink to={menu?.path} activeclassname="active" className="navbarMenu">
		<Stack ml={{ base: "0", md: "0.7em" }}>
			<Button
				variant={variant ? variant : "ghost"}
				onClick={() => handleClick(menu)}
				bg="var(--nav_menu)"
				display="flex"
				alignItems="center"
				borderRadius="6px"
				w="130px"
				justifyContent="center"
				h="3rem"
				outline="none"
				transition="all 0.3s ease"
				_hover={{ bg: "rgba(255, 255, 255, 0.15)" }}
				fontSize="0.95em"
				py={1.5}
				opacity="0.85"
			>
				<HStack spacing="2.5">
					{icon && <Icon as={icon} boxSize="5.5" color="subtle" />}
					<TextTitle
						size="0.95em"
						title={menu.name}
						whiteSpace={"pre-wrap"}
						textTransform={textTransform || "capitalize"}
					/>
				</HStack>
			</Button>
		</Stack>
	</NavLink>
);
export default Menu;
