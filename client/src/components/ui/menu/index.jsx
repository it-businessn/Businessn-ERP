import { Button, HStack, Icon, Stack } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import TextTitle from "../text/TextTitle";

const Menu = ({ icon, textTransform, handleClick, variant, menu }) => (
	<NavLink to={menu?.path} activeclassname="active" className="navbarMenu">
		<Stack ml={{ base: "0", md: "2em" }}>
			<Button
				variant={variant ? variant : "ghost"}
				onClick={() => handleClick(menu)}
				bg="var(--nav_menu)"
				display="flex"
				alignItems="center"
				borderRadius="8px"
				w="150px"
				justifyContent="center"
				h="3rem"
				outline="none"
			>
				<HStack spacing="3">
					{icon && <Icon as={icon} boxSize="6" color="subtle" />}
					<TextTitle
						size="1em"
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
