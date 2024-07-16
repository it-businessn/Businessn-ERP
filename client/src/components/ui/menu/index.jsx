import { Button, HStack, Icon, Stack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import TextTitle from "../text/TextTitle";

const Menu = ({ icon, textTransform, handleClick, variant, menu }) => (
	<Link to={menu?.path}>
		<Stack ml={{ base: "1em", md: "2em" }}>
			<Button
				variant={variant ? variant : "ghost"}
				justifyContent="start"
				onClick={() => handleClick(menu)}
			>
				<HStack spacing="3">
					{icon && <Icon as={icon} boxSize="6" color="subtle" />}
					<TextTitle
						weight="1em"
						title={menu.name}
						whiteSpace={"pre-wrap"}
						color="var(--menu_item_color)"
						textTransform={textTransform || "capitalize"}
					/>
				</HStack>
			</Button>
		</Stack>
	</Link>
);
export default Menu;
