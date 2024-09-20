import { Button, HStack, Icon, Stack } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import TextTitle from "../text/TextTitle";

const Menu = ({ icon, textTransform, handleClick, variant, menu }) => (
	<NavLink to={menu?.path} activeclassname="active" className="navbarMenu">
		<Stack ml={{ base: "1em", md: "2em" }}>
			<Button
				variant={variant ? variant : "ghost"}
				justifyContent="start"
				onClick={() => handleClick(menu)}
				alignItems={"end"}
			>
				<HStack spacing="3">
					{icon && <Icon as={icon} boxSize="6" color="subtle" />}
					<TextTitle
						weight="1em"
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
