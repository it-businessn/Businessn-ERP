import { Button } from "@chakra-ui/react";

const LeftIconButton = ({ handleClick, icon, name, flex, colorScheme }) => {
	return (
		<Button
			size={"xs"}
			onClick={handleClick}
			flex={flex}
			color={!colorScheme && "brand.100"}
			bg={!colorScheme && "var(--primary_button_bg)"}
			colorScheme={colorScheme}
			variant={"outline"}
			fontWeight={"bold"}
			_hover={{ bg: "transparent", color: "brand.600" }}
			leftIcon={icon}
		>
			{name}
		</Button>
	);
};

export default LeftIconButton;
